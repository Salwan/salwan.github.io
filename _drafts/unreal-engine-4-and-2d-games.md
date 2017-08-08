---
layout: post
title: "Unreal Engine 4 and 2D games"
description: ""
category: 
tags: []
---
{% include JB/setup %}

[mario-ue4]: http://www.youtube.com/ "Feast your eyes and confuse your brain's reality/fantasy processing centres: Mario in Unreal Engine 4"
[ue4-logo]: http://www.unrealengine.com/ "Unreal Engine 4"

I wanted to explore [Unreal Engine 4]() as a possible choice for my personal projects and as part of preparing for a professional move. Compared to [Unity](), UE4 uses C++ mainly and it's a next-gen engine with incredible graphics fidelity and an astonishing set of features. It also comes with the full source code and a no cost license: Unbelievable for an engine that one day not so long ago costed many thousands of dollars per license per platform! And a step ahead of Unity.

I was also interested in 4 because I felt with it Epic were trying to compete with Unity's intuitive ease of use and slew of supported platforms + faster prototyping and zero overhead programming - Unity's bugs and missing features locked behind its closed source mentality - the relatively expensive licensing. 

So I started with some basic tutorials which mostly focus on Blueprints (a much more capable Kismet) and my first impression is that Epic's decision to ditch UnrealScript in favour of visual programming is a very bold move. Blueprints feel a lot like a literally-visual C++.. and I gotta admit, somehow they nailed it.

However, as with any visual programming method there are several drawbacks and some are serious. The big obvious drawback is that UE3 games depended on UnrealScript a lot and that makes migrating code bases to UE4 an insurmountable task, something that I believe directly contributed to Rock Steady sticking to their heavily modified Unreal Engine 3 for developing Arkham Knight instead of moving to 4 which is a the next step feature-wise and performance-wise (although certainly less stable at this point).

About 2 weeks ago there was a game jam competition called 'gamesequel' hosted by [AGDN](http://www.agdn-online.com/). The challenge was to pick an old classic game and then making a sequel that changes features and adds new ones to the game. I decided to enter with Unreal Engine 4 and one of the games I found intriguing as a child on Atari 2600: [Pitfall](). Of course using an engine I'm not yet very comfortable with is a bad idea. I didn't finish in time and actually wasn't close to implementing Pitfall's original features let alone make changes and additions.
One of the mistakes I made early on was insisting on making it fully 2D. After trying Paper2D I decided to use that and a few techniques used in the example game "Tappy Chicken" which had a 16-bit retro feel to it.
Based on what I know now, I might have had better luck doing it in a hybrid 3D/2D mix (Level geometry use orthographic 3D. Sprites use Paper2D).

I was planning to use UE4 browser support which uses [asm.js]() (via [emscripten]()) and WebGL for rendering. First problem was that even for a very simple level with nothing but a few low resolution textures the size of the output package after numerous tweaks to shrink size is about 80 MB! there is 60+ MB of Unreal stuff mostly asm.js code there. However this isn't a deal breaker, requiring a 64-bit Chrome or Firefox (exclusively) is. Both these browsers are distributed in 32-bit by default and you have to deliberately search for and install a 64-bit build of either to be able to run your packaged game in a browser. 

So I tweaked down my expectations to a desktop build instead (Windows and OSX) and started working on the game with that in mind. After jumping over a couple of obstacles (to create a game about jumping over obstacles) I ran into a more serious issue, performance. I tweaked down every quality setting to minimum and created a custom post processing volume (with a simple shader that renders the game in Atari 2600 resolution: 160x192) and to my surprise for only a few quads and Paper2D sprites the performance was awful on my MBP running an intel iris 5100 GPU, in fact less than 30 frames/second!
After a few more tweaks and shortcuts I managed to get the framerate up to 30-40. However a new issue emerged that I don't know how to solve yet without diving into engine code: constant framerate fluctuation. 
The framerate keeps going up and down between around 28 to 42 frames and that produces very jerky motion and frankly, I can't think of one reason why a few quads with all engine effects disabled would lead to that.

Searching around the web I was able to find several developers reporting simple 2D graphics leading to awful performance in Unreal Engine 4 and the official response is that the machine in question is below the engine's minimum requirements (regardless of how simple or complex the game is).

I should also add another issue I experienced. Doing Unreal Engine 4 on a Macbook Pro with a 7-9 hours of battery life (normally) brings the battery life to around 1 hour. There is the option to disable realtime viewport rendering which makes an impact but the usage is still very high compared to Unity.

My conclusion is clear and I don't think its much of a conclusion to begin with: Unreal Engine 4 in its current state (version 4.8.1) is still not suitable for doing small or 2D games (Paper2D is actually considered an experimental plugin). The engine assumes a minimum level of graphics fidelity and capability that far exceeds what's required for simple games or 2D games and its code is optimised to work on high end hardware and will suffocate on anything lower than that even if you render nothing.

For 3D games, Unreal Engine 4 is perfect and unmatchable. Full code access? rapid prototyping? direct C++ coding with minimal overhead? 
The renderer defaults to physically-based rendering which makes even my awful 3D modelling skills shine.. and that alone is plenty XD

![mario-ue4]

Next step: switching gears and reimplementing Pitfall Sequel in Unity.

