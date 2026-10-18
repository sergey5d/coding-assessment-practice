import { describe, expect, it } from "vitest";

import { RecordAggregator } from "../src/record-aggregator.js";

describe("Step 4: time-range top N", () => {
  it("aggregates records inside the requested range", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,10,alice,20");
    aggregator.ingest("r2,15,alice,30");
    aggregator.ingest("r3,18,bob,40");

    expect(aggregator.top_n_in_range(10, 20, 10)).toEqual([
      "alice(2,50)",
      "bob(1,40)",
    ]);
  });

  it("uses half-open range boundaries", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,9,before,100");
    aggregator.ingest("r2,10,start,20");
    aggregator.ingest("r3,19,inside,30");
    aggregator.ingest("r4,20,end,200");

    expect(aggregator.top_n_in_range(10, 20, 10)).toEqual([
      "inside(1,30)",
      "start(1,20)",
    ]);
  });

  it("sorts range totals descending and ties by key", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,zoe,20");
    aggregator.ingest("r2,2,amy,20");
    aggregator.ingest("r3,3,bob,50");

    expect(aggregator.top_n_in_range(0, 10, 3)).toEqual([
      "bob(1,50)",
      "amy(1,20)",
      "zoe(1,20)",
    ]);
  });

  it("limits the number of range results", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,10");
    aggregator.ingest("r2,2,bob,20");
    aggregator.ingest("r3,3,carol,30");

    expect(aggregator.top_n_in_range(0, 10, 2)).toEqual([
      "carol(1,30)",
      "bob(1,20)",
    ]);
  });

  it("excludes voided records", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,10,alice,100");
    aggregator.ingest("r2,11,alice,-20");
    aggregator.ingest("r3,12,bob,50");
    aggregator.void_record("r1");

    expect(aggregator.top_n_in_range(0, 20, 10)).toEqual([
      "bob(1,50)",
      "alice(1,-20)",
    ]);
  });

  it("works with out-of-order ingestion", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,100,later,50");
    aggregator.ingest("r2,10,earlier,30");
    aggregator.ingest("r3,50,middle,40");

    expect(aggregator.top_n_in_range(0, 60, 10)).toEqual([
      "middle(1,40)",
      "earlier(1,30)",
    ]);
  });

  it("includes zero-total keys that have records in the range", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,zero,10");
    aggregator.ingest("r2,2,zero,-10");
    aggregator.ingest("r3,3,negative,-1");

    expect(aggregator.top_n_in_range(0, 10, 10)).toEqual([
      "zero(2,0)",
      "negative(1,-1)",
    ]);
  });

  it("returns empty for invalid limits and empty or reversed ranges", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,10,alice,20");

    expect(aggregator.top_n_in_range(0, 20, 0)).toEqual([]);
    expect(aggregator.top_n_in_range(10, 10, 5)).toEqual([]);
    expect(aggregator.top_n_in_range(20, 10, 5)).toEqual([]);
    expect(aggregator.top_n_in_range(30, 40, 5)).toEqual([]);
  });

  it("does not count a rejected duplicate", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,10,alice,20");
    expect(aggregator.ingest("r1,11,alice,100")).toBe(false);

    expect(aggregator.top_n_in_range(0, 20, 10)).toEqual([
      "alice(1,20)",
    ]);
  });
});
