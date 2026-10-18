import { describe, expect, it } from "vitest";

import { WorkerTimeTracker } from "../src/worker-time-tracker.js";

describe("Step 4: per-session overtime", () => {
  it("pays time beyond the threshold at double compensation", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 5);
    tracker.register("alice", 1);
    tracker.register("alice", 11);

    expect(tracker.calc_salary("alice", 0, 20)).toBe(150);
  });

  it("does not add overtime when a session ends exactly at the threshold", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 5);
    tracker.register("alice", 10);
    tracker.register("alice", 15);

    expect(tracker.calc_salary("alice", 0, 100)).toBe(50);
  });

  it("resets the overtime threshold for every session", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 5);
    tracker.register("alice", 1);
    tracker.register("alice", 5);
    tracker.register("alice", 10);
    tracker.register("alice", 14);

    expect(tracker.calc_salary("alice", 0, 20)).toBe(80);
  });

  it("measures overtime from the session start rather than the query start", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 5);
    tracker.register("alice", 10);
    tracker.register("alice", 30);

    expect(tracker.calc_salary("alice", 18, 22)).toBe(80);
  });

  it("splits a clipped query at the session's overtime boundary", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 5);
    tracker.register("alice", 10);
    tracker.register("alice", 30);

    expect(tracker.calc_salary("alice", 13, 17)).toBe(60);
  });

  it("uses each promoted session's captured compensation for overtime", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 2);
    tracker.register("alice", 1);
    tracker.register("alice", 5);
    tracker.promote("alice", "lead", 20, 10);
    tracker.register("alice", 10);
    tracker.register("alice", 14);

    expect(tracker.calc_salary("alice", 0, 20)).toBe(180);
  });

  it("applies a new threshold to previously completed sessions", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 1);
    tracker.register("alice", 11);

    expect(tracker.calc_salary("alice", 0, 20)).toBe(100);
    expect(tracker.set_overtime("alice", 8)).toBe(true);
    expect(tracker.calc_salary("alice", 0, 20)).toBe(120);
    expect(tracker.set_overtime("alice", 3)).toBe(true);
    expect(tracker.calc_salary("alice", 0, 20)).toBe(170);
  });

  it("double-pays the whole session when the threshold is zero", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 7);
    tracker.set_overtime("alice", 0);
    tracker.register("alice", 2);
    tracker.register("alice", 7);

    expect(tracker.calc_salary("alice", 0, 10)).toBe(70);
  });

  it("rejects overtime settings for unknown workers", () => {
    const tracker = new WorkerTimeTracker();

    expect(tracker.set_overtime("missing", 5)).toBe(false);
    expect(tracker.get("missing")).toBeNull();
  });

  it("does not let overtime change time totals or rankings", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.set_overtime("alice", 2);
    tracker.register("alice", 1);
    tracker.register("alice", 11);

    expect(tracker.get("alice")).toBe(10);
    expect(tracker.top_n_workers(1, "engineer")).toEqual(["alice(10)"]);
  });
});
