import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
  const roll = Math.random();

  // if (roll < 0.6) {
  //   // Simulate success
  //   return NextResponse.json({
  //     transactionId: body.transactionId,
  //     status: "success",
  //   });
  // } else if (roll < 0.85) {
  //   // Simulate failure
  const reasons = [
    "Insufficient funds",
    "Card declined",
    "Transaction limit exceeded",
  ];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  return NextResponse.json(
    { transactionId: body.transactionId, status: "failed", reason: reason },
    { status: 400 },
  );
  // } else {
  //   // Simulate timeout
  //   const sleep = (ms: number) =>
  //     new Promise((resolve) => setTimeout(resolve, ms));
  //   await sleep(8000);
  //   return NextResponse.json(
  //     {
  //       transactionId: body.transactionId,
  //       status: "failed",
  //       reason: "Request timed out",
  //     },
  //     { status: 408 },
  //   );
  // }
}
