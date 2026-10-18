import { describe, expect, it } from "vitest";

import { RecordAggregator } from "../src/record-aggregator.js";

describe("Step 3: void records", () => {
  it("removes exactly one record's contribution", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,alice,30");

    expect(aggregator.void_record("r1")).toBe(true);
    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 30 });
  });

  it("rejects unknown and already voided IDs", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");

    expect(aggregator.void_record("missing")).toBe(false);
    expect(aggregator.void_record("r1")).toBe(true);
    expect(aggregator.void_record("r1")).toBe(false);
  });

  it("removes a key when its final record is voided", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");

    expect(aggregator.void_record("r1")).toBe(true);
    expect(aggregator.get_rollup("alice")).toBeNull();
    expect(aggregator.all_rollups()).toEqual([]);
  });

  it("keeps voided record IDs reserved", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.void_record("r1");

    expect(aggregator.ingest("r1,2,bob,100")).toBe(false);
    expect(aggregator.get_rollup("bob")).toBeNull();
  });

  it("reverses signed amounts correctly", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,alice,-7");

    expect(aggregator.void_record("r2")).toBe(true);
    expect(aggregator.get_rollup("alice")).toEqual({ count: 1, total: 20 });
  });

  it("updates ordering and top-N results immediately", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,100");
    aggregator.ingest("r2,2,alice,-80");
    aggregator.ingest("r3,3,bob,50");
    expect(aggregator.top_n(1)).toEqual(["bob(1,50)"]);

    aggregator.void_record("r2");

    expect(aggregator.top_n(1)).toEqual(["alice(1,100)"]);
  });

  it("does not affect other keys", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,bob,30");

    aggregator.void_record("r1");

    expect(aggregator.get_rollup("alice")).toBeNull();
    expect(aggregator.get_rollup("bob")).toEqual({ count: 1, total: 30 });
  });
});

