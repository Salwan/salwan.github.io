---
layout: post
title: "Running native mode GL on Raspberry Pi Zero"
description: ""
category: raspberrypi
tags: [linux,opengl,raspberrypi]
---
{% include JB/setup %}

I've always found the RPiZ interesting due to it being so limited and slow (lol) kind of why I like Amiga A500 or Atari ST.

My vision for the RPiZ was to use it like it's a low level development gaming platform with a respectable GPU compared to older GPUs before DirectX9. The problem is that modern day linux (Raspbian included) is way too much for this little chip that it makes it almost impossible to use for GUI-based development and the super-outdated and bloated X11 tasks the hardware too much that any OpenGL performance is completely unpredictable and choppy.

The RPiZ comes with an ARM11 processor that uses the arm6vl architecture. It has a floating point co-processor (called vfp) and some not-so-useful extensions like running Java byte code in hardware. The RPiZ runs the processor at 1000MHz which sounds like a lot.. but it pales compared to a Pentium III 600MHz for example. I heard it compared to a Pentium II 300MHz with a small cache and a terribly limiting IO bandwidth.

Its GPU is the Video Core IV which on paper supports OpenGL ES 2.0 and uses a tiled-renderer. It's quite cool that this GPU is entirely detailed in [this freely available document](https://docs.broadcom.com/doc/12358545). On paper it has a compute capacity of around 24 GFLOPs. The GameCube is said to have 9.4 GFLOPs in comparison. There is no way the VC4 can produce the same rendering level as the GameCube as it doesn't have dedicated memory or enough bandwidth to do anything like that.

How can we get the true GPU performance with minimal intrusion from the operating system?

1. we could boot from baremetal and use [the Circle library](https://github.com/rsta2/circle) to access the hardware including the vc4 GPU with OpenGL
2. we could run natively from command-line by starting our own framebuffer and using that

I like the first solution as it sounds like a lot of fun and is the fastest, but it has an expensive overhead and iteration during development is going to be a challenge.

I opted to do the second solution as it appeared to be the easiest. I know that SDL can do native build with graphics support but I was able to find a great library similar to one I was developing 2 years ago except it's actually finished lol and it's [raylib](https://www.raylib.com/index.html).

### Build Raylib with native

I used a fresh DietPi image on RPiZ, to build raylib with native graphics I did:

```
mkdir build && cd build
cmake .. -DPLATFORM="Raspberry Pi" -DBUILD_EXAMPLES=OFF
make PLATFORM=PLATFORM_RPI
sudo make install
```

To build the examples there are a few things that need to be done:

* add `atomic` library to examples/CMakeLists.txt in the build loop at the end of `target_link_libraries` so it should look like this: `target_link_libraries(${example_name} raylib atomic)`
* exclude two examples from building due to a conflict in GL, add these before `if (${PLATFORM} MATCHES "Android")`
  * `list(REMOVE_ITEM example_sources ${CMAKE_CURRENT_SOURCE_DIR}/others/rlgl_standalone.c)`
  * `list(REMOVE_ITEM example_sources ${CMAKE_CURRENT_SOURCE_DIR}/others/raylib_opengl_interop.c)`

Then rebuild raylib with examples: `-DBUILD_EXAMPLES=ON`

Keep in mind if you're doing this on Raspberry Pi 3, you don't need any of the changes to build it correctly and you should also build the "DRM" mode rather than "Raspberry Pi" mode which is legacy.

So on RPi3 this is how to build:

```
cmake .. -DPLATFORM=DRM
make PLATFORM=PLATFORM_DRM
```

you'll need a few extra dev libraries to build correctly: libgbm-dev and libdrm-dev

### Results

Not great. Mostly due to the driver not being great. OpenGL seems to be missing VAO support and blending is a bit glitchy (running textures_bunnymark shows no bunnies!), also R32G32B32 texture format is not supported which is needed for the skybox example. Also the PiZ hard freezes at random after a while, but this could be my RPiZ only as I always had this issue.

Another odd issue is that running audio_module_playing segfaults.

Other than that, when it works it feels great! instant startup and smooth.

Here's the spotlight example showing how expensive this is on the GPU even if it was running at 800x450 only:

<video width="720" height="480" controls>
  <source src="{{site.baseurl}}assets/videos/rpiz_native/VID_20230310_104833.webm" type="video/webm">
Your browser does not support the video tag.
</video>

Here's the maze example working correctly:

<video width="720" height="480" controls>
  <source src="{{site.baseurl}}assets/videos/rpiz_native/VID_20230310_105124.webm" type="video/webm">
Your browser does not support the video tag.
</video>

And here's the cubes example to show how terrible the performance could get, however this demo in particular could be running into a feature reported by the driver to be available but it's actually running in software but I don't know that for certain:

<video width="720" height="480" controls>
  <source src="{{site.baseurl}}assets/videos/rpiz_native/VID_20230310_104942.webm" type="video/webm">
Your browser does not support the video tag.
</video>

Yeah, you could probably make simple graphical demos but this is not what I'd expect from a 24GFLOPs GPU and I blame the vc4 driver.

I tried this same thing on RPi3, compilation runs much faster naturally but the issues graphical and beyond are all there too as it uses the same vc4 driver including the missing bunnies in textures_bunnymark :(

RPi4 might be the one? haven't tried it yet.
