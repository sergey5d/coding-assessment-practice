# Step 1 — Basic operations

Implement the basic record operations on `MemoryDatabase`.

## API

```ts
set(key: string, field: string, value: string): void
get(key: string, field: string): string
delete(key: string, field: string): boolean
```

## Requirements

- Records are stored as a mapping from a key to its field/value pairs.
- `set` creates the record when the key does not exist.
- `set` creates or overwrites the specified field without changing other fields.
- `get` returns the stored value.
- `get` returns `""` when either the key or field does not exist.
- `delete` returns `true` only when the field existed and was removed.
- `delete` returns `false` without changing state when the key or field does not exist.
- A record with no fields remaining is considered absent.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.

