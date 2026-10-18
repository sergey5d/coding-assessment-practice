# Step 2 — Ordered rollups and top N

Keep Step 1 working and add deterministic rollup listings.

## API

```ts
all_rollups(): string[]

top_n(n: number): string[]
```

## Requirements

- Format each current rollup as `"key(count,total)"`.
- Sort rollups by total in descending numeric order.
- Break equal-total ties by key in ascending lexicographical order.
- `all_rollups` returns every current rollup in that order.
- `top_n` returns at most the first `n` entries in the same order.
- `top_n` returns `[]` when `n` is not positive.
- A key with a total of zero remains present as long as at least one accepted record contributes to it.
- Every call reflects all records accepted before the call; no sorted result may be cached after the underlying totals change unless it is correctly invalidated.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step3.md`.

