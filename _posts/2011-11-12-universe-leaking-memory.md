---
layout: post
title:  "The Universe is leaking memory"
description: "Zamron progress"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

2 days of memory leakage hunting, I refactored at least 3 main components of the game (so far) and still about 4MB of memory leakage! who the hell is doing that??! I haven’t looked inside Away3D yet though..

As I’m digging deeper, I started to discover the horrors beneath.. you see Zamron had this life cycle so far:

1. started as a hello world to test pseudo 3D in Flash
2. developed into a proof of concept in only 48 hours, the first 24 hours of that was spent trying to get a pseudo 3D engine working correctly
3. decided to give it a few more days and called it wolf
4. arrived at a “pseudo” good experience for a flash game, so I started expanding it hoping to turn it into some kind of game, the biggest mistake I did was trying to use wolf’s code as is, I should have started from scratch here.. I guess I just wanted to do it quickly in the spirit of Ludum Dare
5. Zamron idea was born as my entry for ludum dare october challenge, I didn’t make it in time. But I’m pretty close to finishing it now

One of the worst problems I’m facing is the horrible base that was part of wolf, you’d think a retro fps should be simple enough to do, but as I’m adding more stuff to Zamron, those “simple enough” parts started to grow and get hairy.. which is where I am now, the only weapon I have against this uncontrolled growth is refactoring and more refactoring… :-/
