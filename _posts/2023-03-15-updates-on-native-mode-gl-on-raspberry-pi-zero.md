---
layout: post
title: "Updates on native mode GL on Raspberry Pi Zero"
description: ""
category: raspberrypi
tags: [linux,opengl,raspberrypi]
---
{% include JB/setup %}

After [last post](https://zenithsal.com/raspberrypi/2023/03/10/running-native-mode-gl-on-raspberry-pi-zero) I had a few realizations when I compiled raylib and tested the same examples on my aging Macbook Pro that I've revived. The module music example crashes the same way! so the RPiZ/3 were innocent. And the colored cubes example is very expensive to run on the Intel Iris 5100 too which is not a slouch. So I had to redo these two tests to make sure I made a correct evaluation.

First, running a different cubes drawing demo on RPiZ resulted in a solid 60 fps:

<video width="720" height="405" controls>
  <source src="{{site.baseurl}}assets/videos/rpiz_native/vid_cubes2.webm" type="video/webm">
Your browser does not support the video tag.
</video>

Also I realized the reason why the textures_bunnymark demo didn't show any bunnies on the Raspberries is that I had to modify it to emit bunnies with keyboard input since there is no mouse cursor when running native GL like that, but all the bunnies were being spawned at `GetMousePosition()` which always returns origin of screen in this case and the bunnies stay under the top rectangle!

So now the bunnies are spawned in the center and it works perfectly:

<video width="720" height="405" controls>
  <source src="{{site.baseurl}}assets/videos/rpiz_native/vid_bunnies.webm" type="video/webm">
Your browser does not support the video tag.
</video>

Can render up to 2000 alpha-blended bunnies to the framebuffer while maintaining a solid 60 fps! that's not bad at all for 2D games. Once we get to 2100 bunnies the performance drops drastically from 60 to around 52 fps. This kind of predictable performance is only possible in native mode, so I consider this experiment a success. 🙌
