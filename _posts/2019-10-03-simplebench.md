---
layout: post
title:  "Benchmarking using simplebench script"
description: "Running a simple benchmark on multiple platforms and runtimes"
category: programming
tags: [programming,python,lua,cpp,raspberrypi,snapdragon,benchmarking]
published: true
---

{% include JB/setup %}

A while ago I used a simple benchmark to very roughly compare performance on multiple platforms: [PC-6002 vs 80s Computers Benchmark](http://zenithsal.com/pc-6002/2018/04/30/pc-6002-vs-80s-computers-benchmark) and got some interesting results.

Recently I got a Raspberry Pi 4 and wanted to figure out how its new CPU compare to other platforms so I went back to that simple benchmark I used, scaled it up by 1000x and used it in many different ways on many different devices and platforms. I think the results are noteworthy :) but it's still just for fun, this is by no means a benchmark that should be taken seriously.

The simple bench I used looks like this:

~~~~ py
import math
import time
import os

all_primes = []
t1=time.time()
skip=False
for i in range(2, 100000):
    skip=False
    k = math.floor(math.sqrt(float(i))) + 1.0
    for j in range(2, int(k)):
        k1=i/float(j)
        k2=int(k1)
        if k1==k2:
            skip=True
            break
    if skip:
        continue
    all_primes.append(i)
elapsed=(time.time() - t1)
print("Prime count = " + str(len(all_primes)))
print("Python Time=" + str(elapsed))
~~~~

Rewritten to: C++, C#, Lua, Javascript, and GDScript

Here are the systems I ran simplebench on:

* Raspberry Pi 4: Cortex A72 1.5GHz, Raspbian
* Desktop PC: AMD Ryzen 5 1600 3.2GHz, Windows 10
* Laptop: Intel Core i5-4258U 2.4GHz, Kubuntu 18.04
* Laptop: Intel Core i7-8550U 1.8GHz, Kubuntu 18.04
* Laptop: Intel Pentium 4415Y 1.6GHz, Windows 10
* Laptop: AMD E-450 1.6GHz, Debian
* Mobile: Snapdragon 855 2.84GHz+1.78GHz, Android 9
* ShieldTV: nVIDIA Tegra X1 2GHz, Android 8

Here are the runtimes I used to run the benchmarks on:

* GCC 7+ C++14
* Mono
* Lua 5.1+ and luajit
* NodeJS 8
* Godot 3.1
* Python 2.7
* PyPy

I wanted to put minimal time into this so I didn't try to run everything on every platforms, just what's easily doable.

For each measured time, I ran the simplebench script/binary more than 10 times and took the shortest achieved time:

|--------------------------------+--------+--------+---------+-------+--------+-------+------+--------|
| Platform                       |Lua     |Python27|PyPy     |NodeJS |GCC/C++ |Mono/C#|Luajit|Godot/GD|
|--------------------------------|--------|--------|---------|-------|--------|-------|------|--------|
|RaspberryPi4/Cortex A72 1.6GHz  |0.61s   |4.3s    |0.14s    |0.061s |0.045s  |0.136s |0.087s|        |
|Laptop/Core i5 4258U 2.4GHz     |0.22s   |1.2s    |0.041s   |0.018s |0.015s  |0.045s |0.025s|0.637s  |
|Laptop/AMD E-450 1.65GHz        |1.17s   |7.2s    |0.210s   |0.110s |0.079s  |0.233s |0.152s|        |
|Mobile/Snapdragon 855 2.84GHz   |0.23s   |2.37s   |         |       |        |       |      |0.758s  |
|Laptop/Core i7 8550U 1.8GHz     |0.18s   |1.0s    |0.037s   |0.012s |0.011s  |0.053s |0.018s|        |
|Laptop/Pentium 4415Y 1.6GHz     |0.46s   |3.65s   |0.094s   |0.020s |0.030s  |       |      |1.411s  |
|Desktop/AMD Ryzen 5 3.2GHz      |0.22s   |1.38s   |0.031s   |0.008s |0.011s  |       |0.011s|0.725s  |
|ShieldTV/Cortex A57             |        |        |         |       |        |       |      |1.496s  |
|-----------------------------------------------------------------------------------------------------|

## Conclusions:

#### Snapdragon 855

Mobile phone processors are catching up to laptop processors very quickly. I've read that Snapdragon 855 is similar in performance to a current gen core i3, and these results confirm that. It's especially impressive that Snapdragon 855 is almost exactly matching a desktop PC Ryzen 5 1600 in both Lua and Godot/GDScript!

#### Python

CPython is so incredibly slower than everything else which comes as a no surprise, some of my old CPython/PyGame games struggled to hit 60 fps on laptop processors at the time without some sort of jit thrown in (back then I used [Psyco](http://psyco.sourceforge.net/))

Pypy runtime (which uses jit) is impressively quick in comparison to CPython, it almost matches mono actually, it's a surprise it hasn't become the dominant python runtime yet!

#### Lua/JIT

As expected, lua is very fast for a fully interpreted language. I wish CPython was closer to that.

Luajit is damn impressive. Actually really close to native C++ performance! Which is insane.

#### Javascript

The anomaly here is NodeJS which uses the excellently optimized [Google V8 engine](https://v8.dev/). Not only did it match but actually surpass native C++ performance on 2 platforms. I have no explanation other than blaming it on timer precision? but I'm not surprised its performance is that good as it not only runs 100% of the web, but a growing list of desktop applications like this very editor I'm using to write these words now.

#### Godot/GDScript

Godot's GDScript is not as bad as I thought it'll be, about 2x CPython. Alone it would make Godot a terrible solution for bigger games, but luckily Godot allows C++ modules to be used for critical bits and Mono/C# support is almost ready for prime time.

