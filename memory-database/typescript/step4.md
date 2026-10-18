# Step 4 — Backup and restore

Keep Steps 1-3 working and implement timestamped backup and restore.

## API

```ts
backup(ts: number): number
restore(ts: number, ts_to_restore: number): void
```

## Requirements

- `backup` saves a snapshot containing only fields visible at `ts`.
- `backup` returns the number of non-empty records in that snapshot, not the number of fields.
- Backups remain available after later writes, deletions, backups, and restores.
- `restore` selects the latest backup whose backup timestamp is less than or equal to `ts_to_restore`.
- A qualifying backup is guaranteed to exist.
- `restore` replaces the current database state with a deep copy of the selected snapshot.
- Writes and deletions performed after the selected backup are not present after restoration.
- A permanent field remains permanent after restoration.
- For a TTL field, the backup stores the lifetime remaining at the backup timestamp.
- Restoration anchors that remaining lifetime at the restore operation's `ts`.
- A restored TTL field with `remaining` time units is visible throughout `[ts, ts + remaining)` and expires at `ts + remaining`.
- Expired fields are not included in a backup and cannot be brought back by restoring that backup.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.

