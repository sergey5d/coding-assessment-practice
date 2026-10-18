# Step 3 — Leaky bucket

Keep Steps 1-2 working and implement a leaky-bucket meter in `LeakyBucketRateLimiter`.

## API

```ts
constructor(capacity: number, leak_rate: number)

allow(key: string, ts: number, amount?: number): boolean
```

## Requirements

- Each key has an independent bucket that starts empty.
- `amount` defaults to `1` and is a positive number.
- Before processing a request, leak `elapsed × leak_rate` units from that key's current fill level.
- Fill cannot fall below `0`.
- If adding `amount` would keep fill less than or equal to `capacity`, add it and return `true`.
- Otherwise return `false` without adding `amount`.
- A rejected request still records the processed timestamp and leaked fill level.
- Requests at the same timestamp cause no leakage between them.
- An amount greater than the bucket capacity can never be accepted.

Model the fill level as a number. Leakage is continuous, so fractional fill values are valid even when capacity and request amounts are integers.

## Test this step

```bash
npm run test:step3
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step4.md`.

