---
layout: post
title:  "Wolf is still alive…"
description: "Wolf prototype progress"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

Yes, a 3 day project that lasted.. well a lot more than 3 days obviously. I've been logging a few details about progress in twitter for reference, working is going much slower than the initial burst of work because I didn't plan for something this big :-S

But I feel like I learned things and solved new types of problems, so it's all in good sports :) here's a little brief on how things went so far:

## Level System

Enhanced the invisible level system, each level is formed of 3 different textures to provide good flexibility, though the demo level I'm still using fails to show any of that heh.

I'm trying this new method of decoding levels as pixels in a texture, so each pixel represents something, a wall, floor, door, or enemy maybe.. the actual data held by the pixel is a little bit complicated, almost like a pixel scripting language :D

## Collision Detection

Collision detection between player-walls, player-enemy, player-projectile-enemy, all working and sufficiently optimized, the projectiles collision detection took me some time and 3 different methods until I arrived at something I'm satisfied with, here are the methods I tried:

1. A mathematical method of detection, very fast detection. But it had problems and sometimes it just didn't work, so I canceled it.

2. A ray casting based method, where the projectile casts a ray that is then checked against bounding spheres of enemies and obstacles like walls. But that sounded like too many space calculations, most are probably useless.

3. A pixel based method I came up with, it involves drawing a small representation of the whole level in memory (walls, floor, enemies, players, etc) while color coding each type of objects, then just moving along the projectile path 10 units at a time checking for the first color encountered, then doing a more comprehensive test by object type. I think this is a pretty fast method with good flexibility. And with a little trick it can even handle varying height ;)

Here's how the projectile collision map looks like: (scaled up 200%)

![Wolf Minimap]({{site.baseurl}}assets/photos/tumblr/wolf-2.jpg)

Bonus, I could actually use it as a mini-map! :D

And here ends my quest for perfect collision detection, thank god I didn't get into method 4, which involved BSP and PVS... wtf? it's just a retro shooter dude.. I should learn to do it caveman style, MAKE IT WORK NAW or I club you.

## Performance

I'm a bit haunted with a performance hungry ghost, so here is a short list of tweaks I did (so far):

1. Compiling performance, this is a very annoying thing that actively helped in prolonging this once 3 days project, this is flash for gods sake it shouldn't take 10 minutes to build an SWF :(

So I just kinda switched to Flex, flash is out of the picture, guess what? compiling time is ZERO, I just run... I didn't even expect that big a difference.

2. Custom geometry: rather than drawing a cubic block for everything, I'm only drawing the necessary faces to create the level, all I did was create a custom cube class with the ability to remove faces as needed.

3. Tweaked clipping, renderer, and actually thinking of creating my own clipping method..

Oh yes, enemies can fire stuff now! blue stuff... no idea what yet.

![Wolf Enemies]({{site.baseurl}}assets/photos/tumblr/wolf-3.jpg)

hmm... ugly hehe
