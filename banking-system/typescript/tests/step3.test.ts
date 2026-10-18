import { describe, expect, it } from "vitest";

import { BankingSystem } from "../src/banking-system.js";

const DAY = 86_400_000;

function fundedPair(amount = 100): BankingSystem {
  const bank = new BankingSystem();
  bank.create_account(1, "alice");
  bank.create_account(2, "bob");
  bank.deposit(3, "alice", amount);
  return bank;
}

describe("Step 3: transfers", () => {
  it("withholds money and assigns IDs only to successful transfers", () => {
    const bank = fundedPair();

    expect(bank.transfer(4, "missing", "bob", 10)).toBeNull();
    expect(bank.transfer(5, "alice", "missing", 10)).toBeNull();
    expect(bank.transfer(6, "alice", "alice", 10)).toBeNull();
    expect(bank.transfer(7, "alice", "bob", 101)).toBeNull();
    expect(bank.transfer(8, "alice", "bob", 40)).toBe("transfer1");
    expect(bank.deposit(9, "alice", 5)).toBe(65);
    expect(bank.transfer(10, "alice", "bob", 20)).toBe("transfer2");
  });

  it("rejects a negative transfer without changing balances or consuming an ID", () => {
    const bank = fundedPair();

    expect(bank.transfer(4, "alice", "bob", -10)).toBeNull();
    expect(bank.deposit(5, "alice", 1)).toBe(101);
    expect(bank.deposit(6, "bob", 1)).toBe(1);
    expect(bank.transfer(7, "alice", "bob", 10)).toBe("transfer1");
  });

  it("reflects a pending transfer in the destination balance without double-crediting it", () => {
    const bank = fundedPair();
    const id = bank.transfer(4, "alice", "bob", 40);

    expect(bank.deposit(5, "bob", 1)).toBe(41);
    expect(bank.accept_transfer(6, "bob", id!)).toBe(true);
    expect(bank.deposit(7, "bob", 1)).toBe(42);
  });

  it("accepts only for the destination", () => {
    const bank = fundedPair();
    bank.deposit(4, "bob", 5);
    const id = bank.transfer(5, "alice", "bob", 40);

    expect(id).toBe("transfer1");
    expect(bank.accept_transfer(6, "alice", id!)).toBe(false);
    expect(bank.accept_transfer(7, "bob", "transfer999")).toBe(false);
    expect(bank.accept_transfer(8, "bob", id!)).toBe(true);
    expect(bank.accept_transfer(9, "bob", id!)).toBe(false);
    expect(bank.deposit(10, "bob", 1)).toBe(46);
    expect(bank.deposit(11, "alice", 1)).toBe(61);
  });

  it("expires and refunds at the exact 24-hour boundary", () => {
    const bank = fundedPair();
    const createdAt = 10;
    const id = bank.transfer(createdAt, "alice", "bob", 75);

    expect(bank.deposit(createdAt + DAY - 1, "alice", 1)).toBe(26);
    expect(bank.accept_transfer(createdAt + DAY, "bob", id!)).toBe(false);
    expect(bank.deposit(createdAt + DAY + 1, "alice", 1)).toBe(102);
  });

  it("processes refunds before a payment at the expiry timestamp", () => {
    const bank = fundedPair();
    const createdAt = 20;
    bank.transfer(createdAt, "alice", "bob", 100);

    expect(bank.pay(createdAt + DAY, "alice", 30)).toBe(70);
  });

  it("counts only accepted transfers as outgoing", () => {
    const bank = fundedPair(200);
    bank.create_account(4, "carol");
    bank.pay(5, "alice", 20);
    const accepted = bank.transfer(6, "alice", "bob", 50);
    bank.transfer(7, "alice", "carol", 30);

    expect(bank.top_spenders(8, 3)).toEqual([
      "alice(20)",
      "bob(0)",
      "carol(0)",
    ]);

    expect(bank.accept_transfer(9, "bob", accepted!)).toBe(true);
    expect(bank.top_spenders(10, 3)).toEqual([
      "alice(70)",
      "bob(0)",
      "carol(0)",
    ]);

    expect(bank.top_spenders(7 + DAY, 3)).toEqual([
      "alice(70)",
      "bob(0)",
      "carol(0)",
    ]);
    expect(bank.deposit(8 + DAY, "alice", 1)).toBe(131);
  });

  it("keeps separate pending transfers independent", () => {
    const bank = fundedPair(100);
    bank.create_account(4, "carol");
    const toBob = bank.transfer(5, "alice", "bob", 30);
    const toCarol = bank.transfer(6, "alice", "carol", 20);

    expect(bank.accept_transfer(7, "carol", toCarol!)).toBe(true);
    expect(bank.accept_transfer(8, "bob", toBob!)).toBe(true);
    expect(bank.deposit(9, "carol", 1)).toBe(21);
    expect(bank.deposit(10, "bob", 1)).toBe(31);
    expect(bank.deposit(11, "alice", 1)).toBe(51);
    expect(bank.top_spenders(12, 1)).toEqual(["alice(50)"]);
  });

  it("does not let the destination spend a pending credit", () => {
    const bank = fundedPair();
    const id = bank.transfer(4, "alice", "bob", 40);

    expect(bank.pay(5, "bob", 40)).toBeNull();
    expect(bank.transfer(6, "bob", "alice", 40)).toBeNull();
    expect(bank.deposit(7, "bob", 10)).toBe(50);
    expect(bank.pay(8, "bob", 11)).toBeNull();
    expect(bank.pay(9, "bob", 10)).toBe(40);
    expect(bank.accept_transfer(10, "bob", id!)).toBe(true);
    expect(bank.pay(11, "bob", 40)).toBe(0);
    expect(bank.transfer(12, "alice", "bob", 10)).toBe("transfer2");
  });

  it("never leaves a negative balance when a pending credit expires", () => {
    const bank = fundedPair();
    const createdAt = 10;
    bank.transfer(createdAt, "alice", "bob", 75);
    bank.deposit(createdAt + 1, "bob", 5);

    expect(bank.pay(createdAt + 2, "bob", 80)).toBeNull();
    expect(bank.pay(createdAt + 3, "bob", 5)).toBe(75);
    expect(bank.deposit(createdAt + DAY, "bob", 1)).toBe(1);
    expect(bank.deposit(createdAt + DAY + 1, "alice", 1)).toBe(101);
  });
});
