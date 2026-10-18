import { describe, expect, it } from "vitest";

import { MemoryDatabase } from "../src/memory-database.js";

describe("Step 3: time and TTL", () => {
  it("supports timestamped set, get, overwrite, and delete", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "user", "name", "Ada");

    expect(db.get_at(2, "user", "name")).toBe("Ada");
    db.set_at(3, "user", "name", "Grace");
    expect(db.get_at(4, "user", "name")).toBe("Grace");
    expect(db.delete_at(5, "user", "name")).toBe(true);
    expect(db.get_at(6, "user", "name")).toBe("");
    expect(db.delete_at(7, "user", "name")).toBe(false);
  });

  it("supports timestamped scans and prefix scans", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "user", "role", "admin");
    db.set_at(2, "user", "age", "37");
    db.set_at(3, "user", "alias", "ada");

    expect(db.scan_at(4, "user")).toBe("age(37), alias(ada), role(admin)");
    expect(db.scan_by_prefix_at(5, "user", "a")).toBe(
      "age(37), alias(ada)",
    );
    expect(db.scan_by_prefix_at(6, "user", "missing")).toBe("");
  });

  it("keeps a TTL field visible only inside its half-open interval", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(10, "session", "token", "abc", 5);

    expect(db.get_at(11, "session", "token")).toBe("abc");
    expect(db.get_at(14, "session", "token")).toBe("abc");
    expect(db.get_at(15, "session", "token")).toBe("");
    expect(db.get_at(16, "session", "token")).toBe("");
  });

  it("hides expired fields from every read and delete operation", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "alpha", "A", 4);
    db.set_at(2, "record", "beta", "B");

    expect(db.scan_at(3, "record")).toBe("alpha(A), beta(B)");
    expect(db.scan_at(5, "record")).toBe("beta(B)");
    expect(db.scan_by_prefix_at(6, "record", "a")).toBe("");
    expect(db.delete_at(7, "record", "alpha")).toBe(false);
    expect(db.get_at(8, "record", "alpha")).toBe("");
  });

  it("applies TTL independently to each field", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "short", "S", 3);
    db.set_at_with_ttl(2, "record", "long", "L", 10);
    db.set_at(3, "record", "permanent", "P");

    expect(db.scan_at(4, "record")).toBe("long(L), permanent(P)");
    expect(db.scan_at(11, "record")).toBe("long(L), permanent(P)");
    expect(db.scan_at(12, "record")).toBe("permanent(P)");
  });

  it("replaces a previous TTL when a field is written again with TTL", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "field", "old", 100);
    db.set_at_with_ttl(5, "record", "field", "new", 3);

    expect(db.get_at(6, "record", "field")).toBe("new");
    expect(db.get_at(8, "record", "field")).toBe("");
  });

  it("does not reveal an older value after the latest TTL version expires", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "record", "field", "permanent-old-value");
    db.set_at_with_ttl(2, "record", "field", "temporary-new-value", 3);

    expect(db.get_at(4, "record", "field")).toBe("temporary-new-value");
    expect(db.get_at(5, "record", "field")).toBe("");
  });

  it("makes a TTL field permanent when plain set_at overwrites it", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "field", "temporary", 3);
    db.set_at(2, "record", "field", "permanent");

    expect(db.get_at(4, "record", "field")).toBe("permanent");
    expect(db.get_at(100, "record", "field")).toBe("permanent");
  });

  it("can replace an expired field with a new permanent value", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "field", "temporary", 2);
    expect(db.get_at(3, "record", "field")).toBe("");

    db.set_at(4, "record", "field", "replacement");
    expect(db.get_at(5, "record", "field")).toBe("replacement");
  });
});
