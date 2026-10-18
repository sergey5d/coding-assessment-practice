import { describe, expect, it } from "vitest";

import { CloudStorage } from "../src/cloud-storage.js";

describe("Step 3: users and capacity", () => {
  it("adds users and rejects duplicate IDs and admin", () => {
    const storage = new CloudStorage();

    expect(storage.add_user("alice", 100)).toBe(true);
    expect(storage.add_user("alice", 500)).toBe(false);
    expect(storage.add_user("admin", 500)).toBe(false);
  });

  it("uploads for a user and returns remaining capacity", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);

    expect(storage.file_upload_by("alice", "a.bin", 30)).toBe(70);
    expect(storage.file_upload_by("alice", "b.bin", 25)).toBe(45);
    expect(storage.file_get("a.bin")).toBe(30);
  });

  it("rejects unknown users, duplicate names, and files that do not fit", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 50);
    storage.file_upload_by("alice", "a.bin", 30);

    expect(storage.file_upload_by("missing", "x.bin", 1)).toBeNull();
    expect(storage.file_upload_by("alice", "a.bin", 1)).toBeNull();
    expect(storage.file_upload_by("alice", "b.bin", 21)).toBeNull();
    expect(storage.file_get("b.bin")).toBeNull();
  });

  it("uses a global file-name namespace across owners", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.add_user("bob", 100);
    storage.file_upload_by("alice", "shared.bin", 20);

    expect(storage.file_upload_by("bob", "shared.bin", 10)).toBeNull();
    expect(storage.file_upload("shared.bin", 99)).toBe(false);
    expect(storage.file_get("shared.bin")).toBe(20);
  });

  it("treats Level 1 uploads and copies as unlimited admin files", () => {
    const storage = new CloudStorage();

    expect(storage.file_upload("huge.bin", 1_000_000)).toBe(true);
    expect(storage.file_copy("huge.bin", "huge-copy.bin")).toBe(true);
    expect(storage.file_upload_by("admin", "other.bin", 2_000_000)).toBe(
      Infinity,
    );
  });

  it("preserves source ownership when copying and charges its owner", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "source.bin", 40);

    expect(storage.file_copy("source.bin", "copy.bin")).toBe(true);
    expect(storage.file_upload_by("alice", "last.bin", 20)).toBe(0);
    expect(storage.file_upload_by("alice", "too-much.bin", 1)).toBeNull();
  });

  it("rejects a copy that would exceed capacity and preserves its destination", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 50);
    storage.file_upload_by("alice", "source.bin", 30);
    storage.file_upload("dest.bin", 5);

    expect(storage.file_copy("source.bin", "dest.bin")).toBe(false);
    expect(storage.file_get("dest.bin")).toBe(5);
    expect(storage.file_get("source.bin")).toBe(30);
  });

  it("accounts for a same-owner destination when checking copy capacity", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 50);
    storage.file_upload_by("alice", "source.bin", 30);
    storage.file_upload_by("alice", "dest.bin", 20);

    expect(storage.file_copy("source.bin", "dest.bin")).toBe(false);
    expect(storage.file_get("dest.bin")).toBe(20);

    expect(storage.update_capacity("alice", 60)).toBe(0);
    expect(storage.file_copy("source.bin", "dest.bin")).toBe(true);
    expect(storage.file_get("dest.bin")).toBe(30);
  });

  it("transfers destination ownership on a cross-owner overwrite", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.add_user("bob", 50);
    storage.file_upload_by("alice", "source.bin", 30);
    storage.file_upload_by("bob", "dest.bin", 40);

    expect(storage.file_copy("source.bin", "dest.bin")).toBe(true);
    expect(storage.file_upload_by("bob", "bob-new.bin", 50)).toBe(0);
    expect(storage.file_upload_by("alice", "alice-new.bin", 40)).toBe(0);
  });

  it("returns null when updating an unknown user or admin", () => {
    const storage = new CloudStorage();

    expect(storage.update_capacity("missing", 10)).toBeNull();
    expect(storage.update_capacity("admin", 10)).toBeNull();
  });

  it("updates capacity without deleting files when they still fit", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "a.bin", 20);
    storage.file_upload_by("alice", "b.bin", 30);

    expect(storage.update_capacity("alice", 60)).toBe(0);
    expect(storage.file_get("a.bin")).toBe(20);
    expect(storage.file_get("b.bin")).toBe(30);
  });

  it("evicts largest files until the reduced capacity is satisfied", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 200);
    storage.file_upload_by("alice", "small.bin", 20);
    storage.file_upload_by("alice", "medium.bin", 40);
    storage.file_upload_by("alice", "large.bin", 70);

    expect(storage.update_capacity("alice", 50)).toBe(2);
    expect(storage.file_get("large.bin")).toBeNull();
    expect(storage.file_get("medium.bin")).toBeNull();
    expect(storage.file_get("small.bin")).toBe(20);
  });

  it("breaks equal-size eviction ties by name ascending", () => {
    const storage = new CloudStorage();
    storage.add_user("alice", 100);
    storage.file_upload_by("alice", "z.bin", 30);
    storage.file_upload_by("alice", "a.bin", 30);
    storage.file_upload_by("alice", "m.bin", 30);

    expect(storage.update_capacity("alice", 60)).toBe(1);
    expect(storage.file_get("a.bin")).toBeNull();
    expect(storage.file_get("m.bin")).toBe(30);
    expect(storage.file_get("z.bin")).toBe(30);
  });
});

