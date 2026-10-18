# Cache Strategies — TypeScript interview practice

This is a four-step, 90-minute implementation exercise covering LRU, LFU, timestamp-driven TTL, and a bounded cache combining TTL with LRU eviction.

The implementation is intentionally incomplete. Your work belongs in [`src/caches.ts`](src/caches.ts); do not change the supplied tests. Use Node.js 20 or newer.

## Rules of the exercise

1. Run `npm install` before starting.
2. Start a 90-minute timer.
3. Read only [`step1.md`](step1.md). Do not open a later step or its tests yet.
4. Implement the current step and run its test command until it passes.
5. Only then read the next step and continue.
6. Treat all steps as cumulative: implementations from earlier steps must keep working.

Suggested pacing:

- Step 1: 20 minutes
- Step 2: 25 minutes
- Step 3: 20 minutes
- Step 4: 25 minutes

Each step introduces a separate cache class. The supplied APIs are synchronous and single-process; distributed invalidation, persistence, and concurrency are outside the exercise.

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

The starter classes are deliberately empty. Add type parameters, constructors, and method signatures only when the corresponding step reveals them, so failing tests are expected at the beginning.

## Shared conventions

- Keys and values are generic type parameters. Supplied tests do not store `null` as a value because `null` represents a cache miss.
- Cache capacities are non-negative integers. A zero-capacity cache never retains an entry.
- Timestamped calls to one cache instance arrive in non-decreasing timestamp order.
- Timestamps and TTL values are non-negative integers; supplied TTL values are positive.

