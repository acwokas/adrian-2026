# Heir Presumptive measurement

Google Analytics property: Adrian Watkins, 517148315.
https://analytics.google.com/analytics/web/#/p517148315/reports/intelligenthome

Book path: /writing/heir-presumptive

Separate events:
- book_view: a loaded book page, one per page load.
- book_read_start: at least three visible seconds with the extract in the viewport.
- book_read_progress: 25/50/75/90 percent of the extract reached, with minimum visible time (5/10/15/18 seconds). percent_scrolled parameter records the threshold.
- book_engaged_read: at least 30 visible seconds with the extract on screen and at least halfway reached.
- book_signup: server-confirmed saved signup, not merely a button click. Explicit repeat signup can generate another event; use the database for distinct active subscribers.

Open GA4 Reports > Engagement > Events and search book_. In Pages and screens filter page path to /writing/heir-presumptive for users and views. Use Realtime during validation; standard reporting can take 24–48 hours. Progress parameter needs an exploration/custom dimension if a breakdown by milestone is wanted; the dedicated event totals need no custom dimension. Homepage-to-book links are also captured by aw_link_click.

These are engagement proxies. They cannot establish comprehension or identify a named reader. Repeat loads, shared devices, blockers and consent/browser settings affect counts. Browser automation tests are excluded by the existing bot filter where detected. Validation using ordinary browsers may contribute test events.

Signup audience is the private heir_presumptive_subscribers table in the existing personal-site Supabase project ukacqljogssreycumocn. Select only unsubscribed_at IS NULL for book mailings. Never combine with writing_subscribers. No new recurring mailing or publication schedule is enabled. Do not email readers without an approved book update.
