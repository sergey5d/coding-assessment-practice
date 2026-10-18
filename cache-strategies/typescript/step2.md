# Step 2 — LFU cache

Keep Step 1 working and implement a capacity-bounded least-frequently-used cache in `LFUCache`.

## API

```ts
class LFUCache<K, V> {
  constructor(capacity: number)
  get(key: K): V | null
  put(key: K, value: V): void
  delete(key: K): boolean
  size(): number
}
```

## Requirements

- Every newly inserted entry starts with frequency `1`.
- A successful `get` increments the entry's frequency and makes it most recently used among entries at its new frequency.
- A failed `get` changes nothing.
- `put` on an existing key replaces its value, increments its frequency, and updates its recency.
- `put` on a new key evicts one entry first when the cache is already at capacity.
- Evict the entry with the lowest frequency.
- When multiple entries share the lowest frequency, evict the least recently used among them.
- `delete` returns `true` only when the key existed and was removed.
- `size` returns the number of currently stored entries.
- A zero-capacity cache retains no entries.

The two ordering dimensions must remain independent: frequency chooses the candidate group, then recency breaks ties within that group.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step3.md`.

