"use client";

import React, { useState } from "react";
import { CardPreview } from "@/components/CardPreview";
import { CardInput } from "@/components/CardInput";
import { StatusView } from "@/components/StatusView";
import { usePayment } from "@/hooks/usePayment";
import { CardFormValues, FormErrors } from "@/types/payment";
import { TransactionHistory } from "@/components/TransactionHistory";
import { usePaymentStore } from "@/store/paymentStore";
import {
  validateCardholderName,
  validateCardNumber,
  validateExpiry,
  validateCvv,
  validateAmount,
} from "@/utils/validators";
import { detectCardType } from "@/utils/cardUtils";

const initialFormState: CardFormValues = {
  cardholderName: "",
  number: "",
  expiry: "",
  cvv: "",
  amount: "49.00",
  currency: "USD",
};

export default function PaymentGateway() {
  const [formData, setFormData] = useState<CardFormValues>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const {
    pay,
    retry,
    status,
    attemptCount,
    failureReason,
    canRetry,
    startNewPayment,
  } = usePayment();
  const transactionsList = usePaymentStore((state) => state.transactions);

  // Real-time validation
  const validateField = (
    field: keyof CardFormValues,
    value: string,
    currentFormData = formData,
  ) => {
    let error: string | undefined;

    switch (field) {
      case "cardholderName":
        error = validateCardholderName(value);
        break;
      case "number":
        error = validateCardNumber(value, detectCardType(value));
        break;
      case "expiry":
        error = validateExpiry(value);
        break;
      case "cvv":
        error = validateCvv(value, detectCardType(currentFormData.number));
        break;
      case "amount":
        error = validateAmount(value);
        break;
    }

    setFormErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleFieldChange = (field: keyof CardFormValues, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (field === "currency") {
      return;
    }

    // Validate on change if field has been touched
    if (touched[field]) {
      validateField(field, value, newFormData);
    }

    if (field === "number" && touched.cvv && newFormData.cvv) {
      validateField("cvv", newFormData.cvv, newFormData);
    }
  };

  const handleFieldBlur = (field: keyof CardFormValues) => {
    if (field === "currency") {
      return;
    }

    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field], formData);
  };

  const currencySymbol = formData.currency === "INR" ? "₹" : "$";

  // Check if form is valid by validating each field directly
  const isFormValid = () => {
    const cardType = detectCardType(formData.number);
    return (
      !validateCardholderName(formData.cardholderName) &&
      !validateCardNumber(formData.number, cardType) &&
      !validateExpiry(formData.expiry) &&
      !validateCvv(formData.cvv, cardType) &&
      !validateAmount(formData.amount)
    );
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    await pay(formData);
  };

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Contacting bank... do not refresh.";
      case "success":
        return "Thank you! Your payment was processed successfully.";
      case "failed":
        return (
          failureReason || "The card was declined. Please check your details."
        );
      case "timeout":
        return failureReason || "The request timed out. Please try again.";
      default:
        return "";
    }
  };

  const reset = () => {
    startNewPayment();
    setFormData(initialFormState);
    setFormErrors({});
    setTouched({});
  };

  if (status && status !== "idle") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
          <StatusView
            status={status}
            message={getStatusMessage()}
            attemptCount={attemptCount}
            maxAttempts={3}
          />

          <div className="mt-6 grid gap-3">
            {status !== "processing" && canRetry && status !== "success" ? (
              <button
                onClick={() => retry(formData)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl shadow-sm transition"
              >
                Retry payment ({attemptCount}/3)
              </button>
            ) : null}

            {status !== "processing" ? (
              <button
                onClick={reset}
                className="w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition"
              >
                Start a new payment
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-6">
          <CardPreview
            number={formData.number}
            name={formData.cardholderName}
            expiry={formData.expiry}
          />

          <div className="overflow-hidden">
            <TransactionHistory transactions={transactionsList} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">
              Secure Checkout
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Pay with confidence
            </h1>
            <p className="mt-2 text-slate-500">
              Fill in your card details to complete a fast and secure payment.
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <CardInput
              label="Name on card"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(val) => handleFieldChange("cardholderName", val)}
              onBlur={() => handleFieldBlur("cardholderName")}
              error={formErrors.cardholderName}
            />

            <CardInput
              label="Card number"
              placeholder="4242 4242 4242 4242"
              value={formData.number}
              onChange={(val) => handleFieldChange("number", val)}
              onBlur={() => handleFieldBlur("number")}
              error={formErrors.number}
              type="tel"
              maxLength={19}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <CardInput
                label="Expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(val) => handleFieldChange("expiry", val)}
                onBlur={() => handleFieldBlur("expiry")}
                error={formErrors.expiry}
                type="tel"
                maxLength={5}
              />
              <CardInput
                label="CVC"
                placeholder="123"
                value={formData.cvv}
                onChange={(val) => handleFieldChange("cvv", val)}
                onBlur={() => handleFieldBlur("cvv")}
                error={formErrors.cvv}
                type="tel"
                maxLength={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[100px_1fr] items-end">
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-semibold text-slate-600">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleFieldChange("currency", e.target.value)
                  }
                  className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <CardInput
                label="Amount"
                placeholder="49.00"
                value={formData.amount}
                onChange={(val) => handleFieldChange("amount", val)}
                onBlur={() => handleFieldBlur("amount")}
                error={formErrors.amount}
                type="number"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg transition"
            >
              {`Pay ${currencySymbol}${Number(formData.amount || 0).toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
