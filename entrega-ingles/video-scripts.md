# UniGrades — TikTok Series: "Build and Monetize a Startup with AI"

> 10-episode script, ready to record. Each episode runs 60–90 seconds.
> The main thread is the **startup process** (find a problem, validate, define an MVP,
> build with AI, publish, get users). UniGrades — a web app where university students
> track their grades and GPA — is only the **example** used to illustrate the process.
>
> Central message: **AI gives you the power to build and monetize almost any idea, as
> long as you solve a real problem.**
>
> **Recurring ebook CTA:** at the end of most episodes, we invite viewers to comment a
> keyword so we DM them the link to the full ebook. The keyword changes per episode so
> we can track which video converts best.

---

## Episode 1 — Find a Problem Worth Solving

**Title:** "Stop looking for ideas. Look for problems."

**Hook (first 3 seconds):**
"Calculating my own GPA used to take me hours in a spreadsheet. That annoyance became a real app."

**What to say (narration):**
Everyone tells you to "find a great idea." That's backwards. You don't need a genius idea, you need a real problem that annoys real people. Mine was simple: every semester I rebuilt the same messy spreadsheet to figure out my grade point average. Partial exams, weights, credits, it never added up on the first try. If something irritates you enough to waste hours on it, that's a signal. Write down three things that frustrate you this week. One of them is your startup. The best part? With AI, you no longer need to be a programmer to build the solution. You just need the problem.

**What to show on screen:**
- Open with a cluttered Excel spreadsheet full of numbers and broken formulas.
- Cut to a hand writing "What annoys me?" on paper, listing three frustrations.
- End on the clean UniGrades app showing a GPA, captioned "Same problem, solved."

**Call to action:**
"Follow along: I'm building this real app from zero with AI, step by step. Comment BUILD and I'll DM you the free chapter of the ebook where I break down how to find your problem."

---

## Episode 2 — Validate Before You Build

**Title:** "Don't build in the dark. Ask first."

**Hook (first 3 seconds):**
"Before I wrote a single line, I asked 10 classmates one question, and it changed everything."

**What to say (narration):**
Here's the trap: you get excited, you spend two months building, and then nobody wants it. Validation is just proof that the problem is real for other people, not only for you. You don't need a fancy survey. I sent a message to classmates: "How do you track your grades, and does it stress you out?" Almost everyone had their own broken spreadsheet or just guessed their average. That's your green light. If people shrug, keep looking. If people say "oh my god, yes, I hate that," you found something. Validation costs you an afternoon. Building the wrong thing costs you months.

**What to show on screen:**
- A phone screen sending a WhatsApp message to a group chat.
- Replies popping in: "Same!", "I never know my real GPA", "I use Excel too."
- A simple tally on screen: "8 out of 10 said yes."

**Call to action:**
"This whole journey is in the ebook. Comment VALIDATE and I'll send you the link, including the exact questions I asked."

---

## Episode 3 — Define Your MVP

**Title:** "Your first version should embarrass you a little."

**Hook (first 3 seconds):**
"I cut 90% of my ideas before building. That's why it actually shipped."

**What to say (narration):**
MVP means Minimum Viable Product. Think of it like opening a restaurant with three dishes you cook perfectly instead of a 50-item menu you can't handle. For UniGrades I forced myself to pick only the core: register your subjects, set how each one is graded, enter your scores, and see your average calculated automatically. That's it. What did I leave out? Subscriptions, payments, a mobile app, fancy design. Not because they're bad, but because they're not the point yet. A feature you add later is easy. A product you never launch because it got too big is a tragedy. Pick the one thing your app must do, and protect it from everything else.

**What to show on screen:**
- A long list of features; most get crossed out with a red marker.
- Three survivors highlighted: "Add subjects", "Enter grades", "See GPA."
- A restaurant menu analogy: 50 items shrinking to 3.

**Call to action:**
"Want the exact MVP checklist I used? Comment MVP and I'll DM you the ebook link."

---

## Episode 4 — Design It Simple

**Title:** "Make it work ugly before you make it pretty."

**Hook (first 3 seconds):**
"My app launched in pure black and white, on purpose. Here's why that was smart."

**What to say (narration):**
People waste weeks picking colors and fonts before anything even works. I did the opposite. UniGrades started as plain black text on a white background, no logo, nothing fancy. The rule was simple: first make it work, then make it beautiful. Think of building a house. You pour the foundation and raise the walls before you choose the paint. Design is paint. And because I separated the "looks" from the "logic," a future redesign only touches the surface, never the engine underneath. Ugly but working beats gorgeous but imaginary every single time.

**What to show on screen:**
- The stark black-and-white UniGrades screens, no styling.
- Split screen: "Pretty mockup (fake)" vs "Ugly app (real and working)."
- A house under construction: concrete frame first, paint last.

**Call to action:**
"The full story, screenshots and all, is in the ebook. Comment DESIGN and I'll send it over."

---

## Episode 5 — Build It with AI

**Title:** "I'm not a coder. The AI is. I'm the director."

**Hook (first 3 seconds):**
"I didn't write this app. I told an AI what to build, and it did."

**What to say (narration):**
This is the part that sounds like magic, so let me demystify it. I used an AI copilot called Kiro. But here's the key lesson: AI works way better when you give it rules and a plan instead of random requests. Think of it like hiring a brilliant builder. If you say "build me something," you get chaos. If you hand them blueprints, you get a house. So first I wrote down the project's rules and a task list, then let the AI execute one task at a time. I reviewed, corrected, and directed. You don't need to know how to lay bricks. You need to know what you're building and be able to describe it clearly. That's the real skill now.

**What to show on screen:**
- A chat with the AI: a plain-language instruction going in, working screens coming out.
- A "Plan mode vs Build mode" caption.
- Blueprint handed to a builder, then a finished structure.

**Real problem box (mention on screen as text overlay):**
🔥 "Real problem: right after setup, a security warning appeared about the framework version. I didn't ignore it. I upgraded to the patched version before moving on. Lesson: warnings are friends, not obstacles."

**Call to action:**
"I documented every prompt and every stumble in the ebook. Comment AI and I'll DM you the link."

---

## Episode 6 — Where Your Data Lives

**Title:** "Your app needs a memory. Here's where it lives."

**Hook (first 3 seconds):**
"Think of a database as an Excel that lives on the internet, with rules nobody can break."

**What to say (narration):**
Your app has to remember things: your subjects, your grades, your account. That memory is called a database. Don't panic, it's just an organized Excel that lives online, with sheets connected to each other. For UniGrades I used a service called Supabase so I didn't have to build that from scratch. The powerful part is that I put the rules inside the database itself. For example, a grade must be between 0 and 5, and your evaluation weights must add up to 100%. The database enforces that, so even if the app has a bug, your data stays honest. The database is the guardian. And security starts here: there's a public key that's safe to share, and a secret key you never, ever expose.

**What to show on screen:**
- An Excel with multiple linked sheets morphing into a cloud database icon.
- A rule firing: typing "7.0" for a grade gets rejected, "0 to 5 only."
- 🔒 Overlay: "Public key = safe to share. Secret key = never show it."

**Call to action:**
"The ebook explains databases with zero jargon. Comment DATA and I'll send you the link."

---

## Episode 7 — Publish It for Free

**Title:** "From my laptop to a real link, for zero dollars."

**Hook (first 3 seconds):**
"This app is live on the internet right now, and it cost me nothing to publish."

**What to say (narration):**
A product nobody can open isn't a product, it's a file on your computer. Publishing sounds technical but today it's almost a button. I pushed my code to GitHub, which is like cloud storage for projects, then connected it to Vercel, a service that takes your project and gives it a real public web address, free. Minutes later, UniGrades had a live link anyone could open on any device. No servers to rent, no bills. The lesson: the barrier to going live has basically disappeared. If your excuse for not launching is "hosting is complicated," that excuse expired years ago.

**What to show on screen:**
- Code uploading to GitHub, then Vercel detecting the project.
- A loading bar, then a real live URL being typed into a phone browser.
- The app opening on a phone: "Live. For free."

**Call to action:**
"Step-by-step publishing guide is in the ebook. Comment LAUNCH and I'll DM you the link."

---

## Episode 8 — Brand & Online Presence

**Title:** "A name, a face, and a reason to trust you."

**Hook (first 3 seconds):**
"A product without a brand is a stranger. Nobody downloads from a stranger."

**What to say (narration):**
Now that it works and it's live, it needs an identity. Branding isn't about an expensive logo, it's about being recognizable and trustworthy. Pick a clear name that says what it does. UniGrades, university grades, done. Make a simple logo, you can do it free in Canva in ten minutes. Then claim your social profiles so people can find you and follow the journey. Here's the secret weapon: build in public. Share the messy process, the wins and the stumbles. People don't just buy products, they buy the story and the person behind it. Your content becomes your marketing, and it's free.

**What to show on screen:**
- Typing a name, generating a simple logo in Canva.
- Creating TikTok and Instagram handles for the project.
- A "build in public" montage of behind-the-scenes clips.

**Call to action:**
"I show my exact branding setup in the ebook. Comment BRAND and I'll send you the link."

---

## Episode 9 — Make It Official

**Title:** "Turning a side project into a real company."

**Hook (first 3 seconds):**
"At some point a project becomes a business. Here's the boring part that makes it real."

**What to say (narration):**
You can build and launch without any of this, but the moment you want to charge money or sign deals, you make it official. In Colombia that means two simple steps. First, register the business with the Cámara de Comercio, the chamber of commerce, which is the office that officially records your company exists. Second, get your RUT, the tax ID, from the DIAN, the national tax authority. Think of it like getting an ID card for your company so it can legally exist, invoice, and grow. It's paperwork, not rocket science, and you only need it when money starts moving. Don't let it scare you off at the idea stage, but know it's there waiting when you're ready to monetize.

**What to show on screen:**
- A hand stamping a document, "Business registered."
- A simple diagram: Cámara de Comercio (company exists) → DIAN / RUT (tax ID).
- An ID card for a person morphing into an ID card for a company.

**Call to action:**
"The ebook walks through making it official in plain language. Comment OFFICIAL and I'll DM the link."

---

## Episode 10 — Launch & Get First Users

**Title:** "Your first 10 users matter more than your next 10,000."

**Hook (first 3 seconds):**
"Launching isn't a fireworks show. It's handing your app to one real person at a time."

**What to say (narration):**
This is the finish line that's actually a starting line. Your first users won't come from an ad, they'll come from you. I started where my users already hang out: university student groups and classmates who told me "yes, I hate doing this by hand." I handed them the link and watched them use it. Then the real gold: feedback. Every "this confused me" is a free upgrade to your product. You improve, you share again, you grow. And this is where it all connects, the content series itself becomes the engine. Every video brings viewers, every viewer can become a user or an ebook buyer. That's the whole loop: solve a real problem, build it with AI, share the story, and let it pay you back.

**What to show on screen:**
- Sharing the link in a student group chat, people opening it.
- A feedback note turning into an improved screen.
- A full-circle graphic: Problem → Build with AI → Share → Users → Income.
- End on the "magic moment": typing a grade and the GPA updating itself instantly.

**Call to action:**
"That's the whole process. The complete playbook, every prompt, every real obstacle, is in the ebook. Comment START and I'll DM you the link. Your idea plus AI is enough to begin today."
