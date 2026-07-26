import React, { useState } from 'react';
import { Settings, Shield, Server, HardDrive, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [network, setNetwork] = useState('undeployed');
  const [proofServerUrl, setProofServerUrl] = useState('http://localhost:6300');
  const [rpcUrl, setRpcUrl] = useState('http://localhost:9944');
  const [indexerUrl, setIndexerUrl] = useState('http://localhost:8088/api/v1/graphql');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-borderSubtle pb-4">
        <h1 className="text-xl font-bold text-textPrimary tracking-tight">Midnight Node & Network Settings</h1>
        <p className="text-xs text-textSecondary mt-0.5">
          Configure proof server, RPC endpoints, and indexer GraphQL settings
        </p>
      </div>

      <form onSubmit={handleSave} className="card-container space-y-5">
        
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-textPrimary font-semibold mb-1">Target Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="input-field"
            >
              <option value="undeployed">Local Standalone (Undeployed)</option>
              <option value="preprod">Midnight Preprod Testnet</option>
              <option value="preview">Midnight Preview Testnet</option>
            </select>
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Proof Server URL (Midnight Compact Prover)</label>
            <input
              type="text"
              value={proofServerUrl}
              onChange={(e) => setProofServerUrl(e.target.value)}
              className="input-field font-mono"
            />
            <p className="text-[11px] text-textSecondary mt-1">Docker proof-server listening on port 6300</p>
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Substrate RPC Endpoint</label>
            <input
              type="text"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              className="input-field font-mono"
            />
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Indexer GraphQL Endpoint</label>
            <input
              type="text"
              value={indexerUrl}
              onChange={(e) => setIndexerUrl(e.target.value)}
              className="input-field font-mono"
            />
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-borderSubtle">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
