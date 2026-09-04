---
title: "Holiday mode for a one-person operation."
date: 2026-08-28
draft: true
status: "retired"
retired_date: "2026-09-04"
retired_note: "Retired, not published. Temporally welded to a departure (\"I fly out tomorrow\") that has since passed -- Adrian is back; the tense can't be salvaged without rewriting the piece from scratch. It was also never gated (hand-authored, sat as draft: true, never ran through check_gates -- two dash-rule-adjacent slips are visible in the body: a spaced hyphen standing in for an em dash, and a staccato two-part aphorism). And it's a beat departure from the adtech/AI-governance line the frame has been running. This is the only copy; kept on this branch for the idea underneath it, not for the prose. See src/content/friday-frame -- the underlying observability insight (a pipeline returning exit 0 while producing nothing looks healthy until someone checks) is carried forward as a topic seed in the friday-frame task's candidate-topics list, not this file."
summary: "Two content pipelines silently stalled for five days and nothing told me. The checklist I actually needed wasn't what needs to run while I'm away. It was what I wouldn't notice if it stopped."
---

I've been trying to hand off my web estate to automation today, because I fly out tomorrow and won't be near a laptop for a week. That sounds straightforward until you start writing the checklist.

The thing that made me stop was discovering, on Monday, that two of my content pipelines had silently stalled. Nothing errored, nothing alerted. They just... stopped publishing, five days ago, and nothing told me. I found out because I went looking for something else and noticed the dates were wrong.

Five days. For a one-person operation, five days of silence is also five days of nobody noticing. There is no colleague glancing at the dashboard. No Slack channel where someone says "has anyone seen output from the feed today?" The system you built is the system you monitor, and if you built it well enough to forget about, you've also built something that can fail without an audience.

I'd suggest this is where solo operators and large companies have more in common than either would admit. In large companies, the quiet failure mode is a team that keeps reporting green because nobody has checked what green means in six months. For a solo operator it's a cron job that returns exit code 0 while producing nothing. Different scale, same shape. The process looks healthy because health was defined once and never revisited.

So the checklist I've actually been writing today became "what would I not notice if it stopped." That turned out to be a longer list than "what needs to run while I'm away," and a more useful one.

I've added heartbeat checks - not on whether the pipeline runs, but on whether it produced anything. A script that counts output and messages me if the number is zero. It took twenty minutes to set up, which makes me wonder why I didn't do it six months ago. Probably because the system was working, and working systems don't prompt you to verify them. That's the whole problem.

I'm going on holiday tomorrow. The automation will either hold or it won't, and I'll know either way now. That feels like the right level of control for someone who won't be checking.
