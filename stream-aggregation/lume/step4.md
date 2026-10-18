# Step 4 — Time-range top N

Keep Steps 1-3 working and add top-N aggregation over timestamp ranges.

## API

```text
class RecordAggregator {
    def top_n_in_range(start_ts Int, end_ts Int, n Int) [Str]
}
```

## Requirements

- Consider non-voided records whose timestamps lie in the half-open interval `[start_ts, end_ts)`.
- Aggregate matching records by key within the range. Lifetime rollups cannot be reused when they include records outside the range.
- Format each range rollup as `"key(count,total)"`.
- Sort by range total descending, then key ascending.
- Return at most `n` entries.
- Return an empty vector when `n` is not positive, the range is empty or reversed, or no active records fall inside it.
- A key appears only when at least one active record falls inside the requested range, even if its range total is zero.
- Exact range boundaries, duplicate rejection, and voiding must all be reflected.
- Queries must work correctly even when records were ingested out of timestamp order.

## Test this step

```bash
./scripts/test-step4.sh
```

Passing this command and `./scripts/check.sh` completes the exercise.

