package assessment.concurrency;

import java.time.Duration;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

final class TestSupport {
    private TestSupport() {
    }

    @FunctionalInterface
    interface ThrowingRunnable {
        void run() throws Exception;
    }

    static void run(String name, ThrowingRunnable test) throws Exception {
        test.run();
        System.out.println("PASS " + name);
    }

    static void assertTrue(boolean condition, String message) {
        if (!condition) {
            throw new AssertionError(message);
        }
    }

    static void assertFalse(boolean condition, String message) {
        assertTrue(!condition, message);
    }

    static void assertNull(Object actual) {
        if (actual != null) {
            throw new AssertionError("expected null but was " + actual);
        }
    }

    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new AssertionError("expected " + expected + " but was " + actual);
        }
    }

    static <T extends Throwable> T assertThrows(
            Class<T> expectedType,
            ThrowingRunnable action) throws Exception {
        try {
            action.run();
        } catch (Throwable error) {
            if (expectedType.isInstance(error)) {
                return expectedType.cast(error);
            }
            throw new AssertionError(
                    "expected " + expectedType.getName() + " but caught " + error,
                    error);
        }
        throw new AssertionError("expected " + expectedType.getName() + " to be thrown");
    }

    static <T> T get(Future<T> future, Duration timeout) throws Exception {
        try {
            return future.get(timeout.toMillis(), TimeUnit.MILLISECONDS);
        } catch (ExecutionException error) {
            Throwable cause = error.getCause();
            if (cause instanceof Exception exception) {
                throw exception;
            }
            if (cause instanceof Error fatal) {
                throw fatal;
            }
            throw new AssertionError(cause);
        }
    }

    static void assertStillBlocked(Future<?> future) throws Exception {
        try {
            future.get(100, TimeUnit.MILLISECONDS);
            throw new AssertionError("operation completed instead of blocking");
        } catch (TimeoutException expected) {
            // Expected: the operation is still waiting.
        } catch (ExecutionException error) {
            throw new AssertionError("blocked operation failed", error.getCause());
        }
    }

    static void shutdown(ExecutorService executor) throws InterruptedException {
        executor.shutdownNow();
        if (!executor.awaitTermination(2, TimeUnit.SECONDS)) {
            throw new AssertionError("executor did not terminate");
        }
    }
}
