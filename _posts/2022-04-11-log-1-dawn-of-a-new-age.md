---
layout: post
title: Log 1: Dawn of a new age
date: 2022-04-11 13:10 +1200
---

{% include JB/setup %}

I've recently decided to dedicate myself to my passion in GameDev and attempt to make it self-employed. This was approximately 3 weeks ago.

I will try to write weekly or bi-weekly updates logging what I've done so far.

## Week 1: Set my heart a flutter

I've been preping this for a while and one unfinished thing I had to get through is figuring out a suitable pipeline for me to develop Android apps for tooling that I want to manage my time and budget.

The last thing I've done in this domain is attempt to utilize Python for Android app making, which is possible but what I tried was horrendous in its own way. I've looked at both [kivy](https://kivy.org/) and [BeeWare](https://beeware.org) on my Fedora Silverblue laptop.

Immediately ran into issues with kivy that made it a pain to get things running, so I moved on to BeeWare. Now, BeeWare works but there it's anything but focused and compact. Lots of moving parts and things to set up and when you finally get it working, there isn't much documentation and I didn't feel like I got it after doing the tutorials they had available which by the way are incomplete and outdated.

I hate to say it but for the first time, Python failed me. So I decided to move on and focus on modern programming languages that are not derivatives or layers on top of Java like Kotlin is because I dislike Java and its ecosystem. I remember hearing about Flutter somewhere so I jumped there and it's based on this current gen language called Dart. I liked Dart immediately as it reminded me of TypeScript.

When I started doing the tutorials for Flutter, it just clicked and I got what the high-level design was. You define UI layouts in a similar way to writing a JSON spec. Constructors within constructors, kinda like this:

```dart
Widget build(BuildContext context) {
  return MaterialApp(
    title: 'Hello World',
    home: Scaffold(
      appBar: AppBar(title: const Text('Hello World'),
      body: const Center(
        child: Text('Hello World!'),
        ..etc
```

It gets a little too LISP-like with the parentheses you need to manage, but nothing a good editor can't figure out.

With this I was able to put together a simple alternative time app that allows setting up timers through Android's native timers app:

![CMG::Time]({{site.baseurl}}assets/photos/govoldot/cmgtime_app.jpg)

it's pretty simple, [here it is in github](https://github.com/cloudmillgames/cmg_time).
But it demonstrated to me this is totally usable and has a low time cost for developing tools like that.

## Week 1: Unfinished pixel business

Last year during the holidays, I started remaking my childhood game as a tribute to it. It's an old forgotten game called `VOLGUARD` that ran on my first computer, an [NEC PC-6001 Mk2 SR](https://www.old-computers.com/museum/computer.asp?c=39) produced and localized in Iraq.

As a kid, that game inspired and awed me. It just seemed to be too much for my humble machine and I could never figure out how they managed to squeeze that much stuff into it.

![VOLGUARD]({{site.baseurl}}assets/photos/govoldot/volguard.png)

It appears to me that the VOLGUARD version on PC-6001 was the originally developed one. MSX and PC-8801 both got ports with better graphics but they are missing some vital elements like the intro music.

So my goal is to re-make this game maintaining its exact feel and style using Godot. This first week I picked back up what I was doing last year, I've had some good progress going and thought perhaps this is going to be a few days only to finish.. estimated it at 6 days of work to completion..

## Week 2: 90% == 50%

There is this funny thing in gamedev, that if you're working on a project and you believe you're at 90% progress and only a few things left to do... you still got 90% more to go.

I re-learned this lesson with VOLGUARD. A game I gave 6 days but it took nearly double that to get anywhere close to completion.

The biggest time sink is the enemies behavior. Unlike the majority of shovelware games out there that tend to implement enemies with a single braincell that basically says: "see player? run at and attack player". VOLGUARD has actual relatively complex behaviors. A ton of them. Out of nearly 28 variants of enemies, there are roughly 20 of them with unique behaviors!

I developed a good pace in implementing these behaviors and tweaking them to approximate the original game. [My last blog post](https://zenithsal.com/gamedev/2022/04/03/state-management-with-coroutines) was actually based on that.

There are 5 missions. Each introduce new enemies and more variations in behaviors. This game goes to the school of Souls.. you'll die alot but it's because you made a mistake and you can do better. Make no mistakes and you'll breeze right through.

VOLGUARD also had this unique design decision where they allowed you to play any mission out of the 5 at anytime.

At the end of week 2 I had mission 1 fully implemented and tested with all behaviors and enemies, and mission 2 about two-thirds in.

So 6 days in.. progress = 1.5/5.0, not even 50%.

## Week 3: The Light of Release

Last week's work focused on the more complex enemies. I've had to revise or re-implement several enemies as later on in the game I started running into variations in behaviors I didn't account for in my initial implementation.

In Week 3, I finished Mission 2 and was most of the way through Mission 3. In addition to implementation of all the complex enemies. Remaining enemies are easier as they are similar to already implemented enemies with variations here and there making them cost less to implement.

This is when I started seeing some light, that perhaps I could get it released the following week! (this week)

