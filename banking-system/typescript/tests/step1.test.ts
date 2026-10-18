import { describe, expect, it } from "vitest";

import { BankingSystem } from "../src/banking-system.js";

describe("Step 1: basic accounts", () => {
  it("creates accounts and rejects duplicate IDs", () => {
    const bank = new BankingSystem();

    expect(bank.create_account(1, "alice")).toBe(true);
    expect(bank.create_account(2, "alice")).toBe(false);
    expect(bank.deposit(3, "alice", 1)).toBe(1);
  });

  it("deposits money and returns the new balance", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "alice");

    expect(bank.deposit(2, "alice", 40)).toBe(40);
    expect(bank.deposit(3, "alice", 2)).toBe(42);
  });

  it("pays when funds are available, including the exact balance", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "alice");
    bank.deposit(2, "alice", 50);

    expect(bank.pay(3, "alice", 20)).toBe(30);
    expect(bank.pay(4, "alice", 30)).toBe(0);
  });

  it("rejects operations on missing accounts", () => {
    const bank = new BankingSystem();

    expect(bank.deposit(1, "missing", 10)).toBeNull();
    expect(bank.pay(2, "missing", 10)).toBeNull();
  });

  it("rejects an unaffordable payment without changing the balance", () => {
    const bank = new BankingSystem();
    bank.create_account(1, "alice");
    bank.deposit(2, "alice", 25);

    expect(bank.pay(3, "alice", 26)).toBeNull();
    expect(bank.deposit(4, "alice", 1)).toBe(26);
  });

});
