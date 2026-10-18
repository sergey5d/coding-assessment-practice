# Step 4 — Per-session overtime

Keep Steps 1-3 working and add a worker-specific overtime threshold.

## API

```ts
set_overtime(worker_id: string, threshold: number): boolean
```

## Requirements

- `set_overtime` returns `false` and changes nothing for an unknown worker.
- For a known worker, it stores or replaces the worker's overtime threshold and returns `true`.
- The threshold is a non-negative integer measured in the same time units as timestamps.
- The current threshold applies to all salary calculations for that worker, including sessions completed before the threshold was set or replaced.
- The first `threshold` units of each completed session are paid at the session's captured compensation.
- Time beyond `threshold` in that same session is paid at twice the session's captured compensation.
- The overtime counter resets at the beginning of every session.
- Overtime is determined from the actual session start, not from the beginning of the salary query range.
- `calc_salary` still clips work to `[start_ts, end_ts)`, and then applies the correct normal or overtime rate to each part of the overlap.
- A threshold of `0` makes the entire completed session double-paid.
- Calling `set_overtime` does not change worked-time totals or ranking results.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.

