---
layout: post
title: "Neuromorphic Artificial Intelligence"
description: "The Next Leap"
category: AI
tags: [ai,neuralnetworks]
---
{% include JB/setup %}

This is mostly going to be an information dump. I've been researching this for a month or two and the amount of stuff happening out there these last few months is just mind-blowing. Progress achieved from mid 2016 till time of writing this post (end of 2017) wasn't only impressive but paradigm shifting.

First off, this is not about robots or androids or skynet. This is about artificial intelligence that runs on software and hardware designed to resemble biological intelligence. Everytime you swipe through Snapchat's filters, you're running a variation of that intelligence that attempts to find where your face is, match its orientation and scale to superimpose dog-ears or makeup.

While exploring this stuff, you might want to listen to the Machine from [Person of Interest](http://www.imdb.com/title/tt1839578/) which is perfectly appropriate:

<figure class="video_container">
	<iframe width="560" height="180" src="https://www.youtube.com/embed/wBMfUzxp4n4" frameborder="0" allowfullscreen></iframe>
</figure>


To understand what this is about, read this entertaining exploration of artificial general intelligence and the technological singularity: [Artificial Intelligence Revolution](https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html)

Name of the game (so far): *Recusrive self-improvement via reinforcement learning* (+minimal human experts involvement)

### [Deepmind](https://deepmind.com/) (Google)

#### Stated goal

> Solve intelligence. Use it to make the world a better place.

#### Stated purpose

> If we’re successful, we believe this will be one of the most important and widely beneficial scientific advances ever made, increasing our capacity to understand the mysteries of the universe and to tackle some of our most pressing real-world challenges. From climate change to the need for radically improved healthcare, too many problems suffer from painfully slow progress, their complexity overwhelming our ability to find solutions. With AI as a multiplier for human ingenuity, those solutions will come into reach.

Viral influential work:

* AlphaGo Fan (?? months): 176 GPUs
* AlphaGo Lee (6 months?): 48 TPUs v1
* AlphaGo Master (3 months?): 4 TPUs v2
* AlphaGo Zero (40 Days): 4 TPUs v2
* AlphaZero (4 hours): 4 TPUs v2
* Next step: Alpha ? (?)

**Chess: AlphaZero vs Stockfish**

<figure class="video_container">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/7-MborNxYWE" frameborder="0" allowfullscreen></iframe>
</figure>

### [OpenAI](https://openai.com/) (Elon Musk's pre-emptive plan for AGI)

#### Stated goal:

> Discovering and enacting the path to safe artificial general intelligence.

#### Stated purpose:

> OpenAI's mission is to build safe AGI, and ensure AGI's benefits are as widely and evenly distributed as possible. We expect AI technologies to be hugely impactful in the short term, but their impact will be outstripped by that of the first AGIs.

> By being at the forefront of the field, we can influence the conditions under which AGI is created. As Alan Kay said, "The best way to predict the future is to invent it."

Viral influential work:

* Dota 2 1v1 AI destroying pro players
* Next step: 5v5 Dota 2

**Dota 2: Dendi vs OpenAI**

<figure class="video_container">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/7U4-wvhgx0w" frameborder="0" allowfullscreen></iframe>
</figure>


## Rise of Neuromorphic Computing Architectures

Current explosion in Neuromorphic Computing:

* [IBM TrueNorth (DARPA)](http://www.research.ibm.com/articles/brain-chip.shtml)
* [Intel Nervana Neural Network Processor (First Neuromorphic desktop processor)](https://www.intelnervana.com/)
* [NVIDIA Xavier (Tesla autopilot)](https://blogs.nvidia.com/blog/2016/09/28/xavier/)
* [Google TensorFlow Processing Unit (Deepmind)](https://cloud.google.com/tpu/) and [TensorFlow software](https://www.tensorflow.org/)
* Apple Neural Processor (iPhone X)
* Qualcomm Kirin 970 Neural Processing Unit
* PowerVR Neural Net Accelerator
* and many more ..

Beginning of an international race in AI: ["Rule AI" action plan by China's industry and information technology Ministry](https://www.technologyreview.com/the-download/609791/china-has-a-new-three-year-plan-to-rule-ai/) Notice the focus on development and mass-production of neuromorphic processors.

Argument that computing power is nearing its peak is invalid. Neuromorphic computing is fundamentally different and is already exceeding traditional digital processing efficiency for Neural Network algorithms significantly.

Perhaps we won't need a fundamentally different approach such as Quantum computing to hit a technological singularity after all!

## Brain emulation

Google since May 2017 has 10^17 ops-per-second spiking(?) neural network tensorflow processing pods (Able to perform the equivalent of [11.5 petaFLOPs](https://en.wikipedia.org/wiki/Tensor_processing_unit)), [Nick Bostrom](https://en.wikipedia.org/wiki/Nick_Bostrom) estimated 10^18 needed to simulate human brain neural processing capacity based on spiking neural networks model.  [Report.pdf](http://www.fhi.ox.ac.uk/brain-emulation-roadmap-report.pdf)

*Roadmap until 2099:*

| Level | Desc              | CPU Demand (FLOPS) | Consumer Computing      | Super Computing      |
| ----- | ----------------- | ------------------ | ----------------------- | -------------------- |
4 | Spiking Neural Network | 10^18 | 2042 | 2019
5 | Electrophysiology | 10^22 | 2068 | 2033
6 | Metabolome | 10^25 | 2087 | 2044
7 | Proteome | 10^26 | 2093 | 2048
8 | States of protein compelxes | 10^27 | 2100 | 2052

--------------------------------------------------------

Multiple projects to simulate the human brain are underway:

* [Human Brain Project](https://www.humanbrainproject.eu/en/) -> [SpiNNaker](http://apt.cs.manchester.ac.uk/projects/SpiNNaker/)
* [Brain/MINDS](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4387516/)

And others

## Cultural Impact

[Singularity University](https://su.org/) aims to prepare academics and researchers around the world for exponential growth technologies like Artificial Intelligence. ([Ray Kurzweil](https://en.wikipedia.org/wiki/Ray_Kurzweil), Google)

AGI religion already exists although still very low-profile: [Way of the Future](http://www.wayofthefuture.church/)

### Media

+ [Person of Interest](https://www.netflix.com/title/70197042)

*WARNING: Video contains **spoilers**!*

<figure class="video_container">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/8yT2oXEpGmg" frameborder="0" allowfullscreen></iframe>
</figure>

+ [Transcendence](https://www.netflix.com/title/70266675)


+ [Her](https://www.netflix.com/title/70278933)

## Perspective

This is our future. There is a 50% probability that by year 2045 we will create an intelligence that will change humanity forever in ways we can't even imagine now.

Change could either be uplifting us or ending our civilization. We cannot stop it, we can only prepare to do it right by making sure the first AGI is what scientists and researchers call "friendly AI".

Videos related to the topic:

<figure class="video_container">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/MnT1xgZgkpk" frameborder="0" allowfullscreen></iframe>
</figure>

<figure class="video_container">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/8nt3edWLgIg" frameborder="0" allowfullscreen></iframe>
</figure>

<figure class="video_container">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/Xc2tiSH_eBg" frameborder="0" allowfullscreen></iframe>
</figure>
