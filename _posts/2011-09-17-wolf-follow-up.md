---
layout: post
title:  "Wolf: Follow Up"
description: "Wolf prototype progress report"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

I couldn't sleep yesterday, I slept this morning around 10 am (being nearly 25 hours awake.. typical) only to be awaken by the gas company wanting to install the new gas line in my kitchen around 2 pm, that's 4 hours of sleep... but all is well :)

I was kinda harsh on Away3D, that's probably because I come from a native performance background, when I draw a polygon and watch the framerate drop 0.01 frames I freakout and start running and cursing. In addition to that doing this rapid gamedev thing kinda twists how I judge stuff, I want to get things done as fast as possible (within minutes ideally) and if a solution doesn't act the way I think it should at the time, it costs me preciousss minutesesss, and then I start cursing more.. yep, there is a lot of cursing involved in gamedev :D

Today is my rest and I'm taking things at a much slower pace, I went to Away3D site and looked at the showcase demos they have for the first time, and there are pretty impressive things in there! like Raveleijn (a dutch MMORPG) for example:

<figure class="video_container">
	<iframe width="540" height="304" src="https://www.youtube.com/embed/xGtTaUGAUF8" frameborder="0" allowfullscreen></iframe>
</figure>

Great, now I feel like an ass, especially since one of the developers of Away3D twitt..ed (?) me asking about what kind of problems I was facing and suggesting I take it to the away3d forums, and I was pretty ticked off at the time but I think he understood the situation. (btw I love open source projects like away3d, honestly love them, I want to marry one and have little forks.. I have like a fetish for open source projects.. ok I'm gonna stop now lol)

Oh yes, about Wolf... so I ran around and showed what I have to different kinds of people, other indie game developers (who are all awesome) ask immediately about what am I going to do about the lighting and that I should add at least fog so the polygon popping (due to aggressive clipping) is less noticeable.. Gamers give the occasional encouragement while hiding the fact they are comparing my Wolf to Call of Duty (CoD doesn't stand a chance), meanwhile people from outside the games community just get confused with a "what is this I don't even..." look.

Now there is a decision to be made, but first the purpose behind Wolf was to hit multiple targets at once with one ray:

* Work on Flash 3D libraries to figure out what they are all about, are they useful for serious projects?
* Create a complex game iteratively depending on emerging design, there is no classic design document or any kind of presuppositions about what it should be neither mechanically nor artistically, basically I'm just making up things as I go
* Develop the skill of finishing games quickly, learning to sacrifice the right things in exchange for shorter development time, with the main objective being fun gameplay
* Trolling teh internet, which is what I'm doing right now ;)

Obviously, Wolf isn't even a game yet.

So the decision is, will I give it another 72 hours of development? in which case I should specify exactly what to do during the 3 days to hopefully arrive at a playable fun game at the end.. or should I just accept the lessons I learned here and move on to the next challenge?

p.s I just realized a quick method to give Wolf considerably more performance, just render to a smaller screen and scale up! it's supposed to look pixelated to begin with, I'm just pixelating it in HD hehe
