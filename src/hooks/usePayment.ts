import { usePaymentStore } from "@/store/paymentStore";
import { CardFormValues, Transaction } from "@/types/payment";
import { submitPayment } from "@/utils/api";
import { detectCardType } from "@/utils/cardUtils";

export function usePayment() {
  const store = usePaymentStore();

  async function pay(formValues: CardFormValues) {
    if (store.status === "processing") return; // prevent double submit

    // generate ID only on first attempt
    let txId = store.currentTransactionId;
    if (!txId) {
      txId = crypto.randomUUID();
      store.setTransactionId(txId);
    }

    store.incrementAttempt();
    store.setStatus("processing");
    store.setFailureReason(null);

    const payload = {
      transactionId: txId,
      amount: formValues.amount,
      currency: formValues.currency,
      cardholderName: formValues.cardholderName,
      last4: formValues.number.slice(-4),
    };

    try {
      const result = await submitPayment(payload);

      // Create transaction record
      const transaction: Transaction = {
        id: result.transactionId,
        amount: parseFloat(formValues.amount),
        currency: formValues.currency,
        status: result.status,
        cardType: detectCardType(formValues.number),
        lastFour: formValues.number.slice(-4),
        createdAt: result.timestamp || new Date().toISOString(),
        attemptsCount: store.attemptCount,
        failureReason: result.status === "failed" ? result.reason : undefined,
      };

      store.addTransaction(transaction);

      if (result.status === "success") {
        store.setStatus("success");
      } else {
        store.setStatus("failed");
        store.setFailureReason(result.reason || "Payment failed");
      }
    } catch (err) {
      // Handle timeout or network errors
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";

      const transaction: Transaction = {
        id: txId,
        amount: parseFloat(formValues.amount),
        currency: formValues.currency,
        status: "timeout",
        cardType: detectCardType(formValues.number),
        lastFour: formValues.number.slice(-4),
        createdAt: new Date().toISOString(),
        attemptsCount: store.attemptCount,
        failureReason: errorMessage,
      };

      store.addTransaction(transaction);
      store.setStatus("timeout");
      store.setFailureReason(errorMessage);
    }
  }

  async function retry(formValues: CardFormValues) {
    if (store.status === "processing" || store.attemptCount >= 3) return;
    await pay(formValues);
  }

  return {
    pay,
    retry,
    status: store.status,
    attemptCount: store.attemptCount,
    failureReason: store.failureReason,
    canRetry:
      store.attemptCount < 3 &&
      (store.status === "failed" || store.status === "timeout"),
    startNewPayment: store.resetPayment,
  };
}
