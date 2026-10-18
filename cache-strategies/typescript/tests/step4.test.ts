import { describe, expect, it } from "vitest";

import { TTLLRUCache } from "../src/caches.js";

describe("Step 4: TTL with LRU eviction", () => {
  it("evicts the least recently used live entry at capacity", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 1, 100);
    cache.put("b", 2, 2, 100);

    cache.put("c", 3, 3, 100);

    expect(cache.get("a", 4)).toBeNull();
    expect(cache.get("b", 4)).toBe(2);
    expect(cache.get("c", 4)).toBe(3);
  });

  it("makes a successful read most recently used", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 1, 100);
    cache.put("b", 2, 2, 100);
    expect(cache.get("a", 3)).toBe(1);

    cache.put("c", 3, 4, 100);

    expect(cache.get("a", 5)).toBe(1);
    expect(cache.get("b", 5)).toBeNull();
  });

  it("removes expired entries before deciding whether to evict", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("live", 1, 1, 100);
    cache.put("short", 2, 2, 3);

    cache.put("new", 3, 5, 100);

    expect(cache.get("short", 6)).toBeNull();
    expect(cache.get("live", 6)).toBe(1);
    expect(cache.get("new", 6)).toBe(3);
  });

  it("expires entries at the exact TTL boundary", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 10, 5);

    expect(cache.get("a", 14)).toBe(1);
    expect(cache.get("a", 15)).toBeNull();
    expect(cache.size(15)).toBe(0);
  });

  it("refreshes an existing value, TTL, and recency", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 1, 4);
    cache.put("b", 2, 2, 100);

    cache.put("a", 10, 3, 10);
    cache.put("c", 3, 5, 100);

    expect(cache.get("a", 6)).toBe(10);
    expect(cache.get("b", 6)).toBeNull();
    expect(cache.get("c", 6)).toBe(3);
  });

  it("does not let an old expiration delete a refreshed value", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 1, 4);
    cache.put("a", 2, 3, 10);

    expect(cache.get("a", 5)).toBe(2);
    expect(cache.get("a", 12)).toBe(2);
    expect(cache.get("a", 13)).toBeNull();
  });

  it("deletes only live entries and reuses capacity", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 1, 100);
    cache.put("b", 2, 2, 100);

    expect(cache.delete("a", 3)).toBe(true);
    expect(cache.delete("a", 4)).toBe(false);
    cache.put("c", 3, 5, 100);

    expect(cache.get("b", 6)).toBe(2);
    expect(cache.get("c", 6)).toBe(3);
  });

  it("reports only live entries in size", () => {
    const cache = new TTLLRUCache<string, number>(3);
    cache.put("a", 1, 1, 3);
    cache.put("b", 2, 2, 5);
    cache.put("c", 3, 3, 10);

    expect(cache.size(3)).toBe(3);
    expect(cache.size(4)).toBe(2);
    expect(cache.size(7)).toBe(1);
    expect(cache.size(13)).toBe(0);
  });

  it("does not let a failed read alter live-entry recency", () => {
    const cache = new TTLLRUCache<string, number>(2);
    cache.put("a", 1, 1, 100);
    cache.put("b", 2, 2, 100);
    expect(cache.get("missing", 3)).toBeNull();

    cache.put("c", 3, 4, 100);

    expect(cache.get("a", 5)).toBeNull();
    expect(cache.get("b", 5)).toBe(2);
  });

  it("retains nothing when capacity is zero", () => {
    const cache = new TTLLRUCache<string, number>(0);

    cache.put("a", 1, 1, 100);

    expect(cache.get("a", 2)).toBeNull();
    expect(cache.size(2)).toBe(0);
  });
});
