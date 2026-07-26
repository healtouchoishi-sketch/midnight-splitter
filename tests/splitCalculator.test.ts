import { describe, it, expect } from 'vitest';
import { calculateSplits, validateSplitInputs, computeOptimalSettlements } from '../src/utils/splitCalculator';
import { Member } from '../src/types';

describe('Split Calculator Utilities', () => {
  const sampleMembers: Member[] = [
    { id: 'm1', name: 'Alice', walletAddress: 'mn_addr1', balance: 0 },
    { id: 'm2', name: 'Bob', walletAddress: 'mn_addr2', balance: 0 },
    { id: 'm3', name: 'Charlie', walletAddress: 'mn_addr3', balance: 0 },
  ];

  it('calculates equal splits correctly without rounding errors', () => {
    const splits = calculateSplits(100, sampleMembers, 'equal', {});
    expect(splits).toHaveLength(3);
    const sum = splits.reduce((acc, s) => acc + s.amount, 0);
    expect(sum).toBe(100);
  });

  it('calculates percentage splits accurately', () => {
    const customPercentages = { m1: 50, m2: 30, m3: 20 };
    const validation = validateSplitInputs(200, sampleMembers, 'percentage', customPercentages);
    expect(validation.valid).toBe(true);

    const splits = calculateSplits(200, sampleMembers, 'percentage', customPercentages);
    expect(splits.find(s => s.memberId === 'm1')?.amount).toBe(100);
    expect(splits.find(s => s.memberId === 'm2')?.amount).toBe(60);
    expect(splits.find(s => s.memberId === 'm3')?.amount).toBe(40);
  });

  it('rejects invalid percentage totals', () => {
    const customPercentages = { m1: 50, m2: 30, m3: 10 }; // 90% total
    const validation = validateSplitInputs(100, sampleMembers, 'percentage', customPercentages);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('Percentages must add up to 100%');
  });

  it('computes minimal debt settlements correctly', () => {
    const membersWithBalances: Member[] = [
      { id: 'm1', name: 'Alice', walletAddress: 'mn_addr1', balance: 120 }, // owed 120
      { id: 'm2', name: 'Bob', walletAddress: 'mn_addr2', balance: -70 },  // owes 70
      { id: 'm3', name: 'Charlie', walletAddress: 'mn_addr3', balance: -50 },// owes 50
    ];

    const transfers = computeOptimalSettlements('group_1', 'USD', membersWithBalances);
    expect(transfers).toHaveLength(2);

    const totalTransferred = transfers.reduce((acc, t) => acc + t.amount, 0);
    expect(totalTransferred).toBe(120);
  });
});
