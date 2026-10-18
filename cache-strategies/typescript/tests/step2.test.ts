import { describe, expect, it } from "vitest";

import { LFUCache } from "../src/caches.js";

describe("Step 2: LFU cache", () => {
  it("stores values with an initial frequency", () => {
    const cache = new LFUCache<string, number>(2);
    cache.put("a", 1);

    expect(cache.get("a")).toBe(1);
    expect(cache.get("missing")).toBeNull();
    expect(cache.size()).toBe(1);
  });

  it("evicts the least frequently used key", () => {
    const cache = new LFUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);
    expect(cache.get("a")).toBe(1);

    cache.put("c", 3);

    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBeNull();
    expect(cache.get("c")).toBe(3);
  });

  it("breaks equal-frequency ties by least recent use", () => {
    const cache = new LFUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);

    cache.put("c", 3);

    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("uses recency within the new frequency after reads", () => {
    const cache = new LFUCache<string, number>(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.get("a");
    cache.get("b");
    cache.get("a");
    cache.get("b");
    cache.get("c");
    cache.get("c");

    cache.put("d", 4);

    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("treats updating an existing key as an access", () => {
    const cache = new LFUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);

    cache.put("a", 10);
    cache.put("c", 3);

    expect(cache.get("a")).toBe(10);
    expect(cache.get("b")).toBeNull();
    expect(cache.size()).toBe(2);
  });

  it("does not change frequencies after a failed read", () => {
    const cache = new LFUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);
    expect(cache.get("missing")).toBeNull();

    cache.put("c", 3);

    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBe(2);
  });

  it("deletes entries and reuses capacity", () => {
    const cache = new LFUCache<string, number>(2);
    cache.put("a", 1);
    cache.put("b", 2);

    expect(cache.delete("a")).toBe(true);
    expect(cache.delete("a")).toBe(false);
    cache.put("c", 3);

    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
    expect(cache.size()).toBe(2);
  });

  it("retains nothing when capacity is zero", () => {
    const cache = new LFUCache<string, number>(0);

    cache.put("a", 1);

    expect(cache.get("a")).toBeNull();
    expect(cache.size()).toBe(0);
  });
});

