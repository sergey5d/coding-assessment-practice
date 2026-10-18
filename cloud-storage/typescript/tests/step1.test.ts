import { describe, expect, it } from "vitest";

import { CloudStorage } from "../src/cloud-storage.js";

describe("Step 1: files", () => {
  it("uploads and retrieves a file", () => {
    const storage = new CloudStorage();

    expect(storage.file_upload("notes.txt", 12)).toBe(true);
    expect(storage.file_get("notes.txt")).toBe(12);
  });

  it("returns null for a missing file", () => {
    const storage = new CloudStorage();

    expect(storage.file_get("missing.txt")).toBeNull();
  });

  it("rejects duplicate uploads without replacing the file", () => {
    const storage = new CloudStorage();
    storage.file_upload("notes.txt", 12);

    expect(storage.file_upload("notes.txt", 99)).toBe(false);
    expect(storage.file_get("notes.txt")).toBe(12);
  });

  it("copies an existing file", () => {
    const storage = new CloudStorage();
    storage.file_upload("source.bin", 25);

    expect(storage.file_copy("source.bin", "copy.bin")).toBe(true);
    expect(storage.file_get("source.bin")).toBe(25);
    expect(storage.file_get("copy.bin")).toBe(25);
  });

  it("rejects a missing copy source without changing the destination", () => {
    const storage = new CloudStorage();
    storage.file_upload("dest.bin", 8);

    expect(storage.file_copy("missing.bin", "dest.bin")).toBe(false);
    expect(storage.file_get("dest.bin")).toBe(8);
  });

  it("overwrites an existing copy destination", () => {
    const storage = new CloudStorage();
    storage.file_upload("source.bin", 25);
    storage.file_upload("dest.bin", 8);

    expect(storage.file_copy("source.bin", "dest.bin")).toBe(true);
    expect(storage.file_get("dest.bin")).toBe(25);
  });

  it("allows a file to be copied to its own name", () => {
    const storage = new CloudStorage();
    storage.file_upload("same.bin", 25);

    expect(storage.file_copy("same.bin", "same.bin")).toBe(true);
    expect(storage.file_get("same.bin")).toBe(25);
  });
});

