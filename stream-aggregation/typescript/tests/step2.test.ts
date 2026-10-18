import { describe, expect, it } from "vitest";

import { RecordAggregator } from "../src/record-aggregator.js";

describe("Step 2: ordered rollups and top N", () => {
  it("sorts all rollups by total descending", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,bob,50");
    aggregator.ingest("r3,3,carol,30");

    expect(aggregator.all_rollups()).toEqual([
      "bob(1,50)",
      "carol(1,30)",
      "alice(1,20)",
    ]);
  });

  it("breaks equal-total ties by key ascending", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,zoe,20");
    aggregator.ingest("r2,2,amy,20");
    aggregator.ingest("r3,3,mike,20");

    expect(aggregator.all_rollups()).toEqual([
      "amy(1,20)",
      "mike(1,20)",
      "zoe(1,20)",
    ]);
  });

  it("formats aggregated counts and totals", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,alice,-5");

    expect(aggregator.all_rollups()).toEqual(["alice(2,15)"]);
  });

  it("returns only the requested top entries", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,bob,50");
    aggregator.ingest("r3,3,carol,30");

    expect(aggregator.top_n(2)).toEqual(["bob(1,50)", "carol(1,30)"]);
    expect(aggregator.top_n(10)).toEqual(aggregator.all_rollups());
  });

  it("returns an empty list for a non-positive n or no data", () => {
    const aggregator = new RecordAggregator();

    expect(aggregator.top_n(3)).toEqual([]);
    aggregator.ingest("r1,1,alice,20");
    expect(aggregator.top_n(0)).toEqual([]);
    expect(aggregator.top_n(-1)).toEqual([]);
  });

  it("keeps zero-total keys and orders negative totals numerically", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,zero,0");
    aggregator.ingest("r2,2,less,-20");
    aggregator.ingest("r3,3,more,-5");

    expect(aggregator.all_rollups()).toEqual([
      "zero(1,0)",
      "more(1,-5)",
      "less(1,-20)",
    ]);
  });

  it("reflects records ingested after an earlier sorted query", () => {
    const aggregator = new RecordAggregator();
    aggregator.ingest("r1,1,alice,20");
    aggregator.ingest("r2,2,bob,10");
    expect(aggregator.top_n(1)).toEqual(["alice(1,20)"]);

    aggregator.ingest("r3,3,bob,20");

    expect(aggregator.top_n(1)).toEqual(["bob(2,30)"]);
  });
});

