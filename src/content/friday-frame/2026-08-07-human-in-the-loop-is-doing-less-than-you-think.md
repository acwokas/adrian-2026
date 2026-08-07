---
title: "Human-in-the-loop is doing less than you think."
date: 2026-08-07
summary: "If reviewers miss a third of dangerous agent requests, what you've written into policy as a control is really a story you're telling the board."
---

While on holiday last week, a friend asked me to review their governance deck. The phrase "human-in-the-loop" appeared eleven times across the policy pack. Every high-risk agent action, every code deployment, every data egress: a human would review it. That was the control. That was the assurance to the board.

The uncomfortable question I put on the table: what percentage of dangerous requests does that human actually catch? Nobody in the room had measured it. The assumption was near 100. The evidence, when you go looking, suggests closer to two thirds. Reviewers approve things they shouldn't because the request looks routine, the context window is long, the reviewer is tired, or the agent has phrased it in a way that reads plausible.

So the mechanism underwriting the entire risk framework is catching roughly two out of three. A filter with a known failure rate that nobody's priced in doesn't deserve to be called a control.

Boards are being asked to sign off operating models where "human oversight" is the load-bearing beam. If the beam holds two-thirds of the weight, the building has a problem the architect hasn't disclosed.

A human in the loop is not enough by itself. What needs building is the layer underneath it: the one that catches the requests the reviewer misses.
