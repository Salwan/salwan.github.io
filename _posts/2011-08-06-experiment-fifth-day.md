---
layout: post
title:  "Experiment: Fifth Day"
description: "Experimenting on time management"
category: life
tags: [life,as3,flash]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

Today started with [a beautiful TED talk](https://www.ted.com/talks/matt_cutts_try_something_new_for_30_days) about trying something new for 30 days, I was pumped with excitement! :D

I’m a bit out of energy today for some unknown reason, I don’t remember the specific details of what I did during the first 8 hours! but it involved playing guitar from written musical notes for the first time, I got carried away with the practice and spent nearly 3 hours plucking the strings, my fingers hurt a little and I didn’t feel them by the end of the practice but I could have carried on for 3 more hours. Maybe it’s that TED speech?

Also I watched the first episode from season 1 of [Sliders](https://en.wikipedia.org/wiki/Sliders) after recommending it to a friend. Sliders is a sci-fi TV series I loved back in the 90s about some guys who travel between infinite parallel dimension earths, during the first episode the parallel earth they go to has US under Soviet control, turned into a communist nation and they eventually get involved with underground resistance/revolution by imperialists (as the comrades like to say).

The coding problem I had to tackle today was about pausing sound effects in First Defense. Flash wasn’t designed to be a game platform, it’s instead a 2D animation and multimedia platform that we mutilate to make it run games, so it lacks a lot of features necessary for games. I discovered it especially sucks when it comes to playing sounds. There are a ton of problems regarding animation, synchronization, and compression when dealing with sounds in Flash.

Have you ever seen a sound API that doesn’t provide pause/resume functionality? and where you can’t possibly know when sounds get garbage collected during the game? This is outrageous, [I’m mad as hell and I’m not gonna take this anymore…](https://www.youtube.com/watch?v=QMBZDwf9dok)

Hacking sleeves up, I started looking for dodgy solutions, if only I had weak pointers/references so I keep an eye on Sounds without intervening with garbage collection … wait, Dictionary uses that internally! quick ask Google, hey bro, “weak reference using dictionary as3” plz? and google answers: “About 32,500 results (0.28 seconds)”.. love this guy ^_^ problem solved, even though implementation is still a bit buggy.

Next challenge: pausing Flint particles, the creator of [Flint](https://github.com/richardlord/Flint) had the common sense to include a pause/resume mechanism, so it should be easy.

I had to go to university today, about time to ask about graduation procedures. I go ask, they say “not now come back on the 13th”.. But I shaved and wore clothes today! shame on you university :’(

Visiting university after graduation is a surreal experience, it’s like visiting the past or travelling back in time. I felt completely weirded out for some reason, but wait.. I always feel weirded out in university.

While I was looking for an Action Script 3 sound system library today, [I found this wonderful list](http://web.archive.org/web/20170421121146/http://www.adrianparr.com/?p=83). Check out those hot.. augmented reality libraries, imagine using those card like print-outs to play an RPG, where each card represents a magic attack or something, and you can then show those cards to your webcam and the magic will be carried out! Then you get to combine two cards or something to create more powerful attacks (AR libs can read more than one card), then you can use a card that will turn into a sword on screen which you can then move to hack-n-slash everyone. It’s gonna be epic, it’s gonna have brown-HDR and eye popping bloom, and it’s gonna be an MMORPG.
Funding? call 1-800-IWANTFERRARI now
