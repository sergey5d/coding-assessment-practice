import { describe, expect, it } from "vitest";

import { CloudStorage } from "../src/cloud-storage.js";

describe("Step 2: search", () => {
  it("finds files whose names begin with the prefix", () => {
    const storage = new CloudStorage();
    storage.file_upload("docs/readme.md", 10);
    storage.file_upload("docs/design.md", 20);
    storage.file_upload("images/logo.png", 100);

    expect(storage.file_search("docs/")).toEqual([
      "docs/design.md",
      "docs/readme.md",
    ]);
  });

  it("sorts by size descending", () => {
    const storage = new CloudStorage();
    storage.file_upload("log-small", 1);
    storage.file_upload("log-large", 100);
    storage.file_upload("log-medium", 20);

    expect(storage.file_search("log-")).toEqual([
      "log-large",
      "log-medium",
      "log-small",
    ]);
  });

  it("breaks equal-size ties by name ascending", () => {
    const storage = new CloudStorage();
    storage.file_upload("item-z", 10);
    storage.file_upload("item-a", 10);
    storage.file_upload("item-m", 10);

    expect(storage.file_search("item-")).toEqual([
      "item-a",
      "item-m",
      "item-z",
    ]);
  });

  it("returns at most ten files", () => {
    const storage = new CloudStorage();
    for (let index = 0; index < 12; index += 1) {
      storage.file_upload(`report-${index.toString().padStart(2, "0")}`, index);
    }

    expect(storage.file_search("report-")).toEqual([
      "report-11",
      "report-10",
      "report-09",
      "report-08",
      "report-07",
      "report-06",
      "report-05",
      "report-04",
      "report-03",
      "report-02",
    ]);
  });

  it("returns an empty list when nothing matches", () => {
    const storage = new CloudStorage();
    storage.file_upload("notes.txt", 10);

    expect(storage.file_search("missing")).toEqual([]);
  });

  it("treats an empty prefix as matching every file", () => {
    const storage = new CloudStorage();
    storage.file_upload("a", 2);
    storage.file_upload("b", 3);

    expect(storage.file_search("")).toEqual(["b", "a"]);
  });

  it("reflects overwritten destination sizes", () => {
    const storage = new CloudStorage();
    storage.file_upload("file-source", 100);
    storage.file_upload("file-dest", 1);
    storage.file_copy("file-source", "file-dest");

    expect(storage.file_search("file-")).toEqual([
      "file-dest",
      "file-source",
    ]);
  });
});

