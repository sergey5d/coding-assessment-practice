# Step 2 — Bounded blocking queue

Keep Step 1 working and implement `BoundedBlockingQueue<T>` for a producer–consumer workflow.

## API

```java
public final class BoundedBlockingQueue<T> {
    public BoundedBlockingQueue(int capacity);
    public void put(T item) throws InterruptedException;
    public T take() throws InterruptedException;
    public boolean offer(T item, Duration timeout) throws InterruptedException;
    public T poll(Duration timeout) throws InterruptedException;
    public int size();
}
```

## Requirements

- Capacity must be positive; otherwise the constructor throws `IllegalArgumentException`.
- Null elements are not supported and must cause `NullPointerException`.
- Elements are returned in FIFO order.
- `put` waits while the queue is full and resumes when capacity becomes available.
- `take` waits while the queue is empty and resumes when an element becomes available.
- `offer` waits for at most `timeout` for capacity, returning `false` on timeout without inserting.
- `poll` waits for at most `timeout` for an element, returning `null` on timeout.
- A negative timeout is invalid and causes `IllegalArgumentException`.
- Waiting must not use spinning, repeated sleeping, or polling loops outside a lock condition.
- All waits must tolerate spurious wakeups by rechecking their condition.
- If interrupted while waiting, propagate `InterruptedException` and leave the queue unchanged by that operation.
- Multiple producers and consumers must not lose, duplicate, or corrupt elements.

## Test this step

```bash
./scripts/test-step2.sh
```

The command includes Step 1. When it passes, continue to `step3.md`.

