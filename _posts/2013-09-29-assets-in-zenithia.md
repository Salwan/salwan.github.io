---
layout: post
title: "Assets in Zenithia"
description: "How assets are treated in Zenithia"
category: zenithia
tags: [cpp, zenithia, direct3d]
---
{% include JB/setup %}

Dealing with resources is one of the most complex aspects of a graphics/game framework, this is due to the fact that:
* there are a lot of resource types each could be using a different format.
* some resources involve complex relatively expensive parsing.
* some resource types need to be associated directly with a device object, and that introduces several caveats.

I wanted Zenithia to be a streaming-based framework, so basically what I do is load all data from disk without blocking the main thread.

At the moment Zenithia follows this pattern to load resources:
* Resource system creates resource and calls resource.prepare() function in the main thread.
* Resource system adds the resource to the task queue of the resource thread.
* Resource thread calls resource.loadData() which will actually read all data from disk in the resource thread, this must not involve any device object access since Direct3D9 is tied directly to the creator thread (the main thread in this case) but Direct3D11 supports loading and creating objects in a secondary thread, so a lot of refactoring may takeplace later on to make use of that.
* Resource system is notified when loading data is finished
* Resource system calls resource.finalize()

But this introduces a problem, what happens if the application tries to use a resource before its loading is finished?

At the moment my solution is very basic: each resource type generates a placeholder resource when resource.prepare() is called which makes the resource valid to be used immediately by any element in the framework. When resource.finalize() is called I interchange the placeholders with the actual loaded objects.

There could be a lot more involved and practical solutions, simplest is probably preloading a low-resolution version of the resource being created and using that as a placeholder until the actual resource is loaded. For example if it's an in-game model then it would make sense to preload low resolution textures and meshes involved in addition to collision and physics information. I believe this is the exact process UnrealEngine3 uses except they load multiple resources concurrently and have a much more involved system for generating placeholders.

