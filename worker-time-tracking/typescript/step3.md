# Step 3 — Promotions and salary

Read this entire step before writing code. Keep Steps 1-2 working.

A promotion is scheduled first and becomes active only on a later qualifying entry. Work sessions must preserve the position and compensation that were active when they opened.

## API

```ts
promote(
  worker_id: string,
  new_position: string,
  new_compensation: number,
  start_ts: number,
): boolean

calc_salary(
  worker_id: string,
  start_ts: number,
  end_ts: number,
): number | null
```

## Requirements

- `promote` returns `false` when the worker is unknown or already has a pending promotion. Otherwise it records the pending promotion and returns `true`.
- Calling `promote` does not immediately change the worker's current position or compensation.
- A pending promotion takes effect immediately before the worker's first entry at or after its `start_ts`.
- An exit never activates a promotion, even when its timestamp is at or after `start_ts`.
- An entry before `start_ts` keeps the promotion pending and uses the old position and compensation for that entire session.
- Once a promotion activates, the worker's current position and compensation change and the pending promotion is cleared.
- `top_n_workers` uses the worker's current position. Its displayed time includes only completed sessions that started in that current position; time from earlier positions is not carried into the new position's ranking.
- `get` continues to return completed time across all positions.
- `calc_salary` returns the worker's pay from completed sessions, clipped to the half-open query range `[start_ts, end_ts)`.
- Each session is paid using the compensation that was active when that session started, even if promotion eligibility or activation occurs before the session ends.
- An open session contributes nothing to salary until it is closed.
- `calc_salary` returns `null` for an unknown worker.
- For a known worker, `calc_salary` returns `0` when the range is empty or no completed session overlaps it.

The key modeling requirement is to retain completed sessions with their start, end, position, and compensation captured at entry. Promotion changes future sessions only.

## Test this step

```bash
npm run test:step3
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step4.md`.

