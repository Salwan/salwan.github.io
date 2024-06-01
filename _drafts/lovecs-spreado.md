---
layout: post
title: "LovECS Spreado"
description: ""
category: gamedev
tags: [gamedev,lua]
---
{% include JB/setup %}

Last week after I released [lovecs](https://github.com/cloudmillgames/lovecs) I asked myself the question: what does it take to create a UI for the data part of ECS?

ECS involves a lot of simply defining data. Components are basically just data tables with default values. Bevy's bundles are a list of components to create and initialize with data. And entities are essentially a list of components working together.

The only aspect that isn't just data are the systems.

I have briefly looked at an approach for this in [flecs](https://github.com/SanderMertens/flecs) a while back, they use a custom format to define what needs to be defined in [their cool web-based explorer tool](https://www.flecs.dev/explorer/?local=true&wasm=https://www.flecs.dev/explorer/playground.js) (btw flecs is one of those undercover AAA tools which explains its production quality code and tooling).

So I asked myself, what's the most straight forward way to create a thing that plays the same role? ideally a few hours of work..

These collections of data and relationships screamed spreadsheets to me. Since I have plenty of experience writing Google Spreadsheets scripts, I thought this would indeed be a fun project. And Spreado was born!

## What is Spreado?

Ever wanted to introduce spreadsheets into your game programming process? introducing: Spreado. Here's the premise:

* A single spreadsheet with multiple sheets each for a specific aspect of LovECS: ECS, Comps, USystems, DSystems, and Bundles
* ECS sheet: by default, the script creates an ECS instance called "ECS", for any additional instances you may define them here
* Comps: allows defining components and their tables of data as well as default values in the table
* USystems and DSystems: defines update and draw system names and which components do they work on
* Bundles: allows defining a collection of entities, components, and data to be spawned together with a single function call

The process of using Spreado looks like this:

* create a new spreadsheet in Google Spreadsheets using [this template]()
* from Extensions -> App Scripts, add file: [spreado.gs]()
* from the spreadsheets menu, run: LovECS -> Compile spreado.lua
* you get a download link for resulting spreado.lua file, download it into project

your main lua file will look like this:

```lua
require("spreado")

update_systems = {
    UpdateInput: (ent, comps, dt)->
        ...
}
draw_systems = {
    DrawHUD: (ent, comps)->
        ...
}

spreado = Spreado(update_systems, draw_systems)

love.load = () ->
	ECS\SetDebugMode(true)

love.keyreleased = (key) ->
	if key == "escape" then
		love.event.quit()

love.update = (dt) ->
	spreado\update(dt)

love.draw = () ->
	spreado\draw()

```

To create a bundle named `create_food` for example: `e = Bcreate_food()`

This expriment [lives in branch spreado in lovecs](https://github.com/cloudmillgames/lovecs/tree/spreado)

TODO: export/share template spreadsheet and link here, download link for script, port spreado moon to lua
