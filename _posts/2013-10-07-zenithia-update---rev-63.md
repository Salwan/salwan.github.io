---
layout: post
title: "Zenithia update - Rev 63"
description: "Zenithia updates"
category: zenithia
tags: [zenithia, cpp, direct3d]
published: true
---
{% include JB/setup %}

Just a quick screenshot showing some progress:

![Basic lighting shaders]({{ site.baseurl }}assets/screenshots/zenithia/zenithia_7102013_1.jpg)

I implemented a common shader library and 3 basic effects using shader model 3 and fx effects: 

- Basic per-vertex lighting: ambient, diffuse, specular, and emissive lighting. Shader supports 1 point light and/or 1 directional light per-pass.
- Basic per-pixel: same lighting equation but calculated per-pixel.
- Wireframe shader for gizmo rendering.

I also added basic camera and lights scene node objects.

