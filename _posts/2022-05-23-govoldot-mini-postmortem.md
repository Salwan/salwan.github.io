---
layout: post
title: GoVolDot postmortem
date: 2022-05-23 10:15 +1200
category: gamedev
tags:
- gamedev
- indie
published: true
---
{% include JB/setup %}

[govoldot_spritesheet]: {{site.baseurl}}assets/photos/govoldot/spritesheet.png
[govoldot_3d]: {{site.baseurl}}assets/photos/govoldot/3d-attempt.png
[spreadeditor]: {{site.baseurl}}assets/photos/govoldot/spreadeditor.png
[govoldot_font]: {{site.baseurl}}assets/photos/govoldot/govoldot_font.png

[GoVolDot is out!](https://cloudmillgames.itch.io/govoldot) Released it a few days ago after not doing anything with it for a few weeks.

I have this weird release hesitation sometimes, I think I'm worried to let a project go, let it fly out of the window into the wild harsh world.

GoVolDot was a very interesting experience despite its apparent simplicity. The goal I had for it besides that I always wanted to remake this game and actually play it, is to run a project through an entire production cycle in preparation for bigger things in the future.

## What Went Wrong 🤧

### Estimation Fail

My estimate for this project from beginnings to release was about 2 weeks. My actual total dev time was around 4 weeks of full time work.

While this is accurate for gamedev (2x estimated time). It still feels a little too much for a minimalist 2D shooter!

Some excuses:

* I was honestly surprised how many enemies with unique behaviors there were, around 25 unique behavior enemies. Took me full days of work for the most complex enemies.
* Levels had very specific sequences for the game and the boss battles and I tried to reproduce them accurately. There are a LOT of events, so it took most of a day to play that level in the original game then clone all the events into my spread-editor.
* I was also using Godot for a full-scale game for the first time, so had a lot to learn there and attempted many different ways to do things

### Messy assets

The project started quite organically so I threw together a large texture in affinity designer and used their sliced exports to spit out spritesheets per-object. However as the game scaled up to include more and more stuff, that simple process turned into a bit of a time-hole and produced many small sprite files sometimes a few pixels wide. I should have developed a better pipeline for that stuff.

![govoldot_spritesheet]

### Unfruitful pursuits

I spent a lot of time playing around with different ideas and directions. Attempted to re-mix Volguard's music theme twice then gave up due to not really being any good at music lol.

Here I had this crazy idea to switch to 3D for intro, syncretize, and reinforcement sequences:

![govoldot_3d]

And here is a taste of that awful remix I mentioned, you've been warned:

<audio controls>
	<source src="{{site.baseurl}}assets/audio/volguard_remix.mp3" type="audio/mpeg" />
Your browser does not support the HTML5 Audio element.
</audio>
<br/>



## What Went Right! 🕺

### Nailed the feels!

I got the feeling just right! the game is not 100% one-to-one to the original Volguard but it's close enough - I'd say around 75% accurate.

There are a few bugs here and there but nothing major I'm aware of. All in all, it's a playable game and one that I can replay myself and still be challenged and have some fun 🙂

Also I really like the font:

![govoldot_font]

### Spread-editor?

For GoVolDot I needed a way to describe precise sequences of events across a long timeline. I could not at the time come up with a way to build that into Godot quickly, but for whatever reason I thought a Google spreadsheet might be ideal for this and it's immediately available!

![spreadeditor]

Horizontal-axis is time at 0.25 secs steps. Vertical represents Y coordinate to spawn the enemy.

I could embed metadata about each spawned enemy behavior/look in its cell using this smooth-brain format: `bandit:edir=-45:vel=[-80 0]`

This then gets dumped into a CSV file... yes.. into a specific path.

Then from there a constantly-running python script watching for any mission file changes, detects the change, parses the CSV and throws it into a GDScript file.

Then the game parses the actual CSV data at runtime and turns them into game events.

As hilariously complex as this spread-editor was, it actually worked and once all the moving parts were in-place I forgot it was there. So I consider it a win 💃

### Scope Discipline

Did I already mention I wanted to turn parts of GoVolDot into 3D sequences? yeah, I'm glad I didn't dive into that hole.

Also, multiplayer support.

### Coroutines

In GoVolDot I used coroutines for enemies behavior ([written a post about that](http://localhost:4000/gamedev/2022/04/04/state-management-with-coroutines)), and it simplified things a lot. I re-used that approach as many times as I could! it doesn't work with all types of behaviors though. I found that if behavior needs to change based on external events it's better to just implement that using a traditional state machine to avoid having to pass around variables for the coroutine to check against.


## Conclusion

I am happy with what I got at the end. This project has been on my mind since the day I had a "real" computer as I used to call x86 PCs when I was 19 years old.

Consider this checkbox.. checked!

And I gotta say, I'm really impressed with the level of depth and attention to detail this old game has! it's beyond anything else I've had on my PC-6001 at the time and to imagine that the original developers created this game using Z80 assembly? and somehow managed to cram all required data and all those behaviors into 64KB!
