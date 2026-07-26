import React, { useState } from 'react';
import { Group, SettlementTransfer } from '../types';
import { Scale, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, Lock, Wallet } from 'lucide-react';
import { midnightContractClient } from '../api/contractClient';

interface SettlementPageProps {
  groups: Group[];
  settlements: SettlementTransfer[];
  onExecuteSettlement: (settlementId: string) => void;
}

export const SettlementPage: React.FC<SettlementPageProps> = ({
  groups,
  settlements,
  onExecuteSettlement,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSettle = async (s: SettlementTransfer) => {
    setLoadingId(s.id);
    try {
      // Execute Compact settlement circuits
      await midnightContractClient.settleBalancesCircuit(s.groupId, { [s.fromMemberId]: 0, [s.toMemberId]: 0 });
      await midnightContractClient.markSettledCircuit(s.groupId);
      onExecuteSettlement(s.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderSubtle pb-4">
        <div>
          <h1 className="text-xl font-bold text-textPrimary tracking-tight">Zero-Knowledge Settlement Engine</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Greedy debt graph minimization with zero-knowledge proof settlement validation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-settled">Greedy Debt Graph Minimized</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-bgSec border border-borderSubtle rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-textPrimary">
          <ShieldCheck className="w-5 h-5 text-primaryAccent" />
          <span>How Zero-Knowledge Settlement Works</span>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed">
          Instead of performing dozens of individual peer-to-peer payments, Midnight's split engine aggregates net member balances into a zero-sum vector. It generates ZK proof hashes ensuring that total debts equal total credits without exposing individual transaction histories.
        </p>
      </div>

      {/* Pending Settlements List */}
      <div className="card-container space-y-4">
        <h2 className="text-base font-semibold text-textPrimary">Calculated Optimal Transfers</h2>

        {settlements.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-borderSubtle rounded-md bg-bgSec">
            <CheckCircle2 className="w-8 h-8 text-statusSuccess mx-auto" />
            <div className="text-sm font-semibold text-textPrimary">All Groups Fully Settled</div>
            <p className="text-xs text-textSecondary">There are no outstanding balances requiring settlement.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((s) => {
              const isSettled = s.status === 'settled';
              const isLoading = loadingId === s.id;

              return (
                <div
                  key={s.id}
                  className={`p-4 border rounded-md transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSettled ? 'bg-bgSec border-borderSubtle opacity-80' : 'bg-bgMain border-borderSubtle hover:border-primaryAccent/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-textPrimary">
                      <span>{s.fromMemberName}</span>
                      <ArrowRight className="w-4 h-4 text-textSecondary" />
                      <span>{s.toMemberName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-textSecondary font-mono">
                      <span>From: {s.fromWalletAddress.slice(0, 14)}...</span>
                      <span>•</span>
                      <span>To: {s.toWalletAddress.slice(0, 14)}...</span>
                    </div>

                    <div className="text-[11px] font-mono text-primaryAccent flex items-center gap-1 pt-1">
                      <Lock className="w-3 h-3" />
                      <span>ZK Proof Hash: {s.zkProofHash}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-textSecondary">Transfer Amount</div>
                      <div className="font-mono text-lg font-bold text-textPrimary">
                        ${s.amount.toFixed(2)} {s.currency}
                      </div>
                    </div>

                    {isSettled ? (
                      <span className="badge-settled">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Settled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSettle(s)}
                        disabled={isLoading}
                        className="btn-primary"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Proving Circuit...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="w-4 h-4" />
                            <span>Execute ZK Settlement</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
