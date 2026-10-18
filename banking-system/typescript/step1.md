# Step 1 — Basic accounts

Implement the first three methods on `BankingSystem`.

## API

```ts
create_account(ts: number, id: string): boolean
deposit(ts: number, id: string, amount: number): number | null
pay(ts: number, id: string, amount: number): number | null
```

## Requirements

- `create_account` creates an account with a zero balance and returns `true`.
- Creating an ID that already exists returns `false` and changes nothing.
- `deposit` adds `amount` and returns the new balance.
- `pay` subtracts `amount` and returns the new balance.
- A deposit or payment for a missing account returns `null`.
- A payment with insufficient funds returns `null` and does not change the balance.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.
