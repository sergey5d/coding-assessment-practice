# Step 1 — Parse and aggregate

Implement record ingestion and lifetime per-key rollups in `RecordAggregator`.

## Record format

Each input record contains exactly four comma-separated fields in this order:

1. Record ID
2. Timestamp
3. Aggregation key
4. Amount

Surrounding whitespace on each field is ignored. A valid record has a non-empty record ID, a non-negative base-10 integer timestamp, a non-empty key, and a signed base-10 integer amount. Timestamp and amount must both be safe integers.

## API

```ts
type Rollup = {
  count: number;
  total: number;
}

ingest(record: string): boolean

get_rollup(key: string): Rollup | null
```

## Requirements

- `ingest` returns `false` and changes nothing when the record is malformed.
- Record IDs are globally unique. `ingest` returns `false` and changes nothing when its ID was already accepted.
- A rejected malformed record does not reserve its record ID.
- A successful ingestion increments the key's count and adds the amount to its total.
- Amounts may be positive, negative, or zero.
- `get_rollup` returns a new object containing the key's current count and total.
- `get_rollup` returns `null` when no accepted record currently contributes to the key.
- Callers must not be able to mutate internal state by changing a returned rollup object.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.

