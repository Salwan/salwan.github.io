---
layout: post
title: State Management with Coroutines
description: An exploration of the different state management approaches I've tried
  so far.
category: gamedev
tags:
- gamedev
- engine-dev
published: true
date: 2022-04-04 00:55 +1200
---
{% include JB/setup %}

Say we're working on a GTA-style game and we want to create a behavior sequence for a mission:

* Car (with an AI driver) spawns at location A and waits for the player to get in.
* Car drives to location B.
* Player gets out.
* Car waits for player to get back in with item within 5 minutes.
* Mission success!

## Manual State Management

The problem with straight-forward gameplay programming is it's made of an `Update()` function that gets called ±60 times a second.

This means we must manage time between events manually.

It also means we must store necessary states and update them organically. If we have many overlapping inter-dependent states we may end up with unpredictable hard-to-debug gameplay issues.

Here's some pseudo-code for the manual gameplay programming approach:

``` py
player_first_got_in = False
player_first_got_out = False
player_second_got_in = False
at_location_b = False
wait_time = 5 * 60
waiting_for = 0.0

def Update(delta):
  if not player_first_got_in:
    if car.passenger == player:
      player_first_got_in = True
  elif not player_second_got_in:
    if not at_location_b:
      distance = car.driver.drive_to("location_b"))
      if distance < 10.0 and car.driver.stopped():
        at_location_b = True
    elif not player_first_got_out:
      if car.passenger == None:
        player_first_got_out = True
    elif not player_second_got_in:
      waiting_for += delta
      if car.passenger == player:
        player_second_got_in = True
      elif waiting_for > wait_time:
        announce("mission_failed")
    else:
      if player.has("item"):
        announce("mission_success")
      else:
        announce("mission_failed")
```

This looks terrible. When the explanation of the task is 10 times easier to understand than the actual code that implements it, we are definitely not in sustainable territory.

And there is a bigger problem.. how do we deal with parallel gameplay complexities? say an event occurs that interrupts the supposedly straight forward mission that would interrupt our logic. Examples: the player gets out of the car BEFORE it gets to location B, the car is damaged too much and explodes, or the player destroys the package instead of picking it up.

There is no choice but to handle every single special scenario and to keep updating that everytime we have a new gameplay feature that could potentially complicate things.

Do not do this!

Once you catch yourself doing state management via endless if-else chains, switch it to a state machine.

## State Machines

They aren't magic, but they provide us with much needed cleanliness and simplicity in addition to some nifty abilities like being able to go to any state at any time!

``` py
enum State {
  BEGIN,
  DRIVE_TO_LOCATION_B,
  WAIT_FOR_PLAYER_ITEM,
  CONCLUDE
}
state = State.BEGIN

at_location_b = False
wait_time = 5 * 60
waiting_for = 0.0

def Update(delta):
  switch state:
    case State.BEGIN:
      if car.passenger == player:
        state = State.DRIVE_TO_LOCATION_B
    case State.DRIVE_TO_LOCATION_B:
      distance = car.driver.drive_to("location_b")
      if distance < 10.0 and car.driver.stopped():
        at_location_b = True
        state = State.WAIT_FOR_PLAYER_ITEM
    case State.WAIT_FOR_PLAYER_ITEM:
      waiting_for += delta
      if car.passenger == player:
        state = State.CONCLUDE
      elif waiting_for > wait_time:
        announce("mission_failed")
    case State.CONCLUDE:
      if car.alive() and at_location_b and car.passenger == player and player.has("item"):
        announce("mission_success")
      else:
        announce("mission_failed")
```

Notice that this state machine implementation is not shorter than the previous manual state management implementation, but it's so much easier to understand and allows us to add a level of resilience through fallback states to handle exceptional interruptions.

We could actually do better than the state machine! A game like this has many missions that require a car to wait for a passenger or particular conditions related to car's location or passenger inventory. It would be really annoying if we had to re-write that code in 100 different variations..

## Job Systems

We could instead create a sort of a job driven mission description. In such a system, missions are defined as lists of jobs. Each job is a self-contained gameplay activity that can be customized with parameters and reused as many times as we want.

If we had such a system in place.. how would our mission description look like? Well for starters we no longer need to manually track everything in Update!

``` py
def Start():
  Jobs.executePackage([
    Job(type=WAIT_FOR_PLAYER),
    Job(type=DRIVE_TO, {location="location_b"}),
    Job(type=WAIT_FOR_PLAYER, {time_limit=5*60}),
    JobSuccess(type=IF_INVENTORY_HAS, "item"),
    JobFailure()
  ])
```

With this approach we could magically eliminate the Update function! I mean in reality the Job system is doing that internally, but hey.. makes life easier.

Of course designing and developing a job system like this for a large game is not a trivial task and this example is too simplified to reflect what a real world implementation might look like. However, a game with 100s of missions like that would definitely benefit from this.

The job driven mission system is perfect for this particular case. It's a great example of the perfect tool for the job. It also opens up some interesting capabilities. We now have a mission system that's data-driven! this means we can define missions visually, from within the game, allows us to implement mod support, etc.

This implementation is suitable for an ECS driven-engine and is multi-threading friendly as well.

Speaking of multi-threading..

## Coroutines and States

I was first exposed to this approach with Unreal Engine 3. Its UnrealScript language has a [built-in way to define a state machine per script](https://docs.unrealengine.com/udk/Three/MasteringUnrealScriptStates.html#11.2%20STATES%20IN%20UNREAL%20ENGINE%203). What's special about those state machines is that they run in parallel with that script's conventional Update() function. This appears unimpressive at first glance, but practically? you could write your code in a way that forgoes many of the annoyances of manual frame-to-frame state management.

So the last approach which happens to be my current favorite, utilizes coroutines (or any similar feature). In this context coroutines are essentially functions that run concurrently with your `Update()` and normal event handling callbacks until completion:

* Each coroutine encapsulates a specific self-contained task.
* Coroutines can be chained one after the other producing a sequence of events executing one after the other across time.
* These coroutines continue until their completion or until the object containing them is freed.
* This means we can actually have a `while true:` style infinite loop running a continuous sequence of events until the object is freed! think enemies that perform pattern attacks.

How would our mission sequence look like with this approach? Due to the variation in implementations between different engines and languages, I'm gonna base my example here on how Godot implements coroutines:

``` py
enum State {
  RUN,
  MISSION
}

state = State.RUN
# if the player takes longer than 10mins, mission fails
mission_time_limit = 10 * 60

def Update(delta):
  switch state:
    case State.RUN:
      if car.passenger == player:
        run_sequence()
        state = State.MISSION
    case State.MISSION:
      # Here we can handle any special interruptions we want to account for
      mission_time_limit -= delta
      if mission_time_limit <= 0:
        announce("mission_failed")      

def run_sequence():
  yield(Task.DriveTo(what=car, dest="location_b"), "task_complete")
  yield(Task.WaitForPassenger(what=car, who=player, time_limit=5*60), "task_complete")
  if car.passenger == None or not player.has("item"):
    announce("mission_failed")
  else:
    announce("mission_success")
```

Note that:

* We don't really need a state machine here but I included it to illustrate how it can work together with coroutines.
* We assume the announce function kills the mission object interrupting any ongoing coroutines.

This might be the best general approach for state management. It produces clean compact readable code and costs almost no time/effort to implement the runtime for. If your language of choice has some form of coroutines, you're good to go!

I'm interested to see how this coroutines approach would look like in Unity? also C++20? or anything else you use, [tweet](https://twitter.com/zenithsal)/comment me an implementation :)
