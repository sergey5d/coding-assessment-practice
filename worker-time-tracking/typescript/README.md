# Worker Time Tracking — TypeScript interview practice

This is a four-step, 90-minute implementation exercise. It starts with worker registration and completed work sessions, then adds rankings, delayed promotions, salary calculation, and per-session overtime.

The implementation is intentionally incomplete. Your work belongs in [`src/worker-time-tracker.ts`](src/worker-time-tracker.ts); do not change the supplied tests. Use Node.js 20 or newer.

## Rules of the exercise

1. Run `npm install` before starting.
2. Start a 90-minute timer.
3. Read only [`step1.md`](step1.md). Do not open a later step or its tests yet.
4. Implement the current step and run its test command until it passes.
5. Only then read the next step and continue.
6. Treat all steps as cumulative: code from an earlier step must keep working.

Suggested pacing:

- Step 1: 15 minutes
- Step 2: 15 minutes
- Step 3: 35 minutes
- Step 4: 25 minutes

In a real interview, ask clarifying questions when a requirement is ambiguous. In this practice version, the Markdown files define the public contract. You may add your own tests, but do not edit or remove the supplied ones.

## Commands

```bash
npm run test:step1  # Step 1 and its tests
npm run test:step2  # Steps 1-2
npm run test:step3  # Steps 1-3
npm run test:step4  # Steps 1-4
npm test            # Alias for the complete suite
npm run test:watch  # Optional watch mode
npm run typecheck   # TypeScript static checks
```

The starter class is deliberately empty. Add method signatures and their implementations only when the corresponding step reveals them, so failing tests are expected at the beginning.

## Shared conventions

- Worker IDs and positions are non-empty strings.
- Compensation is a non-negative integer amount per unit of time.
- Timestamps are non-negative integers. Calls to `register` for one tracker arrive with strictly increasing timestamps.
- Time ranges and work sessions are half-open intervals: a range from `start_ts` to `end_ts` includes `start_ts` but excludes `end_ts`.
- All state is in memory. No database server or persistence layer is required.

