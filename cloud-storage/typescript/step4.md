# Step 4 — Compression

Keep Steps 1-3 working and add compression for owned files.

## API

```ts
compress_file(user_id: string, name: string): number | null

decompress_file(user_id: string, name: string): number | null
```

## Requirements

- A compressed file name ends with the exact suffix `".COMPRESSED"`.
- The supplied test data uses even sizes for files that are compressed, so halving a size produces an integer.
- `compress_file` succeeds only when the user exists, owns `name`, and `name` is not already compressed.
- Compression replaces `name` with `name + ".COMPRESSED"`, at half the original size and with the same owner.
- `compress_file` returns `null` if the replacement name already exists. On any failure, storage is unchanged.
- A successful compression returns the owner's remaining capacity.
- `decompress_file` succeeds only when the user exists, owns `name`, and `name` ends with `".COMPRESSED"`.
- Decompression removes one `".COMPRESSED"` suffix, doubles the size, and keeps the same owner.
- `decompress_file` returns `null` if the restored name already exists or the larger file would exceed the owner's capacity. On failure, the compressed file remains unchanged.
- A successful decompression returns the owner's remaining capacity.
- The admin user may compress and decompress owned files without a capacity limit; its remaining capacity is represented by `Infinity`.
- Compression and decompression immediately affect `file_get`, `file_search`, copies, and capacity updates.

## Test this step

```bash
npm run test:step4
npm run typecheck
```

Passing both commands completes the exercise.

