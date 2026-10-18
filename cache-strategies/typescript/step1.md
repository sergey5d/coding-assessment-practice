# Step 1 — LRU cache

Implement a capacity-bounded least-recently-used cache in `LRUCache`.

## API

```ts
class LRUCache<K, V> {
  constructor(capacity: number)
  get(key: K): V | null
  put(key: K, value: V): void
  delete(key: K): boolean
  size(): number
}
```

## Requirements

- `get` returns the stored value, or `null` when the key is absent.
- A successful `get` makes that key the most recently used.
- A failed `get` does not change recency.
- `put` inserts a new key as the most recently used.
- `put` on an existing key replaces its value, keeps the cache size unchanged, and makes the key most recently used.
- When insertion makes the cache exceed capacity, evict exactly one least-recently-used key.
- `delete` returns `true` only when the key existed and was removed.
- `size` returns the number of currently stored entries.
- A zero-capacity cache accepts operations but retains no entries.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.

