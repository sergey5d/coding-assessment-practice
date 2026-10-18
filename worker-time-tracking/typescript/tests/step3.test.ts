import { describe, expect, it } from "vitest";

import { WorkerTimeTracker } from "../src/worker-time-tracker.js";

describe("Step 3: promotions and salary", () => {
  it("rejects promotions for unknown workers and while one is pending", () => {
    const tracker = new WorkerTimeTracker();

    expect(tracker.promote("missing", "lead", 20, 10)).toBe(false);
    tracker.add_worker("alice", "engineer", 10);
    expect(tracker.promote("alice", "lead", 20, 10)).toBe(true);
    expect(tracker.promote("alice", "director", 30, 20)).toBe(false);
  });

  it("keeps a promotion pending until a qualifying entry", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.promote("alice", "lead", 20, 10);

    expect(tracker.top_n_workers(5, "engineer")).toEqual(["alice(0)"]);
    expect(tracker.top_n_workers(5, "lead")).toEqual([]);

    tracker.register("alice", 9);
    expect(tracker.top_n_workers(5, "engineer")).toEqual(["alice(0)"]);
    tracker.register("alice", 12);
    expect(tracker.top_n_workers(5, "engineer")).toEqual(["alice(3)"]);

    tracker.register("alice", 13);
    expect(tracker.top_n_workers(5, "engineer")).toEqual([]);
    expect(tracker.top_n_workers(5, "lead")).toEqual(["alice(0)"]);
  });

  it("does not activate a due promotion when the due registration is an exit", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 1);
    tracker.promote("alice", "lead", 20, 5);

    tracker.register("alice", 10);
    expect(tracker.top_n_workers(5, "engineer")).toEqual(["alice(9)"]);
    expect(tracker.top_n_workers(5, "lead")).toEqual([]);

    tracker.register("alice", 11);
    expect(tracker.top_n_workers(5, "lead")).toEqual(["alice(0)"]);
  });

  it("activates a promotion on an entry exactly at its start timestamp", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.promote("alice", "lead", 20, 10);

    tracker.register("alice", 10);
    tracker.register("alice", 15);

    expect(tracker.top_n_workers(5, "engineer")).toEqual([]);
    expect(tracker.top_n_workers(5, "lead")).toEqual(["alice(5)"]);
    expect(tracker.calc_salary("alice", 0, 20)).toBe(100);
  });

  it("keeps lifetime time but ranks only time in the current position", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 1);
    tracker.register("alice", 11);
    tracker.promote("alice", "lead", 20, 15);
    tracker.register("alice", 15);
    tracker.register("alice", 19);

    expect(tracker.get("alice")).toBe(14);
    expect(tracker.top_n_workers(5, "engineer")).toEqual([]);
    expect(tracker.top_n_workers(5, "lead")).toEqual(["alice(4)"]);
  });

  it("pays each completed session using compensation captured at entry", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 1);
    tracker.register("alice", 6);
    tracker.promote("alice", "lead", 25, 10);
    tracker.register("alice", 10);
    tracker.register("alice", 14);

    expect(tracker.calc_salary("alice", 0, 20)).toBe(150);
  });

  it("uses the old compensation for a session spanning promotion eligibility", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 1);
    tracker.promote("alice", "lead", 100, 5);
    tracker.register("alice", 10);

    expect(tracker.calc_salary("alice", 0, 20)).toBe(90);

    tracker.register("alice", 11);
    tracker.register("alice", 12);
    expect(tracker.calc_salary("alice", 0, 20)).toBe(190);
  });

  it("clips salary to the half-open query range", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 7);
    tracker.register("alice", 10);
    tracker.register("alice", 30);

    expect(tracker.calc_salary("alice", 0, 10)).toBe(0);
    expect(tracker.calc_salary("alice", 10, 30)).toBe(140);
    expect(tracker.calc_salary("alice", 15, 25)).toBe(70);
    expect(tracker.calc_salary("alice", 30, 40)).toBe(0);
    expect(tracker.calc_salary("alice", 20, 20)).toBe(0);
  });

  it("ignores open sessions when calculating salary", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.register("alice", 1);

    expect(tracker.calc_salary("alice", 0, 100)).toBe(0);

    tracker.register("alice", 11);
    tracker.register("alice", 20);
    expect(tracker.calc_salary("alice", 0, 100)).toBe(100);
  });

  it("returns null only for unknown workers", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);

    expect(tracker.calc_salary("missing", 0, 100)).toBeNull();
    expect(tracker.calc_salary("alice", 0, 100)).toBe(0);
  });

  it("allows another promotion after the previous one activates", () => {
    const tracker = new WorkerTimeTracker();
    tracker.add_worker("alice", "engineer", 10);
    tracker.promote("alice", "lead", 20, 5);
    tracker.register("alice", 5);

    expect(tracker.promote("alice", "director", 30, 10)).toBe(true);
    tracker.register("alice", 8);
    tracker.register("alice", 10);
    tracker.register("alice", 12);

    expect(tracker.top_n_workers(5, "lead")).toEqual([]);
    expect(tracker.top_n_workers(5, "director")).toEqual(["alice(2)"]);
    expect(tracker.calc_salary("alice", 0, 20)).toBe(120);
  });
});

