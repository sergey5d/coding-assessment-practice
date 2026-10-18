# Step 2 — Ranking workers

Keep Step 1 working and add ranked queries by position.

## API

```text
def top_n_workers(n Int, position Str) [Str]
```

## Requirements

- Only workers whose current position equals `position` are eligible.
- Rank eligible workers by completed time in their current position, descending.
- Break equal-time ties by worker ID in ascending lexicographical order. Lume's `Str.compareTo` supplies the ordering.
- Return at most `n` strings formatted as `worker_id(time)`.
- Include eligible workers with no completed sessions using time `0`.
- An open session contributes nothing until it closes.
- Return an empty vector when no workers qualify or `n` is not positive.

## Test this step

```bash
./scripts/test-step2.sh
```

The command includes Step 1 tests. When it passes, continue to `step3.md`.
