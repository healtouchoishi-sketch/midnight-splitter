import React from 'react';
import { Activity, Shield, CheckCircle2, Lock, FileCode2 } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const activities = [
    {
      id: 'act_1',
      type: 'settleBalances',
      circuit: 'settleBalances',
      description: 'Zero-knowledge settlement executed for Apartment 4B',
      commitment: '0x9f8a12bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
      timestamp: '10 minutes ago',
      status: 'On-Chain Verified'
    },
    {
      id: 'act_2',
      type: 'addPrivateExpense',
      circuit: 'addPrivateExpense',
      description: 'Private expense commitment added ($180.00 Whole Foods Grocery)',
      commitment: '0x4f8a12bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
      timestamp: '1 hour ago',
      status: 'Shielded Witness'
    },
    {
      id: 'act_3',
      type: 'addMember',
      circuit: 'addMember',
      description: 'Member Charlie added to Summer Trip 2026',
      commitment: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      timestamp: '3 hours ago',
      status: 'On-Chain Verified'
    },
    {
      id: 'act_4',
      type: 'createGroup',
      circuit: 'createGroup',
      description: 'Group Compact contract initialized for Summer Trip 2026',
      commitment: '0x0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: '1 day ago',
      status: 'On-Chain Verified'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-borderSubtle pb-4">
        <h1 className="text-xl font-bold text-textPrimary tracking-tight">On-Chain Circuit & ZK Activity Audit</h1>
        <p className="text-xs text-textSecondary mt-0.5">
          Real-time activity log of Compact circuit executions & ZK proof submissions
        </p>
      </div>

      <div className="card-container space-y-4">
        <div className="space-y-3">
          {activities.map((act) => (
            <div key={act.id} className="p-4 border border-borderSubtle rounded-md bg-bgMain space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-bgSec border border-borderSubtle flex items-center justify-center text-primaryAccent font-mono text-xs">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-textPrimary">{act.description}</span>
                    <span className="text-xs text-textSecondary font-mono block">Circuit: <span className="text-primaryAccent font-bold">{act.circuit}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-textSecondary font-mono">{act.timestamp}</span>
                  <span className="badge-settled">{act.status}</span>
                </div>
              </div>

              <div className="bg-bgSec p-2.5 rounded font-mono text-[11px] text-textSecondary break-all border border-borderSubtle flex items-center justify-between">
                <span>Commitment: {act.commitment}</span>
                <Lock className="w-3.5 h-3.5 text-primaryAccent shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
