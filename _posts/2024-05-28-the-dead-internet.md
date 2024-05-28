---
layout: post
title: "The Dead Internet"
description: ""
category: computing
tags: [internet,computing]
---
{% include JB/setup %}

Little by little the internet is dying. I felt like ranting on a private discord server which led me into a rabbit hole after. This was my rant raw:

> man the internet really sucks nowadays, most forums are gone not even in archive, search engines are crippled with ads and target dumb audiences, every piece of software that's not opensource is spying on us "to enhance your experience", pretty much every social discussion network wants to be a walled garden like discord, reddit is almost there.. it seems most people have migrated from internet to social media focused on doom scrolling and pointless angry arguing. It feels like LLMs are the only good thing that happened recently.. but wait til they're enshitified as well and start to cripple themselves (to enhance experience naturally), spy on us and push ads which will happen once their growth slows down
>
> I think we broke the internet, so many computer people started looking for an escape.. for some they found it in pre-internet retro hardware
> some are trying to revive the old internet by reviving personal sites and focusing on decentralized services only
(I think I'm in both camps)
>
> a part of me just wants to boot all major software from all my computers and switch to FreeBSD or something and start over 😂

These sentiments were all brewing in my consciousness for a while now. I'm glad I was able to just dump the whole thing in one paragraph.

I want to break it down here:

### Forums are gone

One day not long ago the internet was full of self-hosted forums. At the beginning of my computing and gamedev journey this was one of the main sources of expanding my knowledge and asking when I'm facing problems. Only a few of these still exist like Gamedev.net, and their activity is a pale shadow of what it was. Forums like these had the following characteristics:

* completely open to search engine indexing and every thread and reply had a unique clean URL (no tracking or fingerprinting)
* no dynamic content loading: pages are rendered on the server and sent to clients. This lowers the cost of accessing them for both the browser and the network bandwidth, makes it easier to index the page, and allows saving the page to a local file with all relevant content
* they did not spy on their users, "enhance" anybody's experience, nor sell private data to highest bidders like social media does today
* they contained moderated focused collective knowledge, due to the tight scope of each forum it was easier for human moderators to enforce rules and whenever a particular section of a forum gets too unwieldily they split it into smaller sections
* I witnessed many conflicts that started and ended on forums, there was none of the bullying and anti-social behavior common in current social media, even when most users had anonymous handles there was a sense of reputation that no longer exists now due to the sheer number of users

Those forums often were self-hosted using a privately purchased domain and direct use of an opensource forum system like phpbb paired with an SQL database. The moment the domain is not renewed or server bill goes unpaid, the entire forum is gone like it never existed. And this is what happened.

So many communities and knowledge vanished over the last decade, a lot of the larger ones migrated to reddit then discord. But reddit is almost a walled garden now due to them essentially crippling API access and using it to kill rival frontends, while discord was always an anomaly as its a walled garden from the get go yet somehow many communities used it as a safe refuge as there are no domains or server fees to pay and therefore content is assumed to remain there for as long as discord will remain active. Until it's not, and that will happen sooner or later and we loose everything in there again.

On the game development side, lots of specialized forums are gone but the main big ones are somehow still surviving. [Gamedev.net](https://gamedev.net/forums/) as well as [TigSource](https://forums.tigsource.com) are notable examples.

As for the web archive, it's an amazing effort that I believe began at the right time. However if you've ever tried using it for deeper than main page queries you'd understand how limited its archiving is despite most sites not using dynamic content loading, nowadays with dynamic content and the sea of bloated javascript/css, it's harder to archive anything useful.

### Enshitified Search Engines

This is a topic that's been talked about a lot. In my view, search engines went from "indexing the world wide web" to "pushing more ads to make more money this quarter". They are no longer really search engines but ad networks with a side-feature of sometimes providing relevant results.

Fortunately but also equally cursed, LLMs attack the heart of this problem.

### LLMs to the temporary rescue

Temporary because I know that ultimately they will all go through enshitification. Soon OpenAI's goal will deform from building the smartest LLM to "pushing more ads to make more money this quarter". And LLMs will transition from intelligent data collators to intelligent ad networks with the side-feature of sometimes providing a useful answer.

But for now, this is an effective solution.

Thankfully, there is already opensource solutions with comparable knowledge. If there is one thing I learned from my journey through computing it's that open-source software outlasts everything and has the property of remaining very consistent. It's the only form of software that is immune to enshitifcation.

### Social conflict stimulators

Then comes social media. It started with its heart in the right place. Connecting people and sharing interests. A long time ago when I signed up for a facebook account when it opened to everyone, some of us used it to show off our work and post screenshots of current projects. In that way it was great! Then when facebook became toxic-boomer-ville and was filled with vile content left and right. I ran off to Google Plus which had this nice feature called "circles" that connected me to entire communities of like-minded people. For a while we used it to share our stuff until one day the plug was pulled and G+ joined the cemetery of Google.

I feel Google Plus was the end of the golden era of social media for me. After that everything moved away from computing and it became about angry arguing, posting personal everyday life photos and filter-ridden selfies.

If there is any resilient property about the wider social internet, it's that it caters to the needs of the lowest common denominator. It arrives at that via a process of elimination of useful features via what's often described as..

### "Enhancing your experience"

I wince whenever I hear or read that phrase. It basically announces that this service is in active enshitification right now. The exact steps vary but one I was directly exposed to from a development perspective is AB testing, where they vary button colors, positions, sizes, and telemetry the hell out of their users to determine which was clicked the most. That way they arrive at users more likely to click buttons that lead to spending money and less likely to click buttons that don't.

Nowadays this is referred to as dark patterns, there is a common prediction that dark patterns are created on purpose. That's definitely true in summary, however part of why these patterns exist is that they do actually work. And there is a general correlation between the number of users on a platform and how concentrated its dark patterns use gets. This is part of why at the beginning web services and platforms are actually good for their target audience, but overtime as they build a larger userbase they start to apply more and more manipulative UI practices as those are the ones that are most illustratively effective on more users. The metric they optimize for is "growth" of userbase, it's never quality of services or user satisfaction.

This also explains the last phase of enshitification, descending into complete lunacy in UI design where the platform shoots itself in all limbs and users abandon ship faster than "growth" maximizing tactics can adapt to.

I see this whole process to be similar to the paper-clip optimizer problem. Platforms sacrifice their entire userbase and eventually themselves for the sole purpose of optimizing growth.

### To the Escape Pods

How do we escape this? I as many others identify deeply with computing. Not just as a profession, hobby, or passion.. but a literal lifestyle. There has to be some sort of an escape from this degradation?

As I mentioned earlier, opensource software is a beacon of eternal light. In the early 2000s they were an escape from corporate control, now they are an escape from enshitification. I consider it the greatest monument of human creation in the digital realm. Opensource code is owned by us, humans, and those rights of ownership are protected and eternal.

Some of us started looking back driven by nostalgia, to before the internet in its modern form began. There is a huge community of retro computing that's constantly growing in refuge from big tech. But I recently began to feel this puts us in denial of our present reality and disconnects us from the amazing unstoppable progress of computing despite of all the mess. Two notable examples related to this movement are the [misterFPGA project](https://github.com/MiSTer-devel/Wiki_MiSTer/wiki), and [8bitworkshop](https://8bitworkshop.com).

Some of us started an alternative web movement. Here are some examples:

* [NeoCities](https://neocities.org) is a great successor to what geocities did
* [glitch](https://glitch.com) for live creation of web content (and currently encouraging users to build fediverse apps!)
* [tildeverse](https://tildeverse.org) is a very interesting experiment

Another move for us is focusing on technologies that render old internet obsolete. Knowing what we know now, we can design/migrate to platforms that are basically immune to enshitification like opensource software is. One example of this is [Mastodon](https://mastodon.social/explore). It took me a while to understand it but once I did, it basically became the only social media platform I use regularly (and trust).

### Decentralized Web

Platforms like [Mastodon](https://mastodon.social/explore), [Diaspora](https://diasporafoundation.org), and many others are now my beacon of light out of enshitification.

I fell in the rabbit hole today trying to understand what's possible and how do these things work, and here's a summary of what I found:

* Fediverse is the middle-ground between fully-centralized and decentralized services
* there is an unfortunate overlap between this and blockchain/crypto-shit. From a shallow look only a little bit of what they created appears to be useful for fighting back enshitification
* there are so [many applications already built](https://github.com/gdamdam/awesome-decentralized-web). An alarming number of them are discontinued but that's not a death sentence as anyone can pick things back up where they were left off
* [ActivityPub](https://www.w3.org/TR/activitypub/) is the big player as it defines a protocol for decentralized social networking through which mastodon was built, to be more specific ActivityPub is a REST HTTP API covering all the basics of content creation and fediverse interactions
* [IPFS](https://ipfs.tech) appears to be a central service for many solutions (and has the most badass name: Intergalactic File System 🚀🌍🪐), it stores immutable data and indexes them using a calculated hash
* [Scuttlebutt](https://scuttlebutt.nz) is used for many different apps proving that their approach definitely works (based on gossip)


#### Storing decentralized data

IPFS seems to be the most straight forward way. You install the tool which lets you upload files to an IPFS node. [Here's a tutorial they provide for how to host a static website on IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website/#install-ipfs-desktop).


#### What do I want?

A project that materialized as I was researching this is a trello-like decentralized service. Task boards can be private or public, and using a fediverse approach you may host your own node or join an existing node. This stems from a frustration I have with searching for a practical kanban boards solution that isn't part of a commercial platform, also allows full access from any device, and ideally doesn't require manual backing up.

