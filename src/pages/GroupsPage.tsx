import React, { useState } from 'react';
import { Group } from '../types';
import { Users, Plus, ShieldCheck, ArrowRight, Search, CreditCard } from 'lucide-react';

interface GroupsPageProps {
  groups: Group[];
  onOpenCreateGroup: () => void;
  onSelectGroup: (groupId: string) => void;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({
  groups,
  onOpenCreateGroup,
  onSelectGroup,
}) => {
  const [search, setSearch] = useState('');

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderSubtle pb-4">
        <div>
          <h1 className="text-xl font-bold text-textPrimary tracking-tight">Group Management</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Privacy-preserving group rosters & zero-knowledge expense split state
          </p>
        </div>

        <button onClick={onOpenCreateGroup} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Create New Group</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search groups by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className="card-container hover:border-primaryAccent/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-textPrimary tracking-tight">{group.name}</h3>
                  <p className="text-xs text-textSecondary line-clamp-2 mt-1">{group.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                  group.settlementStatus === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {group.settlementStatus.toUpperCase()}
                </span>
              </div>

              {/* Members Preview */}
              <div className="space-y-1.5 pt-2 border-t border-borderSubtle">
                <div className="text-[11px] font-medium text-textSecondary">Members ({group.members.length}):</div>
                <div className="flex flex-wrap gap-1">
                  {group.members.map((m) => (
                    <span key={m.id} className="bg-bgSec border border-borderSubtle px-2 py-0.5 rounded text-[11px] text-textPrimary">
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
              <div>
                <div className="text-[10px] text-textSecondary uppercase tracking-wider font-mono">Total Expenses</div>
                <div className="font-mono text-sm font-bold text-textPrimary">
                  ${group.totalExpensesAmount.toFixed(2)} {group.currency}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-primaryAccent">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
