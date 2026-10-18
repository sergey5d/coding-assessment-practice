# Step 1 — Concurrent counter map

Implement `ConcurrentCounterMap<K>`, a thread-safe collection of named signed counters.

## API

```java
public final class ConcurrentCounterMap<K> {
    public ConcurrentCounterMap();
    public long increment(K key);
    public long add(K key, long delta);
    public long get(K key);
    public Map<K, Long> snapshot();
}
```

## Requirements

- A missing key has value `0`.
- `increment` atomically adds one and returns the new value.
- `add` atomically adds `delta`, which may be positive, negative, or zero, and returns the new value.
- Updates to the same key must not be lost under contention.
- Different keys may be updated concurrently.
- `get` returns the value visible at that operation.
- `snapshot` returns a detached, unmodifiable map. Later updates must not change an earlier snapshot.
- Keys must be non-null. Reject a null key with `NullPointerException` without changing state.
- Do not synchronize on caller-owned key objects.

## Test this step

```bash
./scripts/test-step1.sh
```

When it passes, continue to `step2.md`.

