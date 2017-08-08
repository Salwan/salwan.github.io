---
layout: page
title: "AGDN Papers Competition"
description: "Game Development Papers Competition, hosted by AGDN"
---
{% include JB/setup %}

Won [first place in the Arabic Game Development papers competition](http://agdn-online.com/communities.aspx?view=posts&threadid=654) hosted by [Arabic Game Developer Network](http://agdn-online.com/) for my two parts paper about character animation programming.
The two papers are of course written in Arabic.

## Part 1: Character Animation for Programmers حركة الشخصيات ثلاثية الأبعاد للمبرمجين

This paper discusses the principle techniques for character animation programming used in games and realtime applications in a fun and practical way.
The techniques covered include:

- Hierarchical animation
- Skeletal animation
- Character skinning
- Initial posing
- Keyframed animation
- Animation blending
- Facial animation
- Cloth simulation
- Forward and Inverse Kinematics

The sample code for part 1 includes multiple projects each demonstrating a different aspect of character animation:

- Hierarchical animation
- Skinned animation
- Facial morphing

![facial animation]({{site.baseurl}}assets/screenshots/agdncontest/facial_morphing.jpg "Facial Animation")

All sample projects are written using C/C++ and use Direct3D 9 for graphics.

Additionally, a tool used for exporting models from 3D Studio MAX to .X files is included. (used for the sample projects) and a demonstration video for Natural Motion technology as an example for procedural character animation advances.

#### Links:

- Read online in AGDN: [http://www.agdn-online.com/papers/charanim1.htm](http://www.agdn-online.com/papers/charanim1.htm)
- Sample code download: [http://zenithsal.com/assets/AGDN/charanim_1_files.zip](charanim_1_files.zip)

## Part 2: Using Cal3D library for Character Animation استخدام مكتبة Cal3D لتحريك الشخصيات

The second part is code oriented and more practical. It explores and makes use of Cal3D, an opensource character animation library that supports most of the features discussed in part 1 to build practical applications that involve animating and rendering an imported animated character named "Vincent".

Part 2 includes 3 sample projects that demonstrate using Cal3D practically with Vincent:

- Loading and animating Vincent FFP: uses the fixed-function pipeline in Direct3D9 to perform rendering and animation.
- Loading and animating Vincent PP: uses the programmable pipeline in Direct3D9 to perform rendering and animation offloading bones calculations to the GPU.
- Graduation Project: a full mini-game that uses Vincent as a playable character.

![graduation project]({{site.baseurl}}assets/screenshots/agdncontest/graduation.jpg "Graduation Project")

All sample projects are written using C/C++ and use Direct3D 9 for graphics.

#### Links:

- Read online in AGDN: [http://www.agdn-online.com/papers/charanim2.htm](http://www.agdn-online.com/papers/charanim2.htm)
- Sample code download: [http://zenithsal.com/assets/AGDN/charanim_2_files.zip](charanim_2_files.zip)  
