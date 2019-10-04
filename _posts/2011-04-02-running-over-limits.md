---
layout: post
title:  "Running Over Limits"
description: First Defense progress"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

I may have mentioned I'm developing my first flash game which will be released on Kongregate (or similar game portals), since this is the first one I wanted something small and simple that would take about a month to develop and polish including actually learning Flash and ActionScript...

When I started working, I took the simplest candidate idea I had, and under the principle of K.I.S.S. (Keep It Stupidly Simple) I overran all my limits.

Started with something small and simple, but I didn't like the way it looked and played, so I thought I'll try to give its look'n'feel a makeover. I restarted coding from scratch (and that turned out to be a very good idea since my initial noob code was horrible), and I redesigned how the game looks, but I went too far with the design, and mind you I'm no artist...

A few days later I realized how much artistic trouble I got myself into, I sent an S.O.S. to my friends looking for a brave Photoshopist, and no one stepped forward! (now if this was a movie, 300 brave men would step forward, fully clothed hopefully)

Here is how the old design looked:

 
![First Defense test]({{site.baseurl}}assets/screenshots/firstdefense/first-defense-test-1.jpg)

And here is the new one:

 
![First Defense new look]({{site.baseurl}}assets/screenshots/firstdefense/first-defense-test-2.jpg)

The new water is animated using a perlin noise + displacement filter, very bad for performance and violently impacts the fps even on my 3 core desktop..! tried to optimize using 3 different methods and still came out with nothing.

So yeah, I'm in trouble.. but I'll try the only thing I have: my best