import React from 'react';
import { Group, Expense, SettlementTransfer } from '../types';
import { Users, CreditCard, Scale, DollarSign, Plus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PrivacyDemoCard } from '../components/PrivacyDemoCard';

interface DashboardPageProps {
  groups: Group[];
  expenses: Expense[];
  settlements: SettlementTransfer[];
  onOpenCreateGroup: () => void;
  onOpenAddExpense: () => void;
  onSelectGroup: (groupId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  groups,
  expenses,
  settlements,
  onOpenCreateGroup,
  onOpenAddExpense,
  onSelectGroup,
  onNavigateTab
}) => {
  const totalExpenseSum = expenses.reduce((acc, e) => acc + e.totalAmount, 0);
  const activeGroupCount = groups.filter(g => g.settlementStatus === 'active').length;
  const pendingSettlementCount = settlements.filter(s => s.status === 'pending').length;

  const latestExpense = expenses[0];
  const activeGroup = groups[0];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderSubtle pb-4">
        <div>
          <h1 className="text-xl font-bold text-textPrimary tracking-tight">Financial Overview</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Private group expense tracking & zero-knowledge ledger state
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onOpenCreateGroup} className="btn-secondary">
            <Users className="w-4 h-4 text-textSecondary" />
            <span>Create Group</span>
          </button>
          <button onClick={onOpenAddExpense} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Add Private Expense</span>
          </button>
        </div>
      </div>

      {/* SaaS Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="card-container flex items-center justify-between">
          <div>
            <div className="text-xs text-textSecondary font-medium">Active Groups</div>
            <div className="text-2xl font-bold text-textPrimary mt-1 font-mono">{activeGroupCount}</div>
            <div className="text-[11px] text-textSecondary mt-1">Midnight Compact contracts</div>
          </div>
          <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-primaryAccent">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="card-container flex items-center justify-between">
          <div>
            <div className="text-xs text-textSecondary font-medium">Total Recorded Expenses</div>
            <div className="text-2xl font-bold text-textPrimary mt-1 font-mono">
              ${totalExpenseSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-statusSuccess mt-1 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Shielded in Witness</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-primaryAccent">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="card-container flex items-center justify-between">
          <div>
            <div className="text-xs text-textSecondary font-medium">Personal Net Balance</div>
            <div className="text-2xl font-bold text-statusSuccess mt-1 font-mono">+$45.00</div>
            <div className="text-[11px] text-textSecondary mt-1">You are owed in 2 groups</div>
          </div>
          <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-statusSuccess">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="card-container flex items-center justify-between">
          <div>
            <div className="text-xs text-textSecondary font-medium">Pending Settlements</div>
            <div className="text-2xl font-bold text-statusWarning mt-1 font-mono">{pendingSettlementCount}</div>
            <div className="text-[11px] text-textSecondary mt-1">Optimal transfers ready</div>
          </div>
          <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-statusWarning">
            <Scale className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Privacy Demonstration Component */}
      <PrivacyDemoCard
        groupId={activeGroup?.id || '0x9a8f...'}
        expenseCount={expenses.length}
        latestCommitmentHash={latestExpense?.zkCommitment || '0x4f8a12bc93e0...'}
        latestPrivateAmount={latestExpense?.totalAmount}
        latestTitle={latestExpense?.title}
        payerName={latestExpense?.payerName}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Groups List */}
        <div className="lg:col-span-2 card-container space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <h2 className="text-sm font-semibold text-textPrimary">Your Active Groups</h2>
            <button onClick={() => onNavigateTab('groups')} className="text-xs text-primaryAccent hover:underline flex items-center gap-1">
              <span>View All ({groups.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className="p-4 border border-borderSubtle rounded-md bg-bgMain hover:bg-bgSec transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-textPrimary">{group.name}</span>
                    <span className="badge-privacy">
                      {group.members.length} Members
                    </span>
                  </div>
                  <p className="text-xs text-textSecondary truncate max-w-md">{group.description}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-mono text-sm font-bold text-textPrimary">
                    ${group.totalExpensesAmount.toFixed(2)} {group.currency}
                  </div>
                  <div className="text-[11px] font-mono text-textSecondary">
                    {group.expenses.length} Expenses
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Settlement Summary */}
        <div className="card-container space-y-4">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
            <h2 className="text-sm font-semibold text-textPrimary">Pending Settlements</h2>
            <button onClick={() => onNavigateTab('settlement')} className="text-xs text-primaryAccent hover:underline">
              Settle
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {settlements.map((s) => (
              <div key={s.id} className="p-3 border border-borderSubtle rounded-md bg-bgSec space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-textPrimary">
                    {s.fromMemberName} → {s.toMemberName}
                  </span>
                  <span className="font-mono font-bold text-textPrimary">${s.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-textSecondary font-mono">
                  <span>ZK Proof Hash</span>
                  <span>{s.zkProofHash.slice(0, 10)}...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
