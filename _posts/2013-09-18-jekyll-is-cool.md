---
layout: post
title: "Jekyll.. is cool!"
description: "Setting up Jekyll, the difficulties, solutions, and drawbacks."
category: webdev
tags: [jekyll, git, github]
---
{% include JB/setup %}

For the last two days, I've been looking at several solutions to setup a blog for this site, from blogging services like Wordpress.com and Blogger to fully fledged CMS-like solutions running on one of the many cloud-based platforms available today, I setup several blogs in the process to test and get a feel for it.

The solution that satisfies my needs without paying truckloads of money was Wordpress running on my own server rather than someone elses, and it works great! but Wordpress still doesn't feel like a blog I would update frequently, something is missing.

While I was setting something up on GitHub I noticed a service called ["GitHub pages"](http://pages.github.com/) a hosting service for static sites with the ability to set a custom domain and use the excellent github service for storing and modifying the actual files, then I found Jekyll.. and I immediately knew this is what I was looking for!

[Jekyll](http://jekyllrb.com/) is a blog-aware, static site generator in Ruby that is tied directly to GitHub services, Tom Preston-Werner (GitHub staff) wrote it for his personal usage and then it transformed into a broader solution with the help of the community.

Here is how it works basically: you create a set of text files that use multiple minimal scripting solutions like FrontMatter and MarkDown to write content. You then run Jekyll on these text files to build the actual HTML site.

The secret that makes Jekyll work is the amazing git and github hosting service. Adding modifying and building changes into the site can happen very fast because the whole process is ASCII-text only and straight forward especially if you like working with git.

The first issue I ran into after I setup Jekyll on my machine was that there is no notion of a home page in the themes that you can find for Jekyll including the standard theme.

I noticed that most developers that use the service set the archive page as their homepage, which is not what I wanted to do. I wanted the homepage to be a list of the latest created blog posts.

After a couple of hours of meddling with Liquid (the template scripting solution used by Jekyll/github) and Jekyll's layout system, I managed to get it working! Added a new layout type called "home" that displays the latest 5 posts. However I have yet to figure out how to browse all posts in sets of 5, Liquid doesn't provide access to URL parameters which might've been enough to solve the problem, one possible solution is implementing it completely client-side and that might require modifications to Jekyll so it generates a special set of files that are then parsed by javascript/browser.

Consequently, the main drawback is of course the lack of any kind of server-side functionality, databases are not very important anymore with the existence of incredibly capable social networks and services like disqus.

Just.. one more homepage feature before I push this post... :-)
