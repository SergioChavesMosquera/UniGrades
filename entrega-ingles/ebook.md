# From Class Project to Startup: I Built a Real App with AI (and I'll Show You How)

*A plain-language playbook for turning a real problem into a published, monetizable product, even if you've never written a line of code.*

---

## Introduction — Why this book exists

A few years ago I did a project for a Databases class at my university. It was called UniGrades: a small app to track grades and calculate averages. When the class ended, most projects die in a folder. This one didn't, because it solved a problem I actually had. Every single semester I would open Excel and rebuild the same tangled spreadsheet to figure out my grade point average, my GPA. Weights, partial exams, credits, leveling courses that don't count. It took me hours, and it was still wrong half the time.

So I decided to turn that annoyance into a real, published product, using artificial intelligence as my copilot. I'm not a professional software engineer. I directed the build. The AI did the typing. And that's the entire point of this book.

Here's the promise, and the central message: **AI now gives almost anyone the power to build and monetize an idea, as long as that idea solves a real problem.** You don't need to learn to code. You need to learn to *direct the building of a product.* That's a skill you can start practicing today.

Throughout this book, UniGrades is just the example. The real subject is **the process**: how you go from a frustration to a live app people pay for. Each chapter ends with a checklist so you can apply the same steps to *your* idea, not mine. And in boxes marked "Real problem," I'll show you the genuine stumbles, the security scares, the tools that broke mid-project, the features I had to delete, because that's the part generic tutorials hide, and it's the part that actually teaches you.

Let's begin where every good product begins: not with an idea, but with a problem.

---

# Part 1 — Before Writing a Single Line of Code

The most important work happens before any building. Skip this part and you'll build something beautiful that nobody wants.

---

## Chapter 1 — Find a Problem Worth Solving

### The idea trap

Most people wait for a lightning-bolt idea. They think successful founders sat under a tree one day and a perfect app fell into their head. That almost never happens. Great products don't start with ideas, they start with problems, specifically problems that annoy real people enough that they'd happily pay, or switch, to make the pain go away.

Think of it like being a doctor. A doctor doesn't walk around inventing cures for diseases nobody has. They find the symptom first, then prescribe. Your startup works the same way. Find the ache, then build the remedy.

### The real story

My problem was embarrassingly ordinary. Every semester at university I wanted to know my average, my GPA, so I could see if I was on track. The official university system showed final grades but not the breakdown I cared about: how each partial exam, each workshop, each project added up along the way. So I built a spreadsheet. And every semester that spreadsheet grew into a monster of formulas that broke whenever I touched them. Calculating my own average took hours, and I still didn't trust the result.

That frustration is the seed of UniGrades. Not a brilliant idea. A recurring annoyance I couldn't stop running into.

### How to tell if your problem is worth it

A problem worth solving usually has three traits:

1. **It repeats.** A one-time annoyance isn't a business. Mine came back every semester like clockwork.
2. **It costs something.** Time, money, or stress. Mine cost hours and a nagging uncertainty about my own grades.
3. **It's not just you.** This one you confirm in the next chapter, but if you already suspect others feel the same pain, you're onto something.

> **Real problem 🔥**
> When I restarted UniGrades, I had an old class project PDF with the data model already designed: the entities, the business rules, the diagrams. My first instinct was to reinvent everything "properly." That would have wasted weeks. The honest lesson: don't throw away good work that already exists just because it came from a humble place like a class assignment. I reused that solid foundation and adapted it. Starting from something beats starting from nothing.

### Checklist — Apply it to your idea

- [ ] Write down three things that annoyed you this week.
- [ ] For each one, ask: does it repeat? does it cost time, money, or stress?
- [ ] Circle the one that bothers you the most, the one you'd pay to make disappear.
- [ ] Write one sentence: "The problem is ___, and it affects ___."
- [ ] Resist the urge to think about the app yet. Stay on the problem.

---

## Chapter 2 — Validate Before You Build

### The most expensive mistake in startups

The classic founder disaster goes like this: you fall in love with your idea, you lock yourself away for two months building it in secret, you launch, and then... silence. Nobody wanted it. You built a beautiful answer to a question nobody asked.

Validation is the cure. It simply means getting proof, before you build, that your problem is real for *other* people, not just you. Think of it like tasting the soup before you serve the whole table. One spoonful now saves you from cooking a pot nobody eats.

### The real story

Before writing anything, I did the cheapest possible test. I messaged classmates and asked a simple question: "How do you keep track of your grades, and does it stress you out?" I didn't pitch my app. I just listened. The answers came back fast and familiar: some had their own broken spreadsheets, some just guessed their average, and almost everyone said yes, it was annoying. That was my green light. The pain wasn't only mine.

### How to validate without spending a dime

- **Ask 5 to 10 real people.** Not your mom. People who actually have the problem.
- **Ask about the problem, not your solution.** "How do you handle X today?" tells you more than "would you use my app?" People lie to be nice about your app. They tell the truth about their current pain.
- **Use tools you already have.** A WhatsApp message, a short form, a conversation in the hallway. Validation is a conversation, not a research project.
- **Listen for emotion.** A shrug means keep looking. A "oh my god, yes, I hate that" means you found something.

> **Real problem 🔥**
> It's tempting to skip this because you're sure you're right. I almost did. But the validation step is also where you learn the *words* people use for their problem, "I never know my real GPA," "the system doesn't show the breakdown." Those exact words become your marketing later. Skipping validation doesn't just risk building the wrong thing, it robs you of the language your future users respond to.

### Checklist — Apply it to your idea

- [ ] List 5 to 10 people who genuinely have your problem.
- [ ] Write one question about how they handle it *today*.
- [ ] Reach out this week. Don't pitch, just listen.
- [ ] Write down the exact phrases they use.
- [ ] Decide: strong yes (build), lukewarm (rethink), or no (find a new problem).

---

## Chapter 3 — Define Your MVP

### What MVP really means

MVP stands for Minimum Viable Product. Translated into human: the smallest version of your product that still solves the core problem for a real person. Emphasis on *smallest* and *still solves*.

Picture opening a restaurant. You could launch with a 50-dish menu and drown in the kitchen, or open with three dishes you cook flawlessly. The three-dish restaurant wins, because it's real, it's good, and it survives long enough to add dish number four. Your MVP is your three perfect dishes.

### The real story

For UniGrades I made a list of everything I *could* build: grade tracking, a mobile app, social sharing, subscriptions, beautiful design, notifications, the works. Then I did the hard thing, I crossed almost all of it out. The core that survived was tiny:

1. Register your subjects.
2. Set how each subject is graded (the weights).
3. Enter your scores.
4. See your average calculated automatically.

That's the whole MVP. Everything else was a "later."

### What I deliberately left out, and why

- **Subscriptions and payments.** The app launched 100% free, with no technical trace of billing at all. Charging money is a decision for when you have users who love the product, not a day-one feature. My business partner will define pricing later; I refused to let it complicate the MVP.
- **A mobile app.** Web first. Faster to build, easier to share a link, perfect for a demo. Mobile can come later in a separate project, sharing the same data.
- **Pretty design.** Covered in the next chapter, but it was a loud "not yet."

The discipline here is brutal but freeing: every feature you *don't* build is time you *do* spend shipping. A feature added later is easy. A product that never launches because it grew too big is the real failure.

> **Real problem 🔥**
> The pressure to add "just one more thing" never stops. Midway through, I was tempted to model every tiny detail, like marking each subject as mandatory or optional. I caught myself and asked: does this change whether the app solves the core problem? It didn't. So I left all subjects as a single simple type and moved on. Over-modeling is just procrastination in a smart costume.

### Checklist — Apply it to your idea

- [ ] List every feature you can imagine for your product.
- [ ] Circle the one thing it absolutely must do to solve the problem.
- [ ] Keep only the 2 to 4 features that directly serve that one thing.
- [ ] Cross out the rest and label them "later" (don't delete, just defer).
- [ ] Confirm: is payment in your MVP? If so, ask whether it truly needs to be. Usually it doesn't.

---

# Part 2 — Building with AI

Now we build. Here's where "I can't code" stops being an excuse. Your job isn't to type code, it's to direct a very capable, very literal assistant.

---

## Chapter 4 — Set the Stage: Give the AI Rules and a Plan

### Why a plan makes AI dramatically better

Here's the single biggest lesson of the whole build: AI performs far better when you give it rules and a written plan than when you throw random requests at it.

Imagine hiring an extraordinarily talented builder who's also extremely literal. If you say "build me something nice," you get chaos, because they'll guess, and their guesses won't match your head. If you hand them blueprints and a list of rooms to build in order, you get a house. The AI copilot is that builder. Your blueprints are the rules and the plan.

### The real story

I used an AI copilot called Kiro. Before building anything, I set up three things:

- **Rules (steering):** the fixed facts of the project. What technology to use, the convention that the UI stays minimal, and the core business rules of grades. The AI respects these in every interaction, so I don't have to repeat myself.
- **A plan (specs):** I turned the idea into written documents, what the product needs, how it's designed, and a task list of concrete steps to execute one at a time.
- **Automation (hooks):** a small automation that checks the work for errors every time a file is saved, so mistakes get caught early instead of piling up.

There's also a mindset I kept switching between: **Plan mode** (talking through and designing, no code yet) and **Build mode** (actually producing the code). Thinking before building sounds obvious, but it's the habit most people skip, and it's exactly why their AI results feel messy.

### Plan mode vs Build mode

- **Plan mode** is a conversation. You and the AI decide *what* and *why*. No code is written. This is where you catch bad ideas cheaply.
- **Build mode** is execution. The AI writes the actual product, one planned task at a time, while you review.

Separating the two keeps you in control. You never let the builder start laying bricks before the blueprint is agreed.

### Checklist — Apply it to your idea

- [ ] Write 5 to 10 fixed rules for your project (tech, style, non-negotiables).
- [ ] Turn your MVP into a short plan: what it needs, how it looks, a list of steps.
- [ ] Decide to build one step at a time, not all at once.
- [ ] Always plan in words before asking the AI to build.
- [ ] Review every piece the AI produces before moving to the next step.

---

## Chapter 5 — The Skeleton: Make It Work Ugly Before Pretty

### Function first, beauty later

People burn weeks choosing fonts and colors before anything works. Do the opposite. Build the skeleton that *functions*, then dress it up.

Think of building a house. You pour the foundation and raise the walls before you pick the paint. Nobody lives in paint. The structure comes first.

### The real story

The first real build of UniGrades was deliberately ugly: plain black text on a white background, no logo, basic reusable building blocks like buttons and input fields. I built the public pages first, a landing page and the login and signup screens. It compiled, it ran, it looked boring. Perfect.

The deeper decision was separating the "looks" from the "logic" from day one. The part that calculates and stores data (the backend) lives apart from the part you see and click (the frontend). Because of that separation, a future redesign only touches the surface. The engine underneath never has to change. That's not just tidiness, it's what lets a non-designer like me ship now and beautify later without breaking anything.

> **Real problem 🔥**
> Two real stumbles hit during this first build, and both are great teachers.
> First, right after setting up the project, a **security warning** appeared: the version of the framework I was using had a known vulnerability. I did not ignore it to "save time." I upgraded to the patched version before continuing. Security warnings are friends, not obstacles.
> Second, a command I relied on to check the code's quality was **removed in a new version of the framework**. My checks broke overnight. I had to migrate the configuration to the new format. The lesson: tools evolve, sometimes mid-project. Knowing how to diagnose "why did this break?" and adapt is part of the job, even when the AI is doing the typing.

### Checklist — Apply it to your idea

- [ ] Build the plainest possible working version first, no styling.
- [ ] Keep the logic (how it works) separate from the look (how it appears).
- [ ] Take security warnings seriously the moment they appear.
- [ ] Expect a tool to break or change, and treat it as normal, not a disaster.
- [ ] Confirm the ugly version actually runs before you touch design.

---

## Chapter 6 — Where Your Data Lives

### A database, explained without jargon

Your app has to remember things, your account, your subjects, your grades. That memory is called a database. Don't let the word scare you.

A database is just an organized Excel that lives on the internet, made of several sheets (called tables) that are connected to each other. One sheet for users, one for subjects, one for grades, all linked. The big difference from a normal spreadsheet is that a database can enforce rules nobody can break.

### The real story

For UniGrades I used a service called Supabase, which gives you a real database without building one from scratch. I defined the structure of my "sheets" and connected the app to it.

The powerful move was putting the rules *inside* the database itself, so the database becomes the authority, the guardian. For example: a grade must be between 0 and 5, and the evaluation weights of a subject must add up to 100%. Even if the app had a bug, the database would refuse bad data. That means your information stays honest no matter what happens on the surface.

> **Real problem 🔒**
> When I connected the app to the database, I had to copy some access keys. There are two kinds, and confusing them is dangerous. One is the **public key**, safe to use in the app and safe for people to see. The other is the **secret key**, which grants total access and must *never* be exposed or shared. I almost pasted the wrong one. The lesson, learned live: in the app you only ever use the public key. The real security is enforced by the database itself. Treat your secret key like your house key, you don't tape it to the front door.

### Checklist — Apply it to your idea

- [ ] Picture your data as linked spreadsheet "sheets": what does your app need to remember?
- [ ] Use a ready-made database service so you don't build one from scratch.
- [ ] Put your most important rules inside the database, not only in the app.
- [ ] Identify your public key (safe) versus your secret key (never expose).
- [ ] Never paste a secret key anywhere the public can reach it.

---

## Chapter 7 — The Rules Nobody Can Break

### Why rules belong in the database

In the last chapter we put the data's memory in place. Now we make it trustworthy. The key principle: your most important rules should live in the database, not just in the app's screens.

Here's the difference. If a rule lives only in the form on screen, a glitch, a bug, or a clever user can sneak bad data past it. If the rule lives in the database, it's the final gatekeeper, nothing gets in unless it obeys. Think of it like a nightclub. The friendly host at the door (the app) is nice but can be fooled. The bouncer inside (the database) checks everyone, no exceptions.

### The real story

For UniGrades I put the real rules in the database so they'd be the authority:

- Evaluation weights for a subject can never exceed 100%, and should add up to exactly 100 when finished.
- A subject marked passed or failed can't secretly go back to "in progress."
- A grade is always between 0 and 5.
- Leveling courses (like introductory English) don't count toward your average.
- Each user can only ever see their own data, never anyone else's.

Because these rules sit in the database, they hold true even if the app changes, even if I switch devices, even if a future version has a bug. The app can relax, because the guardian never sleeps.

One design choice made this clean: I did NOT nag the user while they typed. They could add weights little by little as they configured a subject, but the moment something tried to break a rule, like going over 100%, it was blocked. Friendly on the way in, strict on the actual rule. That's good product thinking, not just good engineering.

> **Real problem 🔥**
> It's tempting to put rules only in the screen because it's faster and the user sees instant feedback. I did add instant feedback in the app for a nice experience, but I made sure the database enforced the same rules underneath. Feedback for the human, enforcement for the data. If you only do the first, your data eventually gets corrupted. If you only do the second, your app feels clunky. You want both.

### Checklist — Apply it to your idea

- [ ] List the rules your data must always obey (ranges, limits, who-sees-what).
- [ ] Put the critical ones in the database as the final authority.
- [ ] Add friendly, instant feedback in the app on top of them.
- [ ] Make sure one user can never see another user's private data.
- [ ] Test by trying to break a rule, confirm the database stops you.

---

## Chapter 8 — The Front Door: Accounts and Security

### Why you need a front door

Up to now, anyone could walk into the app. But people store personal data, their own grades, so you need a front door: a way to sign up, log in, and make sure each person sees only *their* stuff. This is called authentication.

Think of an apartment building. Everyone enters through the same front door (the login), but your key only opens *your* apartment (your data). You can't wander into a neighbor's place, and they can't wander into yours.

### The real story

I added sign-up and login with email and password, and protected the private part of the app so you can't enter without an account. When you register, your personal profile is created automatically. Combined with the database rule that each user only sees their own data, the result is simple and safe: your grades are yours alone.

> **Real problem 🔥**
> Here's one of the most valuable product lessons of the whole project, and it's about *removing* a feature. I originally planned to let people log in with Google. But setting that up meant leaving my tools to configure an external Google system, and my university email account kept blocking it due to administrator policies. It was friction on top of friction. So I made a product decision: **cut Google login for now.** Email and password live entirely inside my existing service and anyone understands them. The best decision was to remove an option, not add one. Less friction for the user equals a better product. "Make it so simple anyone can use it" beat "offer every possible option."
>
> There was even a small technical aftershock: after deleting the Google feature, a leftover cached reference to the removed screen made my checks fail. The fix was to clear the tool's cache and rebuild. The lesson: sometimes the error isn't in your work at all, it's stale leftovers in the tool's memory.

> **Real problem 🔄**
> A second real twist: partway in, I realized my database was created under the wrong account (a personal one instead of my institutional one). Rather than live with the mess, I rebuilt the database under the correct account. Because I had saved the database's structure as versioned files, "moving" it was almost trivial, I just ran those files again in the new place. That's the hidden payoff of doing things properly: changing servers became copy and paste, not starting over.

### Checklist — Apply it to your idea

- [ ] Add a simple way to sign up and log in (email and password is plenty to start).
- [ ] Protect the private part of your app so no account means no entry.
- [ ] Guarantee each user sees only their own data.
- [ ] Be willing to remove a login option if it adds friction, simple wins.
- [ ] Save your database's structure as files so you can move it without pain.

---

# Part 3 — Launch and Grow

You built it. Now make it real, make it known, and put it in people's hands. This is where a project becomes a startup.

---

## Chapter 9 — Publish It for Free

### A product nobody can open isn't a product

An app sitting on your laptop is just a file. To be real, it has to live on the internet where anyone can open it. Good news: publishing used to be hard and expensive, and today it's nearly a button, and free.

### The real story

Publishing UniGrades took two steps. First I pushed the project to GitHub, which is like cloud storage built for software projects, a safe, versioned copy that lives online. Then I connected that to Vercel, a service that takes your project and gives it a real public web address automatically, at no cost. Minutes later, UniGrades had a live link that anyone could open on any device. No servers to rent, no monthly bill.

Think of GitHub as the warehouse where your product's master copy is stored, and Vercel as the storefront that puts it on the street where customers can walk in. Together they turn "a file on my computer" into "a business anyone on earth can visit."

> **Real problem 🔒**
> Right before publishing, I did a critical safety check: I made sure none of my secret credentials were being uploaded. The project was set up so that a file holding real keys stays private and never leaves my machine, while only a harmless template with blank placeholders gets shared. The lesson: before you ever publish, confirm that no password, key, or secret is riding along in the upload. Publishing a secret to the public internet is one mistake that's genuinely hard to undo.

### Checklist — Apply it to your idea

- [ ] Store your project in a cloud code warehouse like GitHub.
- [ ] Connect it to a free hosting service that gives you a public link.
- [ ] Open the live link on your phone to confirm it really works.
- [ ] Before publishing, double-check that no secrets are in the upload.
- [ ] Share the link with one person to prove it's truly live.

---

## Chapter 10 — Brand and Online Presence

### A product without a brand is a stranger

Your app works and it's live. Now it needs an identity, because people don't download from strangers. Branding isn't about an expensive logo, it's about being clear, recognizable, and trustworthy.

### The real story

Branding can be simple and cheap. Pick a name that says what it does, UniGrades literally means university grades, so nobody has to guess. Make a basic logo in a free tool like Canva in ten minutes. Claim your social profiles so people can find you and follow along.

Then the secret weapon: **build in public.** Partway through this project I decided to document the whole process in real time, the decisions, the wins, and especially the stumbles. That became a planned 10-episode video series showing how the startup gets built step by step, plus this very ebook as a product to sell. The behind-the-scenes story, recorded live, is worth far more than a polished one reconstructed later. The real obstacles, the security scares, the features I deleted, aren't the embarrassing part to hide. They're the most engaging content you have.

People don't just buy products. They buy the story and the person behind it. Your honest process *is* your marketing, and it costs nothing.

> **Real problem 🔥**
> The temptation is to wait until everything is perfect before showing anyone. That's a mistake. The most valuable clips, like the moment the GPA calculates itself for the first time, only exist if you capture them *as they happen*. If you wait for the end, those authentic moments are gone forever. So the active rule I set for myself: screenshot and record at every milestone, never leave it for later.

### Checklist — Apply it to your idea

- [ ] Pick a clear name that hints at what your product does.
- [ ] Make a simple logo in a free tool, don't overthink it.
- [ ] Claim your social handles so people can find you.
- [ ] Start documenting your process now, wins and stumbles both.
- [ ] Capture screenshots and clips at every milestone as they happen.

---

## Chapter 11 — Make It Official

### When a project becomes a business

You can build, launch, and even gather users without any paperwork. But the moment you want to charge money, sign contracts, or invoice clients, you make your business official. Think of it as getting an ID card for your company so it can legally exist and handle money.

### The real story

In Colombia, making it official comes down to two steps, and neither is rocket science:

1. **Register with the Cámara de Comercio** (the Chamber of Commerce). This is the office that officially records that your company exists. It's the equivalent of your business getting its birth certificate.
2. **Get your RUT from the DIAN.** The RUT is the tax ID for your business, and the DIAN is Colombia's national tax authority. This is what lets your company legally invoice, pay taxes, and operate with money.

That's the core of it: one step says "this company exists," the other says "this company can legally handle money." It's paperwork, and you only truly need it when money starts moving. Don't let it scare you at the idea stage, but know exactly where it waits for you when you're ready to monetize.

> **Real problem 🔥**
> The real obstacle here isn't the paperwork, it's fear and procrastination. Many founders delay launching because they think they need to be a registered company first. You don't. UniGrades launched completely free, with no payment system and no company registration, and that was the right call. Make it official when you're about to charge, not before. Doing it too early just adds cost and complexity to a product that hasn't proven itself yet.

### Checklist — Apply it to your idea

- [ ] Confirm you actually need to be official yet (only when money moves).
- [ ] Find your country's equivalent of registering the company's existence.
- [ ] Find your country's equivalent of getting a business tax ID.
- [ ] Keep launching and growing while this waits, don't let it block you.
- [ ] When money is about to flow, handle the paperwork, then invoice freely.

---

## Chapter 12 — Launch and Get Your First Users

### The finish line that's actually a starting line

Launching isn't a fireworks show. It's handing your app to one real person at a time and learning from what happens. Your first 10 users teach you more than your next 10,000 ever will.

### The real story

My first users didn't come from an ad, they came from me. I went where my users already were: university student groups and the classmates who had already told me "yes, I hate doing this by hand." I handed them the link and watched them use it.

Then came the real gold: feedback. Every "this part confused me" is a free upgrade request for your product. You listen, you improve, you share again, you grow. And here's where the whole thing becomes a machine: the content series itself is the engine. Every video brings viewers, and every viewer can become a user or an ebook buyer. That's the full loop, solve a real problem, build it with AI, share the story honestly, gather users, and let it pay you back.

And at the center of it all sits the magic moment, the thing that makes someone go "oh, I need this." For UniGrades, it's this: you type in a single grade, and your subject average, your semester average, and your overall GPA all update themselves instantly, no formulas, no hours in a spreadsheet. The hard work we did earlier, putting the rules and calculations inside the database, is exactly what makes the visible part feel effortless. The difficult work was done early so the visible part could be easy. That's the whole philosophy of this book in one sentence.

> **Real problem 🔥**
> The hardest part of launching isn't technical, it's emotional: the fear of sharing something imperfect. But a product improved by 10 real users beats a "perfect" product nobody has ever touched. Share before you're ready. The feedback you get is the fastest path to actually being ready.

### Checklist — Apply it to your idea

- [ ] Identify where your first users already gather.
- [ ] Hand your link to real people and watch them use it.
- [ ] Treat every confusion and complaint as a free upgrade request.
- [ ] Find your product's magic moment and show it off everywhere.
- [ ] Let your content and your users feed each other, that's your growth loop.

---

## Closing — Your turn

You just watched a frustration, calculating my GPA by hand, become a real, published app with real users, built mostly by an AI I directed rather than code I wrote. Every chapter here maps to a step you can take this week.

Remember the one message that ties it all together: **AI gives you the power to build and monetize almost any idea, as long as you solve a real problem.** You don't need permission, a computer science degree, or a perfect plan. You need a real problem, the discipline to keep it small, an AI copilot, and the courage to share before it's perfect.

The problem that annoys you most right now? That's your UniGrades. Start today.
