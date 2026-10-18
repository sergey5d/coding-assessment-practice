import { describe, expect, it } from "vitest";

import { MemoryDatabase } from "../src/memory-database.js";

describe("Step 1: basic operations", () => {
  it("sets and gets a field", () => {
    const db = new MemoryDatabase();

    db.set("user", "name", "Ada");

    expect(db.get("user", "name")).toBe("Ada");
  });

  it("creates multiple records and fields independently", () => {
    const db = new MemoryDatabase();
    db.set("user:1", "name", "Ada");
    db.set("user:1", "role", "admin");
    db.set("user:2", "name", "Grace");

    expect(db.get("user:1", "name")).toBe("Ada");
    expect(db.get("user:1", "role")).toBe("admin");
    expect(db.get("user:2", "name")).toBe("Grace");
  });

  it("overwrites one field without changing its neighbors", () => {
    const db = new MemoryDatabase();
    db.set("user", "name", "Ada");
    db.set("user", "role", "admin");

    db.set("user", "name", "Grace");

    expect(db.get("user", "name")).toBe("Grace");
    expect(db.get("user", "role")).toBe("admin");
  });

  it("returns an empty string for missing keys and fields", () => {
    const db = new MemoryDatabase();
    db.set("user", "name", "Ada");

    expect(db.get("missing", "name")).toBe("");
    expect(db.get("user", "missing")).toBe("");
  });

  it("stores an empty string as a valid value", () => {
    const db = new MemoryDatabase();
    db.set("user", "nickname", "");

    expect(db.get("user", "nickname")).toBe("");
    expect(db.delete("user", "nickname")).toBe(true);
    expect(db.delete("user", "nickname")).toBe(false);
  });

  it("deletes only existing fields and removes empty records", () => {
    const db = new MemoryDatabase();
    db.set("user", "name", "Ada");
    db.set("user", "role", "admin");

    expect(db.delete("missing", "name")).toBe(false);
    expect(db.delete("user", "missing")).toBe(false);
    expect(db.delete("user", "name")).toBe(true);
    expect(db.get("user", "role")).toBe("admin");
    expect(db.delete("user", "role")).toBe(true);
    expect(db.get("user", "role")).toBe("");
    expect(db.delete("user", "role")).toBe(false);
  });
});

