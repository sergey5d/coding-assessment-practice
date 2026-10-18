# Step 4 — Token bucket

Keep Steps 1-3 working and implement a token bucket in `TokenBucketRateLimiter`.

## API

```ts
constructor(capacity: number, refill_rate: number)

allow(key: string, ts: number, cost?: number): boolean
```

## Requirements

- Each key has an independent bucket that starts full with `capacity` tokens when that key is first seen.
- `cost` defaults to `1` and is a positive number.
- Before processing a request, add `elapsed × refill_rate` tokens for that key.
- The token balance cannot exceed `capacity`.
- If at least `cost` tokens are available, subtract them and return `true`.
- Otherwise return `false` without subtracting tokens.
- A rejected request still records the processed timestamp and refilled balance.
- Requests at the same timestamp receive no refill between them.
- A cost greater than the bucket capacity can never be accepted.

Model the token balance as a number. Refilling is continuous, so fractional token balances are valid.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.

