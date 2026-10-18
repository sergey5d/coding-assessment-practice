# Step 1 — Worker registration and time

Implement worker creation, entry/exit registration, and completed-time queries in `WorkerTimeTracker`.

## API

```text
class WorkerTimeTracker {
    def add_worker(worker_id Str, position Str, compensation Int) Bool
    def register(worker_id Str, ts Int) Bool
    def get(worker_id Str) Int?
}
```

## Requirements

- `add_worker` creates a worker with the supplied position and compensation.
- It returns `false` and changes nothing when the worker ID already exists; otherwise it returns `true`.
- For a known worker, successive `register` calls alternate between entering and leaving work. The first call opens a session.
- `register` returns `false` and changes nothing for an unknown worker; otherwise it returns `true`.
- A completed session contributes its exit timestamp minus its entry timestamp.
- `get` returns total time across completed sessions.
- An open session contributes nothing until it closes.
- `get` returns `None` for an unknown worker.

## Test this step

```bash
./scripts/test-step1.sh
```

When it passes, continue to `step2.md`.

