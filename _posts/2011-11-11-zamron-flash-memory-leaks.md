---
layout: post
title:  "Zamron + Flash Memory Leaks?"
description: "Zamron progress"
category: gamedev
tags: [gamedev,as3,flash,indie]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

I’m having an issue with a massive memory leak about 8MB per level in Zamron, even though I’m making extremely sure to remove and nullify everything after a level ends… Away3D seems to not have a hand in it even though it’s what I’m using to render the game.

Going to investigate embedded textures and also look for any lingering events that might be causing this. Definitely had more productive days..

Here’s a hilarious song about pentiums and corporate nerds hehe

<figure class="video_container">
	<iframe width="540" height="304" src="https://www.youtube.com/embed/qpMvS1Q1sos" frameborder="0" allowfullscreen></iframe>
</figure>