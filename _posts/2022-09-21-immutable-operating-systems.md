---
layout: post
title: Immutable Operating Systems
date: 2022-09-21 12:20 +1200
category: linux
tags:
- linux
- operating-systems
published: true
---
{% include JB/setup %}

I've been using [Fedora Kinoite](https://kinoite.fedoraproject.org) on my main laptop for about a year now. Kinoite is a spin of [Fedora Silverblue](https://silverblue.fedoraproject.org). This is the first and only immutable operating system I've used to date.

To explain why immutability is so important in my view, let's take a look at some examples from other systems.

#### Mutability by bad decisions

Let's start with Windows. In my opinion the worst wide-spread operating system of them all. It's basically a collection of bad decisions upon bad decisions dating back to the 90s dictated by the requirements of back-compatibility on legacy features that enterprises wish to drag along with them forever.

An example of one of those outdated decisions is that Windows was always designed to be a mutable OS.

What does that mean? you can go into your Windows system folder and delete anything you want. Windows may not stop you. In fact you need to do this every now and then to clean your system folder from 10s of GBs of Windows logs and/or temporary install files that their updater (another broken legacy system) just ignores.

Another example of one of those bad decisions is the registry. You can just mess with it to your hearts content, delete whatever you want, and it'll mess up the whole system!

### Mutability by Design

Linux as an operating system was designed from the ground up to be mutable but it's done right in my opinion. The user has full complete freedom to do anything they want in the system allowing advanced users to do whatever they can think of.

You want to experiment on a different OS scheduler? a different way to install device drivers? have at it at your own peril.

The drawback of course is that this absolute mutability is hostile to its users. I can't count how many times I killed my installed distro by attempting to update an NVIDIA display driver.

BSD is an interesting variation on the mutability by design philosophy. It actually achieves better stability and is more friendly to its users simply by being a larger OS that comes with many more batteries included and a slower more sensible evolution process.

### The Walled Garden

On the other extreme all modern mainstream phones are powered by immutable systems that require a jailbreak to escape from. An immutable system cannot be changed in anyway by its user, only by the system or software makers themselves issuing updates to it.

An operating system with a walled garden design proved to be vital for stability and long term dependable robust operation. This is part of the reason why we depend on our mobile devices so much. We know they are very unlikely to misbehave or break internally like a Windows laptop often does.

This is also reflected in all Apple OSX devices like Macbooks. They are super dependable and clean.

However these systems come with a large drawback: the user does not really control the system, and the system controls what the user can and cannot do.


### Immutable Operating Systems

Between the fragility of mutable systems and the authoritarianism of walled gardens lies a sensible middle.

A system that offers the same immutability you find in OSX/iOS/Android so it's dependable, robust, and maybe impossible to break by the end user. Yet, it maintains the ability to let the user change most things in their system if they really want to, while also providing a method to reverse these changes non-destructively!

So what are the elements that Fedora Silverblue provides that let's it achieve all that?

* Immutable system: neither you nor any software can change any system specific files/folders directly as they are protected from writing
* Atomic image updates: the system gets updated as an image rather than the usual package manager approach. This eliminates any issues that may rise from wrong dependencies as well as provide a straight forward way to jump back to a previous image of the system or a future one still in beta to test things out non-destructively
* The system image operates as a version control system via [rpm-ostree](https://coreos.github.io/rpm-ostree/) which acts as a package manager of sorts. It allows you to push changes on top of current system image, this way you can apply any system changes you need (such as install NVIDIA drivers or any tools you may need in the OS) and these changes "shadow" any existing data. At anytime you can revert or cherry-pick these changes or altogether discard all commits and restore original system image. When system image is updated, your committed changes get pushed on top of the new image.
* You may install any software you want from [flathub](https://flathub.org/home) (flatpak is supported by default) and you can also install snapd by committing the change on top of the system image using rpm-ostree to enable [snapcraft](https://snapcraft.io). And finally my favorite method: AppImage
* For developers, one of my favorite features in Kinoite/Silverblue is [toolbox](https://docs.fedoraproject.org/en-US/fedora-silverblue/toolbox/). You can create as many toolboxes as you want each acts as a self-contained mutable install of Fedora/Centos where you can use dnf to your hearts content and can even install and run GUI applications seemlessly like VS Code. I naturally setup a toolbox per project and can go crazy in any of these toolboxes without worrying about my actual system getting poisoned in the process


In my opinion this is the perfect developer OS: as solid as OSX or iOS without sacrificing flexibility to change the system, best dev containers system I've used so far (much better than manually creating dev containers), and it still works perfectly for gaming by installing steam using rpm-ostree and steam runs in its own sandbox so that's all you need.

However it's anything but perfect. Here are some of the challenges I've run into so far:

* sometimes when an OS image update is available, some changes in it conflict with packages you installed using rpm-ostree and it fails to update as a result. The error and info you get are vague but the easiest way is to simply uninstall whichever packages are conflicting with the update
* I could not for the life of me get an NVIDIA RTX GPU to work via Thunderbolt, I followed every single guide I found and eventually gave up and installed Windows on an external drive for playing newer games
* Running GUI applications from within toolbox works, however there is a really annoying bug that occurs when you quickly move between app UI elements with the mouse, the whole system pauses for a second (mouse included) and resumes after. This seems to be much worst in electron apps *sigh*
* Updating your software works from Fedora's software manager (Discover) but sometimes some updates just fail for no apparent reason, retrying gets those updates to succeed most of the time
* Can't change the wallpaper in the Login Screen as it's in a system image path (might be a Kinoite specific issue?)
* Installing Lutris and other game launchers (ubi, epic, etc) is problematic as wine is not part of the default system image and must be applied using rpm-ostree

And that's that! since Silverblue there has been other immutable Linux distros, [this awesome list keeps track of everything immutable](https://github.com/castrojo/awesome-immutable).
