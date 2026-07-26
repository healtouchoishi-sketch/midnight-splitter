import React, { useState } from 'react';
import { Group, Expense } from '../types';
import { Users, Plus, CreditCard, Scale, ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2, X, UserPlus } from 'lucide-react';

interface GroupDetailsPageProps {
  group: Group;
  onBack: () => void;
  onOpenAddExpense: () => void;
  onOpenSettlement: () => void;
  onAddMember?: (groupId: string, memberName: string) => void;
}

export const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({
  group,
  onBack,
  onOpenAddExpense,
  onOpenSettlement,
  onAddMember,
}) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim() && onAddMember) {
      onAddMember(group.id, newMemberName.trim());
      setNewMemberName('');
      setIsAddMemberOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-secondary py-1.5 px-3">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Groups</span>
        </button>
        <span className="text-xs text-textSecondary font-mono truncate">
          Contract: {group.contractAddress || '0x4a91b820...'}
        </span>
      </div>

      {/* Group Header Card */}
      <div className="card-container space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderSubtle pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-textPrimary tracking-tight">{group.name}</h1>
              <span className="badge-privacy">
                {group.settlementStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-textSecondary">{group.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsAddMemberOpen(true)} className="btn-secondary">
              <UserPlus className="w-4 h-4 text-textSecondary" />
              <span>Add Member</span>
            </button>
            <button onClick={onOpenSettlement} className="btn-secondary">
              <Scale className="w-4 h-4 text-statusWarning" />
              <span>Settle Balances (ZK)</span>
            </button>
            <button onClick={onOpenAddExpense} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Member Balances Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-textPrimary">Member Net Balances (Off-chain Witness)</h3>
            <span className="text-[11px] text-textSecondary font-mono">{group.members.length} Members</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {group.members.map((member) => {
              const isOwed = member.balance > 0;
              const isOwes = member.balance < 0;
              return (
                <div key={member.id} className="p-3 border border-borderSubtle rounded-md bg-bgSec flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-textPrimary">{member.name}</div>
                    <div className="text-[11px] font-mono text-textSecondary">{member.walletAddress.slice(0, 14)}...</div>
                  </div>
                  <div className={`font-mono text-sm font-bold ${
                    isOwed ? 'text-statusSuccess' : isOwes ? 'text-statusError' : 'text-textSecondary'
                  }`}>
                    {isOwed ? `+$${member.balance.toFixed(2)}` : isOwes ? `-$${Math.abs(member.balance).toFixed(2)}` : '$0.00'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card-container space-y-4">
        <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
          <h2 className="text-base font-semibold text-textPrimary">Group Expense Log ({group.expenses.length})</h2>
          <span className="text-xs text-textSecondary font-mono">
            Total: ${group.totalExpensesAmount.toFixed(2)} {group.currency}
          </span>
        </div>

        {group.expenses.length === 0 ? (
          <div className="py-12 text-center space-y-3 border border-dashed border-borderSubtle rounded-md bg-bgSec">
            <CreditCard className="w-8 h-8 text-textSecondary mx-auto" />
            <div className="text-sm font-semibold text-textPrimary">No expenses recorded yet</div>
            <p className="text-xs text-textSecondary max-w-sm mx-auto">
              Add your first group expense to test Midnight zero-knowledge private witness calculation.
            </p>
            <button onClick={onOpenAddExpense} className="btn-primary mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bgSec border-b border-borderSubtle text-textSecondary font-semibold">
                <tr>
                  <th className="py-3 px-4">Expense Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payer</th>
                  <th className="py-3 px-4">Split Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">ZK Commitment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                {group.expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => setSelectedExpense(expense)}
                    className="hover:bg-bgSec/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-semibold text-textPrimary">
                      <div className="flex items-center gap-2">
                        <span>{expense.title}</span>
                        {expense.receiptMetadata && (
                          <span title="Receipt attached">
                            <FileText className="w-3.5 h-3.5 text-primaryAccent" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-textSecondary">{expense.category}</td>
                    <td className="py-3 px-4 text-textPrimary font-medium">{expense.payerName}</td>
                    <td className="py-3 px-4">
                      <span className="bg-bgSec border border-borderSubtle px-2 py-0.5 rounded text-[11px] font-mono text-textPrimary capitalize">
                        {expense.splitMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-textPrimary">
                      ${expense.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-primaryAccent">
                      {expense.zkCommitment.slice(0, 10)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-bgMain border border-borderSubtle rounded-lg max-w-sm w-full p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
              <h3 className="text-sm font-bold text-textPrimary">Add Member to {group.name}</h3>
              <button onClick={() => setIsAddMemberOpen(false)} className="p-1 rounded text-textSecondary hover:text-textPrimary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddMemberSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-textPrimary font-semibold mb-1">Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., David or Eva"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-borderSubtle">
                <button type="button" onClick={() => setIsAddMemberOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Detail Inspector Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-bgMain border border-borderSubtle rounded-lg max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
              <h3 className="text-base font-semibold text-textPrimary">{selectedExpense.title}</h3>
              <button onClick={() => setSelectedExpense(null)} className="p-1 rounded text-textSecondary hover:text-textPrimary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-borderSubtle pb-2">
                <span className="text-textSecondary">Total Amount:</span>
                <span className="font-mono font-bold text-textPrimary text-sm">${selectedExpense.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-borderSubtle pb-2">
                <span className="text-textSecondary">Paid By:</span>
                <span className="font-medium text-textPrimary">{selectedExpense.payerName}</span>
              </div>
              <div className="flex justify-between border-b border-borderSubtle pb-2">
                <span className="text-textSecondary">Split Method:</span>
                <span className="font-mono capitalize text-textPrimary">{selectedExpense.splitMethod}</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-textSecondary font-semibold">Member Allocations:</span>
                <div className="space-y-1 bg-bgSec p-2.5 rounded border border-borderSubtle">
                  {selectedExpense.splits.map(s => (
                    <div key={s.memberId} className="flex justify-between text-textPrimary">
                      <span>{s.memberName}</span>
                      <span className="font-mono font-medium">${s.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-textSecondary font-semibold">On-Chain Ledger ZK Hash:</span>
                <div className="bg-bgSec p-2 rounded font-mono text-[11px] text-primaryAccent break-all border border-borderSubtle">
                  {selectedExpense.zkCommitment}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedExpense(null)} className="btn-secondary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
