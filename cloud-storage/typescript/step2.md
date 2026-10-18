# Step 2 — Search

Keep Step 1 working and add prefix search.

## API

```ts
file_search(prefix: string): string[]
```

## Requirements

- Consider every current file whose name starts with `prefix`.
- Sort matching files by size in descending order.
- Break equal-size ties by file name in ascending lexicographical order.
- Return the names of the first 10 matching files after sorting.
- Return all matching names when there are fewer than 10.
- Return `[]` when no file matches.
- An empty prefix matches every file.

## Test this step

```bash
npm run test:step2
npm run typecheck
```

The command includes all earlier tests. When it passes, continue to `step3.md`.

