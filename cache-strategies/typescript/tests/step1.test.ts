import { describe, expect, it } from "vitest";

import { LRUCache } from "../src/caches.js";

describe("Step 1: LRU cache", () => {
  it("stores and retrieves values", () => {
    const cache = new LRUCache<string, number>(2);

    cache.put("a", 1);

    expect(cache.get("a")).toBe(1);
    expect(cache.get("missing")).toBeNull();
    expect(cache.size()).toBe(1);
  });

  it("evicts the least recently inserted key", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);

    cache.put("c", 3);

    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("makes a successfully read key most recently used", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);
    expect(cache.get("a")).toBe(1);

    cache.put("c", 3);

    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBeNull();
    expect(cache.get("c")).toBe(3);
  });

  it("updates an existing key and makes it most recently used", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);

    cache.put("a", 10);
    cache.put("c", 3);

    expect(cache.get("a")).toBe(10);
    expect(cache.get("b")).toBeNull();
    expect(cache.size()).toBe(2);
  });

  it("does not alter recency after a failed read", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);
    expect(cache.get("missing")).toBeNull();

    cache.put("c", 3);

    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBe(2);
  });

  it("deletes only existing keys", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("a", 1);

    expect(cache.delete("missing")).toBe(false);
    expect(cache.delete("a")).toBe(true);
    expect(cache.delete("a")).toBe(false);
    expect(cache.size()).toBe(0);
  });

  it("reuses capacity after deletion", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.delete("a");
    cache.put("c", 3);

    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
    expect(cache.size()).toBe(2);
  });

  it("retains nothing when capacity is zero", () => {
    const cache = new LRUCache<string, number>(0);

    cache.put("a", 1);

    expect(cache.get("a")).toBeNull();
    expect(cache.size()).toBe(0);
  });
});

