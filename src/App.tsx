import React, { useState } from 'react';
import { Group, Expense, SettlementTransfer, WalletState } from './types';
import { calculateSplits, computeOptimalSettlements } from './utils/splitCalculator';
import { generateExpenseCommitment } from './api/zkProofService';
import { midnightContractClient } from './api/contractClient';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WalletModal } from './components/WalletModal';

import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { GroupsPage } from './pages/GroupsPage';
import { GroupDetailsPage } from './pages/GroupDetailsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AddExpenseModal } from './pages/AddExpenseModal';
import { CreateGroupModal } from './pages/CreateGroupModal';
import { SettlementPage } from './pages/SettlementPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Seed Initial Groups & Expenses
const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp_apartment_4b',
    name: 'Apartment 4B Roommates',
    description: 'Monthly rent, utilities, household groceries, and shared internet bill.',
    createdDate: '2026-07-01',
    currency: 'USD',
    settlementStatus: 'active',
    totalExpensesAmount: 430.00,
    zkBalanceCommitment: '0x4f8a12bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    members: [
      { id: 'mbr_alice', name: 'Alice Vance', walletAddress: 'mn_addr_undeployed1abc...', balance: 143.33 },
      { id: 'mbr_bob', name: 'Bob', walletAddress: 'mn_addr_undeployed2def...', balance: -71.67 },
      { id: 'mbr_charlie', name: 'Charlie', walletAddress: 'mn_addr_undeployed3ghi...', balance: -71.66 }
    ],
    expenses: [
      {
        id: 'exp_grocery_1',
        groupId: 'grp_apartment_4b',
        title: 'Whole Foods Grocery & Supplies',
        totalAmount: 250.00,
        currency: 'USD',
        payerId: 'mbr_alice',
        payerName: 'Alice Vance',
        category: 'Groceries',
        date: '2026-07-20',
        splitMethod: 'equal',
        isPrivateWitness: true,
        zkCommitment: '0x4f8a12bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
        splits: [
          { memberId: 'mbr_alice', memberName: 'Alice Vance', amount: 83.34 },
          { memberId: 'mbr_bob', memberName: 'Bob', amount: 83.33 },
          { memberId: 'mbr_charlie', memberName: 'Charlie', amount: 83.33 }
        ]
      },
      {
        id: 'exp_wifi_1',
        groupId: 'grp_apartment_4b',
        title: 'High-Speed Fiber Internet Bill',
        totalAmount: 180.00,
        currency: 'USD',
        payerId: 'mbr_alice',
        payerName: 'Alice Vance',
        category: 'Rent',
        date: '2026-07-22',
        splitMethod: 'equal',
        isPrivateWitness: true,
        zkCommitment: '0x9f8a12bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
        splits: [
          { memberId: 'mbr_alice', memberName: 'Alice Vance', amount: 60.00 },
          { memberId: 'mbr_bob', memberName: 'Bob', amount: 60.00 },
          { memberId: 'mbr_charlie', memberName: 'Charlie', amount: 60.00 }
        ]
      }
    ]
  },
  {
    id: 'grp_summer_trip_2026',
    name: 'Summer Vacation Trip 2026',
    description: 'Airbnb rental, car hire, dining, and activity tickets.',
    createdDate: '2026-07-15',
    currency: 'USD',
    settlementStatus: 'active',
    totalExpensesAmount: 600.00,
    zkBalanceCommitment: '0x88884f8a12bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
    contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
    members: [
      { id: 'mbr_alice', name: 'Alice Vance', walletAddress: 'mn_addr_undeployed1abc...', balance: 200.00 },
      { id: 'mbr_bob', name: 'Bob', walletAddress: 'mn_addr_undeployed2def...', balance: -100.00 },
      { id: 'mbr_charlie', name: 'Charlie', walletAddress: 'mn_addr_undeployed3ghi...', balance: -100.00 }
    ],
    expenses: [
      {
        id: 'exp_airbnb_1',
        groupId: 'grp_summer_trip_2026',
        title: 'Beachside Villa Booking',
        totalAmount: 600.00,
        currency: 'USD',
        payerId: 'mbr_alice',
        payerName: 'Alice Vance',
        category: 'Travel',
        date: '2026-07-18',
        splitMethod: 'equal',
        isPrivateWitness: true,
        zkCommitment: '0x777712bc93e0451a892b11ef44567890abcdef1234567890abcdef1234567890',
        splits: [
          { memberId: 'mbr_alice', memberName: 'Alice Vance', amount: 200.00 },
          { memberId: 'mbr_bob', memberName: 'Bob', amount: 200.00 },
          { memberId: 'mbr_charlie', memberName: 'Charlie', amount: 200.00 }
        ]
      }
    ]
  }
];

export const App: React.FC = () => {
  // Application ALWAYS starts on Landing page
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<{ name: string; email: string; currency: string } | null>(null);

  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: 'undeployed',
    balance: '0 tADA',
    walletName: null
  });

  // Flatten all expenses across groups
  const allExpenses = groups.flatMap(g => g.expenses);

  // Derive optimal settlements
  const allSettlements: SettlementTransfer[] = groups.flatMap(g =>
    computeOptimalSettlements(g.id, g.currency, g.members)
  );

  const handleConnectWallet = () => {
    setWallet({
      isConnected: true,
      address: 'mn_addr_undeployed1abc9876543210xyz',
      network: 'undeployed',
      balance: '1000.00 tADA',
      walletName: 'Lace Midnight'
    });
    setIsWalletModalOpen(false);
  };

  const handleDisconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      network: 'undeployed',
      balance: '0 tADA',
      walletName: null
    });
    setIsWalletModalOpen(false);
  };

  const handleCompleteSignUp = (data: { name: string; email: string; currency: string }) => {
    setUserProfile(data);
    if (!wallet.isConnected) {
      handleConnectWallet();
    }
    setActiveTab('dashboard');
  };

  const handleEnterDemo = () => {
    if (!wallet.isConnected) {
      handleConnectWallet();
    }
    setActiveTab('dashboard');
  };

  const handleCreateGroup = (groupData: { name: string; description: string; currency: string; memberNames: string[] }) => {
    const newGroupId = 'grp_' + Date.now();
    const newMembers = groupData.memberNames.map((name, idx) => ({
      id: `mbr_${Date.now()}_${idx}`,
      name,
      walletAddress: `mn_addr_undeployed${idx + 1}...`,
      balance: 0
    }));

    const newGroup: Group = {
      id: newGroupId,
      name: groupData.name,
      description: groupData.description,
      createdDate: new Date().toISOString().split('T')[0],
      currency: groupData.currency,
      settlementStatus: 'active',
      totalExpensesAmount: 0,
      zkBalanceCommitment: '0x' + Array.from({ length: 64 }, () => 'a').join(''),
      contractAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      members: newMembers,
      expenses: []
    };

    setGroups([newGroup, ...groups]);
    setSelectedGroupId(newGroupId);
    setActiveTab('groupDetails');
  };

  const handleAddExpense = async (data: any) => {
    const group = groups.find(g => g.id === data.groupId);
    if (!group) return;

    const splits = calculateSplits(data.totalAmount, group.members, data.splitMethod, data.customValues);
    const splitRecord: Record<string, number> = {};
    splits.forEach(s => { splitRecord[s.memberId] = s.amount; });

    // Call ZK commitment generator & circuit
    const circuitRes = await midnightContractClient.addPrivateExpenseCircuit(
      data.groupId,
      data.totalAmount,
      data.payerId,
      splitRecord,
      data.receiptMetadata?.filename
    );

    const payerObj = group.members.find(m => m.id === data.payerId);

    const newExpense: Expense = {
      id: 'exp_' + Date.now(),
      groupId: data.groupId,
      title: data.title,
      totalAmount: data.totalAmount,
      currency: data.currency,
      payerId: data.payerId,
      payerName: payerObj?.name || 'Unknown',
      category: data.category,
      date: data.date,
      notes: data.notes,
      receiptMetadata: data.receiptMetadata,
      splits,
      splitMethod: data.splitMethod,
      zkCommitment: circuitRes.commitmentHash,
      isPrivateWitness: true
    };

    // Update balances
    const updatedMembers = group.members.map(m => {
      const splitAmount = splits.find(s => s.memberId === m.id)?.amount || 0;
      let diff = -splitAmount;
      if (m.id === data.payerId) {
        diff += data.totalAmount;
      }
      return {
        ...m,
        balance: Math.round((m.balance + diff) * 100) / 100
      };
    });

    const updatedGroup: Group = {
      ...group,
      totalExpensesAmount: group.totalExpensesAmount + data.totalAmount,
      expenses: [newExpense, ...group.expenses],
      members: updatedMembers
    };

    setGroups(groups.map(g => g.id === data.groupId ? updatedGroup : g));
  };

  const handleExecuteSettlement = (settlementId: string) => {
    // Settle transfer
    const updatedGroups = groups.map(g => ({
      ...g,
      members: g.members.map(m => ({ ...m, balance: 0 })),
      settlementStatus: 'settled' as const
    }));
    setGroups(updatedGroups);
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setActiveTab('groupDetails');
  };

  const currentSelectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  // Render standalone view for Landing & Sign Up pages
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onGoToSignUp={() => setActiveTab('signup')}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onEnterDemo={handleEnterDemo}
      />
    );
  }

  if (activeTab === 'signup') {
    return (
      <SignUpPage
        wallet={wallet}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onCompleteSignUp={handleCompleteSignUp}
        onGoToLanding={() => setActiveTab('landing')}
      />
    );
  }

  // Dashboard Workspace View
  return (
    <div className="min-h-screen bg-bgMain text-textPrimary flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (t !== 'groupDetails') setSelectedGroupId(null);
          setActiveTab(t);
        }}
      />

      {/* Main SaaS Dashboard Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(t) => {
            if (t !== 'groupDetails') setSelectedGroupId(null);
            setActiveTab(t);
          }}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardPage
              groups={groups}
              expenses={allExpenses}
              settlements={allSettlements}
              onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
              onSelectGroup={handleSelectGroup}
              onNavigateTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === 'groups' && (
            <GroupsPage
              groups={groups}
              onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
              onSelectGroup={handleSelectGroup}
            />
          )}

          {activeTab === 'groupDetails' && currentSelectedGroup && (
            <GroupDetailsPage
              group={currentSelectedGroup}
              onBack={() => setActiveTab('groups')}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
              onOpenSettlement={() => setActiveTab('settlement')}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesPage
              expenses={allExpenses}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />
          )}

          {activeTab === 'settlement' && (
            <SettlementPage
              groups={groups}
              settlements={allSettlements}
              onExecuteSettlement={handleExecuteSettlement}
            />
          )}

          {activeTab === 'activity' && <ActivityPage />}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === '404' && <NotFoundPage onGoHome={() => setActiveTab('dashboard')} />}
        </main>
      </div>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        groups={groups}
        selectedGroupId={selectedGroupId || undefined}
        onAddExpense={handleAddExpense}
      />

    </div>
  );
};
