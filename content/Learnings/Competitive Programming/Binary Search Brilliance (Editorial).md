---
title: Binary Search Brilliance (Editorial)
tags:
  - competitive-programming
  - binary-search
  - learnings
  - codeforces
  - dp
  - greedy
date: 2025-02-16
---
# Introduction

As a follow-up to our **Binary Search Brilliance** event at **GDG On Campus, VIT Chennai**, we hosted a [**coding contest**](https://codeforces.com/contestInvitation/c79d049cd43c2da9210e8dae6975839cfea8a5a3) featuring problems authored by [Sai Teja](https://www.linkedin.com/in/janakimadhavasaiteja/). The contest challenged participants with a variety of binary search applications. In this editorial, we’ll break down each problem, explaining the optimal approaches and key takeaways to help you refine your **binary search brilliance**. Let’s dive in!

---
# A. Could this be any more easier?

## Problem Understanding

We need to find the **smallest number `x`** in the range `[1, 10^9]` such that **exactly `k` elements** in the given sequence are **less than or equal to `x`**.

If no such `x` exists, we print `-1`.

---
## Approach

### **Step 1: Binary Search on `x`**

We use **binary search** on `x` (the candidate threshold) within the range `[1, 10^9]`.

1. Define a function `nums_less_than(x)`, which counts how many numbers in `arr` are **≤ x**.
2. Perform **binary search** to find the smallest `x` for which `nums_less_than(x) == k`.
    - If `nums_less_than(mid) < k`, increase `low`.
    - Otherwise, decrease `high` and continue searching.
3. **After binary search**, check if `nums_less_than(low) == k` before returning the answer.

---
## Code Implementation

```python
n, k = map(int, input().split())
arr = list(map(int, input().split()))

low = 1
high = 10**9

# Function to count elements <= x
nums_less_than = lambda x: sum(i <= x for i in arr)

# Binary search on x
while low <= high:
    mid = low + (high - low) // 2
    if nums_less_than(mid) < k:
        low = mid + 1
    else:
        high = mid - 1

# Verify if found x is valid
print(low if nums_less_than(low) == k else -1)
```

---
## Complexity Analysis

1. **Binary Search on `x`** → `O(log 10^9) = O(30)`.
2. **Counting `nums_less_than(x)` per iteration** → `O(n)`.
3. **Total Complexity** → `O(n log 10^9) ≈ O(30n)`, which is efficient for `n ≤ 200,000`.

---
# B. Range Query Test (Easy Version)

## Problem Understanding

Sai challenges Akhil with an **array range query problem**, where he must efficiently count how many elements fall within a given range `[l, r]` for multiple queries. Given the constraints (`n, k ≤ 10^5` and `a_i` values spanning `[-10^9, 10^9]`), a brute-force approach iterating through the array for each query would be **too slow** (`O(n * k)`).

To optimize the solution, we **sort the array first** and use **binary search** (via `bisect`) to quickly find the count of elements within any given range in **O(log n) per query**.

---
## Approach

1. **Sort the Array**:
    - Sorting allows us to efficiently determine how many numbers fall within `[l, r]` using **binary search**.
    - Sorting takes **O(n log n)** time.
2. **Use Binary Search (`bisect`) for Efficient Querying**:
    - `bisect_left(arr, l)`: Finds the **first index** where `arr[i] ≥ l`.
    - `bisect_right(arr, r)`: Finds the **first index** where `arr[i] > r`.
    - The count of numbers in `[l, r]` is given by: $\text{count} = \text{bisect\_right}(arr, r) - \text{bisect\_left}(arr, l)$
    - Each query is processed in **O(log n)** time.
3. **Answer all queries efficiently**:
    - We store results in a list and print them all at once (`O(k)`).

---
## Implementation

```python
from bisect import bisect_left as bsl
from bisect import bisect_right as bsr

# Read input
n = int(input())
arr = list(map(int, input().split()))

# Sort the array for binary search
arr.sort()

# Read queries
k = int(input())
ans = []

# Process each query using binary search
for _ in range(k):
    l, r = map(int, input().split())
    left = bsl(arr, l)   # First index where arr[i] >= l
    right = bsr(arr, r)  # First index where arr[i] > r
    ans.append(right - left)  # Count of elements in range

# Output all results efficiently
print(*ans)
```

---
## Complexity Analysis

1. **Sorting the array**: `O(n log n)`.
2. **Binary search for each query**: `O(log n)`, repeated `k` times → **O(k log n)**.
3. **Total complexity**: $O(n \log n) + O(k \log n)$ which is efficient for `n, k ≤ 10^5`.

---
# C. Range Query Test (Hard Version)

## Problem Understanding

Lokesh needs to efficiently process multiple **range frequency queries** on an array. Each query asks how many times a given number `X` appears in a subarray `[L, R]`.

### Observations

- Given constraints (`N, Q ≤ 2 × 10^5`), a **brute-force approach** (`O(N * Q)`) is too slow.
- The values in `A` are limited (`1 ≤ A[i] ≤ N`), allowing us to **precompute occurrences** for fast lookups.
- **Binary search** on **precomputed positions** enables **O(log N) per query**, making the solution feasible.

---
## Approach

### Step 1: **Preprocessing Using a Dictionary**

- Store indices of each number in a **dictionary** `indices`, where `indices[x]` contains all positions where `x` appears. (Note: this can also be done using a 2-D Array)
- **Preprocessing Time Complexity: O(N)**

### Step 2: **Query Processing Using Binary Search**

- For a query `(L, R, X)`, check `indices[X]`:
    - Find the **leftmost index ≥ L** using `bisect_left()`.
    - Find the **rightmost index ≤ R** using `bisect_right()`.
    - The count of occurrences is `right - left`.
- **Each query runs in O(log N)**.

---
## Code Implementation

```python
from bisect import bisect_left as bsl
from bisect import bisect_right as bsr
from collections import defaultdict

# Read input
n = int(input())
arr = list(map(int, input().split()))

# Precompute indices for each unique number
indices = defaultdict(list)
for i in range(n):
    indices[arr[i]].append(i + 1)  # Store 1-based positions

# Process queries
q = int(input())
for _ in range(q):
    l, r, x = map(int, input().split())
    left = bsl(indices[x], l)  # First index where position ≥ L
    right = bsr(indices[x], r)  # First index where position > R
    print(right - left)
```

---
## Complexity Analysis

1. **Preprocessing (Index Storage):** `O(N)`
2. **Binary Search for Each Query:** `O(log N)`
3. **Total Complexity:** `O(N + Q log N)`

---
# D. The Stand User could be anyone!?

## Problem Understanding

Jotaro and the crusaders must defeat enemy **Stand Users**, but they know the IDs of `N` **friendly** Stand Users, given in a sorted list `A`. For each query `K_i`, we must determine the **K_i-th missing enemy Stand User**—that is, the **K_i-th positive integer not present in `A`**.

---
## Observations

1. The array `A` is **sorted** and contains **only unique values**.
    
2. If `A` contained all numbers from `1 to X`, then the `K-th` missing number would be `X + K`.
    
3. Since some numbers are skipped, we define a helper function:
    $\text{nums\_not\_in\_list}(x) = x - \text{count of elements in } A \leq x$
    which gives the count of missing numbers ≤ `x`.
    
4. To **find the K-th missing number**, we must find the smallest `x` such that:
    $\text{nums\_not\_in\_list}(x) = K$
    This can be efficiently found using **binary search**.

---
## Approach

### Step 1: **Binary Search on the Missing Numbers**

- We perform **binary search on `x`** in the range `[1, 10^{18}]`.
- We use `bisect_right(A, x)` to count how many numbers in `A` are ≤ `x`.
- The number of missing numbers up to `x` is: 
	$\text{missing count} = x - \text{bisect\_right}(A, x)$
- If this count is **less than `K`**, move `low` up. Otherwise, move `high` down.
- The first `x` that meets this condition is our answer.

---
## Code Implementation

```python
from bisect import bisect_right as bsr

def find_num(k):
    low, high = 1, 10**18
    while low <= high:
        mid = low + (high - low) // 2
        if mid - bsr(arr, mid) < k:
            low = mid + 1
        else:
            high = mid - 1
    return low

# Read input
n, q = map(int, input().split())
arr = list(map(int, input().split()))

# Process queries
for _ in range(q):
    k = int(input())
    print(find_num(k))
```

---
## Complexity Analysis

1. **Preprocessing (Reading & Sorting)**: `O(N)`.
2. **Binary Search on Range `[1, 10^{18}]`**: `O(log 10^{18}) = O(60)`.
3. **`bisect_right` for each query**: `O(log N)`.
4. **Total Complexity per query**: `O(log 10^{18} + log N) ≈ O(60 + 17) ≈ O(77)`.

---
# E. Pulling a Boeing but on Lifts

## Problem Understanding

We need to determine the **minimum capacity** `C` for an **elevator** that can transport all `N` groups of people **within `D` trips**, while maintaining their **original boarding order**.

Each group's total weight is given in an array `weights`, and a group **must board together** if there is enough space. If the current group cannot fit, it **waits for the next trip**, meaning subsequent groups also wait.

Our goal is to find the **smallest possible `C`** that ensures all groups are transported **in at most `D` trips**.
### Observations

1. **The smallest possible capacity is at least** `max(weights)` because the lift must carry the heaviest group.
2. **The largest possible capacity is** `sum(weights)`, meaning the lift could move everyone in **one trip** if it had unlimited capacity.
3. **The problem is a variation of "capacity scheduling"**, similar to **Binary Search on Answers**, where we find the **minimum feasible capacity**.

---

## Approach

### Step 1: **Binary Search on Possible Capacities**

- Define a function `can_ship(capacity)`, which **simulates** whether the lift can transport all groups **within `D` trips** given a specific `capacity`.
- **Binary search between** `[max(weights), sum(weights)]` to find the **smallest feasible capacity**.

### Step 2: **Simulate Group Loading** (`can_ship(capacity)`)

- Try to transport all groups using a lift of `capacity`.
- If the **current group** cannot fit, start a **new trip** (`days += 1`).
- If we **exceed `D` trips**, return `False`. Otherwise, return `True`.

### Step 3: **Binary Search to Minimize Capacity**

- If `can_ship(mid) == True`, try reducing `mid` (`high = mid - 1`).
- Otherwise, increase `mid` (`low = mid + 1`).
- The **smallest feasible `C`** is our answer.

---
## Code Implementation

```python
def can_ship(capacity):
    days = 1
    current_weight = 0
    for weight in weights:
        if current_weight + weight > capacity:
            days += 1  # Start a new trip
            current_weight = 0
        current_weight += weight
    return days > D  # If more than D trips are needed, return True

# Read input
n, D = map(int, input().split())
weights = list(map(int, input().split()))

# Binary search for the minimum feasible capacity
low, high = max(weights), sum(weights)
while low <= high:
    mid = low + (high - low) // 2
    if can_ship(mid):  # If more than D trips needed, increase capacity
        low = mid + 1
    else:  # Else, try a smaller capacity
        high = mid - 1

# The minimum required capacity
print(low)
```

---
## Complexity Analysis

1. **Binary Search on Capacity Range:** `O(log(sum(weights) - max(weights))) ≈ O(log S)`, where `S = sum(weights)`.
2. **Simulating `can_ship(capacity)`** for each `mid`: `O(N)`.
3. **Total Complexity:** `O(N log S)`, which is efficient for `N ≤ 5 × 10^4`.

---

# F. Magic in Mathara

## Problem Understanding

Grecil and Aadrito need to find the **n-th magical number**, which is any number divisible by **either `a` or `b`**. Since `n` can be as large as **10⁹**, we must **efficiently** determine the n-th such number.

We need to compute the answer **modulo (10⁹ + 7)** to prevent overflow and keep the results manageable.

---
## Observations

1. **Magical Numbers Sequence**
    - The sequence of magical numbers consists of numbers **divisible by `a` or `b`**.
    - Example: If `a = 2`, `b = 3`, the sequence is: `2, 3, 4, 6, 8, 9, 10, 12, 14, 15, ...`
    - We need to efficiently find the **n-th number in this sequence**.
2. **Counting Multiples Efficiently**
    - The number of values `≤ X` that are divisible by `a` or `b` can be found using: 
		$\text{count\_multiples}(X) = \left\lfloor \frac{X}{a} \right\rfloor + \left\lfloor \frac{X}{b} \right\rfloor - \left\lfloor \frac{X}{\text{lcm}(a, b)} \right\rfloor$
    - This formula counts how many numbers are divisible by `a` or `b`, ensuring we do **not double-count** numbers divisible by **both** (i.e., their LCM). This is based on the inclusion-exclusion principle of combinatorics.

---
## Approach

### **Step 1: Binary Search on Answer**

- We know that the **n-th magical number** lies between:
    - **Lower bound:** `min(a, b)`
    - **Upper bound:** `n * min(a, b)`
- Using **binary search**, we find the smallest `X` where: $\text{count\_multiples}(X) \geq n$
- This ensures we find the **exact n-th magical number** efficiently.
### **Step 2: Implement Binary Search**

- Compute `low = min(a, b)` and `high = n * min(a, b)`.
- Use binary search to find the smallest `X` that satisfies `count_multiples(X) >= n`.
- The result should be taken **modulo (10⁹ + 7)**.

---
## Code Implementation

```python
from math import lcm

# Read input
n, a, b = map(int, input().split())

# Binary search boundaries
low, high = min(a, b), n * min(a, b)

# Function to count magical numbers ≤ x
count_multiples = lambda x: (x // a) + (x // b) - (x // lcm(a, b))

# Binary search to find the n-th magical number
while low <= high:
    mid = low + (high - low) // 2
    if count_multiples(mid) < n:
        low = mid + 1
    else:
        high = mid - 1

# Output result modulo 10^9 + 7
print(low % (10**9 + 7))
```

---
## Complexity Analysis

1. **Binary Search on `X`**
    - We search over a range `[min(a, b), n * min(a, b)]`.
    - Since `a, b ≤ 40,000`, the maximum search space is at most **10¹⁴**.
    - Binary search runs in **O(log 10¹⁴) ≈ O(45)** operations.
2. **Computing `count_multiples(X)`**
    - Each call takes **O(1)** time using division and LCM.
3. **Total Complexity**
    - **Binary Search Calls:** `O(log (n * min(a, b)))`
    - **Each Call:** `O(1)`
    - **Final Complexity:** `O(log (n * min(a, b))) ≈ O(45)`, which is **very efficient** for large inputs.

---
*If you have any doubts or suggestions or just want to interact with me, use the comment section below (Refresh if comments don't load)*