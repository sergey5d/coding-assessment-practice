# Step 4 — Time-range top N

Keep Steps 1-3 working and add top-N aggregation over timestamp ranges.

## API

```ts
top_n_in_range(
  start_ts: number,
  end_ts: number,
  n: number,
): string[]
```

## Requirements

- Consider non-voided records whose timestamps lie in the half-open interval `[start_ts, end_ts)`.
- Aggregate matching records by key within the range; lifetime rollups are not reused when they include records outside the range.
- Format each range rollup as `"key(count,total)"`.
- Sort by range total descending, then key ascending.
- Return at most `n` entries.
- Return `[]` when `n` is not positive, the range is empty or reversed, or no active records fall inside it.
- A key appears only when at least one active record falls inside the requested range, even if its range total is zero.
- Exact range boundaries, duplicate rejection, and voiding must all be reflected.
- Queries must work correctly even when records were ingested out of timestamp order.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.

