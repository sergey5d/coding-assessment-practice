# Step 3 — Thread-safe LRU cache

Keep Steps 1-2 working and implement `ThreadSafeLruCache<K, V>`.

## API

```java
public final class ThreadSafeLruCache<K, V> {
    public ThreadSafeLruCache(int capacity);
    public V get(K key);
    public void put(K key, V value);
    public boolean remove(K key);
    public int size();
    public Map<K, V> snapshotMostRecentFirst();
}
```

## Requirements

- Capacity is non-negative. A negative capacity causes `IllegalArgumentException`; a zero-capacity cache retains nothing.
- Null keys and values are not supported and cause `NullPointerException`.
- `get` returns the value or `null` on a miss.
- A successful `get` makes that entry most recently used. A miss changes nothing.
- `put` inserts or replaces a value and makes that key most recently used.
- Inserting a new key into a full cache evicts exactly the least recently used entry.
- `remove` returns whether an entry existed.
- Every public operation is thread-safe, including recency changes caused by reads.
- `get` and `put` must have constant-time average complexity, excluding lock acquisition.
- `snapshotMostRecentFirst` returns a detached, unmodifiable map whose iteration order is most-recently-used to least-recently-used.
- The cache must never exceed capacity, even transiently as observed through a public method.

## Test this step

```bash
./scripts/test-step3.sh
```

The command includes Steps 1-2. When it passes, continue to `step4.md`.

