# Step 4 — TTL with LRU eviction

Keep Steps 1-3 working and implement `TTLLRUCache`, a capacity-bounded cache with per-entry TTL and LRU eviction.

## API

```ts
class TTLLRUCache<K, V> {
  constructor(capacity: number)
  get(key: K, ts: number): V | null
  put(key: K, value: V, ts: number, ttl: number): void
  delete(key: K, ts: number): boolean
  size(ts: number): number
}
```

## Requirements

- Every public operation first removes all entries expiring at or before its timestamp.
- Live entries follow the same recency rules as `LRUCache`.
- A successful `get` makes the key most recently used; a miss does not alter live-entry recency.
- `put` on an existing live key replaces its value and expiration, and makes it most recently used.
- `put` on a missing or expired key creates a new most-recently-used entry.
- After expiration cleanup, inserting a new key into a full cache evicts the least-recently-used live entry.
- Expired entries never cause a live entry to be evicted.
- A value is visible during `[ts, ts + ttl)` and absent at the exact expiration timestamp.
- Refreshing or recreating a key replaces its expiration. An older expiration record must not delete the newer value.
- `delete` returns `true` only when a live entry existed and was removed.
- `size` returns the number of live entries after expiration cleanup.
- A zero-capacity cache retains no entries.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.

