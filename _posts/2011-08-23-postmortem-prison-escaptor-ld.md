---
layout: post
title:  "Post Mortem: Prison Escapor #LD48"
description: "Post mortem for development of LD21's Prison Escapor"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

If I spend three days every week like I spent the last three days weird things will happen.. I've learned so much and I needed those lessons so bad, while I'm at it I finished my first flash game and the first game I design from scratch! and it only took 3 days.. [Prison: Escapor.](http://ludumdare.com/compo/ludum-dare-21/?action=preview&uid=4775)

LD#21 was wonderful, [nearly 600 games were submitted](http://ludumdare.com/compo/ludum-dare-21/?action=preview), and I felt like I'm competing head-to-head in a race with so many great game developers from all around the world, some just starting, some with 10+ years of experience, some own game companies, and some are considered legends in game development/design.

The first thing I'm wondering about is why First Defense took this long, several months really, and is still no where to be finished... while a game that took me 3 days to finish from concept to release has more game design value, playability, and experience in it?

Through this experience, I created a timelapse video of my whole work for the first time, one screenshot every 30 seconds using [Chronolapse](https://code.google.com/archive/p/chronolapse/). By the time I finished and submitted the game, I got more than 4800 screen shots! that amounts to exactly 40 hours of work, which is a very useful thing to know =)

Here's the timelapse video:

<figure class="video_container">
	<iframe width="540" height="405" src="https://www.youtube.com/embed/ysWkSg8Lxw4" frameborder="0" allowfullscreen></iframe>
</figure>

Heh... game over indeed ^_^

## What Went Right?

### 1. using CMG framework

I built the CMG framework slowly with First Defense as I'm learning ActionScript 3 and Flash, it's still far from being a complete framework or bug free. But using it was the best decision I made because here I have a framework which I know every little detail about that does most of the grunt work for me freeing me to concentrate on the game creation part, and it felt good... minutes after I started working I got something to show :)

### 2. persisting to finish the game

My original intent was to enter the competition, which only allows 2 days of work. But I was nowhere close to finishing by the time it ended, even when the LD servers crashed and we got 12 more hours of extended time, the game was barely playable by then.

At first I almost gave up, but then I said what the hell? I'll go for the jam (3 days contest), which allowed me 12 more hours to work at that point, and somehow I managed to finish, even if I didn't really think I would make it in time.

The strange thing is,.. this has been a recurring theme over every challenge I carried out, at one point it feels kinda hopeless and I want to just give up, but then I get stubborn and force myself to keep carrying on and I usually make it!

So from now on, everytime I hit that "*I can't do it*" point, I know it's time to work even harder because I'm close to success :D

### 3. Timelapsing the whole thing

This is a wonderful thing, it's like a complete record of every moment the project went through.. creating features, squashing bug, and sometimes even frustration all show in the video.. and of course the moment of triumph when the game is finished and released :)

When the timelapse software is working in the background, it feels a bit like someone is watching what I do closely, that someone is me later on.. so procrastination and wasting time with useless things are much less likely to occur if I know my future-self is watching.

It also shows how much I get distracted at work with things I should just shut off, like news or facebook or something, going to check facebook even for half a minute means my line-of-thought will be lost, whatever I was coding I'm going to have to find what I was trying to do with it and most likely I'll end up writing buggy code and *facepalm* myself later.

## What Went Wrong

### 1. The game concept was too much for my first 48 hours contest

Most other entries included a simple design and simple mechanics following a known genre, pattern based enemies (if there are enemies), and mostly simplistic environments. There are exceptions though, there are those who did much more than that, but they are usually quiet experienced with game contests like this one and know exactly what to concentrate on.

### 2. IRC, Notch, and LD blog

IRC channel #ludumdare, Notch livestreaming himself working on his entry, and LD blog entries that I read/write, all served as distractions. And you can see pretty clearly in the timelapse how many times I got distracted with those... more than I thought.

### 3. Incomplete experience with Flash

Flash has a weird way of dealing with things that sometimes doesn't make sense. Before Prison Escapor, the only game I finished in flash was pong which is hardly a game and it was many years ago. I had confidence in my knowledge in Flash and my framework to not face tricky situations.

But I did, many in fact, the two that took most of the time during the second and third day:

* Building multiple levels in Flash editor (I haven't done that yet in First Defense)
* The strange relationship between child and parent movieclips as opposed to construction and events, this is a very basic thing and I'm actually shocked I didn't have problems in the past due to this misunderstanding.

The first problem, turns out I was completely wrong in how I structure my levels, that goes for First Defense too, I had to refactor the whole flash project to follow a better approach that allows easy level creation.

The second problem, drove me crazy for an hour or so until I figured out the issue.. you see, child movieclips are constructed then added to scenes (event), before their parent's constructor is even called! doesn't make sense... even if children should be constructed before parents, they shouldn't be added to stage before their parents are even constructed!
Lazy developers...

Best and quickest solution is to create a new event that is fired on the first ENTER_FRAME received.. call it FIRST_FRAME or something, in which parents are guaranteed to exist.

There was another little issue worth mentioning too, involving static globally accessible classes (singletons), I have a few (about 3).. of course these classes will not be reconstructed when scene changes, so all data they have will be carried around between scenes, which is very useful. But it means you have to make sure to reinitialize them manually at the right time.
