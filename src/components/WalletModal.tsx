import React from 'react';
import { X, Wallet, CheckCircle2, AlertCircle, Copy, ExternalLink, Shield } from 'lucide-react';
import { WalletState } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
}) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bgMain border border-borderSubtle rounded-lg max-w-md w-full p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-primaryAccent">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-textPrimary">Midnight Wallet Connection</h3>
              <p className="text-xs text-textSecondary">Connect your Lace or Midnight-compatible wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-textSecondary hover:text-textPrimary hover:bg-bgSec"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {wallet.isConnected ? (
          <div className="space-y-4">
            <div className="bg-bgSec border border-borderSubtle rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-textSecondary font-medium">Status</span>
                <span className="badge-settled">Connected (Lace)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-textSecondary font-medium">Network</span>
                <span className="font-mono text-textPrimary font-semibold">{wallet.network}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-textSecondary font-medium">Wallet Address</span>
                <div className="flex items-center justify-between bg-bgMain border border-borderSubtle rounded px-3 py-1.5 font-mono text-xs text-textPrimary">
                  <span className="truncate">{wallet.address}</span>
                  <button
                    onClick={() => wallet.address && copyToClipboard(wallet.address)}
                    className="p-1 text-textSecondary hover:text-textPrimary ml-2"
                    title="Copy address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-textSecondary bg-bgSec p-3 rounded-md border border-borderSubtle">
              <Shield className="w-4 h-4 text-primaryAccent shrink-0" />
              <span>Zero-knowledge proof keys stay client-side inside your browser sandbox.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
              <button onClick={onDisconnect} className="btn-danger">
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-textSecondary leading-relaxed">
              Select a wallet provider to interact with Midnight Compact circuits and generate local ZK proofs for group expenses.
            </p>

            <div className="space-y-2">
              <button
                onClick={onConnect}
                className="w-full flex items-center justify-between p-3 rounded-md border border-borderSubtle bg-bgMain hover:bg-bgSec transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center">
                    L
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-textPrimary">Lace Wallet (Midnight Extension)</div>
                    <div className="text-xs text-textSecondary">Official Cardano & Midnight privacy wallet</div>
                  </div>
                </div>
                <span className="badge-privacy">Detected</span>
              </button>

              <button
                onClick={onConnect}
                className="w-full flex items-center justify-between p-3 rounded-md border border-borderSubtle bg-bgMain hover:bg-bgSec transition-colors text-left opacity-90"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-700 font-bold text-sm flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-textPrimary">Midnight Standalone Proof Node</div>
                    <div className="text-xs text-textSecondary">Local proof server (http://localhost:6300)</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-textSecondary">Local</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
