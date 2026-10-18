# Step 2 — Top spenders

Keep Step 1 working and implement `top_spenders`.

## API

```ts
top_spenders(ts: number, n: number): string[]
```

## Requirements

- Track each account's total successful outgoing amount.
- At this level, outgoing money consists only of successful `pay` calls.
- Failed payments do not contribute to the total.
- Return at most `n` active accounts, sorted by outgoing total descending.
- Break ties by account ID in ascending lexicographic order.
- Format each item by writing the account ID followed by its total in parentheses: `"id(total)"`.
- Accounts with zero outgoing are included if space remains.
- If `n <= 0`, return an empty array.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command reruns Step 1 as a regression check. When it passes, continue to `step3.md`.
