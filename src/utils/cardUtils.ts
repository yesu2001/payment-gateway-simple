import { CardType } from "@/types/payment";

export function detectCardType(value: string): CardType {
  const cleaned = value.replace(/\D/g, "");
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  return "unknown";
}

export function formatCardNumber(value: string, cardType: CardType): string {
  const cleaned = value.replace(/\D/g, "");
  if (cardType === "amex") {
    const part1 = cleaned.slice(0, 4);
    const part2 = cleaned.slice(4, 10);
    const part3 = cleaned.slice(10, 15);
    return [part1, part2, part3].filter((p) => p.length > 0).join(" ");
  } else {
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join(" ");
  }
}

export function getMaxCardLength(cardType: CardType): number {
  if (cardType === "amex") return 15;
  return 16;
}

export function getCvvLength(cardType: CardType): number {
  return cardType === "amex" ? 4 : 3;
}

export function maskCardNumber(number: string): string {
  // 1. Clean the input
  const digits = number.replace(/\D/g, "");

  // 2. Handle empty state
  if (digits.length === 0) return "**** **** **** ****";

  // 3. Define the visible part (last 4)
  const last4 = digits.slice(-4);

  // 4. FIX: Ensure count is never negative
  const maskCount = Math.max(0, digits.length - last4.length);
  const masked = "*".repeat(maskCount);

  const full = masked + last4;

  // 5. Group into 4s for that "Credit Card" look
  // We use a specific regex to ensure it groups correctly even during typing
  return full.match(/.{1,4}/g)?.join(" ") ?? full;
}
