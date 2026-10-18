package assessment.concurrency;

import static assessment.concurrency.TestSupport.assertEquals;
import static assessment.concurrency.TestSupport.assertFalse;
import static assessment.concurrency.TestSupport.assertNull;
import static assessment.concurrency.TestSupport.assertStillBlocked;
import static assessment.concurrency.TestSupport.assertThrows;
import static assessment.concurrency.TestSupport.assertTrue;
import static assessment.concurrency.TestSupport.run;
import static assessment.concurrency.TestSupport.shutdown;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicReference;

public final class Step2Test {
    private Step2Test() {
    }

    public static void main(String[] args) throws Exception {
        run("FIFO and size", Step2Test::fifoAndSize);
        run("take blocks until an item exists", Step2Test::takeBlocks);
        run("put blocks until capacity exists", Step2Test::putBlocks);
        run("timed offer", Step2Test::timedOffer);
        run("timed poll", Step2Test::timedPoll);
        run("multiple producers and consumers", Step2Test::multipleProducersConsumers);
        run("interrupted waiter", Step2Test::interruptedWaiter);
        run("argument validation", Step2Test::argumentValidation);
        System.out.println("Step 2: 8 tests passed");
    }

    private static void fifoAndSize() throws Exception {
        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(3);
        queue.put("first");
        queue.put("second");
        queue.put("third");
        assertEquals(3, queue.size());
        assertEquals("first", queue.take());
        assertEquals("second", queue.take());
        assertEquals("third", queue.take());
        assertEquals(0, queue.size());
    }

    private static void takeBlocks() throws Exception {
        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(1);
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            Future<String> waiting = executor.submit(queue::take);
            assertStillBlocked(waiting);
            queue.put("released");
            assertEquals("released", TestSupport.get(waiting, Duration.ofSeconds(2)));
        } finally {
            shutdown(executor);
        }
    }

    private static void putBlocks() throws Exception {
        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(1);
        queue.put("first");
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            Future<?> waiting = executor.submit(() -> {
                queue.put("second");
                return null;
            });
            assertStillBlocked(waiting);
            assertEquals("first", queue.take());
            TestSupport.get(waiting, Duration.ofSeconds(2));
            assertEquals("second", queue.take());
        } finally {
            shutdown(executor);
        }
    }

    private static void timedOffer() throws Exception {
        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(1);
        queue.put("full");
        long started = System.nanoTime();
        boolean accepted = queue.offer("later", Duration.ofMillis(120));
        long elapsedMillis = Duration.ofNanos(System.nanoTime() - started).toMillis();

        assertFalse(accepted, "offer should time out while full");
        assertTrue(elapsedMillis >= 80, "offer returned before waiting for its timeout");
        assertEquals("full", queue.take());
    }

    private static void timedPoll() throws Exception {
        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(1);
        long started = System.nanoTime();
        String value = queue.poll(Duration.ofMillis(120));
        long elapsedMillis = Duration.ofNanos(System.nanoTime() - started).toMillis();

        assertNull(value);
        assertTrue(elapsedMillis >= 80, "poll returned before waiting for its timeout");
        assertEquals(0, queue.size());
    }

    private static void multipleProducersConsumers() throws Exception {
        int producerCount = 4;
        int consumerCount = 4;
        int itemsPerProducer = 200;
        BoundedBlockingQueue<Integer> queue = new BoundedBlockingQueue<>(17);
        ExecutorService executor = Executors.newFixedThreadPool(producerCount + consumerCount);
        CountDownLatch start = new CountDownLatch(1);
        Set<Integer> consumed = ConcurrentHashMap.newKeySet();
        List<Future<?>> futures = new ArrayList<>();
        try {
            for (int producer = 0; producer < producerCount; producer++) {
                int offset = producer * itemsPerProducer;
                futures.add(executor.submit(() -> {
                    start.await();
                    for (int item = 0; item < itemsPerProducer; item++) {
                        queue.put(offset + item);
                    }
                    return null;
                }));
            }
            for (int consumer = 0; consumer < consumerCount; consumer++) {
                futures.add(executor.submit(() -> {
                    start.await();
                    for (int item = 0; item < itemsPerProducer; item++) {
                        Integer value = queue.take();
                        assertTrue(consumed.add(value), "duplicate value " + value);
                    }
                    return null;
                }));
            }
            start.countDown();
            for (Future<?> future : futures) {
                TestSupport.get(future, Duration.ofSeconds(8));
            }
            assertEquals(producerCount * itemsPerProducer, consumed.size());
            assertEquals(0, queue.size());
        } finally {
            shutdown(executor);
        }
    }

    private static void interruptedWaiter() throws Exception {
        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(1);
        AtomicReference<Throwable> outcome = new AtomicReference<>();
        Thread waiting = new Thread(() -> {
            try {
                queue.take();
                outcome.set(new AssertionError("take returned without an item"));
            } catch (Throwable error) {
                outcome.set(error);
            }
        });
        waiting.start();
        Thread.sleep(100);
        waiting.interrupt();
        waiting.join(2_000);

        assertFalse(waiting.isAlive(), "interrupted thread did not terminate");
        assertTrue(
                outcome.get() instanceof InterruptedException,
                "expected InterruptedException but got " + outcome.get());
        assertEquals(0, queue.size());
    }

    private static void argumentValidation() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> new BoundedBlockingQueue<>(0));
        assertThrows(IllegalArgumentException.class, () -> new BoundedBlockingQueue<>(-1));

        BoundedBlockingQueue<String> queue = new BoundedBlockingQueue<>(1);
        assertThrows(NullPointerException.class, () -> queue.put(null));
        assertThrows(NullPointerException.class, () -> queue.offer(null, Duration.ZERO));
        assertThrows(NullPointerException.class, () -> queue.offer("x", null));
        assertThrows(NullPointerException.class, () -> queue.poll(null));
        assertThrows(
                IllegalArgumentException.class,
                () -> queue.offer("x", Duration.ofNanos(-1)));
        assertThrows(
                IllegalArgumentException.class,
                () -> queue.poll(Duration.ofNanos(-1)));
    }
}
