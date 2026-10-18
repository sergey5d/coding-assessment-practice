package assessment.concurrency;

import static assessment.concurrency.TestSupport.assertEquals;
import static assessment.concurrency.TestSupport.assertThrows;
import static assessment.concurrency.TestSupport.run;
import static assessment.concurrency.TestSupport.shutdown;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public final class Step1Test {
    private Step1Test() {
    }

    public static void main(String[] args) throws Exception {
        run("missing keys and sequential updates", Step1Test::sequentialUpdates);
        run("signed deltas", Step1Test::signedDeltas);
        run("same-key contention", Step1Test::sameKeyContention);
        run("atomic returned values", Step1Test::atomicReturnedValues);
        run("independent keys", Step1Test::independentKeys);
        run("detached immutable snapshots", Step1Test::snapshotIsolation);
        run("null keys", Step1Test::nullKeys);
        System.out.println("Step 1: 7 tests passed");
    }

    private static void sequentialUpdates() {
        ConcurrentCounterMap<String> counters = new ConcurrentCounterMap<>();
        assertEquals(0L, counters.get("orders"));
        assertEquals(1L, counters.increment("orders"));
        assertEquals(2L, counters.increment("orders"));
        assertEquals(2L, counters.get("orders"));
    }

    private static void signedDeltas() {
        ConcurrentCounterMap<String> counters = new ConcurrentCounterMap<>();
        assertEquals(10L, counters.add("position", 10));
        assertEquals(7L, counters.add("position", -3));
        assertEquals(7L, counters.add("position", 0));
    }

    private static void sameKeyContention() throws Exception {
        ConcurrentCounterMap<String> counters = new ConcurrentCounterMap<>();
        ExecutorService executor = Executors.newFixedThreadPool(8);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<?>> futures = new ArrayList<>();
        try {
            for (int worker = 0; worker < 8; worker++) {
                futures.add(executor.submit(() -> {
                    start.await();
                    for (int update = 0; update < 5_000; update++) {
                        counters.increment("shared");
                    }
                    return null;
                }));
            }
            start.countDown();
            for (Future<?> future : futures) {
                TestSupport.get(future, Duration.ofSeconds(5));
            }
            assertEquals(40_000L, counters.get("shared"));
        } finally {
            shutdown(executor);
        }
    }

    private static void atomicReturnedValues() throws Exception {
        ConcurrentCounterMap<String> counters = new ConcurrentCounterMap<>();
        ConcurrentSkipListSet<Long> returned = new ConcurrentSkipListSet<>();
        ExecutorService executor = Executors.newFixedThreadPool(4);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<?>> futures = new ArrayList<>();
        try {
            for (int worker = 0; worker < 4; worker++) {
                futures.add(executor.submit(() -> {
                    start.await();
                    for (int update = 0; update < 1_000; update++) {
                        returned.add(counters.increment("sequence"));
                    }
                    return null;
                }));
            }
            start.countDown();
            for (Future<?> future : futures) {
                TestSupport.get(future, Duration.ofSeconds(5));
            }
            assertEquals(4_000, returned.size());
            assertEquals(1L, returned.first());
            assertEquals(4_000L, returned.last());
        } finally {
            shutdown(executor);
        }
    }

    private static void independentKeys() throws Exception {
        ConcurrentCounterMap<Integer> counters = new ConcurrentCounterMap<>();
        ExecutorService executor = Executors.newFixedThreadPool(4);
        List<Future<?>> futures = new ArrayList<>();
        try {
            for (int key = 0; key < 4; key++) {
                int capturedKey = key;
                futures.add(executor.submit(() -> {
                    for (int update = 0; update < 2_000; update++) {
                        counters.add(capturedKey, capturedKey + 1L);
                    }
                }));
            }
            for (Future<?> future : futures) {
                TestSupport.get(future, Duration.ofSeconds(5));
            }
            for (int key = 0; key < 4; key++) {
                assertEquals(2_000L * (key + 1L), counters.get(key));
            }
        } finally {
            shutdown(executor);
        }
    }

    private static void snapshotIsolation() throws Exception {
        ConcurrentCounterMap<String> counters = new ConcurrentCounterMap<>();
        counters.add("a", 1);
        counters.add("b", 2);
        Map<String, Long> snapshot = counters.snapshot();

        counters.add("a", 10);

        assertEquals(Map.of("a", 1L, "b", 2L), snapshot);
        assertThrows(UnsupportedOperationException.class, () -> snapshot.put("c", 3L));
    }

    private static void nullKeys() throws Exception {
        ConcurrentCounterMap<String> counters = new ConcurrentCounterMap<>();
        assertThrows(NullPointerException.class, () -> counters.increment(null));
        assertThrows(NullPointerException.class, () -> counters.add(null, 1));
        assertThrows(NullPointerException.class, () -> counters.get(null));
        assertEquals(Map.of(), counters.snapshot());
    }
}
