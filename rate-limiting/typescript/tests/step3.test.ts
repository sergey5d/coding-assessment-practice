import { describe, expect, it } from "vitest";

import { LeakyBucketRateLimiter } from "../src/rate-limiters.js";

describe("Step 3: leaky-bucket rate limiter", () => {
  it("starts empty and accepts until the bucket is full", () => {
    const limiter = new LeakyBucketRateLimiter(3, 1);

    expect(limiter.allow("alice", 0)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(false);
  });

  it("leaks before deciding whether to accept", () => {
    const limiter = new LeakyBucketRateLimiter(3, 1);

    expect(limiter.allow("alice", 0, 3)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(false);
    expect(limiter.allow("alice", 1)).toBe(true);
  });

  it("clamps leaked fill at zero", () => {
    const limiter = new LeakyBucketRateLimiter(5, 1);

    expect(limiter.allow("alice", 0, 5)).toBe(true);
    expect(limiter.allow("alice", 100, 5)).toBe(true);
    expect(limiter.allow("alice", 100)).toBe(false);
  });

  it("accepts weighted requests that fit exactly", () => {
    const limiter = new LeakyBucketRateLimiter(5, 1);

    expect(limiter.allow("alice", 0, 2)).toBe(true);
    expect(limiter.allow("alice", 0, 3)).toBe(true);
    expect(limiter.allow("alice", 0, 0.1)).toBe(false);
  });

  it("supports fractional leakage", () => {
    const limiter = new LeakyBucketRateLimiter(5, 0.5);

    expect(limiter.allow("alice", 0, 4)).toBe(true);
    expect(limiter.allow("alice", 2, 2)).toBe(true);
    expect(limiter.allow("alice", 3, 1)).toBe(false);
    expect(limiter.allow("alice", 4, 1)).toBe(true);
  });

  it("does not add rejected amounts to the fill level", () => {
    const limiter = new LeakyBucketRateLimiter(3, 1);

    expect(limiter.allow("alice", 0, 3)).toBe(true);
    expect(limiter.allow("alice", 1, 2)).toBe(false);
    expect(limiter.allow("alice", 2, 2)).toBe(true);
  });

  it("tracks each key with an independent bucket", () => {
    const limiter = new LeakyBucketRateLimiter(2, 1);

    expect(limiter.allow("alice", 0, 2)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(false);
    expect(limiter.allow("bob", 0, 2)).toBe(true);
    expect(limiter.allow("bob", 0)).toBe(false);
  });

  it("never accepts an amount larger than capacity", () => {
    const limiter = new LeakyBucketRateLimiter(5, 1);

    expect(limiter.allow("alice", 0, 6)).toBe(false);
    expect(limiter.allow("alice", 1, 5)).toBe(true);
  });
});

