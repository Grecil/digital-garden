---
title: Ternary Mask Dynamic Programming
tags:
  - codeforces
  - competitive-programming
  - dp
  - learnings
  - atcoder
  - leetcode
  - maths
date: 2025-05-18
---

Recently I came across several problems on different platforms that use the seemingly obscure—but actually very intuitive—idea of “Ternary Mask DP.” It’s just like bitmask DP, but instead of each bit representing two states, each digit represents three: 0, 1, or 2. The core idea is simple: convert a number into base 3, so each digit is in {0, 1, 2}. You can generalize this to any k states by using base-k.

Here’s a generalized function that encodes any integer n into an m-digit list in base k. It returns a little‑endian array of integers, but you can easily modify it to produce a string or even pack the digits into a base‑10 integer. Reverse the output if you prefer big‑endian order. (See [Endianness](https://en.wikipedia.org/wiki/Endianness).)

```python
def encode_base_k(n, m, k):
    nums = []
    while n:
        n, r = divmod(n, k)
        nums.append(r)
    return nums + [0] * (m - len(nums))
```

Below are three examples.

**1) [ABC 404 D – Goin’ to the Zoo](https://atcoder.jp/contests/abc404/tasks/abc404_d)**

Since n≤10, we can brute‑force all masks from 0 to 3^n-1. Each ternary digit tells us how many times we visit that zoo (0, 1, or 2). We tally up the total cost and count how many times each animal is seen. If every animal is seen at least twice, we update our answer with the minimum cost.

```python
def ternary(n):
    if n == 0:
        return [0]
    nums = []
    while n:
        n, r = divmod(n, 3)
        nums.append(r)
    return nums

from collections import defaultdict

n, m = map(int, input().split())
costs = list(map(int, input().split()))
zoos_for_animal = [list(map(int, input().split()[1:])) for _ in range(m)]

animals_at_zoo = [[] for _ in range(n)]
for animal, zoos in enumerate(zoos_for_animal):
    for z in zoos:
        animals_at_zoo[z - 1].append(animal)

best = float("inf")
for mask in range(3**n):
    visits = ternary(mask)
    total = 0
    seen = defaultdict(int)
    for i, v in enumerate(visits):
        total += costs[i] * v
        for animal in animals_at_zoo[i]:
            seen[animal] += v
    if len(seen) == m and all(cnt >= 2 for cnt in seen.values()):
        best = min(best, total)

print(best)
```

**2) [LC 1931 – Painting a Grid With Three Different Colors](https://leetcode.com/problems/painting-a-grid-with-three-different-colors)**

We encode each row of length m as a base‑3 mask, where digits 0, 1, 2 represent the three colors. First, we generate all valid masks (no two adjacent cells share the same color) and initialize `dp[mask] = 1` for those. Next, we precompute which pairs of valid masks can go one above the other (no matching digits in any column). Finally, we iterate through the n rows: for each mask j, we sum over all compatible previous masks k, updating a new DP state. After n steps, the sum of `dp` values gives the total number of valid colorings modulo 10^9+7.

```python
from functools import cache
from collections import defaultdict

class Solution:
    def colorTheGrid(self, m: int, n: int) -> int:
        mod = 10**9 + 7

        @cache
        def ternary(mask):
            nums = []
            x = mask
            while x:
                x, r = divmod(x, 3)
                nums.append(r)
            return nums + [0] * (m - len(nums))

        # 1. Find all valid row masks.
        dp = defaultdict(int)
        for mask in range(3**m):
            row = ternary(mask)
            if all(row[i] != row[i+1] for i in range(m-1)):
                dp[mask] = 1

        # 2. Precompute valid transitions.
        valid = list(dp.keys())
        transitions = {mask: [] for mask in valid}
        for a in valid:
            ra = ternary(a)
            for b in valid:
                rb = ternary(b)
                if all(ra[i] != rb[i] for i in range(m)):
                    transitions[a].append(b)

        # 3. DP over rows.
        for _ in range(n-1):
            new_dp = defaultdict(int)
            for prev_mask, ways in dp.items():
                for nxt in transitions[prev_mask]:
                    new_dp[nxt] = (new_dp[nxt] + ways) % mod
            dp = new_dp

        return sum(dp.values()) % mod
```

**3) [CF Gym 104493 A - Gym Plates](https://codeforces.com/gym/104493/problem/A)

We treat each decimal digit’s count (0–2) as a ternary digit and keep a DP over masks $(0..3^{10}-1)$. For each weight we build `cur`, a decimal number whose digit (d) is the count of digit (d) in that weight and use `encode` to convert a DP mask into the same decimal-digit format so we can add them component wise. If `valid(tot)` (no digit >2) we `decode` back to a ternary mask and relax `dp[new_mask] = max(...)`; iterating masks in descending order makes it a 0/1 choice for each weight.

```python
from functools import cache

@cache
def encode(x):
    num, i = 0, 1
    while x:
        x, r = divmod(x, 3)
        num += i * r
        i *= 10
    return num

@cache
def decode(num):
    x = i = 0
    while num:
        x += (num % 10) * (3**i)
        num //= 10
        i += 1
    return x

@cache
def valid(x):
    while x:
        if x % 10 > 2:
            return False
        x //= 10
    return True

for _ in range(int(input())):
    n = int(input())
    w = [*map(int, input().split())]
    
    dp = [-1] * (3**10)
    dp[0] = 0
    
    for wi in w:
        cur, x = 0, wi
        while x:
            cur += 10 ** (x % 10)
            x //= 10
        if not valid(cur):
            continue
        for i in range(3**10 - 1, -1, -1):
            if dp[i] != -1:
                tot = cur + encode(i)
                if not valid(tot):
                    continue      
                j = decode(tot)
                dp[j] = max(dp[j], dp[i] + wi)
                
    print(max(dp))
```

Ternary (and, more generally, base‑k) mask DP lets you pack multi‑state decisions into a single integer, iterate cleanly over all possibilities, and handle compatibility with simple digit‑by‑digit checks. It’s a powerful pattern for grids, colorings, tilings, and any situation where each element has a few discrete states.

---
*If you have any doubts or suggestions or just want to interact with me, use the comment section below (Refresh if comments don't load)*