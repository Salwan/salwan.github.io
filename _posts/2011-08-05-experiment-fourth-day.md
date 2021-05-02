---
layout: post
title:  "Experiment: Fourth Day"
description: "Experimenting on time management"
category: life
tags: [life,as3,flash]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

Huh!? but where is the third day?

lol, I don’t know it just got lost somewhere, I considered it my day off or something. Which means today is work day! however, not much coding took place.. the reason is that I wanted to update Flash, and that process had fallout like FlashDevelop acting weird (turns out I must update it too) among other issues like my C: running out of juice, windows 7 somehow managed to suck nearly 50GB alone. I blame Microsoft.. again.

Today I set out on a witch-hunt to address Runtime Shared Library issues (RSL in short) specifically TLFText which I now hate, it has been causing us problems constantly with streaming,.. ultimately my efforts failed. And I reverted to just merging the RSL components with the SWF for now. The weird thing is that it seems the object that represents RSL preloading events (namely RSLEvent) exists in two libraries mx.events.RSLEvent and fl.events.RSLEvent, why?

Guitar practice is continuing at a good pace, my finger tips are better at taking the pressure now but quick cord changes are still bloody impossible and my left arm tires quickly. I haven’t yet “felt” the guitar if that makes any sense, I’m practicing though, may be one day it’ll happen. :)

Today’s musician is Darko, an Egyptian music composer who is a friend of Islam (multi-talented developer working with me on FirstDefense), Darko’s music is wonderful! to me it feels like Ambient with a touch of sci-fi, some tracks are piano/jazz flavored, others are more electronic. I’m sure there is a name for his music style, but who said I’m a music nerd? :D

Here, listen and enjoy: [Darko](https://soundcloud.com/progressivedarko)

I’m considering participating in the next [Ludum Dare](https://ldjam.com/), which is a dual-game making competition/jam held every 4 months. The competition imposes interesting rules:

> You must work alone (solo)
> All game code and content must be created within 48 hours. Base-code and libraries are allowed on the condition that you announce them before the competition starts and share them with all other competitors.
> Games must be based on the theme, which is announced before the competition starts.
> All libraries, middleware, content creation, and development tools are allowed.
> Source code must be included. (yay! closed source devs will hate it :D)

Next competition is exactly in 14 days, 20 hours, 37 minutes, 52 seconds (and 233ms), which happens to be 19th of August, and lasts till 22nd of August.

My solution of choice is as usual, PyGame. Did I say I love Python? =)
(even though I admit I’m liking Flash as a rapid development solution)
