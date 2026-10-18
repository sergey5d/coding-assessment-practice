# Step 1 — Files

Implement basic file operations in `CloudStorage`.

## API

```ts
file_upload(name: string, size: number): boolean

file_get(name: string): number | null

file_copy(source: string, dest: string): boolean
```

## Requirements

- `file_upload` stores a file with the supplied name and size.
- `file_upload` returns `false` and changes nothing when the name already exists. Otherwise it returns `true`.
- `file_get` returns the current size of the named file, or `null` when it does not exist.
- `file_copy` returns `false` and changes nothing when the source file does not exist.
- Otherwise, `file_copy` creates `dest` with the source file's size and returns `true`.
- If `dest` already exists, the copy overwrites it.
- Copying a file to its own name succeeds and leaves it unchanged.

## Test this step

```bash
npm run test:step1
npm run typecheck
```

When both commands pass, continue to `step2.md`.

