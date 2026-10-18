import { describe, expect, it } from "vitest";

import { RecordAggregator } from "../src/record-aggregator.js";

describe("Step 1: parse and aggregate", () => {
  it("ingests a record and returns its rollup", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.ingest("r1,10,alice,25")).toBe(true);
    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 25 });
  });

  it("aggregates multiple records for the same key", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,10,alice,25");
    aggregator.ingest("r2,11,alice,15");
    aggregator.ingest("r3,12,alice,-5");

    expect(aggregator.get_rollup("alice")).toEqual({ count: 3, total: 35 });
  });

  it("tracks keys independently", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,10,alice,25");
    aggregator.ingest("r2,11,bob,40");

    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 25 });
    expect(aggregator.get_rollup("bob")).toEqual({ count: 1, total: 40 });
    expect(aggregator.get_rollup("missing")).toBeNull();
  });

  it("trims surrounding whitespace from fields", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.ingest("  r1  ,  10 , alice , -7  ")).toBe(true);
    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: -7 });
  });

  it("rejects records with the wrong number of fields", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.ingest("r1,10,alice")).toBe(false);
    expect(aggregator.ingest("r2,10,alice,5,extra")).toBe(false);
    expect(aggregator.get_rollup("alice")).toBeNull();
  });

  it("rejects empty IDs and keys", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.ingest(",10,alice,5")).toBe(false);
    expect(aggregator.ingest("r2,10, ,5")).toBe(false);
    expect(aggregator.get_rollup("alice")).toBeNull();
  });

  it("rejects invalid or unsafe numeric fields", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.ingest("r1,-1,alice,5")).toBe(false);
    expect(aggregator.ingest("r2,1.5,alice,5")).toBe(false);
    expect(aggregator.ingest("r3,1,alice,2.5")).toBe(false);
    expect(aggregator.ingest("r4,1,alice,5x")).toBe(false);
    expect(
      aggregator.ingest(`r5,${Number.MAX_SAFE_INTEGER + 1},alice,5`),
    ).toBe(false);
    expect(aggregator.get_rollup("alice")).toBeNull();
  });

  it("rejects duplicate IDs without changing rollups", () => {
    const aggregator = new RecordAggregator();
    expect(aggregator.ingest("r1,10,alice,25")).toBe(true);

    expect(aggregator.ingest("r1,20,bob,100")).toBe(false);
    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 25 });
    expect(aggregator.get_rollup("bob")).toBeNull();
  });

  it("does not reserve an ID from a malformed record", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.ingest("r1,bad,alice,25")).toBe(false);
    expect(aggregator.ingest("r1,10,alice,25")).toBe(true);
  });

  it("keeps zero and negative totals", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,0");
    aggregator.ingest("r2,2,bob,-10");

    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 0 });
    expect(aggregator.get_rollup("bob")).toEqual({ count: 1, total: -10 });
  });

  it("returns rollup snapshots rather than mutable internal objects", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,10");
    const rollup = aggregator.get_rollup("alice");
    if (rollup) {
      rollup.count = 999;
      rollup.total = 999;
    }

    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 10 });
  });
});

