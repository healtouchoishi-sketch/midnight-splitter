import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Shield, Users } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: { name: string; description: string; currency: string; memberNames: string[] }) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [members, setMembers] = useState<string[]>(['Alice (You)', 'Bob', 'Charlie']);
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setCurrency('USD');
      setMembers(['Alice (You)', 'Bob', 'Charlie']);
      setNewMember('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    const trimmed = newMember.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (idx: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalMembers = [...members];
    const trimmedPending = newMember.trim();
    if (trimmedPending && !finalMembers.includes(trimmedPending)) {
      finalMembers.push(trimmedPending);
    }

    onCreateGroup({
      name: name.trim(),
      description: description.trim() || 'Private group expense split',
      currency,
      memberNames: finalMembers
    });

    setName('');
    setDescription('');
    setNewMember('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 shadow-lg">
      <div className="bg-bgMain border border-borderSubtle rounded-lg max-w-lg w-full p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-bgSec border border-borderSubtle flex items-center justify-center text-primaryAccent font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-textPrimary">Create New Midnight Group</h3>
              <p className="text-xs text-textSecondary">Initialize group Compact contract & ZK witness</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-textSecondary hover:text-textPrimary hover:bg-bgSec">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-textPrimary font-semibold mb-1">Group Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Summer Trip 2026 or Apartment 4B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Description</label>
            <input
              type="text"
              placeholder="Brief description of group purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-textPrimary font-semibold mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="ADA">tADA (Cardano Testnet)</option>
            </select>
          </div>

          {/* Group Roster Input */}
          <div className="space-y-2">
            <label className="block text-textPrimary font-semibold">Group Members ({members.length})</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Member name or wallet address"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
                className="input-field"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="btn-secondary whitespace-nowrap px-3"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto border border-borderSubtle rounded-md p-2 bg-bgSec">
              {members.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between bg-bgMain border border-borderSubtle px-3 py-1.5 rounded text-textPrimary font-medium">
                  <span>{m}</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="text-textSecondary hover:text-statusError p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-bgSec border border-borderSubtle rounded-md text-textSecondary text-[11px]">
            <Shield className="w-4 h-4 text-primaryAccent shrink-0" />
            <span>Group name and member roster hashes are registered via createGroup Compact circuit.</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-borderSubtle">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Deploy Group Contract
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
