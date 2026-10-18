# Step 3 — Promotions and salary

Read this entire step before writing code. Keep Steps 1-2 working.

A promotion is scheduled first and becomes active only on a later qualifying entry. Sessions must preserve the position and compensation active when they opened.

## API

```text
def promote(
    worker_id Str,
    new_position Str,
    new_compensation Int,
    start_ts Int
) Bool

def calc_salary(worker_id Str, start_ts Int, end_ts Int) Int?
```

## Requirements

- `promote` returns `false` when the worker is unknown or already has a pending promotion. Otherwise it stores the pending promotion and returns `true`.
- Scheduling a promotion does not immediately change current position or compensation.
- A pending promotion activates immediately before the worker's first entry at or after its start timestamp.
- An exit never activates a promotion.
- An entry before the promotion start keeps it pending and captures the old position and compensation.
- Activation changes current position and compensation and clears the pending promotion.
- `top_n_workers` uses current position and only completed sessions that started in that position.
- `get` continues to return completed time across all positions.
- `calc_salary` uses completed sessions clipped to the half-open query range.
- Each session uses the compensation captured when it started.
- Open sessions contribute nothing to salary.
- `calc_salary` returns `None` for an unknown worker.
- For a known worker, it returns `Some(0)` for an empty range or no overlapping completed work.

Retain each completed session's start, end, position, and compensation. Promotion changes future sessions only.

## Test this step

```bash
./scripts/test-step3.sh
```

The command includes all earlier tests. When it passes, continue to `step4.md`.

