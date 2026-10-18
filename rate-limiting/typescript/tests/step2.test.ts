import { describe, expect, it } from "vitest";

import { SlidingWindowRateLimiter } from "../src/rate-limiters.js";

describe("Step 2: sliding-window rate limiter", () => {
  it("allows requests up to the configured limit", () => {
    const limiter = new SlidingWindowRateLimiter(3, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 2)).toBe(true);
    expect(limiter.allow("alice", 3)).toBe(true);
    expect(limiter.allow("alice", 4)).toBe(false);
  });

  it("expires a request at the exact sliding-window boundary", () => {
    const limiter = new SlidingWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 5)).toBe(true);
    expect(limiter.allow("alice", 14)).toBe(false);
    expect(limiter.allow("alice", 15)).toBe(true);
  });

  it("does not reset merely because a fixed boundary was crossed", () => {
    const limiter = new SlidingWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 9)).toBe(true);
    expect(limiter.allow("alice", 10)).toBe(false);
    expect(limiter.allow("alice", 19)).toBe(true);
  });

  it("does not store rejected requests", () => {
    const limiter = new SlidingWindowRateLimiter(2, 10);

    expect(limiter.allow("alice", 0)).toBe(true);
    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 2)).toBe(false);
    expect(limiter.allow("alice", 10)).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = new SlidingWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 2)).toBe(false);
    expect(limiter.allow("bob", 3)).toBe(true);
    expect(limiter.allow("bob", 4)).toBe(false);
  });

  it("counts accepted requests with the same timestamp separately", () => {
    const limiter = new SlidingWindowRateLimiter(2, 10);

    expect(limiter.allow("alice", 5)).toBe(true);
    expect(limiter.allow("alice", 5)).toBe(true);
    expect(limiter.allow("alice", 5)).toBe(false);
  });

  it("expires old timestamps incrementally", () => {
    const limiter = new SlidingWindowRateLimiter(3, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 4)).toBe(true);
    expect(limiter.allow("alice", 7)).toBe(true);
    expect(limiter.allow("alice", 10)).toBe(false);
    expect(limiter.allow("alice", 11)).toBe(true);
    expect(limiter.allow("alice", 14)).toBe(true);
  });
});

