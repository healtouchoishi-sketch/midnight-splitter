import { Member, ExpenseSplit, SplitMethod, SettlementTransfer } from '../types';

/**
 * Calculates member splits based on the selected split method.
 */
export function calculateSplits(
  totalAmount: number,
  members: Member[],
  method: SplitMethod,
  customValues: Record<string, number> // percentage, exact amount, or shares per memberId
): ExpenseSplit[] {
  if (members.length === 0 || totalAmount <= 0) {
    return [];
  }

  const numMembers = members.length;

  switch (method) {
    case 'equal': {
      const perPerson = Math.round((totalAmount / numMembers) * 100) / 100;
      let sum = perPerson * numMembers;
      const remainder = Math.round((totalAmount - sum) * 100) / 100;

      return members.map((member, idx) => ({
        memberId: member.id,
        memberName: member.name,
        amount: idx === 0 ? Math.round((perPerson + remainder) * 100) / 100 : perPerson
      }));
    }

    case 'percentage': {
      return members.map((member) => {
        const pct = customValues[member.id] || 0;
        const amount = Math.round(((totalAmount * pct) / 100) * 100) / 100;
        return {
          memberId: member.id,
          memberName: member.name,
          amount,
          percentage: pct
        };
      });
    }

    case 'exact': {
      return members.map((member) => ({
        memberId: member.id,
        memberName: member.name,
        amount: Math.round((customValues[member.id] || 0) * 100) / 100
      }));
    }

    case 'shares': {
      const totalShares = Object.values(customValues).reduce((acc, val) => acc + (val || 0), 0);
      if (totalShares <= 0) return members.map(m => ({ memberId: m.id, memberName: m.name, amount: 0, shares: 0 }));

      return members.map((member) => {
        const shares = customValues[member.id] || 0;
        const amount = Math.round(((totalAmount * shares) / totalShares) * 100) / 100;
        return {
          memberId: member.id,
          memberName: member.name,
          amount,
          shares
        };
      });
    }

    default:
      return [];
  }
}

/**
 * Validates whether the given custom values are mathematically valid for the split method.
 */
export function validateSplitInputs(
  totalAmount: number,
  members: Member[],
  method: SplitMethod,
  customValues: Record<string, number>
): { valid: boolean; error?: string } {
  if (totalAmount <= 0) {
    return { valid: false, error: 'Total expense amount must be greater than zero.' };
  }

  if (method === 'percentage') {
    const totalPercentage = Object.values(customValues).reduce((acc, val) => acc + (val || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return { valid: false, error: `Percentages must add up to 100%. Current sum: ${totalPercentage.toFixed(1)}%` };
    }
  }

  if (method === 'exact') {
    const totalExact = Object.values(customValues).reduce((acc, val) => acc + (val || 0), 0);
    if (Math.abs(totalExact - totalAmount) > 0.01) {
      return { valid: false, error: `Exact split amounts ($${totalExact.toFixed(2)}) must equal total expense ($${totalAmount.toFixed(2)})` };
    }
  }

  if (method === 'shares') {
    const totalShares = Object.values(customValues).reduce((acc, val) => acc + (val || 0), 0);
    if (totalShares <= 0) {
      return { valid: false, error: 'Total allocated shares must be greater than zero.' };
    }
  }

  return { valid: true };
}

/**
 * Greedy debt simplification algorithm for zero-knowledge balance settlement.
 * Computes minimum transactions required to balance group ledger.
 */
export function computeOptimalSettlements(
  groupId: string,
  currency: string,
  members: Member[]
): SettlementTransfer[] {
  // Deep clone members to compute net balances
  const balances = members.map(m => ({ ...m }));

  const debtors: { id: string; name: string; walletAddress: string; amount: number }[] = [];
  const creditors: { id: string; name: string; walletAddress: string; amount: number }[] = [];

  balances.forEach(m => {
    const val = Math.round(m.balance * 100) / 100;
    if (val < -0.01) {
      debtors.push({ id: m.id, name: m.name, walletAddress: m.walletAddress, amount: -val });
    } else if (val > 0.01) {
      creditors.push({ id: m.id, name: m.name, walletAddress: m.walletAddress, amount: val });
    }
  });

  const transfers: SettlementTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const transferAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = Math.round(transferAmount * 100) / 100;

    if (roundedAmount > 0) {
      const zkHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      transfers.push({
        id: `stl_${Date.now()}_${i}_${j}`,
        groupId,
        fromMemberId: debtor.id,
        fromMemberName: debtor.name,
        fromWalletAddress: debtor.walletAddress,
        toMemberId: creditor.id,
        toMemberName: creditor.name,
        toWalletAddress: creditor.walletAddress,
        amount: roundedAmount,
        currency,
        status: 'pending',
        zkProofHash: zkHash,
        timestamp: new Date().toISOString()
      });
    }

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount <= 0.01) i++;
    if (creditor.amount <= 0.01) j++;
  }

  return transfers;
}
