# Step 3 — TTL cache

Keep Steps 1-2 working and implement an unbounded timestamp-driven cache in `TTLCache`.

## API

```ts
class TTLCache<K, V> {
  set(key: K, value: V, ts: number, ttl: number): void
  get(key: K, ts: number): V | null
  delete(key: K, ts: number): boolean
  size(ts: number): number
}
```

## Requirements

- `set` stores or replaces a key and assigns the new value its own TTL.
- A value set at `ts` is visible during the half-open interval `[ts, ts + ttl)`.
- At `ts + ttl` and later, that version is expired and behaves as absent.
- Every public operation processes all expirations at or before its timestamp before doing anything else.
- `get` returns the live value, or `null` when the key is missing or expired.
- `delete` returns `true` only when a live value existed and was removed.
- `size` returns the number of live entries after expiration processing.
- Overwriting a key replaces its value and expiration time.
- An expiration belonging to an older overwritten version must never remove the newer version.
- TTL expiration is driven only by operation timestamps; do not use wall-clock timers.

## Test this step

```bash
npm run test:step3
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step4.md`.

