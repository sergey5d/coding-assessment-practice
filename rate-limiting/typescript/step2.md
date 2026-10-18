# Step 2 — Sliding window

Keep Step 1 working and implement an exact sliding-window log in `SlidingWindowRateLimiter`.

## API

```ts
constructor(limit: number, window_size: number)

allow(key: string, ts: number): boolean
```

## Requirements

- For a request at `ts`, consider accepted requests in the interval `(ts - window_size, ts]`.
- Before deciding, discard stored accepted timestamps less than or equal to `ts - window_size`.
- `allow` returns `true` when fewer than `limit` accepted requests remain for the key, then records `ts`.
- Otherwise it returns `false` and does not record the rejected request.
- A request exactly `window_size` time units old no longer counts.
- Each key has an independent timestamp log.
- Multiple requests may have the same timestamp and each accepted request counts separately.
- The window moves with each request; it is not aligned to epoch boundaries.

The key distinction from Step 1 is that crossing a fixed boundary does not reset recent requests that still lie inside the sliding interval.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step3.md`.

