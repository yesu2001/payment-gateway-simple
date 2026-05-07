import { PaymentStatus, Transaction } from "@/types/payment";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentStore = {
  // State
  status: PaymentStatus;
  currentTransactionId: string | null;
  attemptCount: number;
  failureReason: string | null;
  transactions: Transaction[];

  // Actions
  setStatus: (status: PaymentStatus) => void;
  setTransactionId: (id: string) => void;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  setFailureReason: (reason: string | null) => void;
  addTransaction: (tx: Transaction) => void;
  resetPayment: () => void;
};

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      status: "idle",
      currentTransactionId: null,
      attemptCount: 0,
      failureReason: null,
      transactions: [],

      setStatus: (status) => set({ status }),
      setTransactionId: (id) => set({ currentTransactionId: id }),
      incrementAttempt: () =>
        set((state) => ({ attemptCount: state.attemptCount + 1 })),
      resetAttempts: () => set({ attemptCount: 0 }),
      setFailureReason: (reason) => set({ failureReason: reason }),
      addTransaction: (tx) =>
        set((state) => {
          const existingIndex = state.transactions.findIndex(
            (existingTx) => existingTx.id === tx.id,
          );
          if (existingIndex >= 0) {
            const updatedTransactions = [...state.transactions];
            updatedTransactions[existingIndex] = tx;
            return { transactions: updatedTransactions };
          } else {
            return { transactions: [...state.transactions, tx] };
          }
        }),
      resetPayment: () =>
        set({
          status: "idle",
          currentTransactionId: null,
          attemptCount: 0,
          failureReason: null,
        }),
    }),
    {
      name: "payment-store",
      partialize: (state) => ({
        transactions: state.transactions,
      }),
    },
  ),
);
