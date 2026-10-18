# Step 3 — Time and TTL

Read this entire step before writing code. Keep Steps 1-2 working.

From this level onward, the database has timestamp-aware operations. Calls for one instance arrive in strictly increasing timestamp order.

## API

```ts
set_at(ts: number, key: string, field: string, value: string): void
get_at(ts: number, key: string, field: string): string
delete_at(ts: number, key: string, field: string): boolean
scan_at(ts: number, key: string): string
scan_by_prefix_at(ts: number, key: string, prefix: string): string
set_at_with_ttl(
  ts: number,
  key: string,
  field: string,
  value: string,
  ttl: number,
): void
```

## Requirements

- The timestamp-aware operations otherwise follow the behavior, formatting, and return rules from Steps 1-2.
- `set_at_with_ttl` creates or overwrites a field and gives the new value a lifetime of `ttl` time units.
- A TTL field written at `ts` is visible throughout the half-open interval `[ts, ts + ttl)`.
- At `ts + ttl` and every later timestamp, that version is invisible to `get_at`, `delete_at`, `scan_at`, and `scan_by_prefix_at`.
- TTL belongs to an individual field, not to its containing record.
- Overwriting a field with `set_at_with_ttl` replaces its value and expiration time.
- Overwriting a TTL field with plain `set_at` removes its TTL and makes the new value permanent.
- An expired field behaves as a missing field.
- A record whose fields have all expired or been deleted behaves as a missing record.

The key modeling requirement is that visibility depends on the operation timestamp and the most recent write to a field. Preserve enough field metadata to determine its current value and optional expiration without relying on real timers. One possible design is a per-field sequence of versions containing the write timestamp, value, and optional expiration timestamp.

## Test this step

```bash
npm run test:step3
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step4.md`.
