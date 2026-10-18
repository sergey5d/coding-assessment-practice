import { describe, expect, it } from "vitest";

import { TokenBucketRateLimiter } from "../src/rate-limiters.js";

describe("Step 4: token-bucket rate limiter", () => {
  it("starts full and permits an immediate burst", () => {
    const limiter = new TokenBucketRateLimiter(3, 1);

    expect(limiter.allow("alice", 100)).toBe(true);
    expect(limiter.allow("alice", 100)).toBe(true);
    expect(limiter.allow("alice", 100)).toBe(true);
    expect(limiter.allow("alice", 100)).toBe(false);
  });

  it("refills before deciding whether to accept", () => {
    const limiter = new TokenBucketRateLimiter(3, 1);

    expect(limiter.allow("alice", 0, 3)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(false);
    expect(limiter.allow("alice", 1)).toBe(true);
  });

  it("caps refilled tokens at capacity", () => {
    const limiter = new TokenBucketRateLimiter(5, 1);

    expect(limiter.allow("alice", 0, 5)).toBe(true);
    expect(limiter.allow("alice", 100, 5)).toBe(true);
    expect(limiter.allow("alice", 100)).toBe(false);
  });

  it("subtracts weighted costs that fit exactly", () => {
    const limiter = new TokenBucketRateLimiter(5, 1);

    expect(limiter.allow("alice", 0, 2)).toBe(true);
    expect(limiter.allow("alice", 0, 3)).toBe(true);
    expect(limiter.allow("alice", 0, 0.1)).toBe(false);
  });

  it("supports fractional refill", () => {
    const limiter = new TokenBucketRateLimiter(5, 0.5);

    expect(limiter.allow("alice", 0, 5)).toBe(true);
    expect(limiter.allow("alice", 1, 1)).toBe(false);
    expect(limiter.allow("alice", 2, 1)).toBe(true);
    expect(limiter.allow("alice", 3, 1)).toBe(false);
    expect(limiter.allow("alice", 4, 1)).toBe(true);
  });

  it("does not subtract tokens for rejected requests", () => {
    const limiter = new TokenBucketRateLimiter(3, 1);

    expect(limiter.allow("alice", 0, 3)).toBe(true);
    expect(limiter.allow("alice", 1, 2)).toBe(false);
    expect(limiter.allow("alice", 2, 2)).toBe(true);
  });

  it("tracks each key with an independent bucket", () => {
    const limiter = new TokenBucketRateLimiter(2, 1);

    expect(limiter.allow("alice", 0, 2)).toBe(true);
    expect(limiter.allow("alice", 0)).toBe(false);
    expect(limiter.allow("bob", 0, 2)).toBe(true);
    expect(limiter.allow("bob", 0)).toBe(false);
  });

  it("never accepts a cost larger than capacity", () => {
    const limiter = new TokenBucketRateLimiter(5, 1);

    expect(limiter.allow("alice", 0, 6)).toBe(false);
    expect(limiter.allow("alice", 1, 5)).toBe(true);
  });
});
