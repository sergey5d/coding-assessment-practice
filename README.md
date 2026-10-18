# Coding Assessment Practice

A collection of practice exercises modeled on the kinds of coding assessments used by software companies: live coding rounds and progressive multi-step assessments such as CodeSignal's.

## Disclaimer

- **Nothing here is secret.** Every exercise is based on publicly available knowledge about common interview themes. None of it reproduces confidential interview material or an official question from any company.
- **The code is AI-generated** and comes with no guarantee that everything is correct. The specs, tests and scripts have been checked, but treat them as practice material and not as an authoritative answer key. If a test and a spec disagree, trust your own reasoning.

## How to use these exercises

The goal is not to memorize solutions. It is to have already solved the problem once yourself, so that when a similar question comes up, you know the right approach and have practiced applying it under time pressure.

1. **Research the company.** Find out what its assessment looks like: the format, the time limit, the language, and the topics it tends to cover.
2. **Code the solution yourself.** Pick a matching exercise, start a timer and work through it step by step without looking ahead. Each exercise ships with an empty stub and tests only; no solutions are included.
3. **Train the approach, not the answer.** Afterwards, review what slowed you down and which modeling decisions mattered, then repeat with another exercise.

Different companies use different assessments. If none of these fit the company you're targeting, research its process and ask an AI assistant to generate a similar exercise (a spec split into steps, a starter stub and tests) so you can prepare the same way.

## Where to start

**Do [`rate-limiting`](rate-limiting/typescript) first.** Rate limiters come up frequently in interviews, and the exercise covers the four classic algorithms in one sitting.

**If you're preparing for CodeSignal specifically,** do at least a few of the other TypeScript exercises too. They follow the same progressive format: four cumulative steps in about 90 minutes, where each step extends the same class with new requirements.

## Exercises

Each exercise has four steps, takes about 90 minutes and contains its own README with rules, commands and conventions. Read only the README and `step1.md` before you start, and reveal later steps one at a time.

| Exercise | Language | Topics |
|---|---|---|
| [`rate-limiting`](rate-limiting/typescript) | TypeScript | Fixed window, sliding window, leaky bucket, token bucket |
| [`banking-system`](banking-system/typescript) | TypeScript | Accounts, top spenders, expiring transfers, account merging |
| [`cache-strategies`](cache-strategies/typescript) | TypeScript | LRU, LFU, TTL, TTL with LRU eviction |
| [`cloud-storage`](cloud-storage/typescript) | TypeScript | Files, prefix search, per-user capacity, compression |
| [`memory-database`](memory-database/typescript) | TypeScript | Records, scanning, timestamped TTL fields, backup and restore |
| [`stream-aggregation`](stream-aggregation/typescript) | TypeScript, [Lume](stream-aggregation/lume) | Record parsing, rollups, ranking, voided records, time ranges |
| [`worker-time-tracking`](worker-time-tracking/typescript) | TypeScript, [Lume](worker-time-tracking/lume) | Work sessions, rankings, delayed promotions, salary, overtime |
| [`concurrency`](concurrency/java) | Java | Counter map, bounded blocking queue, thread-safe LRU, single-flight cache |

The Java exercise includes a `discussion.md` with follow-up questions for practicing the verbal part of an interview.

## Requirements

- **TypeScript:** Node.js 20 or newer. Run `npm install` inside the exercise folder.
- **Java:** JDK 17 or newer.
- **Lume:** the `lume` interpreter on your `PATH`, or set `LUME_BIN` to its path.

Test failures are expected at the start of every exercise, because the starter code is intentionally empty.
