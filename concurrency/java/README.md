# Java concurrency — interview practice

This is an original four-step, 90-minute Java concurrency exercise covering four themes: implementing a thread-safe class, producer–consumer coordination, concurrent cache design, and concurrency-focused low-level design.

The implementation is intentionally incomplete. Work only in [`src/main/java/assessment/concurrency/`](src/main/java/assessment/concurrency/) and do not change the supplied tests. The project requires JDK 17 or newer and has no third-party dependencies.

## Rules of the exercise

1. Start a 90-minute timer.
2. Read only [`step1.md`](step1.md). Do not open later steps or tests yet.
3. Implement the current class and run its test command until it passes.
4. Only then read the next step.
5. Treat all steps as cumulative: earlier implementations must keep passing.
6. After coding, use [`discussion.md`](discussion.md) for verbal follow-up practice.

Suggested pacing:

- Step 1: 15 minutes
- Step 2: 25 minutes
- Step 3: 20 minutes
- Step 4: 30 minutes

## Commands

```bash
./scripts/test-step1.sh  # Step 1
./scripts/test-step2.sh  # Steps 1-2
./scripts/test-step3.sh  # Steps 1-3
./scripts/test-step4.sh  # Steps 1-4
./scripts/test.sh        # Alias for the complete suite
```

Each command compiles from scratch with `javac --release 17`, then runs assertions with bounded timeouts. The starter classes deliberately contain no constructors or method signatures, so compilation failures are expected before implementation.

## Assessment expectations

- Correctness is more important than cleverness.
- Blocking methods must block without busy-waiting.
- Never hold a global lock while running caller-provided code.
- Preserve interruption rather than swallowing `InterruptedException`.
- Public operations must not expose mutable internal collections.
- Tests use timeouts to detect deadlocks, but passing tests is not proof that arbitrary concurrent code is correct. Be prepared to explain invariants and happens-before relationships.

