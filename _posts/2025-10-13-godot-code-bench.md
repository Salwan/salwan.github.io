---
layout: post
title: "Godot GDScript/C# Benchmark"
description: "Benchmarking Godot's code performance through its evolution"
category: gamedev
tags: [godot,gamedev]
---
{% include JB/setup %}

Yesterday I found this Godot little bench I created a few years ago to quickly evaluate whether Godot GDScript's interpreter is fast enough for a commercial project that could possibly target Nintendo Switch. This was important because I've been biten by cpython in the past (py2.7) where a simple 2D arcady game struggled to reach 60 fps on certain underpowered laptops to my disappointment.. and GDScript while not python is almost identical in many ways.

At the time (a few years ago), I used my Nvidia Shield TV as the analogue for the Switch and the performance didn't inspire confidence. I had two choices switch to the .NET version of Godot or adopt GDScript and use C++ for later optimization of bottlenecks.

I opted for the C++ route since that's my main language and I intended to port the game to Switch later (though at the time I identified lack of hot-reloading of Godot's native extensions as a problem which has been solved around Godot 4.2). Ultimately the project didn't get further than a vertical slice and a mini demo so never needed to cash my C++ in.

Today just to have a few hours of fun I wanted to revisit that simple bench to plot Godot's performance progress. This is by no means an objective benchmark it's just for fun so I'm not even gonna share the code, but still a good indication of comparative interpreter progression I think.

Runtimes are tested on a PC with an AMD Ryzen 7 3700X and an AMD RX 590 GPU on Windows 11.

|-----------------+-----------------+--------------------------+--------------|
|Godot            | Release Date    | Runtime (less is better) | Binary size  |
|-----------------|-----------------|--------------------------|--------------|
|Godot 3.5.2      | March 2023      | 1.209                    | 37.181 MB    |
|Godot 4.0.4      | August 2023     | 1.366                    | 64.201 MB    |
|Godot 4.1.4      | April 2024      | 1.362                    | 67.309 MB    |
|Godot 4.2.2      | April 2024      | 1.319                    | 67.977 MB    |
|Godot 4.3        | August 2024     | 1.316                    | 82.145 MB    |
|Godot 4.4.1      | March 2025      | 1.056                    | 95.137 MB    |
|Godot 4.5        | September 2025  | 0.537                    | 94.396 MB    |
|Godot 4.0.4 .NET | August 2023     | 0.017                    | 65.385 MB    |
|Godot 4.5 .NET   | September 2025  | 0.017                    | 94.629 MB    |
|-----------------------------------------------------------------------------|

Now this is interesting!

Along with the star of additions in 4.5 in my opinion: stencil/depth-write effects, the Godot team found a way to DOUBLE the performance of GDScript runtime! (at least for my specific test script). That's some amazing progress in 1 version.

I've skimmed [the list of changes in 4.5](https://godotengine.org/releases/4.5/) but could not easily pinpoint where that 2x jump in performance could be coming from, but it's great news!

Naturally the .NET (C#) runtime is basically native performance level thanks to JIT compilation. A runtime boost that could reach 30x-80x depending on whether you use Godot 4.5 or prior versions. Which begs the question, why would anyone opt for GDScript/C++ instead of C# at this point?

To answer that you must decide from the beginning whether you want to port your game to Android/iOS or Switch/Playstation/XBOX/etc. The GDScript version is more versatile in regards to porting to current and future platforms that don't exist yet. Although [MonoGame](https://monogame.net) has managed to do it (Supergiant Games: Bastion, Transistor, and I think Hades as well).

The second reason is the excellent deep integration of GDScript in Godot as its native scripting interface.

Android/iOS has gotten some meaningful updates in 4.5 and seems to be a focus for the team but is still marked as experimental at this point.

Regarding consoles I know there are commercial providers to port Godot games and they may already provide full C# support? I haven't looked into that for a while.
