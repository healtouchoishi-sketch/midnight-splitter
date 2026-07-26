export type SplitMethod = 'equal' | 'percentage' | 'exact' | 'shares';

export type SettlementStatusType = 'active' | 'settling' | 'settled';

export interface Member {
  id: string;
  name: string;
  walletAddress: string;
  avatarUrl?: string;
  balance: number; // positive = owed money, negative = owes money
}

export interface ExpenseSplit {
  memberId: string;
  memberName: string;
  amount: number;
  percentage?: number;
  shares?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  totalAmount: number;
  currency: string;
  payerId: string;
  payerName: string;
  category: string;
  date: string;
  notes?: string;
  receiptMetadata?: {
    filename?: string;
    filesize?: string;
    mimeType?: string;
    hash: string;
  };
  splits: ExpenseSplit[];
  splitMethod: SplitMethod;
  zkCommitment: string; // On-chain disclosure commitment hash
  isPrivateWitness: boolean; // Indicates amount & receipt details stay in local witness
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  members: Member[];
  expenses: Expense[];
  settlementStatus: SettlementStatusType;
  totalExpensesAmount: number;
  currency: string;
  zkBalanceCommitment: string;
  contractAddress?: string;
}

export interface SettlementTransfer {
  id: string;
  groupId: string;
  fromMemberId: string;
  fromMemberName: string;
  fromWalletAddress: string;
  toMemberId: string;
  toMemberName: string;
  toWalletAddress: string;
  amount: number;
  currency: string;
  status: 'pending' | 'settled';
  zkProofHash: string;
  timestamp: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: 'undeployed' | 'preprod' | 'preview' | 'mainnet';
  balance: string;
  walletName: string | null;
}
