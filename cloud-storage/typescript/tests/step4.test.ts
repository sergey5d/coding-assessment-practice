import { describe, expect, it } from "vitest";

import { CloudStorage } from "../src/cloud-storage.js";

describe("Step 4: compression", () => {
  it("compresses an owned file, renames it, and returns remaining capacity", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin", 60);

    expect(storage.compress_file("alice", "data.bin")).toBe(70);
    expect(storage.file_get("data.bin")).toBeNull();
    expect(storage.file_get("data.bin.COMPRESSED")).toBe(30);
  });

  it("rejects compression by a non-owner or unknown user", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.add_user("bob", 100);
    storage.file_upload_by("alice", "data.bin", 40);

    expect(storage.compress_file("bob", "data.bin")).toBeNull();
    expect(storage.compress_file("missing", "data.bin")).toBeNull();
    expect(storage.file_get("data.bin")).toBe(40);
  });

  it("rejects files that are already compressed", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin", 40);
    storage.compress_file("alice", "data.bin");

    expect(storage.compress_file("alice", "data.bin.COMPRESSED")).toBeNull();
    expect(storage.file_get("data.bin.COMPRESSED")).toBe(20);
  });

  it("leaves storage unchanged when the compressed name already exists", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin", 40);
    storage.file_upload("data.bin.COMPRESSED", 5);

    expect(storage.compress_file("alice", "data.bin")).toBeNull();
    expect(storage.file_get("data.bin")).toBe(40);
    expect(storage.file_get("data.bin.COMPRESSED")).toBe(5);
  });

  it("decompresses an owned file and returns remaining capacity", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin", 60);
    storage.compress_file("alice", "data.bin");

    expect(storage.decompress_file("alice", "data.bin.COMPRESSED")).toBe(40);
    expect(storage.file_get("data.bin.COMPRESSED")).toBeNull();
    expect(storage.file_get("data.bin")).toBe(60);
  });

  it("rejects decompression when the expanded file would exceed capacity", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin", 80);
    storage.compress_file("alice", "data.bin");
    storage.file_upload_by("alice", "other.bin", 40);

    expect(
      storage.decompress_file("alice", "data.bin.COMPRESSED"),
    ).toBeNull();
    expect(storage.file_get("data.bin.COMPRESSED")).toBe(40);
    expect(storage.file_get("data.bin")).toBeNull();
  });

  it("rejects decompression by a non-owner or for an uncompressed name", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.add_user("bob", 100);
    storage.file_upload_by("alice", "data.bin", 40);
    storage.compress_file("alice", "data.bin");

    expect(
      storage.decompress_file("bob", "data.bin.COMPRESSED"),
    ).toBeNull();
    expect(storage.decompress_file("alice", "other.bin")).toBeNull();
  });

  it("rejects decompression when the restored name already exists", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin.COMPRESSED", 20);
    storage.file_upload("data.bin", 1);

    expect(
      storage.decompress_file("alice", "data.bin.COMPRESSED"),
    ).toBeNull();
    expect(storage.file_get("data.bin.COMPRESSED")).toBe(20);
    expect(storage.file_get("data.bin")).toBe(1);
  });

  it("frees capacity that can be used by a later upload", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "data.bin", 80);

    expect(storage.file_upload_by("alice", "extra.bin", 30)).toBeNull();
    expect(storage.compress_file("alice", "data.bin")).toBe(60);
    expect(storage.file_upload_by("alice", "extra.bin", 30)).toBe(30);
  });

  it("includes compressed files in searches and capacity eviction", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "report.bin", 60);
    storage.file_upload_by("alice", "report-old.bin", 30);
    storage.compress_file("alice", "report.bin");

    expect(storage.file_search("report")).toEqual([
      "report-old.bin",
      "report.bin.COMPRESSED",
    ]);
    expect(storage.update_capacity("alice", 30)).toBe(1);
    expect(storage.file_get("report-old.bin")).toBeNull();
    expect(storage.file_get("report.bin.COMPRESSED")).toBe(30);
  });

  it("allows admin compression and reports unlimited remaining capacity", () => {
    const storage = new CloudStorage();
    storage.file_upload("admin.bin", 40);

    expect(storage.compress_file("admin", "admin.bin")).toBe(Infinity);
    expect(storage.decompress_file("admin", "admin.bin.COMPRESSED")).toBe(
      Infinity,
    );
  });
});
