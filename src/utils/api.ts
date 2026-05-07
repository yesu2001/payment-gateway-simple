import { ApiResponse, PaymentPayload } from "@/types/payment";

export async function submitPayment(
  payload: PaymentPayload,
): Promise<ApiResponse> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch("/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timerId);

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      if (data && typeof data === "object" && "status" in data && data.status === "failed") {
        return data as ApiResponse;
      }
      throw new Error(
        data && typeof data === "object" && "error" in data && typeof data.error === "string"
          ? data.error
          : "Something went wrong. Please try again."
      );
    }

    return data as ApiResponse;
  } catch (error) {
    clearTimeout(timerId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }
}
