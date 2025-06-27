---
title: Using Complex Numbers for Grid Movement Problems
tags:
  - competitive-programming
  - codeforces
  - learnings
  - atcoder
  - prefix-sums
  - greedy
  - maths
date: 2025-06-27
---
Problems involving movement on a grid can be solved using tuples/pairs of the form (x, y). However, doing addition/subtraction of pairs/tuples is not supported by default. One alternative to this is using complex numbers. 

Using complex numbers for geometry is not a new idea. You can read more about it in this [blog](https://codeforces.com/blog/entry/22175).
I will not go into the more "geometric" side of things. My aim here is to make you guys feel comfortable with using complex numbers instead of pair/tuples in grid-related problems.

I code in Python and for the better understanding of readers, I used AI to convert those codes to C++. We have to keep few things in mind when using std::complex in C++. Certain methods such as std::polar() and std::abs() don't work when you use complex with integral data types (int, long long etc.). They only work with FP datatypes (float, double, long double etc.). You can still use std::complex with integral datatypes if the use case is limited to simple arithmetic functions like addition, subtraction and multiplication.

Despite all of their benefits, complex numbers have one flaw. They cannot be compared directly. Neither do they have std::hash in C++. If you want to use std::map/std::set, you have to implement a ComplexLess operator. If you want to use std::unordered_map/std::unordered_set, you have to implement ComplexHash function. I have provided sample templates for both. I would recommend not using unordered_map and unordered_set unless you have randomized the hash function.

```c++
#include <bits/stdc++.h>
using namespace std;

template <typename T>
struct ComplexLess {
    bool operator()(const complex<T>& a, const complex<T>& b) const noexcept {
        if (a.real() != b.real()) return a.real() < b.real();
        return a.imag() < b.imag();
    }
};

template <typename T>
struct ComplexHash {
    size_t operator()(const complex<T>& c) const noexcept {
        size_t h1 = hash<T>{}(c.real());
        size_t h2 = hash<T>{}(c.imag());
        return h1 ^ (h2 << 1);
    }
};
```

In Python, the hash of a complex number is defined. If you want to compare two complex numbers, you can implement a class of your own with required dunder methods. Or you can make a simple lambda function and use it as key inside inbuilt methods like sort, max, min etc.

```python
ComplexLess = lambda a, b: a.real < b.real if a.real != b.real else a.imag < b.imag
```

or 

```python
ComplexLess = lambda a, b: (a.real, a.imag) < (b.real, b.imag)
``` 

Now let's solve some problems using this technique. You can try them out for yourself before reading my solutions.

## 1) [CF 626A - Robot Sequence](https://codeforces.com/contest/626/problem/A)

This problem asks how many contiguous command subsequences bring the robot back to its starting position. The key insight is that if the robot reaches the same position twice during execution, the commands between those positions form a closed loop.

We track the robot's cumulative position after each command using coordinates (treating movements as complex numbers for simplicity). If position P appears k times in our sequence, we can choose any 2 occurrences as start/end points for a valid loop, giving us k*(k-1)/2 possible subsequences.

The solution computes prefix sums of movements, counts frequency of each position (including initial position 0), then applies the combinatorial formula C(k,2) for each position's count. This efficiently counts all valid returning subsequences without explicitly checking each one.
### Python

```python
from collections import Counter
from itertools import accumulate

d = {"L": -1, "R": 1, "U": 1j, "D": -1j}
n = int(input())
c = Counter(accumulate(d[i] for i in input()))
c[0] += 1
print(sum((i * i - i) // 2 for i in c.values()))
```

### C++

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using ci = complex<ll>;

template <typename T>
struct ComplexLess {
    bool operator()(const complex<T>& a, const complex<T>& b) const noexcept {
        if (a.real() != b.real()) return a.real() < b.real();
        return a.imag() < b.imag();
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    string s;
    cin >> s;

    map<char, ci> d = {
        {'L', ci(-1,  0)},
        {'R', ci( 1,  0)},
        {'U', ci( 0,  1)},
        {'D', ci( 0, -1)}
    };

    map<ci, ll, ComplexLess<long long>> cnt;
    ci pos{0, 0};
    cnt[pos] = 1;

    for (char mv : s) {
        pos += d[mv];
        ++cnt[pos];
    }

    ll ans = 0;
    for (auto const& [p, c] : cnt) {
        ans += c * (c - 1) / 2;
    }

    cout << ans << '\n';
    return 0;
}
```

## 2) [ABC 398D - Bonfire](https://atcoder.jp/contests/abc398/tasks/abc398_d)

This problem simulates smoke spreading from a campfire that gets blown by wind, with new smoke generated at the origin whenever it becomes empty. We need to determine when smoke reaches a target position after each time step.

The key insight is that smoke at any position P will reach target position (R,C) if and only if there was previously smoke at position (P - (R,C)). Since we track all cumulative wind displacements, we can check if the "reverse displacement" needed to reach our target has occurred before.

At each time step, we compute the cumulative displacement from wind, then check if smoke existed at the position that would blow to our target. We maintain a set of all positions where smoke has been generated (starting with origin), and for each new wind displacement, we check if (displacement - target) exists in our set before adding the current displacement.
### Python

```python
from itertools import accumulate

d = {"E": 1, "W": -1, "S": 1j, "N": -1j}
n, r, c = map(int, input().split())
x = c + r * 1j
arr = list(accumulate(d[i] for i in input()))
seen = set([0])
ans = []
for i in arr:
    ans.append(1 if i - x in seen else 0)
    seen.add(i)
print(*ans, sep="")
```

### C++

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using ci = complex<ll>;

template <typename T>
struct ComplexLess {
    bool operator()(const complex<T>& a, const complex<T>& b) const noexcept {
        if (a.real() != b.real()) return a.real() < b.real();
        return a.imag() < b.imag();
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    ll r, c;
    cin >> n >> r >> c;

    ci target(c, r);

    string s;
    cin >> s;

    map<char, ci> d = {
        {'E', ci(1,  0)},
        {'W', ci(-1, 0)},
        {'S', ci(0,  1)},
        {'N', ci(0, -1)}
    };

    vector<ci> arr;
    arr.reserve(n);
    ci pos(0, 0);
    for (char mv : s) {
        pos += d[mv];
        arr.push_back(pos);
    }

    set<ci, ComplexLess<long long>> seen;
    seen.insert(ci(0, 0));

    string ans;
    ans.reserve(n);
    for (ci& p : arr) {
        ci diff = p - target;
        ans.push_back(seen.count(diff) ? '1' : '0');
        seen.insert(p);
    }

    cout << ans;
    return 0;
}
```

## 3) [CF 1296C - Yet Another Walking Robot](https://codeforces.com/contest/1296/problem/C)

This problem asks us to find the shortest substring we can remove from a robot's path such that the robot still ends at the same final position. The key insight is that removing a substring between positions i and j preserves the endpoint if and only if the robot is at the same coordinate at both positions i and j.

We track the robot's cumulative position after each move using prefix sums. If the robot reaches the same position at two different times, then all the moves between those times form a closed loop that can be removed without affecting the final destination.

The solution computes prefix positions and uses a map to track the most recent occurrence of each coordinate. When we encounter a position we've seen before, we calculate the length of the substring between the two occurrences and update our answer if this gives us a shorter removable segment.
### Python

```python
from itertools import accumulate

d = {"L": -1, "R": 1, "U": 1j, "D": -1j}
for _ in range(int(input())):
    n = int(input())
    arr = [0] + list(accumulate(d[i] for i in input()))
    last = {}
    mn = float("inf")
    ans = -1
    for i, val in enumerate(arr):
        if val in last:
            if i - last[val] < mn:
                mn = i - last[val]
                ans = (last[val] + 1, i)
        last[val] = i
    if ans == -1:
        print(-1)
    else:
        print(*ans)
```

### C++

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using ci = complex<ll>;

template <typename T>
struct ComplexLess {
    bool operator()(const complex<T>& a, const complex<T>& b) const noexcept {
        if (a.real() != b.real()) return a.real() < b.real();
        return a.imag() < b.imag();
    }
};


int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int T;
    cin >> T;

    map<char, ci> d = {
        {'L', ci(-1,  0)},
        {'R', ci( 1,  0)},
        {'U', ci( 0,  1)},
        {'D', ci( 0, -1)}
    };

    while (T--) {
        int n;
        cin >> n;
        string s;
        cin >> s;

        vector<ci> arr(n + 1);
        arr[0] = {0, 0};
        for (int i = 0; i < n; ++i) {
            arr[i + 1] = arr[i] + d[s[i]];
        }

        map<ci, int, ComplexLess<long long>> last;
        int mn = INT_MAX;
        pair<int,int> ans = {-1, -1};

        for (int i = 0; i <= n; ++i) {
            ci pos = arr[i];
            auto it = last.find(pos);
            if (it != last.end()) {
                int prev = it->second;
                int len = i - prev;
                if (len < mn) {
                    mn = len;
                    ans = {prev + 1, i};
                }
            }
            last[pos] = i;
        }

        if (ans.first == -1) {
            cout << -1 << '\n';
        } else {
            cout << ans.first << ' ' << ans.second << '\n';
        }
    }

    return 0;
}
```

## 4) [CF 1073C - Vasya and Robot](https://codeforces.com/contest/1073/problem/C)

This problem asks us to find the minimum length contiguous subsegment of robot commands that we must modify to reach a target position (x, y). The key insight is that we can replace any subsegment of length m with arbitrary commands, so we need to check if m moves can cover the "correction" needed.

First, we check if the problem is solvable: the Manhattan distance to target must not exceed n moves, and the parity must match (since each move changes Manhattan distance by ±2 or 0, we need the difference between target distance and available moves to be even).

For any subsegment of length m starting at position i, we calculate what displacement is needed after removing the original subsegment and adding our target displacement. If this required displacement has Manhattan distance ≤ m, then we can construct valid moves to achieve it within the subsegment.

The solution uses binary search on the subsegment length, checking each candidate length by testing all possible starting positions. We compute prefix sums of movements to efficiently calculate the displacement that would remain after removing any subsegment, then verify if the correction can be made within the allowed number of moves.
### Python

```python
from itertools import accumulate


def check(m):
    for i in range(n - m + 1):
        k = arr[i + m] - arr[i] + need
        if abs(k.real) + abs(k.imag) <= m:
            return True
    return False


d = {"L": -1, "R": 1, "U": 1j, "D": -1j}
n = int(input())
arr = [0] + list(accumulate(d[i] for i in input()))
x, y = map(int, input().split())
need = (x + y * 1j) - arr[-1]
if abs(x) + abs(y) > n or (abs(x) + abs(y) - n) % 2:
    print(-1)
else:
    hi, lo = n, 0
    while lo <= hi:
        mid = (hi + lo) // 2
        if check(mid):
            hi = mid - 1
        else:
            lo = mid + 1
    print(lo)
```

### C++

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using ci = complex<ll>;

bool check_complex(const vector<ci>& arr, const ci& need, int m) {
    int n = arr.size() - 1;
    for (int i = 0; i + m <= n; ++i) {
        ci k = arr[i + m] - arr[i] + need;
        ll dist = llabs(k.real()) + llabs(k.imag());
        if (dist <= m) return true;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    string s;
    cin >> s;

    ll x, y;
    cin >> x >> y;

    vector<ci> arr(n + 1);
    arr[0] = {0, 0};
    map<char, ci> d = {
        {'L', ci(-1,  0)},
        {'R', ci( 1,  0)},
        {'U', ci( 0,  1)},
        {'D', ci( 0, -1)}
    };
    for (int i = 0; i < n; ++i) {
        arr[i + 1] = arr[i] + d[s[i]];
    }

    ci need = ci(x, y) - arr[n];
    ll manh = llabs(x) + llabs(y);
    if (manh > n || ((manh - n) & 1)) {
        cout << -1;
        return 0;
    }

    int lo = 0, hi = n;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (check_complex(arr, need, mid)) hi = mid - 1;
        else lo = mid + 1;
    }
    cout << lo;
    return 0;
}
```

---

*If you have any doubts or suggestions or just want to interact with me, use the comment section below (Refresh if comments don't load)*

