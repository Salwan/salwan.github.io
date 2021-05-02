---
layout: post
title:  "ٌReview Over!"
description: "Reviewing gamedev relevant stuff and job hunting"
category: life
tags: [life]
published: true
---

{% include JB/setup %}

**This post is migrated here from my 2012 blog**

Well, it has been a very productive month, I successfully reviewed most of the relevant knowledge to my current professional direction diving in deeper and filling what gaps I have in these subjects:

* Trigonometry
* Calculus
* Linear Algebra
* C/C++
* STL
* Data Structures
* Boost
* Memory operations
* Modularity
* Portability
* Multithreading principles and patterns
* Windows API
* Direct3D9

On the code front, I did some work on Zamron based on the beta feedback I got via FGL (Flash Game License, a dead website for selling Flash games to publishers) but I’m going too slow.. I’ll probably give it a little more focus this month, and I’ve also been writing a Windows API/Direct3D9 framework that I’ll be using and developing iteratively for my demos, today I’m implementing the Mesh class (D3DXMESH is mostly obsolete, completely removed in D3D11), handling window resizing and device lost state, and writing a Camera class.

There will probably be a light weight scene graph in my near future along with a mandatory resource manager to sort out the mess, but I’ll only write those when I have practical use cases for them.

My first demo is going to be some basic fixed function pipeline thing that makes use of as many ffp features as possible: Texturing/Multitexturing, Blending, Stencils (planar shadow and mirrors), particles, and maybe some basic terrain rendering. The point is to prepare the framework for the shader heavy lifting that’s imminent.

For this new month I’m going to dive into rendering/graphics techniques and algorithms starting from Shader Model 2 generation and taking it from there.

Happy Coding Everyone! :D
