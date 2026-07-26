import React, { useState } from 'react';
import { Group, SplitMethod, Member } from '../types';
import { X, Plus, Upload, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { calculateSplits, validateSplitInputs } from '../utils/splitCalculator';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  selectedGroupId?: string;
  onAddExpense: (expenseData: {
    groupId: string;
    title: string;
    totalAmount: number;
    currency: string;
    payerId: string;
    category: string;
    date: string;
    notes?: string;
    splitMethod: SplitMethod;
    customValues: Record<string, number>;
    receiptMetadata?: { filename: string; filesize: string; mimeType: string; hash: string };
  }) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  groups,
  selectedGroupId,
  onAddExpense,
}) => {
  const [groupId, setGroupId] = useState(selectedGroupId || groups[0]?.id || '');
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [payerId, setPayerId] = useState('');
  const [category, setCategory] = useState('Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [customValues, setCustomValues] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState<{ filename: string; filesize: string; mimeType: string; hash: string } | null>(null);

  if (!isOpen) return null;

  const currentGroup = groups.find(g => g.id === groupId) || groups[0];
  const members = currentGroup?.members || [];

  // Default payer to first member if not selected
  const activePayerId = payerId || members[0]?.id || '';

  const numAmount = typeof totalAmount === 'number' ? totalAmount : 0;
  const calculatedSplits = calculateSplits(numAmount, members, splitMethod, customValues);
  const validation = validateSplitInputs(numAmount, members, splitMethod, customValues);

  const handleCustomValueChange = (memberId: string, val: number) => {
    setCustomValues(prev => ({ ...prev, [memberId]: val }));
  };

  const handleSimulateReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulatedHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setReceipt({
        filename: file.name,
        filesize: (file.size / 1024).toFixed(1) + ' KB',
        mimeType: file.type || 'image/jpeg',
        hash: simulatedHash
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numAmount <= 0 || !validation.valid) return;

    onAddExpense({
      groupId: currentGroup.id,
      title: title.trim(),
      totalAmount: numAmount,
      currency: currentGroup.currency || 'USD',
      payerId: activePayerId,
      category,
      date,
      notes: notes.trim(),
      splitMethod,
      customValues,
      receiptMetadata: receipt || undefined
    });

    // Reset form
    setTitle('');
    setTotalAmount('');
    setNotes('');
    setReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-bgMain border border-borderSubtle rounded-lg max-w-xl w-full p-6 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
          <div>
            <h3 className="text-base font-semibold text-textPrimary">Add Private Group Expense</h3>
            <p className="text-xs text-textSecondary">Amount details remain strictly in local ZK witness</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-textSecondary hover:text-textPrimary hover:bg-bgSec">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-textPrimary font-semibold mb-1">Target Group *</label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="input-field"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-textPrimary font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="Dining">Dining & Drinks</option>
                <option value="Groceries">Groceries</option>
                <option value="Travel">Travel & Flight</option>
                <option value="Rent">Rent & Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-textPrimary font-semibold mb-1">Expense Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Grocery Shopping at Whole Foods"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-textPrimary font-semibold mb-1">Total Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="input-field font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-textPrimary font-semibold mb-1">Paid By</label>
              <select
                value={activePayerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="input-field"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-textPrimary font-semibold mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Split Method Tabs */}
          <div className="space-y-2 pt-2 border-t border-borderSubtle">
            <label className="block text-textPrimary font-semibold">Split Method</label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-bgSec border border-borderSubtle rounded-md">
              {(['equal', 'percentage', 'exact', 'shares'] as SplitMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSplitMethod(m)}
                  className={`py-1.5 rounded text-[11px] font-medium capitalize transition-colors ${
                    splitMethod === m
                      ? 'bg-bgMain text-primaryAccent font-bold border border-borderSubtle'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Split Calculation Breakdown Table */}
          <div className="space-y-2 border border-borderSubtle rounded-md p-3 bg-bgSec">
            <div className="text-[11px] font-semibold text-textPrimary flex items-center justify-between">
              <span>Member Split Breakdown</span>
              <span className="font-mono text-textSecondary">${numAmount.toFixed(2)} Total</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {members.map((m) => {
                const splitItem = calculatedSplits.find(s => s.memberId === m.id);
                return (
                  <div key={m.id} className="flex items-center justify-between bg-bgMain border border-borderSubtle px-3 py-1.5 rounded">
                    <span className="font-medium text-textPrimary">{m.name}</span>

                    <div className="flex items-center gap-2">
                      {splitMethod === 'percentage' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="0"
                            value={customValues[m.id] ?? ''}
                            onChange={(e) => handleCustomValueChange(m.id, parseFloat(e.target.value) || 0)}
                            className="w-16 input-field py-0.5 px-1 text-right font-mono text-xs"
                          />
                          <span className="text-textSecondary">%</span>
                        </div>
                      )}

                      {splitMethod === 'exact' && (
                        <div className="flex items-center gap-1">
                          <span className="text-textSecondary">$</span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={customValues[m.id] ?? ''}
                            onChange={(e) => handleCustomValueChange(m.id, parseFloat(e.target.value) || 0)}
                            className="w-20 input-field py-0.5 px-1 text-right font-mono text-xs"
                          />
                        </div>
                      )}

                      {splitMethod === 'shares' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="1"
                            value={customValues[m.id] ?? ''}
                            onChange={(e) => handleCustomValueChange(m.id, parseFloat(e.target.value) || 0)}
                            className="w-16 input-field py-0.5 px-1 text-right font-mono text-xs"
                          />
                          <span className="text-textSecondary">shares</span>
                        </div>
                      )}

                      <span className="font-mono font-bold text-textPrimary w-20 text-right">
                        ${(splitItem?.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {!validation.valid && (
              <div className="flex items-center gap-1.5 text-statusError text-[11px] font-medium pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validation.error}</span>
              </div>
            )}
          </div>

          {/* Receipt Upload simulation */}
          <div>
            <label className="block text-textPrimary font-semibold mb-1">Receipt Metadata (Optional)</label>
            <div className="border border-dashed border-borderSubtle rounded-md p-3 text-center bg-bgSec">
              {receipt ? (
                <div className="flex items-center justify-between bg-bgMain border border-borderSubtle p-2 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primaryAccent" />
                    <div className="text-left">
                      <div className="font-semibold text-textPrimary truncate">{receipt.filename}</div>
                      <div className="text-[10px] text-textSecondary font-mono">{receipt.filesize} • ZK Hash: {receipt.hash.slice(0, 10)}...</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setReceipt(null)} className="text-textSecondary hover:text-statusError">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center gap-1">
                  <Upload className="w-5 h-5 text-textSecondary" />
                  <span className="text-textPrimary font-medium">Click to upload receipt image</span>
                  <span className="text-[10px] text-textSecondary font-mono">Image bytes hashed locally into ZK witness</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleSimulateReceiptUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-3 bg-bgSec border border-borderSubtle rounded-md text-textSecondary text-[11px]">
            <ShieldCheck className="w-4 h-4 text-primaryAccent shrink-0" />
            <span>Only the 32-byte cryptographic hash of this expense will be published via `addPrivateExpense` Compact circuit.</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-borderSubtle">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!validation.valid || numAmount <= 0}
              className="btn-primary disabled:opacity-50"
            >
              Generate ZK Proof & Add Expense
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
