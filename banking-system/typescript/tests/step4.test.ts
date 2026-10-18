import { describe, expect, it } from "vitest";

import { BankingSystem } from "../src/banking-system.js";

const DAY = 86_400_000;

function threeAccounts(): BankingSystem {
  const bank = new BankingSystem();
  bank.create_account(1, "alice");
  bank.create_account(2, "bob");
  bank.create_account(3, "carol");
  return bank;
}

describe("Step 4: merge accounts", () => {
  it("combines balances and removes the secondary account", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 100);
    bank.deposit(5, "bob", 50);

    expect(bank.merge_accounts(6, "alice", "bob")).toBe(true);
    expect(bank.deposit(7, "alice", 10)).toBe(160);
    expect(bank.deposit(8, "bob", 10)).toBeNull();
    expect(bank.pay(9, "bob", 1)).toBeNull();
  });

  it("rejects invalid merges without changing balances", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 10);
    bank.deposit(5, "bob", 20);

    expect(bank.merge_accounts(6, "alice", "alice")).toBe(false);
    expect(bank.merge_accounts(7, "alice", "missing")).toBe(false);
    expect(bank.merge_accounts(8, "missing", "bob")).toBe(false);
    expect(bank.deposit(9, "alice", 1)).toBe(11);
    expect(bank.deposit(10, "bob", 1)).toBe(21);
  });

  it("combines outgoing histories and omits the removed account", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 100);
    bank.deposit(5, "bob", 100);
    bank.pay(6, "alice", 30);
    bank.pay(7, "bob", 20);

    expect(bank.merge_accounts(8, "alice", "bob")).toBe(true);
    expect(bank.top_spenders(9, 3)).toEqual(["alice(50)", "carol(0)"]);
  });

  it("preserves completed transfer spending when histories merge", () => {
    const bank = threeAccounts();
    bank.deposit(4, "bob", 80);
    const id = bank.transfer(5, "bob", "carol", 35);
    expect(bank.accept_transfer(6, "carol", id!)).toBe(true);

    expect(bank.merge_accounts(7, "alice", "bob")).toBe(true);
    expect(bank.top_spenders(8, 3)).toEqual(["alice(35)", "carol(0)"]);
  });

  it("preserves a completed transfer from the primary to the secondary", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 100);
    const id = bank.transfer(5, "alice", "bob", 30);
    expect(bank.accept_transfer(6, "bob", id!)).toBe(true);

    expect(bank.merge_accounts(7, "alice", "bob")).toBe(true);
    expect(bank.deposit(8, "alice", 1)).toBe(101);
    expect(bank.top_spenders(9, 2)).toEqual(["alice(30)", "carol(0)"]);
  });

  it("preserves a completed transfer from the secondary to the primary", () => {
    const bank = threeAccounts();
    bank.deposit(4, "bob", 100);
    const id = bank.transfer(5, "bob", "alice", 30);
    expect(bank.accept_transfer(6, "alice", id!)).toBe(true);

    expect(bank.merge_accounts(7, "alice", "bob")).toBe(true);
    expect(bank.deposit(8, "alice", 1)).toBe(101);
    expect(bank.top_spenders(9, 2)).toEqual(["alice(30)", "carol(0)"]);
  });

  it("cancels outgoing pending transfers from the secondary and merges the refund", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 10);
    bank.deposit(5, "bob", 100);
    const id = bank.transfer(6, "bob", "carol", 60);

    expect(bank.merge_accounts(7, "alice", "bob")).toBe(true);
    expect(bank.deposit(8, "alice", 1)).toBe(111);
    expect(bank.accept_transfer(9, "carol", id!)).toBe(false);
    expect(bank.top_spenders(10, 2)).toEqual(["alice(0)", "carol(0)"]);
  });

  it("redirects transfers from other accounts into the secondary", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 10);
    bank.deposit(5, "bob", 20);
    bank.deposit(6, "carol", 100);
    const id = bank.transfer(7, "carol", "bob", 30);

    expect(bank.merge_accounts(8, "alice", "bob")).toBe(true);
    expect(bank.accept_transfer(9, "alice", id!)).toBe(true);
    expect(bank.deposit(10, "alice", 1)).toBe(61);
    expect(bank.deposit(11, "carol", 1)).toBe(71);
    expect(bank.top_spenders(12, 2)).toEqual(["carol(30)", "alice(0)"]);
  });

  it("does not let the primary spend a redirected pending credit", () => {
    const bank = threeAccounts();
    bank.deposit(4, "carol", 100);
    const id = bank.transfer(5, "carol", "bob", 30);

    expect(bank.merge_accounts(6, "alice", "bob")).toBe(true);
    expect(bank.pay(7, "alice", 30)).toBeNull();
    expect(bank.deposit(8, "alice", 1)).toBe(31);
    expect(bank.accept_transfer(9, "alice", id!)).toBe(true);
    expect(bank.pay(10, "alice", 31)).toBe(0);
  });

  it("cancels a pending transfer from the primary to the secondary", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 100);
    bank.deposit(5, "bob", 20);
    const id = bank.transfer(6, "alice", "bob", 30);

    expect(bank.merge_accounts(7, "alice", "bob")).toBe(true);
    expect(bank.accept_transfer(8, "alice", id!)).toBe(false);
    expect(bank.deposit(9, "alice", 1)).toBe(121);
  });

  it("processes expiry before merging", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 10);
    bank.deposit(5, "bob", 100);
    const id = bank.transfer(6, "bob", "carol", 80);

    expect(bank.merge_accounts(6 + DAY, "alice", "bob")).toBe(true);
    expect(bank.deposit(7 + DAY, "alice", 1)).toBe(111);
    expect(bank.deposit(8 + DAY, "carol", 1)).toBe(1);
    expect(bank.accept_transfer(9 + DAY, "carol", id!)).toBe(false);
  });

  it("redirects an inbound transfer when merging just before it expires", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 10);
    bank.deposit(5, "bob", 20);
    bank.deposit(6, "carol", 100);
    const createdAt = 7;
    const id = bank.transfer(createdAt, "carol", "bob", 30);

    expect(bank.merge_accounts(createdAt + DAY - 2, "alice", "bob")).toBe(true);
    expect(bank.accept_transfer(createdAt + DAY - 1, "alice", id!)).toBe(true);
    expect(bank.deposit(createdAt + DAY, "alice", 1)).toBe(61);
    expect(bank.top_spenders(createdAt + DAY + 1, 2)).toEqual([
      "carol(30)",
      "alice(0)",
    ]);
  });

  it("expires an inbound transfer before merging at the exact deadline", () => {
    const bank = threeAccounts();
    bank.deposit(4, "alice", 10);
    bank.deposit(5, "bob", 20);
    bank.deposit(6, "carol", 100);
    const createdAt = 7;
    const id = bank.transfer(createdAt, "carol", "bob", 30);

    expect(bank.merge_accounts(createdAt + DAY, "alice", "bob")).toBe(true);
    expect(bank.accept_transfer(createdAt + DAY + 1, "alice", id!)).toBe(false);
    expect(bank.deposit(createdAt + DAY + 2, "alice", 1)).toBe(31);
    expect(bank.deposit(createdAt + DAY + 3, "carol", 1)).toBe(101);
    expect(bank.top_spenders(createdAt + DAY + 4, 2)).toEqual([
      "alice(0)",
      "carol(0)",
    ]);
  });

  it("leaves unrelated pending transfers unchanged", () => {
    const bank = threeAccounts();
    bank.create_account(4, "dave");
    bank.deposit(5, "carol", 50);
    const id = bank.transfer(6, "carol", "dave", 20);

    expect(bank.merge_accounts(7, "alice", "bob")).toBe(true);
    expect(bank.accept_transfer(8, "dave", id!)).toBe(true);
    expect(bank.deposit(9, "dave", 1)).toBe(21);
    expect(bank.top_spenders(10, 3)).toEqual([
      "carol(20)",
      "alice(0)",
      "dave(0)",
    ]);
  });
});
