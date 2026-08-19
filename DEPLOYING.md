# Putting your site online

The goal: your website lives at a real web address, and whenever you change
something on your computer, the live site updates by itself.

Two services, both free, both fine to use for coursework:

- **GitHub** stores your project and its history.
- **Vercel** watches GitHub and rebuilds your website every time you change it.

You do the setup once. After that, publishing is three commands.

Set aside about 20 minutes.

---

## Before you start

Everything the deploy needs is already in the project — you do not have to
create or configure anything else:

- `vercel.json` tells Vercel to send every address to your site's own routing.
  **Without it, `/document/cv` returns 404** when someone opens the link
  directly, which is exactly what your marker will do.
- `package.json` tells Vercel how to build the site.
- `.gitignore` keeps `node_modules` and `dist` out of GitHub. Those are
  rebuilt by Vercel, so uploading them would be pointless and slow.

---

## Step 0 — Tell git who you are

Right now your commits are signed by `zuzietthanh@zuzietthanh.local`, which is
not a real address. GitHub will still accept your work, but it will not connect
those commits to your account, so your profile will look empty.

Run these two lines once, using **the same email you will use for GitHub**:

```bash
git config --global user.name "Thanh Vu"
```

```bash
git config --global user.email "vut24595@gmail.com"
```

This only affects commits you make from now on. Earlier ones stay as they are,
which is fine.

---

## Step 1 — Create a GitHub account

If you already have one, skip to Step 2.

1. Go to <https://github.com/signup>
2. Use the same email you just put in Step 0.
3. Pick any username. It will appear in your repository's address, so
   something like `thanhvu` is better than `xX_coolguy_Xx`.
4. Verify your email when GitHub asks.

---

## Step 2 — Create an empty repository

A "repository" (or "repo") is just a project folder that GitHub stores.

1. Go to <https://github.com/new>
2. **Repository name:** `portfolio`
3. **Description:** optional, leave it blank
4. **Private** — choose this. See the note below.
5. **Do NOT tick** "Add a README file", "Add .gitignore", or "Choose a
   license". Your project already has these, and ticking them creates a
   conflict that is annoying to untangle.
6. Click **Create repository**

GitHub then shows you a page with some commands. Ignore it — the next step
covers what you need.

### Private or public?

**Choose Private.** Your repository contains your photo, your CV as a PDF, and
your email address. Private means only you can see the files; your *website*
is still fully public and shareable. Vercel works with private repositories on
the free plan.

Public would also work, and nothing in the project is secret. But there is no
advantage to it for a marketing portfolio, so take the safer default.

---

## Step 3 — Connect your folder to GitHub

Open your terminal in the project folder and run these one at a time.

First, point your project at the repository you just made. **Replace
`YOUR-USERNAME` with your actual GitHub username:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
```

Then check it worked:

```bash
git remote -v
```

You should see your address printed twice. If you typed it wrong, fix it with
`git remote set-url origin <correct address>`.

Now upload everything:

```bash
git push -u origin main
```

### Signing in

The first time you push, git asks for your GitHub username and password.

**Your normal GitHub password will not work here.** GitHub stopped accepting it
for this in 2021. You need a *Personal Access Token*, which is a long password
made specifically for this purpose:

1. Go to <https://github.com/settings/tokens?type=beta>
2. Click **Generate new token**
3. **Name:** `my laptop`
4. **Expiration:** 90 days is sensible
5. **Repository access:** Only select repositories → pick `portfolio`
6. **Permissions** → Repository permissions → **Contents** → set to
   **Read and write**
7. Click **Generate token**, then copy the long string it shows you

Paste that token when git asks for your **password**. Your username stays your
normal username.

> GitHub shows the token exactly once. Copy it somewhere safe. If you lose it,
> delete it and make a new one — you cannot look it up again.

macOS will remember it, so you only do this once.

Refresh your repository page on GitHub. Your files should be there.

---

## Step 4 — Connect Vercel

1. Go to <https://vercel.com/signup>
2. Choose **Continue with GitHub** — this links the two accounts, which is the
   whole point
3. Choose the **Hobby** plan (free). It asks what you are using it for;
   "personal" is correct.
4. Vercel asks for permission to see your repositories. Choose **Only select
   repositories** and pick `portfolio`.

---

## Step 5 — Import and deploy

1. On your Vercel dashboard, click **Add New** → **Project**
2. Find `portfolio` in the list and click **Import**
3. Vercel reads your project and fills in the settings by itself. It should
   show:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | **Vite** |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

   **If Framework Preset says "Other"**, change it to **Vite** manually. Leave
   everything else alone.

4. Ignore the "Environment Variables" section. Your site has no backend and
   needs none.
5. Click **Deploy**

It takes one to two minutes. When it finishes you get a live address like
`portfolio-abc123.vercel.app`.

---

## Step 6 — Test it properly

Do not just open the home page and call it done. **The thing most likely to be
broken is the thing your marker will click.**

Open each of these directly, by pasting the full address into a fresh browser
tab:

- `your-site.vercel.app` — the home page
- `your-site.vercel.app/statement-of-purpose`
- `your-site.vercel.app/document/cv`
- `your-site.vercel.app/documents/thanh-vu-cv.pdf` — the actual PDF

If any of the middle two show **404**, `vercel.json` did not get picked up.
Check the file is in the top level of your repository on GitHub, not inside a
subfolder.

Then click **Download CV** on the site and confirm the PDF opens.

Also open it on your phone. Your brief marks mobile-responsive design.

---

## From now on: how to publish a change

This is the part that matters day to day. Edit whatever you want — a JSON file,
your CV, an image — then run these three commands:

```bash
git add .
```

```bash
git commit -m "Update my statement of purpose"
```

```bash
git push
```

Vercel sees the push and rebuilds within about a minute. Refresh your live site
and the change is there.

Change the message in quotes to describe what you actually did. It is a note to
yourself, and it becomes your revision history — which your assignment happens
to care about.

### If you changed your CV

The PDF is built from `cv-source/thanh-vu-cv.html`, so rebuild it **before**
committing:

```bash
npm run cv
```

Then `git add .`, `git commit`, `git push` as above. Forgetting this is the
easiest mistake to make: the website updates but the PDF stays old.

---

## Switching on the peer-review form

Each document page has a **Leave a review** form. A classmate fills it in, it
lands in a private queue at `/review`, and it only appears on your site once
you publish it there. Nothing a stranger types goes live on its own.

Until you do the two steps below, the form politely says feedback is not
switched on yet. **The reserved reviewer slots and the form itself still show**,
so the page already demonstrates that peer review exists.

### 1. Add a database

Vercel dashboard → your project → **Storage** → **Create Database** →
**Upstash for Redis** → **Free** plan → **Connect** to your project.

Vercel adds the connection details to your project by itself. You do not copy
or paste any keys.

### 2. Set your password

Vercel dashboard → your project → **Settings** → **Environment Variables**

| Field | Value |
| --- | --- |
| Key | `ADMIN_PASSWORD` |
| Value | any password you invent |
| Environments | tick all three |

Click **Save**. Then go to **Deployments**, open the most recent one, and choose
**Redeploy** — environment variables only reach a build that starts after they
are saved.

### Using it

Go to `your-site.vercel.app/review` and enter that password. Each waiting
comment has a box for your reply — that reply is what appears under their
comment as **What I did**, which is exactly what your brief asks for. Then
press **Publish**.

That page is not linked from anywhere on your site and is marked so search
engines skip it. Anyone who guesses the address still needs the password.

### Trying it on your own computer first

Create a file called `.env.local` next to `package.json` containing:

```
ADMIN_PASSWORD=whatever-you-like
```

Then `npm run dev`. The form and `/review` both work locally, storing feedback
in memory — it clears when you stop the server, which is exactly what you want
for testing. `.env.local` is ignored by git, so your password never leaves your
computer.

---

## Getting a nicer web address

`portfolio-abc123.vercel.app` is ugly. You can rename it free:

Vercel dashboard → your project → **Settings** → **Domains** → edit the
`.vercel.app` address to something like `thanhvu.vercel.app`.

If you would rather have a real domain like `thanhvu.com`, you buy it
(roughly 250,000–350,000 VND per year) and add it in the same place. Not
required for your assignment.

---

## When something goes wrong

### The deploy failed

Vercel shows a red **Error**. Click the deployment, then **Building**, and read
the log. The first red line names the problem.

Before pushing, you can catch most failures yourself by running the same
command Vercel runs:

```bash
npm run build
```

If that works on your computer, it will almost certainly work on Vercel.

### "Support for password authentication was removed"

You used your GitHub password instead of a Personal Access Token. Go back to
Step 3 and make one.

### "failed to push some refs" / "rejected"

Something changed on GitHub that you do not have locally — usually because you
edited a file on the GitHub website. Pull it down first:

```bash
git pull --rebase
```

Then push again.

### The site updated but the PDF did not

You forgot `npm run cv` before committing. Run it, then commit and push again.

### A page shows 404 but works locally

`vercel.json` is missing from your repository, or it ended up in the wrong
folder. It must sit at the top level, next to `package.json`.

### I broke something and want to go back

Every push is saved. On Vercel: **Deployments** → find one that worked →
**⋯** → **Promote to Production**. Your site reverts immediately, and your
files on the computer are untouched.
