# Rate Limiting — TypeScript interview practice

This is a four-step, 90-minute implementation exercise covering fixed-window, sliding-window, leaky-bucket, and token-bucket rate limiting.

The implementation is intentionally incomplete. Your work belongs in [`src/rate-limiters.ts`](src/rate-limiters.ts); do not change the supplied tests. Use Node.js 20 or newer.

## Rules of the exercise

1. Run `npm install` before starting.
2. Start a 90-minute timer.
3. Read only [`step1.md`](step1.md). Do not open a later step or its tests yet.
4. Implement the current step and run its test command until it passes.
5. Only then read the next step and continue.
6. Treat all steps as cumulative: implementations from earlier steps must keep working.

Suggested pacing:

- Step 1: 15 minutes
- Step 2: 20 minutes
- Step 3: 25 minutes
- Step 4: 30 minutes

Each step introduces a separate limiter class. The exercise is about modeling time and state precisely, not networking, HTTP middleware, concurrency, or distributed coordination.

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

The starter classes are deliberately empty. Add constructor and method signatures only when the corresponding step reveals them, so failing tests are expected at the beginning.

## Shared conventions

- A `key` identifies an independent caller, user, API key, or resource.
- Timestamps are non-negative numbers measured in arbitrary time units.
- Calls to one limiter instance arrive in non-decreasing timestamp order.
- Limits and capacities are positive integers.
- Leak and refill rates are positive numbers measured per timestamp unit.
- Only accepted requests consume window quota, bucket space, or tokens. Rejected requests still advance the limiter's notion of time.

