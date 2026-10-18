import { describe, expect, it } from "vitest";

import { WorkerTimeTracker } from "../src/worker-time-tracker.js";

describe("Step 2: worker ranking", () => {
  it("ranks workers by completed time in descending order", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.add_worker("bob", "engineer", 10);
    tracker.add_worker("carol", "engineer", 10);
    tracker.register("alice", 1);
    tracker.register("alice", 11);
    tracker.register("bob", 20);
    tracker.register("bob", 35);
    tracker.register("carol", 40);
    tracker.register("carol", 45);

    expect(tracker.top_n_workers(3, "engineer")).toEqual([
      "bob(15)",
      "alice(10)",
      "carol(5)",
    ]);
  });

  it("breaks equal-time ties by worker ID", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("zoe", "engineer", 10);
    tracker.add_worker("amy", "engineer", 10);
    tracker.add_worker("mike", "engineer", 10);
    tracker.register("zoe", 1);
    tracker.register("zoe", 6);
    tracker.register("amy", 10);
    tracker.register("amy", 15);
    tracker.register("mike", 20);
    tracker.register("mike", 25);

    expect(tracker.top_n_workers(3, "engineer")).toEqual([
      "amy(5)",
      "mike(5)",
      "zoe(5)",
    ]);
  });

  it("filters by position", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.add_worker("bob", "designer", 10);
    tracker.add_worker("carol", "engineer", 10);
    tracker.register("alice", 1);
    tracker.register("alice", 6);
    tracker.register("bob", 10);
    tracker.register("bob", 30);

    expect(tracker.top_n_workers(10, "engineer")).toEqual([
      "alice(5)",
      "carol(0)",
    ]);
    expect(tracker.top_n_workers(10, "designer")).toEqual(["bob(20)"]);
    expect(tracker.top_n_workers(10, "manager")).toEqual([]);
  });

  it("includes workers with no completed sessions as zero", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("bob", "engineer", 10);
    tracker.add_worker("alice", "engineer", 10);

    expect(tracker.top_n_workers(2, "engineer")).toEqual([
      "alice(0)",
      "bob(0)",
    ]);
  });

  it("does not count an open session", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.add_worker("bob", "engineer", 10);
    tracker.register("alice", 1);
    tracker.register("alice", 11);
    tracker.register("bob", 20);

    expect(tracker.top_n_workers(2, "engineer")).toEqual([
      "alice(10)",
      "bob(0)",
    ]);
  });

  it("limits the result and treats a non-positive n as empty", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.add_worker("bob", "engineer", 10);
    tracker.add_worker("carol", "engineer", 10);

    expect(tracker.top_n_workers(2, "engineer")).toEqual([
      "alice(0)",
      "bob(0)",
    ]);
    expect(tracker.top_n_workers(0, "engineer")).toEqual([]);
    expect(tracker.top_n_workers(-1, "engineer")).toEqual([]);
  });
});

