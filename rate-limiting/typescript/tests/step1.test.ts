import { describe, expect, it } from "vitest";

import { FixedWindowRateLimiter } from "../src/rate-limiters.js";

describe("Step 1: fixed-window rate limiter", () => {
  it("allows requests up to the configured limit", () => {
    const limiter = new FixedWindowRateLimiter(3, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 2)).toBe(true);
    expect(limiter.allow("alice", 3)).toBe(true);
    expect(limiter.allow("alice", 4)).toBe(false);
  });

  it("resets at the exact beginning of the next window", () => {
    const limiter = new FixedWindowRateLimiter(2, 10);

    expect(limiter.allow("alice", 8)).toBe(true);
    expect(limiter.allow("alice", 9)).toBe(true);
    expect(limiter.allow("alice", 10)).toBe(true);
    expect(limiter.allow("alice", 11)).toBe(true);
    expect(limiter.allow("alice", 12)).toBe(false);
  });

  it("uses epoch-anchored rather than caller-anchored windows", () => {
    const limiter = new FixedWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 9)).toBe(true);
    expect(limiter.allow("alice", 10)).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = new FixedWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 2)).toBe(false);
    expect(limiter.allow("bob", 3)).toBe(true);
    expect(limiter.allow("bob", 4)).toBe(false);
  });

  it("supports multiple requests at the same timestamp", () => {
    const limiter = new FixedWindowRateLimiter(2, 10);

    expect(limiter.allow("alice", 5)).toBe(true);
    expect(limiter.allow("alice", 5)).toBe(true);
    expect(limiter.allow("alice", 5)).toBe(false);
  });

  it("resets correctly after windows with no requests", () => {
    const limiter = new FixedWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 99)).toBe(true);
    expect(limiter.allow("alice", 99)).toBe(false);
    expect(limiter.allow("alice", 100)).toBe(true);
  });

  it("does not let rejected attempts affect another window", () => {
    const limiter = new FixedWindowRateLimiter(1, 10);

    expect(limiter.allow("alice", 1)).toBe(true);
    expect(limiter.allow("alice", 2)).toBe(false);
    expect(limiter.allow("alice", 3)).toBe(false);
    expect(limiter.allow("alice", 10)).toBe(true);
  });
});

