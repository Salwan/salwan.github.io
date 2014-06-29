---
layout: post
title: "Mac OS X: Prologue"
description: "The journey of moving to OSX for game development"
category: hardware
tags: [hardware, macbook, osx]
---
{% include JB/setup %}

[heavy]: {{site.baseurl}}assets/photos/heavy_laptops.jpg "Too Much Hardware"
[res_comparison]: {{site.baseurl}}assets/photos/2560_vs_1920.jpg "2560x1600 vs 1920x1080"
[pcmac]: {{site.baseurl}}assets/photos/pc_vs_mac.jpg
[airpro]: {{site.baseurl}}assets/photos/air_vs_pro.jpg

*A word of warning: this very long post is not about anything in particular, I just felt like writing something :)* 

## Past Considerations 

I've been mainly using Windows for most of my programming career starting with Windows XP. I also work on linux whenever possible but most game projects treat linux as a secondary platform to port to (if at all targeted) rather than a main platform of development so I always felt like my experience on POSIX-compliant operating systems was relatively lacking as a user and a developer due to less exposure despite a modest history of linux and open source community involvement.

In the past, I had a tendency to prefer expensive Windows power laptops and use them for development/gaming but I learned my lesson. Just by thinking about it I can almost feel the shoulder and neck pain from having to carry 3-4kg laptop plus accessories around for a day or several during gaming or programming events in addition to a battery that dies way too quickly for any practical work sessions. If you try to live on the bleeding edge of technology via laptops you'll find yourself losing the fight pretty quickly (unless you own a personal bank that is). These things are non-upgradeable and get outdated fast.

![heavy]

For stationary heavy coding, I prefer the unmatched flexibility and power of a full desktop. But I also do work on the move sometimes, for that I have a simple light 11.6&#8243; AMD E-450 (2 cores at 1.65GHz) Windows 7 Sony Y series ultrabook for 2 years now. Its low specs and 1366x768 display resolution were only an annoyance until I tried to do some work on a big Flash project. It was very limiting and slow. For our current project at Meteoric: [Paragon (a multi-platform indie space sim)](http://www.paragongame.com/), it was nearly impossible to work effectively, a single code build could take up to 1 hour! I converted it to Ubuntu and tried to use it for our Linux development but I gave up within a day and preferred to develop on a virtual machine on my desktop (several orders of magnitude faster even when running 2 virtual machines).

So yeah, it is time to get a new work laptop!

## The Search

I looked, and looked and looked. And nothing caught my eyes on the windows laptops front. For every laptop I research, there is always a deal-breaker somewhere. Too heavy; overheating; very short battery life; low build quality; bad screen; etc. In the past I might be more forgiving if the hardware was seductive enough (I'm looking at you Lenovo with core i7 Haswell and 2 SLI GPUs!).

[<img src="{{site.baseurl}}assets/photos/lenovo_y510p.jpg" />](http://shop.lenovo.com/us/en/laptops/lenovo/y-series/y510p/#techspecs)

Looking for a new laptop in 2014 made it clear that the highest quality laptops are made by Apple, no doubt about it. But I kinda found MacBooks to be uninteresting in the past and that was due to me being unfamiliar with them for the most part and of course to their high cost of entry. When I was working at PeakGames we had a great developer in our team who did backend development and some front-end work too. While my workstation of choice was a core i7 beefy desktop his was a MacBook Pro. I found it fascinating that he could work effectively even when dealing with Flash IDE running in a virtual machine and he depended on the touchpad exclusively too! He is my proof that modern Macs are usable by developers in my field. 

I decided to try. But first, I was facing the dilemma of whether to wait for the inevitable 2014 line of products or get the current 2013 refreshed generation. For that I researched Apple's recent history and support policy of their older generations and I found it to be acceptable. They only release major upgrades to their product lines roughly once a year giving their products cycle extended lifetime and because they usually use the best hardware available the differences are incremental and small between generations, within 10% from a performance perspective. So even a 2012 MacBook is still technically very capable. 

## Air vs Pro

Next big question is which configuration to get, an Air or a Pro? that was a question I researched for a while and until the last second I was leaning towards a 13.3&#8243; Air (2013). It was less expensive, its PCIe SSD and 4 threads core i5 should be sufficiently powerful for compiling/debugging large projects and my two favorite metrics: an unmatched battery life of 12 hours and at only 1.35 kg (2.96 pound) it was lighter than my old ultrabook! The only issues related to my usage are the limited non-upgradeable RAM of 4GB and the limited display resolution of 1280x800. For the RAM I had absolutely no idea how OSX memory usage is. The information I found online are mostly "you get more RAM to run more apps" kind of comments which are very subjective and don't really provide any useful data. I know that OSX is like Linux in that it allocates as much memory as it thinks required even if most of it doesn't end up being used by something and there is the swap factor, so it is a difficult metric to measure. I know that for a Windows 7 Home 4GB were perfectly enough for my usage, so I assumed that 1: it should also be sufficient for OSX Maverick and 2: Apple wouldn't create a high quality product and put less RAM than it needs at the end.

![airpro]

The display resolution issue is more tricky. I got used to working on 1920x1080 and in fact most of the time I wish I have more space in my desktop monitor. Judging from past experience most likely 1280x800 will end up causing a huge pain especially if I'm planning to do serious amounts of work on the move in the coming months.

Pro on the other hand comes in 8GB and 2560x1600 Retina display, both magnificently solve the two issues I have with Air. Pro also comes with a slightly faster CPU, Don't let the difference between Air's 1.xGHz and Pro's 2.xGHz fool you.. they will both throttle up to the same frequency range when heavy processing is required lowering the performance difference to 10%-15% for most practical cases. The Pro though is significantly more expensive than the Air, and frankly it's not worth getting an entry level Pro because it matches the Air in limitations but provides less battery life (12h vs 9h) and slightly heavier (1.35 kg vs 1.5 kg).

![res_comparison]

I ended up taking the fall and shelling out the difference for an 8GB Retina Pro, but I'm keeping in mind Apple's return policy in case I end up not finding enough justification for Pro over Air for my usage within the coming few weeks.

## First Impressions

I've only had it for 2 days now but I'm already putting it under a fair amount of pressure, in fact writing this very post is nothing more than a usability stress test.

The RAM usage so far it hovers around 4-7GB, which leads me to believe that going for the 8GB configuration was a sound decision.

Here are my current impressions, mostly positive for now:

- App icons sparkle in launchpad after they get updated.
- Everything is silky smooth! 8D
- Retina display includes an extremely useful feature, ability to scale view to get more space when needed up to maximum native resolution. That means for many window applications like any IDE really it's possible to just up the display and instantly get more space. I wish my desktop monitor had something like that.
- There are many differences in how keyboard works, nothing too annoying so far. Keyboard is physically excellent.
- Touchpad is extremely accurate compared to the vaio touchpad and its fully clickable surface is more useful than I thought! Dragging is a breeze.
- It's shocking how sturdy the palm wrest areas feel in comparison, the unibody really shines here I think. 
- Mac OSX comes with a LOT of useful software. Including stuff that make me very happy like Python and Ruby.
- After installing brew, jekyll via gem, building latest ninja from source and then using that to build TextMate2 (which is what I'm using now to write this), the Linux vibe tickles my heart.
- The magnetic charger makes the nerd in me very happy.
- App icons sparkle in launchpad after they get updated.

And the few negatives:

- Some Apple software feels a bit too intrusive for my taste.
- My USB wireless mouse doesn't work directly, probably requires some special drivers.

That's it, I'll wrap this post here before I end up writing a book.

To be continued once I start getting some serious compiling/debugging done.

![pcmac]