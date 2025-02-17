---
title: 1794C - Scoring Subsequences
tags:
  - competitive-programming
  - dp
  - greedy
  - binary-search
  - learnings
---
# Introduction

This is one of my favourite problems on Codeforces. I solved this problem when I had just started with Codeforces. Solving this problem during the live contest as a newbie, unaware of concepts like dynamic programming or binary search gave me an immense confidence boost. After the contest I found out that my solution was the shortest and simplest solution to the problem, more efficient than even the editorial.
# Statement

The score of a sequence $[s_1, s_2, \ldots, s_d]$ is defined as 
$$
\frac{s_1 \cdot s_2 \cdot \ldots \cdot s_d}{d!},
$$

where $d! = 1 \cdot 2 \cdot \ldots \cdot d$. In particular, the score of an empty sequence is 1.

For a sequence $[s_1, s_2, \ldots, s_d]$, let $m$ be the maximum score among all its subsequences. Its cost is defined as the maximum length of a subsequence with a score of $m$.

You are given a non-decreasing sequence $[a_1, a_2, \ldots, a_n]$ of integers of length $n$. In other words, the condition 
$$
a_1 \leq a_2 \leq \ldots \leq a_n
$$
 
is satisfied. For each $k = 1, 2, \ldots, n$, find the cost of the sequence $[a_1, a_2, \ldots, a_k]$.

A sequence $x$ is a subsequence of a sequence $y$ if $x$ can be obtained from $y$ by deletion of several (possibly, zero or all) elements.

# Example

$n = 3$
$a = [1, 2, 3]$

- The maximum score among the subsequences of $[1]$ is 1. The subsequences $[1]$ and $[]$ (the empty sequence) are the only ones with this score. Thus, the cost of $[1]$ is 1.
- The maximum score among the subsequences of $[1, 2]$ is 2. The only subsequence with this score is $[2]$. Thus, the cost of $[1, 2]$ is 1.
- The maximum score among the subsequences of $[1, 2, 3]$ is 3. The subsequences $[2, 3]$ and $[3]$ are the only ones with this score. Thus, the cost of $[1, 2, 3]$ is 2.

Therefore, the answer to this case is $1\:\:1\:\:2$, which are the costs of $[1]$, $[1, 2]$ and $[1, 2, 3]$ in this order.

# Official Editorial (Suboptimal)

We first note that for a non-decreasing sequence 
$$
s_1, s_2, \ldots, s_\ell,
$$
 
the maximum score for any subsequence of $k$ elements is achieved by taking the $k$ largest elements—that is, a suffix of the sequence.

Now, transform the sequence by dividing the $i$th element from the right by $i$, so it becomes
$$
\frac{s_1}{\ell},\ \frac{s_2}{\ell-1},\ \ldots,\ \frac{s_{\ell-1}}{2},\ \frac{s_\ell}{1}.
$$

The score of a suffix in the original sequence equals the product of the corresponding suffix in this new sequence.

Since 
$$
s_1 \leq s_2 \leq \ldots \leq s_\ell
$$
 
and 
$$
\frac{1}{\ell} \leq \frac{1}{\ell-1} \leq \ldots \leq \frac{1}{1},
$$
 
we have
$$
\frac{s_1}{\ell} \leq \frac{s_2}{\ell-1} \leq \ldots \leq \frac{s_\ell}{1}.
$$

Thus, to maximize the product, we choose the longest suffix of the transformed sequence in which every element is at least $1$. This length is defined as the cost of the sequence.

For each prefix 
$$
[a_1, a_2, \ldots, a_k]
$$
 
of a non-decreasing sequence 
$$
[a_1, a_2, \ldots, a_n],
$$
 
its cost is the maximum length of a suffix of
$$
\frac{a_1}{k},\ \frac{a_2}{k-1},\ \ldots,\ \frac{a_k}{1}
$$

with all elements $\geq 1$. We can compute this via binary search (determining each required fraction on the fly), leading to an overall complexity of $\mathcal{O}(n \log n)$ per test case.

# My Solution (Optimal)

We can solve the problem by computing the cost of every prefix of a non-decreasing sequence step by step. Recall that for a sequence 
$$
s_1, s_2, \ldots, s_\ell,
$$
 
the cost is defined as the maximum length of a suffix of 
$$
\frac{s_1}{\ell},\ \frac{s_2}{\ell-1},\ \ldots,\ \frac{s_\ell}{1}
$$
 
such that each element is at least $1$ (which ensures that the score/product is maximized).

A key intuition that helped simplify the solution was to instead reframe this transformation as 
$$
\frac{s_1}{1},\ \frac{s_2}{2},\ \ldots,\ \frac{s_\ell}{\ell}.
$$
  
This equivalent view lets us process the sequence from left to right.

The core idea is to maintain a counter $c$, representing the current cost (i.e. the maximum length we can achieve for the prefix). For each new element, we try to extend our valid suffix of the transformed sequence by checking whether the candidate element (which will become the smallest element in the new suffix) satisfies:
$$
\text{candidate value} \geq c+1.
$$
In a 0-indexed array, when processing a prefix of length $i+1$, the candidate is $a_{i-c}$—because the largest $c+1$ elements, which form our new suffix after adding the current element, start at index $i-c$. If this condition holds, then dividing by its new denominator $c+1$ gives a value at least $1$, so the valid suffix can be extended.

The following Python code implements this strategy:

------------------------------------------------------------
```python
for _ in range(int(input())):
    n = int(input())
    arr = [int(i) for i in input().split()]
    c = 1
    result = [c]
    for i in range(1, n):
        if arr[i - c] >= c + 1:
            c += 1
        result.append(c)
    print(*result)
```

------------------------------------------------------------

Code Breakdown:
1. For each test case, we read the number $n$ and the non-decreasing sequence $[a_1, a_2, \ldots, a_n]$.
2. We initialize the cost $c = 1$, since the first element provides a valid subsequence of length $1$.
3. For each subsequent index $i$, we check if the candidate element $a_{i-c}$ meets the condition   $$
   a_{i-c} \geq c+1.
   $$If true, the candidate is strong enough (after the division by $c+1$) to keep every element in the suffix at least $1$, allowing us to increment $c$.
4. We append the current cost to the result for every prefix.

This approach efficiently computes each prefix's cost in a single pass, leveraging the intuition from the alternative view of the transformation:
$$
\frac{s_1}{1},\ \frac{s_2}{2},\ \ldots,\ \frac{s_\ell}{\ell}.
$$
It runs in $\mathcal{O}(n)$ per test case.

---
*If you have any doubts or suggestions or just want to interact with me, use the comment section below (Refresh if comments don't load)*
