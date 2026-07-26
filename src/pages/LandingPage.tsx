import React from 'react';
import { Shield, Lock, Users, ArrowRight, CheckCircle2, Zap, Scale, EyeOff, UserPlus, Wallet } from 'lucide-react';

interface LandingPageProps {
  onGoToSignUp: () => void;
  onConnectWallet: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToSignUp, onConnectWallet }) => {
  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-borderSubtle bg-bgSec text-xs font-medium text-textSecondary">
          <Shield className="w-3.5 h-3.5 text-primaryAccent" />
          <span>Built on Midnight Zero-Knowledge Privacy Blockchain</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-textPrimary tracking-tight leading-tight">
          Split Group Expenses with Total Financial Privacy
        </h1>

        <p className="text-base sm:text-lg text-textSecondary leading-relaxed">
          The SaaS platform for friends, roommates, travel groups, and teams. Split bills without broadcasting individual expense amounts, receipt details, or personal net balances on a public ledger.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button onClick={onGoToSignUp} className="btn-primary text-base px-6 py-3 w-full sm:w-auto">
            <UserPlus className="w-5 h-5" />
            <span>Create Account & Sign Up</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <button onClick={onConnectWallet} className="btn-secondary text-base px-6 py-3 w-full sm:w-auto">
            <Wallet className="w-5 h-5 text-textSecondary" />
            <span>Connect Lace Wallet</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-left">
          {[
            { title: 'Zero-Knowledge Proofs', sub: 'Client-side witnesses' },
            { title: '4 Split Methods', sub: 'Equal, %, Exact, Shares' },
            { title: 'Minimal Settlements', sub: 'Debt graph minimization' },
            { title: 'Compact Contracts', sub: 'Midnight circuit verified' },
          ].map((item, i) => (
            <div key={i} className="bg-bgSec border border-borderSubtle rounded-lg p-3">
              <div className="text-xs font-semibold text-textPrimary">{item.title}</div>
              <div className="text-[11px] text-textSecondary font-mono mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Midnight Section */}
      <section className="space-y-6 border-t border-borderSubtle pt-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-textPrimary">Why Public Blockchains Fail Expense Splitting</h2>
          <p className="text-sm text-textSecondary">
            On Ethereum or Solana, every coffee, dinner receipt, and reimbursement is publicly visible to anyone who knows your wallet address. Midnight changes this paradigm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bgMain border border-borderSubtle rounded-lg p-5 space-y-3">
            <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-statusError font-bold">
              <EyeOff className="w-5 h-5 text-statusError" />
            </div>
            <h3 className="text-base font-semibold text-textPrimary">Private Expense Witnesses</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Expense titles, receipt images, categories, and custom splits remain exclusively in client-side witness memory. They are never written to the blockchain.
            </p>
          </div>

          <div className="bg-bgMain border border-borderSubtle rounded-lg p-5 space-y-3">
            <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-primaryAccent font-bold">
              <Lock className="w-5 h-5 text-primaryAccent" />
            </div>
            <h3 className="text-base font-semibold text-textPrimary">Public Hash Commitments</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              The Midnight contract only records 32-byte cryptographic commitments and expense counter state, ensuring total auditability without compromising privacy.
            </p>
          </div>

          <div className="bg-bgMain border border-borderSubtle rounded-lg p-5 space-y-3">
            <div className="w-10 h-10 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-statusSuccess font-bold">
              <Scale className="w-5 h-5 text-statusSuccess" />
            </div>
            <h3 className="text-base font-semibold text-textPrimary">Optimal Debt Settlement</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Automated debt graph simplification computes the absolute minimum transfers needed to balance group ledgers with zero-knowledge proof verification.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-bgSec border border-borderSubtle rounded-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-textPrimary">How Private Group Splitting Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Create Account & Group', desc: 'Sign up and initialize group Compact contract with encrypted roster' },
            { step: '02', title: 'Add Private Expense', desc: 'Submit receipt metadata & split weights into local ZK witness' },
            { step: '03', title: 'Generate ZK Proof', desc: 'Publish 32-byte state commitment to Midnight ledger' },
            { step: '04', title: 'Settle Balances', desc: 'Execute zero-sum settlement transfers with Lace wallet' },
          ].map((item) => (
            <div key={item.step} className="bg-bgMain border border-borderSubtle rounded-md p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-primaryAccent">{item.step}</div>
              <div className="text-sm font-semibold text-textPrimary">{item.title}</div>
              <div className="text-xs text-textSecondary leading-normal">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Card */}
      <section className="card-container text-center py-10 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-textPrimary">Ready for Privacy-First Group Payroll & Splits?</h2>
        <p className="text-xs text-textSecondary">
          Sign up in under 30 seconds. Experience zero-knowledge financial confidentiality on Midnight.
        </p>
        <button onClick={onGoToSignUp} className="btn-primary px-6 py-2.5 text-sm mx-auto">
          <UserPlus className="w-4 h-4" />
          <span>Get Started Now</span>
        </button>
      </section>

    </div>
  );
};
