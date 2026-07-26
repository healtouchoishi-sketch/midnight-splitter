import { describe, it, expect } from 'vitest';
import { generateExpenseCommitment, generateBalanceCommitment } from '../src/api/zkProofService';

describe('Midnight ZK Privacy & Witness Commitments', () => {
  it('generates cryptographic 32-byte commitment hash for private expenses', async () => {
    const commitment = await generateExpenseCommitment(
      'grp_test_1',
      250.75,
      'mbr_alice',
      { mbr_alice: 125.375, mbr_bob: 125.375 },
      'receipt_hash_xyz123'
    );

    expect(commitment.commitmentHash).toMatch(/^0x[a-f0-9]{64}$/i);
    expect(commitment.witnessHash).toContain('wit_');
    expect(commitment.privateWitnessState.amount).toBe(250.75);
    // Disclosed state MUST NOT reveal exact amount
    expect(commitment.disclosedState).not.toHaveProperty('amount');
  });

  it('generates reproducible zero-knowledge balance commitments', () => {
    const balances = { mbr_alice: 50, mbr_bob: -50 };
    const hash1 = generateBalanceCommitment('grp_test_1', balances);
    const hash2 = generateBalanceCommitment('grp_test_1', balances);
    
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^0x[a-f0-9]{64}$/i);
  });
});
