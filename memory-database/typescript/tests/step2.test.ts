import { describe, expect, it } from "vitest";

import { MemoryDatabase } from "../src/memory-database.js";

describe("Step 2: scanning", () => {
  it("scans fields in lexicographic order with exact formatting", () => {
    const db = new MemoryDatabase();
    db.set("user", "role", "admin");
    db.set("user", "age", "37");
    db.set("user", "name", "Ada");

    expect(db.scan("user")).toBe("age(37), name(Ada), role(admin)");
  });

  it("returns an empty string for a missing or emptied record", () => {
    const db = new MemoryDatabase();
    expect(db.scan("missing")).toBe("");

    db.set("user", "name", "Ada");
    db.delete("user", "name");

    expect(db.scan("user")).toBe("");
  });

  it("scans only fields matching a prefix", () => {
    const db = new MemoryDatabase();
    db.set("user", "address", "London");
    db.set("user", "age", "37");
    db.set("user", "alias", "ada");
    db.set("user", "name", "Ada");

    expect(db.scan_by_prefix("user", "a")).toBe(
      "address(London), age(37), alias(ada)",
    );
    expect(db.scan_by_prefix("user", "ali")).toBe("alias(ada)");
  });

  it("uses case-sensitive prefix matching and ordering", () => {
    const db = new MemoryDatabase();
    db.set("record", "Alpha", "1");
    db.set("record", "alpha", "2");
    db.set("record", "alphabet", "3");

    expect(db.scan_by_prefix("record", "Al")).toBe("Alpha(1)");
    expect(db.scan_by_prefix("record", "al")).toBe(
      "alpha(2), alphabet(3)",
    );
  });

  it("treats an empty prefix as matching every field", () => {
    const db = new MemoryDatabase();
    db.set("record", "b", "2");
    db.set("record", "a", "1");

    expect(db.scan_by_prefix("record", "")).toBe("a(1), b(2)");
  });

  it("returns an empty string when no fields match", () => {
    const db = new MemoryDatabase();
    db.set("record", "name", "Ada");

    expect(db.scan_by_prefix("record", "z")).toBe("");
    expect(db.scan_by_prefix("missing", "n")).toBe("");
  });
});

