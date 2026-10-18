# Step 1 — Worker registration and time

Implement worker creation, entry/exit registration, and completed-time queries in `WorkerTimeTracker`.

## API

```ts
add_worker(
  worker_id: string,
  position: string,
  compensation: number,
): boolean

register(worker_id: string, ts: number): boolean

get(worker_id: string): number | null
```

## Requirements

- `add_worker` creates a worker with the supplied position and compensation.
- `add_worker` returns `false` and changes nothing when the worker ID already exists. Otherwise it returns `true`.
- For a known worker, successive `register` calls alternate between entering and leaving work. The first call opens a session; the next closes it; the following call opens another session, and so on.
- `register` returns `true` when the worker exists and the entry or exit was recorded.
- `register` returns `false` and changes nothing when the worker is unknown.
- A completed session contributes `exit_ts - entry_ts` to worked time.
- `get` returns the worker's total time across all completed sessions.
- An open session contributes nothing until it is closed.
- `get` returns `null` when the worker is unknown.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.

