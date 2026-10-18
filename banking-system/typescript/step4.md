# Step 4 — Merge accounts

Keep Steps 1-3 working and implement account merging.

## API

```ts
merge_accounts(ts: number, primary: string, secondary: string): boolean
```

## Requirements

- Process expired transfers before attempting the merge.
- Both accounts must exist and their IDs must differ. Otherwise return `false` and change nothing.
- Cancel every pending transfer originating from `secondary` and reverse its pending balance changes before merging the balances.
- Cancel every pending transfer from `primary` to `secondary` and reverse its pending balance changes.
- Redirect every other pending transfer whose destination is `secondary` to `primary`. It keeps the same transfer ID and may now be accepted by `primary`. Until then, it remains a pending incoming credit that `primary` cannot spend.
- A canceled transfer can never be accepted and never counts as outgoing.
- After cancellations, add `secondary`'s balance, including remaining redirected pending credits, to `primary`.
- Add `secondary`'s completed outgoing total to `primary`'s outgoing total.
- Remove `secondary`. Operations against it now behave as they would for any missing account.
- `top_spenders` lists only active accounts and uses the combined outgoing total for `primary`.
- All other pending transfers are unchanged.

These rules ensure that no pending transfer refers to an account that no longer exists.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.
