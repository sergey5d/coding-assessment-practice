# Step 2 — Ordered rollups and top N

Keep Step 1 working and add deterministic rollup listings.

## API

```text
class RecordAggregator {
    def all_rollups() [Str]
    def top_n(n Int) [Str]
}
```

## Requirements

- Format each current rollup as `"key(count,total)"`.
- Sort rollups by total in descending numeric order.
- Break equal-total ties by key in ascending lexicographical order.
- `all_rollups` returns every current rollup in that order.
- `top_n` returns at most the first `n` entries in the same order.
- `top_n` returns an empty vector when `n` is not positive.
- A key with a total of zero remains present as long as at least one accepted record contributes to it.
- Every call reflects all records accepted before the call. If sorted results are cached, changes to the underlying totals must invalidate them correctly.

## Test this step

```bash
./scripts/test-step2.sh
```

The command includes all earlier tests. When it passes, continue to `step3.md`.

