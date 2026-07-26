import { describe, it, expect } from 'vitest';
import { MidnightContractClient } from '../src/api/contractClient';

describe('Midnight Contract Circuits Lifecycle Integration', () => {
  const client = new MidnightContractClient();
  const groupId = '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff';

  it('executes createGroup circuit on ledger', async () => {
    const nameHash = '0xaaaa';
    const state = await client.createGroupCircuit(groupId, nameHash, 2);

    expect(state.groupId).toBe(groupId);
    expect(state.memberCount).toBe(2);
    expect(state.expenseCount).toBe(0);
    expect(state.settlementStatus).toBe(0); // Active
  });

  it('executes addMember circuit on ledger', async () => {
    const state = await client.addMemberCircuit(groupId);
    expect(state.memberCount).toBe(3);
  });

  it('executes addPrivateExpense circuit and updates balance commitment', async () => {
    const res = await client.addPrivateExpenseCircuit(
      groupId,
      120,
      'mbr_alice',
      { mbr_alice: 60, mbr_bob: 60 }
    );

    expect(res.ledgerState.expenseCount).toBe(1);
    expect(res.commitmentHash).toMatch(/^0x[a-f0-9]{64}$/i);
    expect(res.witnessId).toBeDefined();
  });

  it('executes settlement circuits: settleBalances and markSettled', async () => {
    const settleState = await client.settleBalancesCircuit(groupId, { mbr_alice: 0, mbr_bob: 0 });
    expect(settleState.settlementStatus).toBe(1); // Settling

    const finalState = await client.markSettledCircuit(groupId);
    expect(finalState.settlementStatus).toBe(2); // Settled
  });
});
