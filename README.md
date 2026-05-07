# Payment Gateway UI

A payment gateway UI built with Next.js (App Router), TypeScript, and Zustand.

## Setup

npm install
npm run dev

Open http://localhost:3000

## Test card numbers

- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- Amex: 3714 496353 98431

## Tech decisions

- Zustand over Redux: simpler API, no boilerplate, works without a Provider
- AbortController: cancels fetch after 6s to handle gateway timeouts
- crypto.randomUUID(): generates transaction ID once, reused on retries for idempotency

## What I'd improve with more time

- Add animations between payment states
- Unit tests for validators and cardUtils
- Better mobile layout for the card preview
- Real card tokenisation instead of sending card data
