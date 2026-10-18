import { describe, expect, it } from "vitest";

import { WorkerTimeTracker } from "../src/worker-time-tracker.js";

describe("Step 1: registration", () => {
  it("adds workers and rejects duplicate IDs without replacing their state", () => {
    const tracker = new WorkerTimeTracker();

    expect(tracker.add_worker("alice", "engineer", 10)).toBe(true);
    expect(tracker.add_worker("alice", "manager", 100)).toBe(false);
    expect(tracker.register("alice", 2)).toBe(true);
    expect(tracker.register("alice", 7)).toBe(true);
    expect(tracker.get("alice")).toBe(5);
  });

  it("returns null for an unknown worker", () => {
    const tracker = new WorkerTimeTracker();

    expect(tracker.get("missing")).toBeNull();
  });

  it("rejects registration for an unknown worker without creating it", () => {
    const tracker = new WorkerTimeTracker();

    expect(tracker.register("missing", 1)).toBe(false);
    expect(tracker.get("missing")).toBeNull();
  });

  it("alternates registrations between entry and exit", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);

    expect(tracker.register("alice", 3)).toBe(true);
    expect(tracker.register("alice", 11)).toBe(true);
    expect(tracker.register("alice", 20)).toBe(true);
    expect(tracker.register("alice", 25)).toBe(true);

    expect(tracker.get("alice")).toBe(13);
  });

  it("excludes an open session from total time", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 4);

    expect(tracker.get("alice")).toBe(0);

    tracker.register("alice", 14);
    tracker.register("alice", 20);
    expect(tracker.get("alice")).toBe(10);
  });

  it("tracks workers independently", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.add_worker("bob", "engineer", 20);

    tracker.register("alice", 1);
    tracker.register("bob", 2);
    tracker.register("alice", 6);

    expect(tracker.get("alice")).toBe(5);
    expect(tracker.get("bob")).toBe(0);

    tracker.register("bob", 10);
    expect(tracker.get("bob")).toBe(8);
  });
});

