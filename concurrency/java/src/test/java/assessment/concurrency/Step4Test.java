package assessment.concurrency;

import static assessment.concurrency.TestSupport.assertEquals;
import static assessment.concurrency.TestSupport.assertFalse;
import static assessment.concurrency.TestSupport.assertThrows;
import static assessment.concurrency.TestSupport.assertTrue;
import static assessment.concurrency.TestSupport.run;
import static assessment.concurrency.TestSupport.shutdown;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

public final class Step4Test {
    private Step4Test() {
    }

    public static void main(String[] args) throws Exception {
        run("sequential caching", Step4Test::sequentialCaching);
        run("same-key requests share one load", Step4Test::sameKeySingleFlight);
        run("different keys load concurrently", Step4Test::differentKeysConcurrent);
        run("TTL starts at successful completion", Step4Test::expiration);
        run("loader failures are not cached", Step4Test::failureRetry);
        run("invalidation and size", Step4Test::invalidationAndSize);
        run("null and TTL validation", Step4Test::validation);
        run("waiting interruption", Step4Test::waitingInterruption);
        System.out.println("Step 4: 8 tests passed");
    }

    private static void sequentialCaching() throws Exception {
        AtomicLong now = new AtomicLong();
        AtomicInteger loads = new AtomicInteger();
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofSeconds(1), now::get);

        assertEquals(42, cache.get("answer", () -> {
            loads.incrementAndGet();
            return 42;
        }));
        assertEquals(42, cache.get("answer", () -> {
            loads.incrementAndGet();
            return 99;
        }));
        assertEquals(1, loads.get());
        assertEquals(1, cache.size());
    }

    private static void sameKeySingleFlight() throws Exception {
        AtomicInteger loads = new AtomicInteger();
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofSeconds(1), () -> 0L);
        ExecutorService executor = Executors.newFixedThreadPool(8);
        CountDownLatch ready = new CountDownLatch(8);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch loaderEntered = new CountDownLatch(1);
        CountDownLatch releaseLoader = new CountDownLatch(1);
        List<Future<Integer>> futures = new ArrayList<>();
        try {
            for (int caller = 0; caller < 8; caller++) {
                futures.add(executor.submit(() -> {
                    ready.countDown();
                    start.await();
                    return cache.get("same", () -> {
                        loads.incrementAndGet();
                        loaderEntered.countDown();
                        releaseLoader.await();
                        return 7;
                    });
                }));
            }
            assertTrue(ready.await(2, TimeUnit.SECONDS), "callers did not become ready");
            start.countDown();
            assertTrue(loaderEntered.await(2, TimeUnit.SECONDS), "loader did not start");
            Thread.sleep(100);
            releaseLoader.countDown();

            for (Future<Integer> future : futures) {
                assertEquals(7, TestSupport.get(future, Duration.ofSeconds(3)));
            }
            assertEquals(1, loads.get());
        } finally {
            releaseLoader.countDown();
            shutdown(executor);
        }
    }

    private static void differentKeysConcurrent() throws Exception {
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofSeconds(1), () -> 0L);
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch bothLoaders = new CountDownLatch(2);
        try {
            Future<Integer> first = executor.submit(() -> cache.get("a", () -> {
                bothLoaders.countDown();
                assertTrue(
                        bothLoaders.await(2, TimeUnit.SECONDS),
                        "different-key loader was serialized");
                return 1;
            }));
            Future<Integer> second = executor.submit(() -> cache.get("b", () -> {
                bothLoaders.countDown();
                assertTrue(
                        bothLoaders.await(2, TimeUnit.SECONDS),
                        "different-key loader was serialized");
                return 2;
            }));

            assertEquals(1, TestSupport.get(first, Duration.ofSeconds(3)));
            assertEquals(2, TestSupport.get(second, Duration.ofSeconds(3)));
        } finally {
            shutdown(executor);
        }
    }

    private static void expiration() throws Exception {
        AtomicLong now = new AtomicLong(10);
        AtomicInteger loads = new AtomicInteger();
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofNanos(100), now::get);

        assertEquals(1, cache.get("a", loads::incrementAndGet));
        now.set(109);
        assertEquals(1, cache.get("a", loads::incrementAndGet));
        now.set(110);
        assertEquals(2, cache.get("a", loads::incrementAndGet));
        assertEquals(2, loads.get());
    }

    private static void failureRetry() throws Exception {
        AtomicInteger loads = new AtomicInteger();
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofSeconds(1), () -> 0L);

        IOException failure = assertThrows(IOException.class, () -> cache.get("a", () -> {
            loads.incrementAndGet();
            throw new IOException("load failed");
        }));
        assertEquals("load failed", failure.getMessage());
        assertEquals(9, cache.get("a", () -> {
            loads.incrementAndGet();
            return 9;
        }));
        assertEquals(2, loads.get());
    }

    private static void invalidationAndSize() throws Exception {
        AtomicLong now = new AtomicLong();
        AtomicInteger loads = new AtomicInteger();
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofNanos(10), now::get);
        cache.get("a", loads::incrementAndGet);
        cache.get("b", loads::incrementAndGet);
        assertEquals(2, cache.size());

        cache.invalidate("a");
        assertEquals(1, cache.size());
        assertEquals(3, cache.get("a", loads::incrementAndGet));

        now.set(10);
        assertEquals(0, cache.size());
    }

    private static void validation() throws Exception {
        assertThrows(IllegalArgumentException.class,
                () -> new SingleFlightCache<>(Duration.ZERO));
        assertThrows(IllegalArgumentException.class,
                () -> new SingleFlightCache<>(Duration.ofNanos(-1)));
        assertThrows(NullPointerException.class,
                () -> new SingleFlightCache<>(null));
        assertThrows(NullPointerException.class,
                () -> new SingleFlightCache<>(Duration.ofSeconds(1), null));

        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofSeconds(1), () -> 0L);
        assertThrows(NullPointerException.class, () -> cache.get(null, () -> 1));
        assertThrows(NullPointerException.class, () -> cache.get("a", null));
        assertThrows(NullPointerException.class, () -> cache.get("a", () -> null));
        assertThrows(NullPointerException.class, () -> cache.invalidate(null));
        assertEquals(5, cache.get("a", () -> 5));
    }

    private static void waitingInterruption() throws Exception {
        SingleFlightCache<String, Integer> cache =
                new SingleFlightCache<>(Duration.ofSeconds(1), () -> 0L);
        CountDownLatch loaderEntered = new CountDownLatch(1);
        CountDownLatch releaseLoader = new CountDownLatch(1);
        ExecutorService leaderExecutor = Executors.newSingleThreadExecutor();
        AtomicReference<Throwable> waiterOutcome = new AtomicReference<>();
        try {
            Future<Integer> leader = leaderExecutor.submit(() -> cache.get("a", () -> {
                loaderEntered.countDown();
                releaseLoader.await();
                return 11;
            }));
            assertTrue(loaderEntered.await(2, TimeUnit.SECONDS), "leader did not start");

            Thread waiter = new Thread(() -> {
                try {
                    cache.get("a", () -> 99);
                    waiterOutcome.set(new AssertionError("waiter unexpectedly returned"));
                } catch (Throwable error) {
                    waiterOutcome.set(error);
                }
            });
            waiter.start();
            Thread.sleep(100);
            waiter.interrupt();
            waiter.join(2_000);

            assertFalse(waiter.isAlive(), "interrupted waiter did not terminate");
            assertTrue(
                    waiterOutcome.get() instanceof InterruptedException,
                    "expected InterruptedException but got " + waiterOutcome.get());

            releaseLoader.countDown();
            assertEquals(11, TestSupport.get(leader, Duration.ofSeconds(2)));
        } finally {
            releaseLoader.countDown();
            shutdown(leaderExecutor);
        }
    }
}
