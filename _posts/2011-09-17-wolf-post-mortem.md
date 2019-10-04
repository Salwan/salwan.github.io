---
layout: post
title:  "Wolf: Post Mortem"
description: "Wolf prototype post-mortem"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

Well I said I will stick to simple ideas, then completely went over that by trying to make a retro fps shotter with support for multiplayer in 72 hours max hehe

[Read the experiment details here]({{site.baseurl}}pages/2011/09/09/exp-rapid-indie-gamedev/), for reference.

This is my first try, I called the whole thing "Wolf"not the game but the whole project. And of course, I didn't quite make it, but I made something from scratch and by all means it's an impressive result for 3 days of normal work, it isn't a full game though, only a good base for one.

Take a look, a pixelated on purpose game :)

![Wolf Prototype]({{site.baseurl}}assets/photos/tumblr/wolf-1.jpg)

Here, try the demo << [WOLF DEMO](http://www.cloudmillgames.com/demos/wolf/wolf.html) >> controls: arrow keys, A/D for strafing, Ctrl for firing, and 1/2 to switch weapon (punching or a pistol you can pick up).

I faced quite a bit of frustrations that unfortunately were a result of introducing untried and untested Flash 3d libraries to power the game, but hey, I learned my lesson :)

## What Went Wrong

### 1. Flash 3D Libraries

Flash 3D (for Flash 10) is fail, it cannot be used for 3d games period, even if it's something as simple as wolf. And it's not the 3d libraries fault, in fact these are wonderfully crafted libraries with many smart tricks to speed things up (albeit buggy).. but it's ultimately Flash 10's crappy performance and its full software implementation.

When I started evaluating libraries, I did a superficial evaluation and picked Sandy3D because it looked like the simplest of them, all I needed was something that can draw simple textured polygons and textured billboards. That's it!

Initial Sandy3D tests on my Netbook yielded relatively acceptable results, however there was a very annoying problem with the texture perspective correction that makes textures "bleed", the only solution was to set a quality parameter per object (which actually just tessellates for more polygons). On the Netbook setting this quality parameter to any value above 1 takes the performance down many notches into unplayable territory. I guess it's ok if it's on the Netbook, atom processors don't pack much mojo anyway... the shock came when I went back home and tested things on my 3 core Phenom desktop, it also kills performance!

I started working on wolf the next day, and the first thing I had to do was find a way to obtain good visual results and more performance.. a few hours later I gave up on Sandy3D so started looking for alternatives. I tested one of the best 3D Flash engines around, Away3D.. turns out it doesn't have a serious perspective correction problem and provides much better performance.. So I made the hard decision to switch libraries, I had to learn Away3D from scratch and port everything I have to it, on the way I got really frustrated with the camera in Away3D... its camera is very weird, ultimately what I didn't know is that I must attach a "lens" object to the camera to set working perspective projection, the tutorial doesn't say anything about that, eventually I started reading examples in case I missed something and found out!

Then came Sprite3D, so buggy and I couldn't figure out why, it disappears when it wants, it changes position and jumps around.. its whole positioning took an hour or two to get right. Working on Sandy3d was much smoother.

After several hours, near the end of the first day, I was thinking of trying Alternative3D which although closed source seems to be the only library made specifically for games, but I decided to stick with Away3D for better or worse.

### 2. FPS games

these things are complex, even a retro fps like this has many elements to make. It's also a lot less forgiving compared to 2D games when it comes to relationship between quick hacky code and fun gameplay.

## What Went Right

### 1. Quickly made art

Even though things were made pretty quickly, and there aren't many to begin with.. the demo looks kinda stylish :)

I used a camera and my hand to make the player hand, which I admit was a lot of fun ^_^ I modeled the pistol quickly using wings3d and did a quick rendering using POV-Ray, very simple but looked good.

### 2. Breaking Flash IDE ties

Using Flash 3D libraries forced me to do most things in as3 code, the whole fla file is very simple.. this is a good thing because depending on the fla file caused problems especially with collaborative work in the past.. it's buggy, binary, and cannot be merged easily.

## Next Challenge

The next experiment, I'm gonna do the exact opposite... choose a very simple idea, but polish it as much as I possibly can within the time limit.

For wolf, I'll see what people think about it as it is now, if I get enough positive opinions, I'll give it another 72 hours, no more.

## Time Report

I'm timelapsing all my work, this way I could go back later and remove all non-work related screen shots.. I get a good time estimation this way :)

Chronolapse set to take 1 screenshot every minute.

Day 1 (14/9/2011): 725 screenshots = 12 hours of work

Day 2 (15/9/2011): 573 screenshots = 9.5 hours of work

Day 3 (16/9/2011): 513 screenshots = 8.5 hours of work

out of 72 hours, I worked for 30 hours.

Ideal work hours = 10 hours/day

Achieved 100% efficiency :D