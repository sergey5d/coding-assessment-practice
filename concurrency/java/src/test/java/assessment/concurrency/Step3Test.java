package assessment.concurrency;

import static assessment.concurrency.TestSupport.assertEquals;
import static assessment.concurrency.TestSupport.assertFalse;
import static assessment.concurrency.TestSupport.assertNull;
import static assessment.concurrency.TestSupport.assertThrows;
import static assessment.concurrency.TestSupport.assertTrue;
import static assessment.concurrency.TestSupport.run;
import static assessment.concurrency.TestSupport.shutdown;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public final class Step3Test {
    private Step3Test() {
    }

    public static void main(String[] args) throws Exception {
        run("basic put and get", Step3Test::basicPutGet);
        run("least-recent eviction", Step3Test::leastRecentEviction);
        run("reads update recency", Step3Test::readsUpdateRecency);
        run("updates preserve size and recency", Step3Test::updates);
        run("remove and snapshot order", Step3Test::removeAndSnapshot);
        run("zero capacity and validation", Step3Test::capacityAndNullValidation);
        run("concurrent capacity invariant", Step3Test::concurrentCapacityInvariant);
        run("immutable detached snapshots", Step3Test::snapshotIsolation);
        System.out.println("Step 3: 8 tests passed");
    }

    private static void basicPutGet() {
        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(2);
        cache.put("a", 1);
        assertEquals(1, cache.get("a"));
        assertNull(cache.get("missing"));
        assertEquals(1, cache.size());
    }

    private static void leastRecentEviction() {
        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(2);
        cache.put("a", 1);
        cache.put("b", 2);
        cache.put("c", 3);

        assertNull(cache.get("a"));
        assertEquals(2, cache.get("b"));
        assertEquals(3, cache.get("c"));
    }

    private static void readsUpdateRecency() {
        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(2);
        cache.put("a", 1);
        cache.put("b", 2);
        assertEquals(1, cache.get("a"));
        cache.put("c", 3);

        assertEquals(1, cache.get("a"));
        assertNull(cache.get("b"));
    }

    private static void updates() {
        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(2);
        cache.put("a", 1);
        cache.put("b", 2);
        cache.put("a", 10);
        cache.put("c", 3);

        assertEquals(10, cache.get("a"));
        assertNull(cache.get("b"));
        assertEquals(2, cache.size());
    }

    private static void removeAndSnapshot() {
        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(3);
        cache.put("a", 1);
        cache.put("b", 2);
        cache.put("c", 3);
        cache.get("a");

        assertEquals(List.of("a", "c", "b"),
                new ArrayList<>(cache.snapshotMostRecentFirst().keySet()));
        assertTrue(cache.remove("c"), "existing entry should be removed");
        assertFalse(cache.remove("c"), "entry was already removed");
        assertEquals(2, cache.size());
    }

    private static void capacityAndNullValidation() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> new ThreadSafeLruCache<>(-1));
        ThreadSafeLruCache<String, Integer> empty = new ThreadSafeLruCache<>(0);
        empty.put("a", 1);
        assertNull(empty.get("a"));
        assertEquals(0, empty.size());

        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(1);
        assertThrows(NullPointerException.class, () -> cache.put(null, 1));
        assertThrows(NullPointerException.class, () -> cache.put("a", null));
        assertThrows(NullPointerException.class, () -> cache.get(null));
        assertThrows(NullPointerException.class, () -> cache.remove(null));
    }

    private static void concurrentCapacityInvariant() throws Exception {
        int capacity = 64;
        ThreadSafeLruCache<Integer, Integer> cache = new ThreadSafeLruCache<>(capacity);
        ExecutorService executor = Executors.newFixedThreadPool(8);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<?>> futures = new ArrayList<>();
        try {
            for (int worker = 0; worker < 8; worker++) {
                int capturedWorker = worker;
                futures.add(executor.submit(() -> {
                    start.await();
                    for (int operation = 0; operation < 5_000; operation++) {
                        int key = (capturedWorker * 31 + operation) % 128;
                        cache.put(key, operation);
                        cache.get((key + 17) % 128);
                        assertTrue(cache.size() <= capacity, "capacity exceeded");
                    }
                    return null;
                }));
            }
            start.countDown();
            for (Future<?> future : futures) {
                TestSupport.get(future, Duration.ofSeconds(8));
            }
            assertTrue(cache.size() <= capacity, "capacity exceeded after workers finished");
            assertEquals(cache.size(), cache.snapshotMostRecentFirst().size());
        } finally {
            shutdown(executor);
        }
    }

    private static void snapshotIsolation() throws Exception {
        ThreadSafeLruCache<String, Integer> cache = new ThreadSafeLruCache<>(2);
        cache.put("a", 1);
        cache.put("b", 2);
        Map<String, Integer> snapshot = cache.snapshotMostRecentFirst();

        cache.put("c", 3);

        assertEquals(List.of("b", "a"), new ArrayList<>(snapshot.keySet()));
        assertThrows(UnsupportedOperationException.class, () -> snapshot.put("x", 9));
    }
}
