# Step 1 — Fixed window

Implement a fixed-window counter in `FixedWindowRateLimiter`.

## API

```ts
constructor(limit: number, window_size: number)

allow(key: string, ts: number): boolean
```

## Requirements

- Time is divided into fixed, epoch-anchored windows of length `window_size`.
- Window number `k` covers the half-open interval `[k × window_size, (k + 1) × window_size)`.
- Each key has an independent accepted-request count for the current window.
- `allow` returns `true` for the first `limit` requests by that key in a window.
- Further requests by that key in the same window return `false`.
- A request at the exact beginning of the next window sees a reset count.
- Rejected requests do not consume quota.
- Windows with no requests require no stored state.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.

