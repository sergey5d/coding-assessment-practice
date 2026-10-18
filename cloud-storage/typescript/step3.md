# Step 3 — Users and capacity

Read this entire step before writing code. Keep Steps 1-2 working.

Every file now has an owner. Capacity is derived from the current files owned by a user, not maintained as a separately changing balance.

## API

```ts
add_user(user_id: string, capacity: number): boolean

file_upload_by(
  user_id: string,
  name: string,
  size: number,
): number | null

update_capacity(user_id: string, new_capacity: number): number | null
```

## Requirements

- The special user `"admin"` always exists and has unlimited capacity.
- `add_user` returns `false` when the user already exists, including `"admin"`. Otherwise it creates the user and returns `true`.
- A regular user's owned files may not exceed that user's capacity in total size.
- `file_upload_by` returns `null` when the user is unknown, the file name already exists, or the file would exceed the user's capacity.
- A successful `file_upload_by` stores the file for that owner and returns the user's remaining capacity. Because the admin user has unlimited capacity, its remaining capacity is represented by `Infinity`.
- `file_upload` acts as an admin upload. Files created by it are owned by `"admin"`.
- `file_get` and `file_search` can see files belonging to any owner.
- Because `file_copy` has no user argument, a successful copy preserves the source file's owner.
- A copied file counts against that owner's capacity. The operation succeeds only when the owner's final total fits after any destination overwrite is taken into account.
- When `file_copy` overwrites a destination owned by another user, the old destination stops counting against its former owner and the replacement counts against the source owner.
- If an owner-capacity check fails, `file_copy` returns `false` and leaves both source and destination unchanged.
- Admin-owned copies are not capacity-limited.
- `update_capacity` returns `null` for an unknown user. The admin user's capacity cannot be updated.
- For a regular user, `update_capacity` first replaces the user's capacity.
- If the user's files no longer fit, repeatedly delete the user's largest remaining file until they do.
- Break equal-size eviction ties by file name in ascending lexicographical order.
- Return the number of deleted files. Return `0` when no deletion is required.

The key modeling requirement is to derive used and remaining capacity from the current files owned by a user. Overwrites, copies, evictions, and later transformations must all be reflected by that same calculation.

## Test this step

```bash
npm run test:step3
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step4.md`.

