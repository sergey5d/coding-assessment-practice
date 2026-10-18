import { describe, expect, it } from "vitest";

import { BankingSystem } from "../src/banking-system.js";

describe("Step 2: top spenders", () => {
  it("orders accounts by successful outgoing amount", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "alice");
    bank.create_account(2, "bob");
    bank.create_account(3, "carol");
    bank.deposit(4, "alice", 100);
    bank.deposit(5, "bob", 100);
    bank.deposit(6, "carol", 100);
    bank.pay(7, "alice", 30);
    bank.pay(8, "bob", 70);
    bank.pay(9, "carol", 50);

    expect(bank.top_spenders(10, 3)).toEqual([
      "bob(70)",
      "carol(50)",
      "alice(30)",
    ]);
  });

  it("accumulates multiple payments", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "alice");
    bank.deposit(2, "alice", 100);
    bank.pay(3, "alice", 10);
    bank.pay(4, "alice", 25);

    expect(bank.top_spenders(5, 1)).toEqual(["alice(35)"]);
  });

  it("breaks ties by account ID", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "zoe");
    bank.create_account(2, "amy");
    bank.create_account(3, "max");
    bank.deposit(4, "zoe", 20);
    bank.deposit(5, "amy", 20);
    bank.deposit(6, "max", 20);
    bank.pay(7, "zoe", 5);
    bank.pay(8, "amy", 5);
    bank.pay(9, "max", 5);

    expect(bank.top_spenders(10, 3)).toEqual([
      "amy(5)",
      "max(5)",
      "zoe(5)",
    ]);
  });

  it("does not count failed payments", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "alice");
    bank.create_account(2, "bob");
    bank.deposit(3, "alice", 10);
    bank.deposit(4, "bob", 10);
    bank.pay(5, "alice", 11);
    bank.pay(6, "bob", 1);

    expect(bank.top_spenders(7, 2)).toEqual(["bob(1)", "alice(0)"]);
  });

  it("limits results, includes zero spenders, and handles non-positive n", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "bravo");
    bank.create_account(2, "alpha");
    bank.create_account(3, "charlie");

    expect(bank.top_spenders(4, 2)).toEqual(["alpha(0)", "bravo(0)"]);
    expect(bank.top_spenders(5, 10)).toEqual([
      "alpha(0)",
      "bravo(0)",
      "charlie(0)",
    ]);
    expect(bank.top_spenders(6, 0)).toEqual([]);
    expect(bank.top_spenders(7, -1)).toEqual([]);
  });
});
