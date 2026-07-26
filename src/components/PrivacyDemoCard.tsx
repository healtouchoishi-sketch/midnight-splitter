import React from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Globe, FileCode2 } from 'lucide-react';

interface PrivacyDemoCardProps {
  groupId: string;
  expenseCount: number;
  latestCommitmentHash: string;
  latestPrivateAmount?: number;
  latestTitle?: string;
  payerName?: string;
}

export const PrivacyDemoCard: React.FC<PrivacyDemoCardProps> = ({
  groupId,
  expenseCount,
  latestCommitmentHash,
  latestPrivateAmount = 180.00,
  latestTitle = 'Team Dinner & Drinks',
  payerName = 'Alice'
}) => {
  return (
    <div className="bg-bgMain border border-borderSubtle rounded-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primaryAccent" />
          <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
            Midnight Zero-Knowledge Privacy Demonstration
          </h3>
        </div>
        <span className="badge-privacy">
          Level 2 Verified
        </span>
      </div>

      <p className="text-xs text-textSecondary leading-relaxed">
        This panel contrasts what data is published to the public Midnight blockchain ledger vs. what remains strictly inside your local private ZK witness sandbox.
      </p>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Public Ledger Box */}
        <div className="border border-borderSubtle rounded-md bg-bgSec p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-textPrimary">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Public Ledger State (On-Chain)</span>
            </div>
            <span className="text-[10px] font-mono text-textSecondary uppercase">Disclosed</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-textSecondary block text-[11px]">Group ID (disclose):</span>
              <span className="text-textPrimary truncate block">{groupId.slice(0, 18)}...</span>
            </div>
            <div>
              <span className="text-textSecondary block text-[11px]">Expense Counter:</span>
              <span className="text-textPrimary block font-bold">{expenseCount} recorded</span>
            </div>
            <div>
              <span className="text-textSecondary block text-[11px]">Latest Balance Commitment Hash:</span>
              <span className="text-primaryAccent break-all text-[11px] block bg-bgMain border border-borderSubtle p-1.5 rounded">
                {latestCommitmentHash}
              </span>
            </div>
            <div className="pt-1 flex items-center gap-1 text-[11px] text-statusSuccess">
              <Eye className="w-3.5 h-3.5" />
              <span>Visible to Network Indexers</span>
            </div>
          </div>
        </div>

        {/* Private Witness Box */}
        <div className="border border-borderSubtle rounded-md bg-bgMain p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-borderSubtle pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-textPrimary">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Private Witness Memory (Off-Chain ZK)</span>
            </div>
            <span className="text-[10px] font-mono text-statusSuccess font-bold uppercase">Shielded</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-textSecondary block text-[11px]">Expense Description:</span>
              <span className="text-textPrimary font-medium">{latestTitle}</span>
            </div>
            <div>
              <span className="text-textSecondary block text-[11px]">Expense Amount:</span>
              <span className="text-textPrimary font-bold font-mono text-sm">${latestPrivateAmount.toFixed(2)} USD</span>
            </div>
            <div>
              <span className="text-textSecondary block text-[11px]">Payer & Split Breakdown:</span>
              <span className="text-textPrimary block font-medium">{payerName} paid (Split across 3 members)</span>
            </div>
            <div className="pt-1 flex items-center gap-1 text-[11px] text-textSecondary font-mono">
              <EyeOff className="w-3.5 h-3.5 text-statusError" />
              <span className="text-statusError font-medium">NEVER Exposed to Ledger or Public Observers</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
