# Step 3 — Transfers

Read this entire step before writing code. Keep Steps 1-2 working.

A transfer remains pending for 24 hours (`86_400_000` ms). While it is pending, its amount is reflected as a debit in the source balance and a credit in the destination balance. Acceptance finalizes those existing balance changes rather than applying them again.

A pending incoming credit is visible in the destination balance but cannot be spent until the transfer is accepted. An account's *available funds* are its balance minus all pending credits it is receiving. Because pending credits are never spent, reversing one never makes a balance negative.

## API

```ts
transfer(
  ts: number,
  src: string,
  dst: string,
  amount: number,
): string | null

accept_transfer(
  ts: number,
  account: string,
  transfer_id: string,
): boolean
```

## Requirements

- Both accounts must exist, source and destination must differ, the amount must be a positive integer, and the source's available funds must cover the amount.
- A failed `transfer` returns `null` and changes nothing.
- A successful transfer immediately subtracts the amount from the source balance, adds it to the destination balance as a pending transfer, and returns a globally increasing ID: `"transfer1"`, `"transfer2"`, and so on.
- Only successful transfers consume an ID.
- `accept_transfer` succeeds only when the transfer exists, is still pending, has not expired, and `account` is its destination.
- On success, finalize the pending balance changes and return `true`. The destination must not be credited a second time.
- On failure, return `false` and leave the transfer pending unless it expired.
- A transfer expires exactly at `createdAt + 86_400_000`. Expiration reverses both pending balance changes, refunds the source, and permanently prevents acceptance.
- Every public operation processes all expirations at or before its own `ts` before doing anything else. A `pay` at the exact expiry timestamp can use the refund.
- `top_spenders` counts a transfer as outgoing only after it is accepted. Pending and expired transfers do not count.
- `pay` succeeds only when the account's available funds cover the amount. Pending incoming credits cannot be used to pay.
- `deposit` and `pay` return the balance with all non-expired pending transfer debits and credits reflected.

## Test this step

```bash
npm run test:step3
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step4.md`.
