# Step 1 — Parse and aggregate

Implement record ingestion and lifetime per-key rollups in `RecordAggregator`.

## Record format

Each input record contains exactly four comma-separated fields in this order:

1. Record ID
2. Timestamp
3. Aggregation key
4. Amount

Surrounding whitespace on each field is ignored. A valid record has a non-empty record ID, a non-negative base-10 integer timestamp, a non-empty key, and a signed base-10 integer amount. Timestamp and amount must both be representable by Lume's `Int` type.

## API

```text
shape Rollup {
    count Int
    total Int
}

class RecordAggregator {
    def ingest(record Str) Bool
    def get_rollup(key Str) Rollup?
}
```

## Requirements

- `ingest` returns `false` and changes nothing when the record is malformed.
- Record IDs are globally unique. `ingest` returns `false` and changes nothing when its ID was already accepted.
- A rejected malformed record does not reserve its record ID.
- A successful ingestion increments the key's count and adds the amount to its total.
- Amounts may be positive, negative, or zero.
- `get_rollup` returns a value containing the key's current count and total.
- `get_rollup` returns `None` when no accepted record currently contributes to the key.
- A returned rollup must be a snapshot of the current result, not mutable internal state.

## Test this step

```bash
./scripts/test-step1.sh
```

When it passes, continue to `step2.md`.

