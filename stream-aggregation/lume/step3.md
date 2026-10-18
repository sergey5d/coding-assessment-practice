# Step 3 — Void records

Keep Steps 1-2 working and support corrections by voiding accepted records.

## API

```text
class RecordAggregator {
    def void_record(record_id Str) Bool
}
```

## Requirements

- `void_record` returns `false` when the record ID was never accepted or was already voided.
- Otherwise it marks the record void, removes exactly that record's contribution from its key, and returns `true`.
- Voiding decrements the key's count and subtracts the record's signed amount from the key's total.
- When a key's count becomes zero, that key is removed from lifetime rollups.
- Voiding one record must not affect any other record for the same key.
- A voided record ID remains permanently reserved. A later `ingest` using that ID returns `false`.
- `get_rollup`, `all_rollups`, and `top_n` must immediately reflect voided records.

Retain enough information per accepted record to reverse its contribution without reparsing records or rebuilding unrelated keys.

## Test this step

```bash
./scripts/test-step3.sh
```

The command includes all earlier tests. When it passes, continue to `step4.md`.

