---
layout: post
title:  "Setting up Stage3D on FlashDevelop 4"
description: "Step-by-step instructions to setting up Stage3D (molehill) and debugger on FlashDevelop 4"
category: gamedev
tags: [gamedev,as3,flash,tutorial]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2011 blog**

**NOTE: Flash is killed by Adobe so I expect all URLs listed here to vanish**

Since Flash 11 is released yesterday, I thought I might as well try the Stage3D (Molehill), at least to set my development tools if I wanted to do something with it in the near future..

The information out there about Stage3D and setting it up with FlashDevelop is confusing and outdated, google didn’t help much, I followed what seems to be the main method to set up the incubator playerglobal.swc and an unofficial flash player debugger which I couldn’t get to “debug” things, then I just found that Adobe did release an official player debugger and playerglobal.swc yesterday! but google didn’t show it in the results probably because it’s very recent and I couldn’t find a direct link for it easily within Adobe Flex/Flash developers pages today (probably because I’m blind), so here it is if someone missed it: [https://www.adobe.com/support/flashplayer/downloads.html](https://www.adobe.com/support/flashplayer/downloads.html)

To set Flash 11 (Stage3D Molehill) up with FlashDevelop 4, first you need [Flex SDK 4 (get the latest stable)](https://www.adobe.com/devnet/flex/flex-sdk-download.html) if you don’t have it already and set it up normally with FlashDevelop 4, then:

1. download playerglobal11_0.zip (or whatever the latest version is)
2. download the Windows Flash Player 11.0 Projector content debugger (“flashplayer_11_sa_debug_32bit.exe”)

### Setting up playerglobal.swc

- rename “playerglobal11_0.zip” to “playerglobal.swc” (don’t uncompress it!)
- navigate to {YourFlex4SDKFolder}\frameworks\libs\player\11.0\
- overwrite the playerglobal.swc you find there with the downloaded file

### Setting up FlashDevelop with Flash Player Debugger 11

- In FlashDevelop, goto Tools -> Program Settings -> Flash Viewer
- Change “External Player Path” to point to your “flashplayer_11_sa_debug_32bit.exe”
- In your project properties, set the platform to Flash Player 11.0, the SDK to the latest Flex 4 SDK you have.. then in Compiler Options -> Additional Compiler Options add this: “-swf-version=13”

That’s it :D
Happy Coding!

Userful resources:

- [Recent AS3 Language reference compiled using asdoc](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/index.html?filter_flashplayer=32.0)
- [AGALMiniAssembler download (it’s not part of the SDK!)]({{site.baseurl}}downloads/AGALMiniAssembler.zip)
- AGALMiniAssembler Primer: [http://web.archive.org/web/20111214082058/http://ryanspeets.com/flash/agalminiassembler-primer/](http://web.archive.org/web/20111214082058/http://ryanspeets.com/flash/agalminiassembler-primer/)
- AGALMiniAssembler opcodes: [Mindmap-1]({{site.baseurl}}assets/photos/tumblr/agal-1.png), [Mindmap-2]({{site.baseurl}}assets/photos/tumblr/agal-2.png)
