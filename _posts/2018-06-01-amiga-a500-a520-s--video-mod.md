---
layout: post
title:  "Amiga A500: A520 S-Video Mod"
description: "Modifying A520 for Amiga A500 to output S-Video"
category: amiga
tags: [amiga,electronics,retro]
published: true
---

{% include JB/setup %}

[my_amiga_a500]: {{site.baseurl}}assets/photos/amiga500/my_amiga_a500.jpg "Day 1 Amiga A500"
[a520]: {{site.baseurl}}assets/photos/amiga500/a520.jpg "Commodore A520"
[svideo_testing]: {{site.baseurl}}assets/photos/amiga500/svideo_testing.jpg "Testing conversion of S-Video to RCA video"
[svideo_testing2]: {{site.baseurl}}assets/photos/amiga500/svideo_testing2.jpg "Looking Good! Time to wrap up"
[svideo_before_after]: {{site.baseurl}}assets/photos/amiga500/svideo_before_after_comparison.jpg "Comparing video output from original A520 and modified A520"
[a520_ready]: {{site.baseurl}}assets/photos/amiga500/modified_a520_ready.jpg "Finished A520"
[svideo_ready]: {{site.baseurl}}assets/photos/amiga500/svideo_done.jpg "S-Video A520 ready!"

[svideo_conversion_guide]: http://members.iinet.net.au/~davem2/overclock/A520.html
[svideo_to_rca]: {{site.baseurl}}assets/photos/amiga500/svideo_to_rca.gif

When I bought my [Amiga A500](https://twitter.com/zenithsal/status/735033118126538753) from [TradeMe](https://www.trademe.co.nz/) it came with a compatible monitor which had some old-monitor problems related to picture quality. I expected that as CRT monitors do tend to deteriote in quality over the years and also tend to die suddenly.

![my_amiga_a500]

I was not proven wrong as the monitor did die a few weeks later with a click and a whine. 

The Amiga A500 has a video-out port but puzzlingly it outputs in greyscale only.

I searched for how to connect the Amiga to a modern monitor using either RGB or HDMI and found that the only indirect way to do it is using an ugly commodore adapter device called A520 which provides an RCA video-out signal in color as well as RF out.

![a520]

Someone was selling a pair of these on ebay so I got them, they both worked but one of them seemed to need some maintenance as it required a bit of fiddling around when plugged in to output in color. Sometimes it insists on only outputing blurry greyscale.

I ran the output to an LCD TV using RCA video and audio out, both produced awful blurry quality picture that made it very difficult to read any text. Since then the Amiga was all but unusable.

# Modifying to output S-Video

I had to decide what to do with the Amiga (either sell it or find a way to get good quality output making it usable again), when doing a quick search I found this [great step-by-step guide][svideo_conversion_guide] to converting the A520 to output S-Video signal which should make it usable again.

I decided to try it. Ordered the electronics components I needed 2 weeks ago and when they arrived setup a work area and spent a day going through all the steps. After many hours and 3 solder-iron burns I got it done. I just needed to test it.

# S-Video to RCA Video Out

S-Video output means I get two signals out of the modified A520 one called Chroma (letter C) and one called Luma (letter Y for some reason). It wasn't clear in the guide how to convert that to a single RCS video-out signal, there are commercial S-Video to RCA converters but I felt since I went this far might as well try adding the conversion to the circuit.

Upon googling, I was surprised that this conversion requires a single component and it's extremely easy to do! Just a single capacitor 470 μF across the Chroma and Luma outputs.

![svideo_to_rca]

Did a quick breadboard test and voila! Got video out to display on TV:

![svideo_testing]

![svideo_testing2]

The difference was very clear even for a camera:

![svideo_before_after]

Adding that capacitor to the output then rewiring and reseating the board and we got a modified A520 ready for use:

![a520_ready]

I left it running for many hours to make sure everything is working as it should

![svideo_ready]





