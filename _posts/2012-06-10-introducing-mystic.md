---
layout: post
title:  "Introducing Project Mystic"
description: "New project I'm working on"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2012 blog**

Mystic is a new personal demo game project I'm working on, it's supposed to be a multiplayer co-op variant of a space shooter, the exact details of gameplay are still not yet defined, but I already put a bunch of hours into it.

![mystic]({{site.baseurl}}assets/photos/tumblr/mystic-1.jpg)

p.s. Mystic is the project code name, the actual name of the game is going to be different.

The highlight features of Mystic are going to be:

* Multiplayer co-op gameplay, 1-4 players
* Facebook integration
* Player matching/game lobbies
* Flash, shader-driven via Stage3D and AGAL

Technically, my implementation is going to be:

* Design: fully iterative, I start with a rough idea and build gameplay experiments around it, keep what's fun ditch what's not, until I have a solid mechanic to build a game around and extend.
* Platform: Flash 11+ and Stage3D with AGAL. Frankly I would go the Unity3D route if I had access to fullscreen shader-driven effects (or at least low-level access to render-to-texture), but the free version doesn't allow either and I can't afford the pro version for a mere experiment.
* Shaders: AGAL, however by the time I start writing serious shaders I'll look for a higher-level alternative, otherwise it may be worth it to do a CG assembly to AGAL converter (if that's possible at all) and a few utility pythons to automate the process.
* Graphics: 2D running on GPU with advanced shader effects (motion blur, lighting, particles, etc..), it should retain the soul of retro but looks and feels quite modern at the same time. I might go for something kinda like what Ethanon does: [http://www.youtube.com/watch?v=Xmn6zhDJGLE](https://www.youtube.com/watch?v=Xmn6zhDJGLE)
* At first, I considered writing my own game framework on top of Stage3D, but then I discovered Starling and the fact it already includes most of what I had in mind like batch rendering and texture atlas support. But it lacks a main feature I need: shader functionality, by display object and fullscreen, so I have to add support for that myself, would still take a lot less time than if I started from scratch. Did I mention that Starling is open source? ^_^
* Networking: this is still not very clear at the moment since the gameplay mechanics are not defined yet, my first choice would be Player.io but if I require high-frequency low-latency updates (aka UDP) [Player.io](https://playerio.com/) might not be an ideal solution since it only supports TCP and apparently a maximum of 10 messages per second (100ms minimum latency) ([related discussion](http://playerio.com/forum/multiplayer/any-plans-for-udp-t34074)). I might investigate other solutions like Heroku (if it's capable of something like this at all), or perhaps directly running the server on a rented host. The problem here is that changing the server might mean changing the solution entirely, so if I picked something unsuitable and then wanted to switch to something else in the middle, I'll probably have to rewrite the server-side from scratch.

Goals:

* Creating an awesome game of course ;)
* This would be my first personal multiplayer game, and first time doing motion prediction and latency compensation.
* Adding full support for Facebook and Server/Client communication to my Actionscript 3 library.

CODE NAW!
