# Step 4 — Single-flight loading cache

Keep Steps 1-3 working and implement `SingleFlightCache<K, V>`. It coalesces concurrent cache misses so one caller loads a key while other callers wait for that same result.

## API

```java
public final class SingleFlightCache<K, V> {
    public SingleFlightCache(Duration ttl);
    public SingleFlightCache(Duration ttl, LongSupplier nanoTime);
    public V get(K key, Callable<V> loader) throws Exception;
    public void invalidate(K key);
    public int size();
}
```

## Requirements

- TTL must be positive. Invalid TTL values cause `IllegalArgumentException`.
- The one-argument constructor uses a monotonic time source. The two-argument constructor exists for deterministic testing.
- Keys, loaders, loaded values, and the supplied time source must be non-null.
- A live cached value is returned without invoking the loader.
- An expired value behaves as a miss.
- For concurrent misses of the same key, exactly one caller invokes a loader. Other callers wait and receive the same value or failure.
- Misses for different keys may run their loaders concurrently.
- Caller-provided loaders must never run while a global cache lock is held.
- TTL begins when a successful load completes.
- Loader failures and null loader results are not cached. Waiting callers observe the failure, and a later call may retry.
- `invalidate` removes a completed cached value. It does not cancel a load already in progress.
- `size` removes expired completed values before returning the count. In-flight loads are not included.
- Waiting interruption must be propagated. Do not convert interruption into a cache miss or silently retry.

## Test this step

```bash
./scripts/test-step4.sh
```

Passing this command completes the coding exercise. Continue with `discussion.md` for verbal follow-ups.

