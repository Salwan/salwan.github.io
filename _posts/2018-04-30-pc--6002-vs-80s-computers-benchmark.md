---
layout: post
title:  "PC-6002 vs 80s Computers Benchmark"
description: "Simple benchmark for a group of 80s computers"
category: pc-6002
tags: [pc-6001,pc-6002,Warka,z80,retro]
published: true
---

{% include JB/setup %}

[asmblit_gif]: {{site.baseurl}}assets/photos/pc6002/asmblit.gif
[blitz_demo_gif]: {{site.baseurl}}assets/photos/pc6002/blitz_demo.gif
[mode3_text_gif]: {{site.baseurl}}assets/photos/pc6002/mode3_text.gif

# The Benchmark

Didn't have much time last week to finish working on a PNG-to-PC-6001 compressed bitmaps pipeline (next blog post) but I saw [this video on youtube](https://www.youtube.com/watch?v=pxye-RbKFpY) and thought this would make a great quick test of performance level for 80s computers! (mostly z80-based) to understand how they compare to each other.

I used the exact same program in the video:

~~~~ vb
10 FOR I=2 to 1000
20 K=INT(SQR(I))+1
30 FOR J=2 TO K
40 K1=I/J
50 K2=INT(K1)
60 IF K1=K2 THEN GOTO 90
70 NEXT J
80 PRINT I
90 NEXT I
~~~~

This is mostly a test of the embedded BASIC interpreter rather than the processing power in these computers. I'm sure running compiled assembly code should deliver similar performance since all Z80 PCs are running at the same frequency.

|------------------------------+--------------+------------|
| PC                           | Processor    | Total Time |
|------------------------------|--------------|------------|
| Amstrad CPC 464              | Z80 @ 4MHz   | *1:20*     |
| Commodore 64                 | 6502 @ 1MHz  | *2:15*     |
| PC-6001 Mk2 N66              | Z80 @ 4MHz   | *8:38*     |
| PC-6002 (PC-6001Mk2SR) N66 SR | Z80 @ 4MHz   | *3:44*     |
| MSX 1 ([Al-Sakhr 170](https://en.wikipedia.org/wiki/Sakhr_Computers)) | Z80 @ 4MHz | *3:54* |
| MSX 2 and 2+                 | Z80 @ 4MHz   | *3:57*     |
| Amiga A500 AmigaBasic        | 68000 @ 7.16MHz | *0:35*  |
| [This Laptop](https://www.asus.com/2-in-1-PCs/ASUS-Transformer-Mini-T102HA/specifications/) using [Python](https://pastebin.com/0RN4fb0p) | Atom x5-Z8350 @ 1.44GHz | *0.337s* |
|----------------------------------------------------------|


The massive variance in performance is surprising! the PC-6001 Mk2 is especially disappointing.. which is a mystery as it shares the same architecture with MSX, and both use a BASIC interpreter developed by Microsoft around the same time.

The PC-6002 (PC-6001 Mk2 SR) BASIC N66 SR version is much better and is close to MSX's performance which is what I expected.

Ultimately, both are left in the dust when compared to the excellent architectures in the Amstrad CPC 464 and the C64 which is powered by a 6502, a much more efficient processor (same processor as the Nintendo NES).

On the other hand, the Amiga architecture is way ahead along with Atari ST, both targeted a different market (much more expensive at the time) and powered by the 68000 which went on to power the SEGA Genesis/Mega Drive later on. 

For comparison how far things have come, the difference between this low-power low-performance tablet-laptop and the CPC 464 is merely 238x (lol). But if we theoretically drop down the clock for the Atom x5-z8350 from its normal frequency 1.2GHz to 4MHz (a factor of approximately 1/300), it would run the [same benchmark program in CPython](https://pastebin.com/0RN4fb0p) in approximately: 0.337s * 300 = 1:41.10 which puts it below the CPC 464.

By the way, the ARM processor architecture is historically a grandchild of the 6502 processor. In fact the initial instruction set was developed using the BBC Micro BASIC!

<<<<<<< HEAD
Another interesting thing is that the Z80 processor was developed to be software compatible with the Intel 8080 machine language.
=======
Another interesting thing is that the Z80 processor was developed to be compatible with the Intel 8080 machine language.
>>>>>>> fbb9aeb92b03f91d5ce219cfe5aee3b1d59db9bc
