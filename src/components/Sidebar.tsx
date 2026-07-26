import React from 'react';
import { Home, UserPlus, LayoutDashboard, Users, CreditCard, Scale, Activity, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'landing', label: 'Landing Page', icon: Home },
    { id: 'signup', label: 'Sign Up Profile', icon: UserPlus },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'groups', label: 'My Groups', icon: Users },
    { id: 'expenses', label: 'All Expenses', icon: CreditCard },
    { id: 'settlement', label: 'ZK Settlement', icon: Scale },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'settings', label: 'Settings & Node', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-bgSec border-r border-borderSubtle hidden lg:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-textSecondary uppercase tracking-wider">
          Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-bgMain text-primaryAccent font-semibold border border-borderSubtle shadow-none'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgMain/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primaryAccent' : 'text-textSecondary'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Midnight ZK Privacy Guarantee Box */}
      <div className="bg-bgMain border border-borderSubtle rounded-lg p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-primaryAccent font-medium text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>ZK Privacy Active</span>
        </div>
        <p className="text-[11px] text-textSecondary leading-relaxed">
          Expense amounts & receipts remain in your local private witness. Only 32-byte hash commitments are published on-chain.
        </p>
      </div>
    </aside>
  );
};
