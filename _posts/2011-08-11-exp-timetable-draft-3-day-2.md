---
layout: post
title:  "Timetable Draft 3: Day 2"
description: "Experimenting on time management"
category: life
tags: [life,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

Fantastic! I managed to keep a timetable this time.. yesterday was mostly spent on the way between Cairo and Alexandria, I met a new friend from south korea on board the train, had fun time with the cultural exchange, and got directions to a few korean restaurants in Maadi which serve Kimchi :)

Second day, today, I worked about 10 hours, I can say I really did work for about 7 hours of them? which is still pretty good, working on my Netbook usually goes well from a performance point of view but this time things were a little extra slow and extra unresponsive, turns out I’m out of ram! even though 1GB should be very sufficient for the apps I’m using, something was not right…

Digging deeper, the first thing I discovered was that visual studio 2010 installed a full fledged automatically running SQLServer which alone is taking about 150MB of physical ram in services (ie. it doesn’t even show up in the task manager!), after eliminating it, I went ahead and eliminated Windows services that I don’t use. Things like the Search Indexer (doesn’t work anyway), IE8 (epic fail browser), etc.

Netbook works nicely now, I also had a performance problem playing 720p H.264 decoded video, which I think is classified as HD (1280x720 frame size), I use VLC but for the sake of HD videos on Netbook… get Media Player Classic Home Cinema edition, disable it’s internal filters for H264 and Matroska, install DivX codec pack and disable deblocking, which is an expensive post-decoding filter to eliminate blocky artifacts caused by compression, blocks don’t look that bad anyway in an HD video.

I did the save/load process in First Defense via SharedObject today, which was surprisingly very easy, and completed game pausing with tags, though I’m not very sure about the weak reference implementation which abuses Dictionary keys, I’ll keep a close eye on dangling elements. I have a backup method to pause if the current automated system turns out to be more problem than solution later on.

Today I leave you with an in-depth interview with [Markus Persson and Daniel Kaplan, most wanted men in the game industry for Minecraft.](https://www.cnet.com/news/markus-notch-persson-the-mind-behind-minecraft-q-a/)

Also I don’t seem to get tired of listening to this by Moderat, it kinda feels like how my brain works on the inside hehehe

<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/11090821&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
