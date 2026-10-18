# Step 4 — Per-session overtime

Keep Steps 1-3 working and add a worker-specific overtime threshold.

## API

```text
def set_overtime(worker_id Str, threshold Int) Bool
```

## Requirements

- `set_overtime` returns `false` and changes nothing for an unknown worker.
- For a known worker, it stores or replaces the threshold and returns `true`.
- The threshold is a non-negative `Int` measured in timestamp units.
- The current threshold applies to every salary calculation, including sessions completed before it was set or replaced.
- The first `threshold` units of each completed session use the captured compensation.
- Time beyond the threshold in that session uses twice the captured compensation.
- The overtime counter resets for every session.
- Overtime is measured from the actual session start, not the salary query start.
- Salary still clips sessions to the half-open query range and applies the correct rate to each overlapping part.
- A threshold of `0` double-pays the entire session.
- Overtime settings do not change worked-time totals or rankings.

## Test this step

```bash
./scripts/test-step4.sh
```

Passing it completes the exercise.

