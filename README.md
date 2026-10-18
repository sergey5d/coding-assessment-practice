# Coding Assessment Practice

A collection of practice exercises modeled on the kinds of coding assessments used by software companies: live coding rounds and progressive multi-step assessments such as CodeSignal's.

## Disclaimer

- **Nothing here is secret.** Every exercise is based on publicly available knowledge about common interview themes. None of it reproduces confidential interview material or an official question from any company.
- **The code is AI-generated** and comes with no guarantee that everything is correct. The specs, tests and scripts have been checked, but treat them as practice material and not as an authoritative answer key. If a test and a spec disagree, trust your own reasoning.

## The approach matters more than the exercises

The most important thing in this repository is not the examples. It is the way of preparing: **the company, its likely problems, and your own work.** The exercises here are just samples of that process.

1. **Research the company.** Find out what its assessment looks like: the format, the time limit, the language, and the topics it tends to cover.
2. **Work out the likely problems.** Collect the problem types that come up for that company and role. If an exercise here matches, use it. If not, ask an AI assistant to generate one in the same shape: a spec split into steps, a starter stub and tests, with no solution.
3. **Do the work yourself.** Start a timer and solve it step by step without looking ahead or asking AI for the answer. The goal is not to memorize a solution, but to have solved the problem once yourself, so that when a similar question comes up you already know the right approach and have practiced applying it under time pressure.
4. **Review and repeat.** Note what slowed you down and which modeling decisions mattered, then move on to the next exercise.

**If your target language is different,** ask an AI assistant to port an exercise: give it the step files and tests and ask for an empty starter stub plus equivalent tests in your language. Interview in the language you'll actually use.

## Where to start

**Do [`rate-limiting`](rate-limiting/typescript) first.** Rate limiters come up frequently in interviews, and the exercise covers the four classic algorithms in one sitting.

**If you're preparing for CodeSignal specifically,** do at least a few of the other TypeScript exercises too. They follow the same progressive format: four cumulative steps in about 90 minutes, where each step extends the same class with new requirements.

## Exercises

Each exercise has four steps, takes about 90 minutes and contains its own README with rules, commands and conventions. Exercises ship with an empty starter stub and tests only; no solutions are included. Read only the README and `step1.md` before you start, and reveal later steps one at a time.

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
