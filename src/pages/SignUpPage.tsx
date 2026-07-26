import React, { useState } from 'react';
import { Shield, Wallet, ArrowRight, CheckCircle2, User, Lock } from 'lucide-react';
import { WalletState } from '../types';

interface SignUpPageProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onCompleteSignUp: (userData: { name: string; email: string; currency: string }) => void;
  onGoToLanding: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  wallet,
  onConnectWallet,
  onCompleteSignUp,
  onGoToLanding,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCompleteSignUp({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@midnight.privacy`,
      currency
    });
  };

  return (
    <div className="py-10 px-4 max-w-lg mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-lg bg-primaryAccent text-white flex items-center justify-center font-bold mx-auto shadow-none">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Create Your Midnight Account</h1>
        <p className="text-xs text-textSecondary">
          Setup your privacy profile & link your Lace Wallet to start splitting expenses privately.
        </p>
      </div>

      {/* Form Container */}
      <div className="card-container space-y-5">
        
        {/* Wallet Connection Status Box */}
        <div className="p-3.5 bg-bgSec border border-borderSubtle rounded-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-textPrimary flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-primaryAccent" />
              <span>Midnight Lace Wallet</span>
            </span>
            <span className={wallet.isConnected ? 'badge-settled' : 'badge-pending'}>
              {wallet.isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          {wallet.isConnected ? (
            <div className="text-[11px] font-mono text-textSecondary truncate bg-bgMain p-2 rounded border border-borderSubtle">
              Address: {wallet.address}
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-textSecondary">Connect Lace to sign ZK proofs</span>
              <button
                type="button"
                onClick={onConnectWallet}
                className="btn-secondary py-1 px-3 text-xs"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-textPrimary font-semibold mb-1">Your Full Name / Display Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-textSecondary" />
              <input
                type="text"
                required
                placeholder="e.g., Alice Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Email Address (Optional)</label>
            <input
              type="email"
              placeholder="e.g., alice@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <p className="text-[10px] text-textSecondary mt-1">Used for local app preferences. Never shared on-chain.</p>
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Default Base Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="ADA">tADA (Cardano / Midnight Testnet)</option>
            </select>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="privacyTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-borderSubtle text-primaryAccent focus:ring-primaryAccent"
            />
            <label htmlFor="privacyTerms" className="text-[11px] text-textSecondary leading-normal cursor-pointer">
              I acknowledge that my financial expense breakdown, receipts, and split allocations are kept strictly inside my local client-side ZK witness memory.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-borderSubtle">
            <button
              type="button"
              onClick={onGoToLanding}
              className="btn-secondary"
            >
              Back to Landing
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !agreeTerms}
              className="btn-primary disabled:opacity-50"
            >
              <span>Complete Sign Up & Enter App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
