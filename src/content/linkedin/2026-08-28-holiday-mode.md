---
title: "Holiday mode for a one-person operation"
date: 2026-08-28
draft: true
friday_frame_url: "https://adrianwatkins.com/writing/friday-frame/2026-08-28-holiday-mode-for-a-one-person-operation"
note: "Native LinkedIn post. Paste the body below as-is. No markdown, no rich text."
---

I'm going on holiday tomorrow. Which means today I'm trying to hand my web estate to automation and hoping it holds.

The thing that gave me pause was discovering, on Monday, that two of my content pipelines had silently stalled. Nothing errored, nothing alerted. They just stopped publishing five days ago, and nothing told me.

I found out because I went looking for something else and noticed the dates were wrong.

Five days. For a one-person operation, five days of silence is also five days of nobody noticing. There is no colleague glancing at the dashboard. No Slack channel where someone says "has anyone seen output from the feed today?"

If you build a system well enough to forget about, you've also built something that can fail without an audience.

I'd suggest this is where solo operators and large companies have more in common than either would admit. In large companies, the quiet failure mode is a team that keeps reporting green because nobody has checked what green means in six months. For a solo operator it's a cron job that returns exit code 0 while producing nothing.

Different scale, same shape. The process looks healthy because health was defined once and never revisited.

So the checklist I actually needed became "what would I not notice if it stopped." That turned out to be a longer list than "what needs to run while I'm away," and a more useful one.

I've added heartbeat checks - not on whether the pipeline runs, but on whether it produced anything. Took twenty minutes. Makes me wonder why I didn't do it six months ago.

Probably because the system was working, and working systems don't prompt you to verify them. So now I have a script that counts output and messages me if the number is zero. Twenty minutes of setup, six months overdue.

Full thinking in this week's Friday Frame: https://adrianwatkins.com/writing/friday-frame/2026-08-28-holiday-mode-for-a-one-person-operation

#AI #Automation #SoloFounder #ContentOps #AIGovernance #OperatingModel #FridayFrame
