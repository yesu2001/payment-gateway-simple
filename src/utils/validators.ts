import { CardType } from "@/types/payment";
import { getMaxCardLength, getCvvLength } from "./cardUtils";

// Luhn algorithm check
function luhnCheck(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// validate cardholder name
export function validateCardholderName(value: string): string | undefined {
  if (!value || !value.trim()) {
    return "Cardholder name is required";
  }

  if (value.trim().length < 2) {
    return "Cardholder name must be at least 2 characters";
  }

  // Only letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(value)) {
    return "Cardholder name can only contain letters, spaces, hyphens, and apostrophes";
  }

  return undefined;
}

// check card number
export function validateCardNumber(
  value: string,
  cardType: CardType,
): string | undefined {
  if (!value || !value.trim()) {
    return "Card number is required";
  }

  const cleanedValue = value.replace(/\s/g, "");

  // Check for invalid characters
  if (!/^\d*$/.test(cleanedValue)) {
    return "Card number must contain only digits";
  }

  const cardLength = getMaxCardLength(cardType);

  // If we have a complete card number, validate fully
  if (cleanedValue.length === cardLength) {
    if (!luhnCheck(cleanedValue)) {
      return "Card number is invalid";
    }
  } else if (cleanedValue.length > cardLength) {
    return `Card number must be ${cardLength} digits`;
  }

  // For partial input, allow it as long as it's not obviously wrong
  return undefined;
}

// check expiry
export function validateExpiry(value: string): string | undefined {
  if (!value || !value.trim()) {
    return "Expiry date is required";
  }

  // Check format MM/YY
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return "Expiry date must be in MM/YY format";
  }

  const [monthStr, yearStr] = value.split("/");
  const month = parseInt(monthStr, 10);

  // Check month is valid (01-12)
  if (month < 1 || month > 12) {
    return "Month must be between 01 and 12";
  }

  // Check not in the past
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  const year = parseInt(yearStr, 10);

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired";
  }

  return undefined;
}

// check CVV
export function validateCvv(
  value: string,
  cardType: CardType,
): string | undefined {
  if (!value || !value.trim()) {
    return "CVV is required";
  }

  if (!/^\d+$/.test(value)) {
    return "CVV must contain only digits";
  }

  const expectedLength = getCvvLength(cardType);
  if (value.length !== expectedLength) {
    return `CVV must be ${expectedLength} digits`;
  }

  return undefined;
}

// validate amount
export function validateAmount(value: string | number): string | undefined {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "Amount must be a valid number";
  }

  if (numValue <= 0) {
    return "Amount must be greater than 0";
  }

  const MAX_AMOUNT = 1000000;
  if (numValue > MAX_AMOUNT) {
    return `Amount cannot exceed ${MAX_AMOUNT.toLocaleString()}`;
  }

  return undefined;
}
