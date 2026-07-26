import React, { useState } from 'react';
import { Expense } from '../types';
import { CreditCard, Search, FileText, Lock, Plus } from 'lucide-react';

interface ExpensesPageProps {
  expenses: Expense[];
  onOpenAddExpense: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ expenses, onOpenAddExpense }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.payerName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderSubtle pb-4">
        <div>
          <h1 className="text-xl font-bold text-textPrimary tracking-tight">All Group Expenses</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Shielded expense log with client-side zero-knowledge proofs
          </p>
        </div>

        <button onClick={onOpenAddExpense} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search expenses by title or payer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="All">All Categories</option>
          <option value="Dining">Dining & Drinks</option>
          <option value="Groceries">Groceries</option>
          <option value="Travel">Travel</option>
          <option value="Rent">Rent & Utilities</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="card-container p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bgSec border-b border-borderSubtle text-textSecondary font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payer</th>
                <th className="py-3 px-4">Split Method</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">ZK Ledger Commitment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-bgSec/60 transition-colors">
                  <td className="py-3 px-4 text-textSecondary font-mono">{e.date}</td>
                  <td className="py-3 px-4 font-semibold text-textPrimary">
                    <div className="flex items-center gap-2">
                      <span>{e.title}</span>
                      {e.receiptMetadata && (
                        <span title={`Receipt: ${e.receiptMetadata.filename}`}>
                          <FileText className="w-3.5 h-3.5 text-primaryAccent" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-textSecondary">{e.category}</td>
                  <td className="py-3 px-4 font-medium text-textPrimary">{e.payerName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-bgSec border border-borderSubtle px-2 py-0.5 rounded text-[11px] font-mono text-textPrimary capitalize">
                      {e.splitMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-textPrimary">
                    ${e.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-primaryAccent">
                    {e.zkCommitment.slice(0, 12)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
