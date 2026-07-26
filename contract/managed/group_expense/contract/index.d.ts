import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum SettlementStatus { active = 0, settling = 1, settled = 2 }

export type Witnesses<PS> = {
  getExpenseAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  createGroup(context: __compactRuntime.CircuitContext<PS>,
              id_0: Uint8Array,
              nameHash_0: Uint8Array,
              initialMembers_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  addMember(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  addPrivateExpense(context: __compactRuntime.CircuitContext<PS>,
                    id_0: Uint8Array,
                    expenseCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settleBalances(context: __compactRuntime.CircuitContext<PS>,
                 id_0: Uint8Array,
                 newCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markSettled(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createGroup(context: __compactRuntime.CircuitContext<PS>,
              id_0: Uint8Array,
              nameHash_0: Uint8Array,
              initialMembers_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  addMember(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  addPrivateExpense(context: __compactRuntime.CircuitContext<PS>,
                    id_0: Uint8Array,
                    expenseCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settleBalances(context: __compactRuntime.CircuitContext<PS>,
                 id_0: Uint8Array,
                 newCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markSettled(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createGroup(context: __compactRuntime.CircuitContext<PS>,
              id_0: Uint8Array,
              nameHash_0: Uint8Array,
              initialMembers_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  addMember(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  addPrivateExpense(context: __compactRuntime.CircuitContext<PS>,
                    id_0: Uint8Array,
                    expenseCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settleBalances(context: __compactRuntime.CircuitContext<PS>,
                 id_0: Uint8Array,
                 newCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markSettled(context: __compactRuntime.CircuitContext<PS>, id_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly groupId: Uint8Array;
  readonly groupNameHash: Uint8Array;
  readonly memberCount: bigint;
  readonly expenseCount: bigint;
  readonly settlementStatus: bigint;
  readonly balanceCommitment: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
