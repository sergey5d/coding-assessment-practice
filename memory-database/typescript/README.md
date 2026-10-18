# Memory Database — TypeScript interview practice

This is a four-step, 90-minute implementation exercise. It starts with basic in-memory records and grows into ordered scanning, timestamped TTL fields, and backup/restore behavior.

The implementation is intentionally incomplete. Your work belongs in [`src/memory-database.ts`](src/memory-database.ts); do not change the supplied tests. Use Node.js 20 or newer.

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

- Keys, fields, prefixes, and values are strings.
- Empty strings are valid stored values.
- Timestamp and TTL values are integers; TTL values are positive.
- Timestamped operations for one `MemoryDatabase` instance arrive in strictly increasing timestamp order.
- State is in memory. No database server or persistence layer is required.

