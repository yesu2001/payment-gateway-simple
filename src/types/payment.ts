// Payment Status
export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

// Card Type
export type CardType = "visa" | "mastercard" | "amex" | "unknown";

// Currency
export type Currency = "INR" | "USD";

// Transaction
export type Transaction = {
  id: string;
  amount: number;
  currency: Currency;
  status: "success" | "failed" | "timeout";
  cardType: CardType;
  lastFour: string;
  createdAt: string;
  attemptsCount: number;
  failureReason?: string;
};

// Card Details
export type CardDetails = {
  cardholderName: string;
  number: string;
  expiry: string;
  cvv: string;
};

// Payment Payload
export type PaymentPayload = {
  transactionId: string;
  amount: string;
  currency: Currency;
  cardholderName: string;
  last4: string;
};

// API Response
export type ApiResponse = {
  transactionId: string;
  status: "success" | "failed";
  reason?: string;
  timestamp: string;
};

export type FormErrors = {
  cardholderName?: string;
  number?: string;
  expiry?: string;
  cvv?: string;
  amount?: string;
};

export type CardFormValues = {
  cardholderName: string;
  number: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: Currency;
};
