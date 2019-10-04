---
layout: post
title:  "Practical WebGL?"
description: "Exploring the potential future of WebGL"
category: gamedev
tags: [gamedev,webgl]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

After taking a look at a few real WebGL demos including a quality platformer game, this thing is starting to look and feel even better than Flash Stage3D, and definitely faster since it doesn't have the bloated Flash player underneath it. And because it's based on OpenGL ES 2.0 it offers both a familiar API and a fully shader driven pipeline, it actually beats all past plug-in based approaches like O3D.

But let's face it, WebGL as a game platform would still suffer from multiple disadvantages.. the major two being source accessibility allowing anyone with a browser to not only have direct access to the source but actually the ability to modify it on the fly, and difficulty of distribution (HTML5/WebGL games can't be packaged as one file, until now at least). There are also some technical difficulties like HTML5 audio not being designed with realtime applications in mind, but these things are being fixed as the WebGL standard is developed.

It is still very exciting because of one thing: availability across a large user base.. given the fact that recent handheld devices have real GPUs built in them, things like [NVIDIA Tegra](https://en.wikipedia.org/wiki/Tegra) will eventually close the performance/capabilities gap between handheld and mainstream graphics which is already kinda happening! take a look at gaming on the recent hot Android/Tegra3 based Asus Transformer Prime tablet (too much awesome :D)

<figure class="video_container">
	<iframe width="540" height="304" src="https://www.youtube.com/embed/hL5Pg15eDBU" frameborder="0" allowfullscreen></iframe>
</figure>

So let's imagine writing an HTML5/WebGL game that instantly runs on any WebGL supporting browser regardless of platform and looks as good as these games... not hard to do technically if it isn't already possible, all the platform dependent mess is sorted by the browser while we get a thin layer between our game and the actual GPU underneath...

![Yeaaa]({{site.baseurl}}assets/photos/tumblr/emoji-1.png)

few WebGL demos: (supported browsers: Chrome 9+, Firefox 4+, Safari 5.1+, Opera 12+)

* [Interactive music demo](http://inear.se/beanstalk/)
* [Emberwind, a platformer game](http://operasoftware.github.io/Emberwind/)
* ['The head' skin rendering demo (or WebGL shaders flexing some muscles)](https://alteredqualia.com/three/examples/webgl_materials_skin.html)
* [Physical simulation running on WebGL fragment shaders](https://www.cake23.de/traveling-wavefronts-lit-up.html)

There are already a bunch of JS engines/frameworks for WebGL out there:

* [Three.js](https://github.com/mrdoob/three.js) - lightweight
* [PhiloGL](http://www.senchalabs.org/philogl/) - mature (originally developed for O3D)
* [GLGE](http://www.glge.org/) - a bit more complex with advanced capabilities

and more!

Excitement!
