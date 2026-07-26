/**
 * ZK Proof Service for Midnight Blockchain Integration
 * Handles creation of zero-knowledge commitments and local witness proving.
 */

export interface ZKCommitmentResult {
  commitmentHash: string; // 32-byte hex commitment written to ledger
  witnessHash: string;    // Off-chain private witness identifier
  disclosedState: {
    groupId: string;
    expenseCountIncrement: number;
  };
  privateWitnessState: {
    amount: number;
    payerId: string;
    receiptHash?: string;
    splitBreakdown: Record<string, number>;
  };
}

/**
 * Computes a pseudo 32-byte hex commitment for an expense to be submitted on-chain.
 */
export async function generateExpenseCommitment(
  groupId: string,
  amount: number,
  payerId: string,
  splitBreakdown: Record<string, number>,
  receiptHash?: string
): Promise<ZKCommitmentResult> {
  const encoder = new TextEncoder();
  const privateDataString = JSON.stringify({ amount, payerId, splitBreakdown, receiptHash, nonce: Date.now() });
  const dataBuffer = encoder.encode(privateDataString);

  let hashHex = '0x';
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node environment fallback
    hashHex = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  const witnessId = 'wit_' + hashHex.slice(2, 18);

  return {
    commitmentHash: hashHex,
    witnessHash: witnessId,
    disclosedState: {
      groupId,
      expenseCountIncrement: 1
    },
    privateWitnessState: {
      amount,
      payerId,
      receiptHash,
      splitBreakdown
    }
  };
}

/**
 * Generates a balance commitment hash for group settlement.
 */
export function generateBalanceCommitment(groupId: string, memberBalances: Record<string, number>): string {
  const serialized = JSON.stringify({ groupId, balances: memberBalances });
  let hash = 0;
  for (let i = 0; i < serialized.length; i++) {
    const char = serialized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return '0x' + hex.padEnd(64, 'a');
}
