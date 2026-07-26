import React from 'react';
import { Shield, Wallet, CircleCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onOpenWalletModal,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="bg-bgMain border-b border-borderSubtle sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 focus:outline-none text-left"
          >
            <div className="w-8 h-8 rounded-md bg-primaryAccent text-white flex items-center justify-center font-bold text-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-textPrimary text-base tracking-tight block leading-none">
                Midnight Split
              </span>
              <span className="text-[10px] text-textSecondary font-mono block mt-0.5">
                PRIVATE EXPENSE PROTOCOL
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'groups', label: 'Groups' },
              { id: 'expenses', label: 'Expenses' },
              { id: 'settlement', label: 'Settlement' },
              { id: 'activity', label: 'Activity' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-bgSec text-textPrimary font-semibold'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-bgSec'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Controls & Wallet Status */}
        <div className="flex items-center gap-3">
          {/* Network Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-bgSec border border-borderSubtle text-textSecondary">
            <span className="w-2 h-2 rounded-full bg-statusSuccess animate-pulse"></span>
            <span>Midnight {wallet.network}</span>
          </div>

          {/* Wallet Button */}
          <button
            onClick={onOpenWalletModal}
            className={`btn-secondary text-xs sm:text-sm py-1.5 px-3 border ${
              wallet.isConnected ? 'border-statusSuccess/40 bg-bgSec' : 'border-borderSubtle'
            }`}
          >
            <Wallet className="w-4 h-4 text-textSecondary" />
            {wallet.isConnected ? (
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium">
                  {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-4)}
                </span>
                <span className="badge-settled text-[10px] py-0 px-1.5">Lace</span>
              </div>
            ) : (
              <span>Connect Lace Wallet</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
