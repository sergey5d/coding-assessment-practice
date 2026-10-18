# Concurrency follow-up prompts

Use these after completing the code. Explain decisions and trade-offs without changing the implementation first.

1. Which operations in each class are linearizable, and where is their linearization point?
2. What happens-before relationship makes one thread's update visible to another?
3. Why is a thread-safe collection alone insufficient for some compound read-modify-write operations?
4. Why must condition waits use a loop rather than an `if` statement?
5. When is `signal` sufficient, and when might `signalAll` be safer?
6. How can inconsistent lock ordering create deadlock? How would you detect it in a running JVM?
7. What are the throughput and latency trade-offs of a fair `ReentrantLock`?
8. Where does the LRU cache's lock become a scalability bottleneck? What semantics would change if the cache were sharded?
9. Why is invoking a loader while holding a global cache lock dangerous?
10. How should cancellation differ from interruption and loader failure in the single-flight cache?
11. How could an ABA-style race appear around invalidation and an in-flight load?
12. What additional problems appear if the single-flight cache becomes distributed across JVMs?
13. When would virtual threads help these classes, and what contention would they not solve?
14. How would you measure contention, queueing delay, blocked-thread time, and cache stampedes in production?

