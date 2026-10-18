import { describe, expect, it } from "vitest";

import { MemoryDatabase } from "../src/memory-database.js";

describe("Step 4: backup and restore", () => {
  it("backs up visible fields and counts non-empty records rather than fields", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "first", "a", "1");
    db.set_at(2, "first", "b", "2");
    db.set_at(3, "second", "a", "3");

    expect(db.backup(4)).toBe(2);
  });

  it("excludes expired and deleted fields from a backup", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "expired", "field", "old", 2);
    db.set_at(2, "deleted", "field", "gone");
    db.delete_at(3, "deleted", "field");
    db.set_at(4, "live", "field", "value");

    expect(db.backup(5)).toBe(1);
    db.restore(6, 5);
    expect(db.scan_at(7, "expired")).toBe("");
    expect(db.scan_at(8, "deleted")).toBe("");
    expect(db.scan_at(9, "live")).toBe("field(value)");
  });

  it("restores permanent fields and discards later changes", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "user", "name", "Ada");
    db.set_at(2, "user", "role", "admin");
    db.backup(3);
    db.set_at(4, "user", "name", "Grace");
    db.delete_at(5, "user", "role");
    db.set_at(6, "later", "field", "value");

    db.restore(7, 3);

    expect(db.scan_at(8, "user")).toBe("name(Ada), role(admin)");
    expect(db.scan_at(9, "later")).toBe("");
  });

  it("selects the latest backup at or before the requested time", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "record", "field", "A");
    db.backup(2);
    db.set_at(3, "record", "field", "B");
    db.backup(4);
    db.set_at(5, "record", "field", "C");

    db.restore(6, 3);
    expect(db.get_at(7, "record", "field")).toBe("A");
    db.restore(8, 4);
    expect(db.get_at(9, "record", "field")).toBe("B");
  });

  it("reanchors a restored TTL using its remaining lifetime at backup", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "field", "value", 10);
    db.backup(5);
    db.set_at(6, "record", "field", "replacement");

    db.restore(10, 5);

    expect(db.get_at(15, "record", "field")).toBe("value");
    expect(db.get_at(16, "record", "field")).toBe("");
  });

  it("preserves independent remaining TTLs for fields in one record", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "short", "S", 7);
    db.set_at_with_ttl(2, "record", "long", "L", 12);
    db.set_at(3, "record", "permanent", "P");
    db.backup(5);

    db.restore(20, 5);

    expect(db.scan_at(22, "record")).toBe("long(L), permanent(P), short(S)");
    expect(db.scan_at(23, "record")).toBe("long(L), permanent(P)");
    expect(db.scan_at(29, "record")).toBe("permanent(P)");
  });

  it("keeps backup snapshots isolated from later mutations", () => {
    const db = new MemoryDatabase();
    db.set_at(1, "record", "field", "original");
    db.backup(2);
    db.set_at(3, "record", "field", "changed");
    db.set_at(4, "record", "other", "later");
    db.backup(5);
    db.delete_at(6, "record", "field");

    db.restore(7, 2);

    expect(db.scan_at(8, "record")).toBe("field(original)");
  });

  it("keeps a TTL removed by plain set permanent through restoration", () => {
    const db = new MemoryDatabase();
    db.set_at_with_ttl(1, "record", "field", "temporary", 4);
    db.set_at(2, "record", "field", "permanent");
    db.backup(3);

    db.restore(10, 3);

    expect(db.get_at(100, "record", "field")).toBe("permanent");
  });
});

