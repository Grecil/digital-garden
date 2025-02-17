---
title: Binary Search Brilliance (Seminar)
tags:
  - competitive-programming
  - binary-search
  - learnings
  - codeforces
  - cses
  - dp
---
# Introduction

Me and [Sai Teja](https://www.linkedin.com/in/janakimadhavasaiteja/) recently conducted an event on [**Binary Search Brilliance** at **GDG On Campus, VIT Chennai**](https://gdg.community.dev/events/details/google-gdg-on-campus-vellore-institute-of-technology-chennai-india-presents-binary-search-brilliance-1/). It was an insightful session where we explored the depths of binary search, its applications, and advanced techniques beyond the basic implementation. In this blog post, I will summarize the key takeaways from our session, including theoretical concepts, real-world applications, and problem-solving techniques.

# Definition

Binary search is an algorithm used to find a target value 𝑇 in the domain of a monotonic function 𝑓(𝑥) by iteratively narrowing down the search interval by half. A monotonic function is a function that either increases or decreases consistently across its entire domain.

# Pseudocode

```
left = Lower Limit of Function
right = Upper Limit of Function

while (left <= right) { 
	mid = left + (right - left) / 2 
	if (check(mid)) { 
		left = mid + 1 
	}
	else { 
		right = mid - 1 
	} 
}
```

# Is it even useful?

Excerpt from a [news report](https://www.thetimes.com/article/i-have-owned-11-bikes-this-is-how-they-were-stolen-d3r553gx3) on increasing bike theft incidents, where a computer scientist tried explaining binary search to a cop - 

“Afterwards I found a chatroom thread among Cambridge computer scientists, one of whom had also been told that unless he could pin down the moment of theft no one would look at the footage. He said he had tried to explain sorting algorithms to police — he was a computer scientist, after all. You don’t watch the whole thing, he said. You use a binary search. You fast forward to halfway, see if the bike is there and, if it is, zoom to three quarters of the way through. But if it wasn’t there at the halfway mark, you rewind to a quarter of the way through. It’s very quick. In fact, he had pointed out, if the CCTV footage stretched back to the dawn of humanity it would probably have only taken an hour to find the moment of theft. This argument didn’t go down well.”

# 1-D Binary Search

## Boundaries

- Upper Bound - First index where the element is strictly greater than target value T.

```python
def upper_bound(arr, target):
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid

    return left
```

- Lower Bound - First index where the element is greater than or equal to target value T.

```python
def lower_bound(arr, target):
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left
```

## Ternary Search

Ternary Search is a search algorithm used to find the maximum or minimum of a unimodal function (a function that increases up to a single peak or decreases up to a single trough and then decreases or increases). It works by dividing the search range into three parts instead of two (as in binary search) and iteratively narrowing the range containing the extremum. A unimodal function has exactly one local extremum (maximum or minimum) in a given interval, with the function being monotonic on either side of that extremum.

```python
n = int(input())
arr = list(map(int, input().split()))

left = 0
right = n - 1

while right - left >= 3:
    # Divide array into three parts
    mid1 = left + (right - left) // 3
    mid2 = right - (right - left) // 3

    # Compare values at mid points
    if arr[mid1] > arr[mid2]:
        # Peak lies in left segment
        right = mid2
    else:
        # Peak lies in right segment
        left = mid1

# Find maximum in remaining small segment
peak = max(arr[left : right + 1])
print(peak)
```

# 2-D Binary Search

## [Multiplication Table](https://codeforces.com/problemset/problem/448/D)

You are given an 𝑛×𝑚 multiplication table, where the value at the intersection of the 𝑖-th row and 𝑗-th column is 𝑖⋅𝑗 (with rows and columns numbered starting from 1). Your task is to determine the 𝑘-th largest number in this table. The 𝑘-th largest number is defined as the 𝑘-th element when all 𝑛⋅𝑚 numbers in the table are sorted in non-decreasing order. (1 ≤ n, m ≤ 5·(10^5); 1 ≤ k ≤ n·m)

For **N = 4**, **M = 6**,  **K = 13**

| 1   | 2   | 3   | 4           | 5   | 6   |
| --- | --- | --- | ----------- | --- | --- |
| 2   | 4   | 6   | **\| 8 \|** | 10  | 12  |
| 3   | 6   | 9   | 12          | 15  | 18  |
| 4   | 8   | 12  | 16          | 20  | 24  |

```python
n, m, k = map(int, input().split())

low, high = 1, n * m
while low < high:
    mid = (low + high) // 2
    count = 0
    # For each row i, count numbers <= mid by taking min of: column count (m) or mid/i
    for i in range(1, n + 1):
        count += min(m, mid // i)
    # If we haven't found k numbers yet, search upper half; otherwise search lower half
    if count < k:
        low = mid + 1
    else:
        high = mid

print(low)
```

# Binary Search on Answers (BSOA)

## [Factory Machines](https://cses.fi/problemset/task/1620)

A factory has n machines which can be used to make products. Your goal is to make a total of t products. For each machine, you know the number of seconds it needs to make a single product. The machines can work simultaneously, and you can freely decide their schedule. What is the shortest time needed to make t products? (1 ≤ n ≤ 2·(10^5); 1 ≤ t ≤ 10^9; 1 ≤ ki ≤ 2·(10^5))

For **N = 3**, **T = 7**, **Machines = `[3, 2, 5]`**  

**Days Required – 8** 

**MACHINE 1** – 2 Products Produced *(Day 3, Day 6)*  

**MACHINE 2** – 4 Products Produced *(Day 2, Day 4, Day 6, Day 8)*  

**MACHINE 3** – 1 Product Produced *(Day 5)*

```python
_, goal = map(int, input().split())
machines = list(map(int, input().split()))

lo = 1
hi = int(1e9)
ans = 0
while lo <= hi:
    mid = (lo + hi) // 2
    # Calculate total items produced by all machines in 'mid' time
    n_produced = 0
    for machine in machines:
        n_produced += mid // machine
        # If we can produce enough items, try to minimize time
    if n_produced >= goal:
        ans = mid
        hi = mid - 1
    # If we can't produce enough, need more time
    else:
        lo = mid + 1
print(ans)
```

## [Aggressive Cows](https://www.geeksforgeeks.org/problems/aggressive-cows/0)

Given an array of length ‘N’, where each element denotes the position of a stall. Now you have ‘N’ stalls and an integer ‘K’ which denotes the number of cows that are aggressive. To prevent the cows from hurting each other, you need to assign the cows to the stalls, such that the minimum distance between any two of them is as large as possible. Print the largest minimum distance.
(2 ≤ N ≤ (10^5); 2 ≤ K ≤ N; 1 ≤ Ni ≤ (10^9))

For **N = 5**, **K = 3**, **Stalls=`[1, 2, 4, 8, 9]`**

We will put -
-  **Cow 1 at Stall 1** 
-   **Cow 2 at Stall 4** 
-  **Cow 3 at Stall 8 (or 9)**

**Maximum Possible Minimum Distance = min(4 - 1, 8 - 4) = 3**

```python
def can_place_cows(stalls, n, cows, min_dist):
    count = 1
    last_pos = stalls[0]
    for i in range(1, n):
        if stalls[i] - last_pos >= min_dist:
            count += 1
            last_pos = stalls[i]
            if count >= cows:
                return True
    return False


n, k = map(int, input().split())
stalls = list(map(int, input().split()))
stalls.sort()

left = 0
right = stalls[n - 1] - stalls[0]  # Maximum possible distance
result = 0

while left <= right:
    mid = (left + right) // 2

    # If we can place k cows with this distance, try larger distance
    if can_place_cows(stalls, n, k, mid):
        result = mid
        left = mid + 1
    else:
        right = mid - 1

print(result)
```

# Dynamic Programming with Binary Search

## [Longest Increasing Subsequence](https://cses.fi/problemset/task/1145)

You are given an array containing n integers. Your task is to determine the longest increasing subsequence in the array, i.e., the longest subsequence where every element is larger than the previous one. A subsequence is a sequence that can be derived from the array by deleting some elements without changing the order of the remaining elements. 
(1 ≤ n ≤ 2·(10^5); 1 ≤ xi ≤ 2·(10^5))

For **N = 8,  A = `[7, 3, 5, 3, 6, 2, 9, 8]`** 

**LIS = `[3, 5, 6, 9]`**  

**Length of Longest Increasing Subsequence = 4**

```python
from bisect import bisect_right as bsr
from bisect import bisect_left as bsl

n = int(input())
arr = [int(i) for i in input().split()]

# # dp[i] stores smallest value that can end an increasing subsequence of length i
dp = [float("-inf")] + [float("inf")] * (n + 1)

for i in range(n):
    # Find the position where current element should be inserted to maintain increasing order
    x = bsr(dp, arr[i])
    # If current element can create a better increasing subsequence of length x, update dp
    if dp[x - 1] < arr[i] < dp[x]:
        dp[x] = arr[i]

# First infinity position minus 1 gives the length of longest increasing subsequence
print(bsl(dp, float("inf")) - 1)
```

## [Projects](https://cses.fi/problemset/task/1140)

There are n projects you can attend. For each project, you know its starting and ending days (ai and bi ) and the amount of money you would get as reward (pi). You can only attend one project during a day. What is the maximum amount of money you can earn? 
(1 ≤ n ≤ 2·(10^5); 1 ≤ ai ≤ bi ≤ 10^9; 1 ≤ pi ≤ 10^9)

For **N = 4**, **Events = `[[2,4,4], [3,6,6], [6,8,2], [5,7,3]]`**

**We can attend the events `[2,4,4]` and `[5,7,3]`**

**Maximum Reward = 4 + 3 = 7**

```python
from bisect import bisect_left as bsl

n = int(input())
arr = []
for i in range(n):
    arr.append(list(map(int, input().split())))
arr.sort(key=lambda x: x[1])
a, b, p = zip(*arr)
dp = [0] * (n + 1)
for i in range(n):
         # Find the latest non-overlapping project before the current one
    x = bsl(b, a[i])
         # Maximum profit is either including current project + previous compatible projects, or excluding current project
    dp[i + 1] = max(dp[i], dp[x] + p[i])
    print(dp)
print(dp[-1])
```

---
*If you have any doubts or suggestions or just want to interact with me, use the comment section below (Refresh if comments don't load)*