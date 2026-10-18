import { describe, expect, it } from "vitest";

import { TTLCache } from "../src/caches.js";

describe("Step 3: TTL cache", () => {
  it("returns a value throughout its live interval", () => {
    const cache = new TTLCache<string, number>();
    cache.set("a", 1, 10, 5);

    expect(cache.get("a", 10)).toBe(1);
    expect(cache.get("a", 14)).toBe(1);
  });

  it("expires a value at the exact end of its TTL", () => {
    const cache = new TTLCache<string, number>();
    cache.set("a", 1, 10, 5);

    expect(cache.get("a", 15)).toBeNull();
    expect(cache.get("a", 16)).toBeNull();
  });

  it("returns null for a key that was never stored", () => {
    const cache = new TTLCache<string, number>();

    expect(cache.get("missing", 1)).toBeNull();
  });

  it("tracks independent expiration times", () => {
    const cache = new TTLCache<string, number>();
    cache.set("short", 1, 1, 3);
    cache.set("long", 2, 2, 10);

    expect(cache.get("short", 4)).toBeNull();
    expect(cache.get("long", 4)).toBe(2);
    expect(cache.get("long", 12)).toBeNull();
  });

  it("overwrites both the value and expiration", () => {
    const cache = new TTLCache<string, number>();
    cache.set("a", 1, 1, 100);
    cache.set("a", 2, 5, 3);

    expect(cache.get("a", 7)).toBe(2);
    expect(cache.get("a", 8)).toBeNull();
  });

  it("does not let an old expiration remove a refreshed value", () => {
    const cache = new TTLCache<string, number>();
    cache.set("a", 1, 1, 4);
    cache.set("a", 2, 3, 10);

    expect(cache.get("a", 5)).toBe(2);
    expect(cache.get("a", 12)).toBe(2);
    expect(cache.get("a", 13)).toBeNull();
  });

  it("deletes only live entries", () => {
    const cache = new TTLCache<string, number>();
    cache.set("live", 1, 1, 10);
    cache.set("expired", 2, 2, 2);

    expect(cache.delete("expired", 4)).toBe(false);
    expect(cache.delete("live", 5)).toBe(true);
    expect(cache.delete("live", 6)).toBe(false);
  });

  it("reports only live entries in size", () => {
    const cache = new TTLCache<string, number>();
    cache.set("a", 1, 1, 3);
    cache.set("b", 2, 2, 10);

    expect(cache.size(3)).toBe(2);
    expect(cache.size(4)).toBe(1);
    expect(cache.size(12)).toBe(0);
  });

  it("allows a key to be recreated after expiration", () => {
    const cache = new TTLCache<string, number>();
    cache.set("a", 1, 1, 2);
    expect(cache.get("a", 3)).toBeNull();

    cache.set("a", 2, 4, 5);

    expect(cache.get("a", 5)).toBe(2);
    expect(cache.size(5)).toBe(1);
  });
});

