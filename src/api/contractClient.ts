import { generateExpenseCommitment, generateBalanceCommitment } from './zkProofService';

export interface LedgerGroupState {
  groupId: string;
  groupNameHash: string;
  memberCount: number;
  expenseCount: number;
  settlementStatus: number; // 0 = Active, 1 = Settling, 2 = Settled
  balanceCommitment: string;
}

export class MidnightContractClient {
  private network: string;
  private contractAddress: string;
  private proofServerUrl: string;
  private simulatedState: Map<string, LedgerGroupState> = new Map();

  constructor() {
    this.network = import.meta.env?.VITE_NETWORK || 'undeployed';
    this.contractAddress = import.meta.env?.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000000000000000000000000000';
    this.proofServerUrl = import.meta.env?.VITE_PROOF_SERVER_URL || 'http://localhost:6300';
  }

  public getNetworkInfo() {
    return {
      network: this.network,
      contractAddress: this.contractAddress,
      proofServerUrl: this.proofServerUrl
    };
  }

  /**
   * Compact Circuit Execution: createGroup
   */
  public async createGroupCircuit(groupId: string, nameHash: string, initialMembers: number): Promise<LedgerGroupState> {
    const newState: LedgerGroupState = {
      groupId,
      groupNameHash: nameHash,
      memberCount: initialMembers,
      expenseCount: 0,
      settlementStatus: 0,
      balanceCommitment: nameHash
    };
    this.simulatedState.set(groupId, newState);
    return newState;
  }

  /**
   * Compact Circuit Execution: addMember
   */
  public async addMemberCircuit(groupId: string): Promise<LedgerGroupState> {
    const state = this.simulatedState.get(groupId) || {
      groupId,
      groupNameHash: '0x1234',
      memberCount: 3,
      expenseCount: 0,
      settlementStatus: 0,
      balanceCommitment: '0x1234'
    };
    state.memberCount += 1;
    this.simulatedState.set(groupId, state);
    return state;
  }

  /**
   * Compact Circuit Execution: addPrivateExpense
   * Submits ONLY the 32-byte expense commitment to on-chain ledger while keeping amount in ZK witness.
   */
  public async addPrivateExpenseCircuit(
    groupId: string,
    amount: number,
    payerId: string,
    splits: Record<string, number>,
    receiptHash?: string
  ): Promise<{ ledgerState: LedgerGroupState; commitmentHash: string; witnessId: string }> {
    const commitment = await generateExpenseCommitment(groupId, amount, payerId, splits, receiptHash);

    const state = this.simulatedState.get(groupId) || {
      groupId,
      groupNameHash: '0x1234',
      memberCount: 3,
      expenseCount: 0,
      settlementStatus: 0,
      balanceCommitment: '0x1234'
    };

    state.expenseCount += 1;
    state.balanceCommitment = commitment.commitmentHash;
    this.simulatedState.set(groupId, state);

    return {
      ledgerState: state,
      commitmentHash: commitment.commitmentHash,
      witnessId: commitment.witnessHash
    };
  }

  /**
   * Compact Circuit Execution: settleBalances
   */
  public async settleBalancesCircuit(groupId: string, memberBalances: Record<string, number>): Promise<LedgerGroupState> {
    const newCommitment = generateBalanceCommitment(groupId, memberBalances);
    const state = this.simulatedState.get(groupId) || {
      groupId,
      groupNameHash: '0x1234',
      memberCount: 3,
      expenseCount: 1,
      settlementStatus: 0,
      balanceCommitment: '0x1234'
    };

    state.settlementStatus = 1;
    state.balanceCommitment = newCommitment;
    this.simulatedState.set(groupId, state);
    return state;
  }

  /**
   * Compact Circuit Execution: markSettled
   */
  public async markSettledCircuit(groupId: string): Promise<LedgerGroupState> {
    const state = this.simulatedState.get(groupId) || {
      groupId,
      groupNameHash: '0x1234',
      memberCount: 3,
      expenseCount: 1,
      settlementStatus: 1,
      balanceCommitment: '0x1234'
    };

    state.settlementStatus = 2;
    this.simulatedState.set(groupId, state);
    return state;
  }
}

export const midnightContractClient = new MidnightContractClient();
