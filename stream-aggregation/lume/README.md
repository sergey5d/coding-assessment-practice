# Stream Aggregation — Lume interview practice

This is a four-step, 90-minute implementation exercise for the Lume interpreter. It starts with parsing transaction records and maintaining per-key rollups, then adds deterministic ranking, record corrections, and time-range aggregation.

The implementation is intentionally incomplete. Write your solution in [`src/record_aggregator.lum`](src/record_aggregator.lum); do not change the supplied tests or support code.

## Prerequisites

- The global `lume` command available on `PATH`.
- Bash or another compatible shell.

Verify the interpreter is available before starting:

```bash
command -v lume
```

The scripts resolve `lume` from `PATH`; they do not assume that the Lume source repository is beside this assessment. To use a particular executable explicitly, set `LUME_BIN`:

```bash
export LUME_BIN=/absolute/path/to/lume
```

## Rules of the exercise

1. Start a 90-minute timer.
2. Read only [`step1.md`](step1.md). Do not open later step files or tests yet.
3. Add the current step's methods and implementation to the starter module.
4. Run the current step's test script until it passes.
5. Only then read the next step and continue.
6. Treat all steps as cumulative: earlier behavior must continue to pass.

Suggested pacing:

- Step 1: 20 minutes
- Step 2: 15 minutes
- Step 3: 25 minutes
- Step 4: 30 minutes

The starter module declares an empty `RecordAggregator` class and the `Rollup` shape that the supplied support code imports. Add method signatures and their implementations only as each step reveals them, so failing tests are expected at the beginning.

## Commands

```bash
./scripts/test-step1.sh  # Step 1
./scripts/test-step2.sh  # Steps 1-2
./scripts/test-step3.sh  # Steps 1-3
./scripts/test-step4.sh  # Steps 1-4
./scripts/test-all.sh    # Alias for the complete suite
./scripts/check.sh       # Interpreter type-check of the complete test graph
```

## Lume-specific support

The supplied [`support/assessment_support.lum`](support/assessment_support.lum) module contains assertion helpers used by the specs. Lexicographical tie-breaking can use the interpreter's native `Str.compareTo` method.

## Shared conventions

- Input records are strings and are processed synchronously in arrival order.
- Record IDs and aggregation keys are case-sensitive strings.
- Timestamps and amounts must be values representable by Lume's `Int` type.
- Records may arrive out of timestamp order.
- All state is in memory. Reading an actual file or network stream is outside the exercise.

