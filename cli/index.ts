import { midnightContractClient } from '../src/api/contractClient';
import { calculateSplits, computeOptimalSettlements } from '../src/utils/splitCalculator';

async function runCli() {
  console.log(`=======================================================`);
  console.log(` Private Group Expense Splitter - Midnight CLI Tool`);
  console.log(`=======================================================\n`);

  const groupId = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const nameHash = '0x' + Array.from({ length: 64 }, () => 'a').join('');

  console.log(`1. Executing createGroup circuit...`);
  const createResult = await midnightContractClient.createGroupCircuit(groupId, nameHash, 3);
  console.log(`   On-chain Group ID : ${createResult.groupId}`);
  console.log(`   Member Count      : ${createResult.memberCount}`);
  console.log(`   Settlement Status : ${createResult.settlementStatus} (Active)\n`);

  console.log(`2. Recording Private Expense with Zero-Knowledge Proof...`);
  const expenseAmount = 150;
  const payerId = 'mbr_alice';
  const splits = { mbr_alice: 50, mbr_bob: 50, mbr_charlie: 50 };
  
  const expenseResult = await midnightContractClient.addPrivateExpenseCircuit(
    groupId,
    expenseAmount,
    payerId,
    splits,
    'receipt_dinner_001.png'
  );

  console.log(`   [PUBLIC ON-CHAIN LEDGER]`);
  console.log(`   - Expense Counter     : ${expenseResult.ledgerState.expenseCount}`);
  console.log(`   - Balance Commitment  : ${expenseResult.commitmentHash}`);
  console.log(`   [PRIVATE WITNESS MEMORY]`);
  console.log(`   - Private Expense Amt : $${expenseAmount}`);
  console.log(`   - Private Witness ID  : ${expenseResult.witnessId}`);
  console.log(`   - Payer ID            : ${payerId}\n`);

  console.log(`3. Computing Zero-Knowledge Debt Settlement...`);
  const mockMembers = [
    { id: 'mbr_alice', name: 'Alice', walletAddress: 'mn_addr_undeployed1...', balance: 100 },
    { id: 'mbr_bob', name: 'Bob', walletAddress: 'mn_addr_undeployed2...', balance: -50 },
    { id: 'mbr_charlie', name: 'Charlie', walletAddress: 'mn_addr_undeployed3...', balance: -50 }
  ];

  const optimalTransfers = computeOptimalSettlements(groupId, 'USD', mockMembers);
  console.log(`   Optimal Settlement Transactions (${optimalTransfers.length} transfers needed):`);
  optimalTransfers.forEach((t, i) => {
    console.log(`   [${i+1}] ${t.fromMemberName} (${t.fromWalletAddress.slice(0, 15)}...) pays $${t.amount} to ${t.toMemberName}`);
    console.log(`       ZK Transfer Proof Hash: ${t.zkProofHash}`);
  });

  console.log(`\n4. Executing settleBalances circuit...`);
  const settleResult = await midnightContractClient.settleBalancesCircuit(groupId, { mbr_alice: 0, mbr_bob: 0, mbr_charlie: 0 });
  console.log(`   On-chain Status   : ${settleResult.settlementStatus} (Settling)`);
  console.log(`   New Commitment    : ${settleResult.balanceCommitment}\n`);

  console.log(`5. Executing markSettled circuit...`);
  const finalResult = await midnightContractClient.markSettledCircuit(groupId);
  console.log(`   On-chain Status   : ${finalResult.settlementStatus} (Settled)`);
  console.log(`\n[SUCCESS] Midnight CLI interaction completed cleanly.`);
}

runCli().catch(err => {
  console.error('CLI Error:', err);
  process.exit(1);
});
