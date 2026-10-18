# Step 2 — Scanning

Keep Step 1 working and implement record scanning.

## API

```ts
scan(key: string): string
scan_by_prefix(key: string, prefix: string): string
```

## Requirements

- `scan` returns every field/value pair belonging to the key.
- Sort fields in ascending lexicographic order by the complete field name.
- Format each pair as `field(value)` and join pairs with `", "`.
- Return `""` when the key does not exist or has no fields.
- `scan_by_prefix` follows the same ordering and formatting rules.
- `scan_by_prefix` includes only fields whose names start with `prefix`.
- An empty prefix matches every field.
- Return `""` when no fields match the prefix.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command reruns Step 1 as a regression check. When it passes, continue to `step3.md`.

