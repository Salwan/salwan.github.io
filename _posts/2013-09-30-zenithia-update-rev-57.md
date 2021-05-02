---
layout: post
title: "Zenithia update - Rev 57"
description: "Zenithia updates"
category: zenithia
tags: [zenithia, cpp, direct3d]
---
{% include JB/setup %}

Today I worked on the mesh parsing section of Zenithia and got a basic scene-graph up and running that supports multiple nodes, meshes, subsets, and basic materials. The screenshot below is from a collada model exported from blender that includes multiple nodes, meshes, subsets, and textures.

The model is rendered using a simple fx effect and all resources are loaded in the resource thread and swapped to the scene at runtime by the resource system.

![Collada Mesh Rendering]({{site.baseurl}}assets/screenshots/zenithia/zenithia_3092013_1.jpg)

I also added a basic logic component to the list of components in Zenithia now, as its name implies any scene-node logic should go there as well as setting custom effect constants. Standard effect constants like transformation is set by the scene-graph automatically.
