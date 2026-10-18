# Step 2 — Ranking workers

Keep Step 1 working and add ranked queries by position.

## API

```ts
top_n_workers(n: number, position: string): string[]
```

## Requirements

- Only workers whose current position equals `position` are eligible.
- Rank eligible workers by their total completed time in their current position, descending.
- Break equal-time ties by worker ID in ascending lexicographical order.
- Return at most `n` strings, each formatted as `"worker_id(time)"`.
- A worker with no completed session in the requested position is included with time `0`.
- An open session contributes nothing to the ranking until it is closed.
- Return `[]` when no workers have the requested position or when `n` is not positive.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step3.md`.

