# How to edit your site

Written for you, not for a developer. You do not need to understand any code to
change everything on this website.

Everything you can change lives in **five files** in the folder
`src/content/`. You edit them, save, and the website updates.

---

## Contents

1. [The one rule that matters](#the-one-rule-that-matters)
2. [Seeing your changes](#seeing-your-changes)
3. [Your name, role and bio](#your-name-role-and-bio)
4. [Your statement of purpose](#your-statement-of-purpose)
5. [Your documents (CV, cover letter, LinkedIn)](#your-documents)
6. [Your projects](#your-projects)
7. [Your contact links](#your-contact-links)
8. [Pictures](#pictures)
9. [Colours](#colours)
10. [Publishing your changes](#publishing-your-changes)
11. [When something breaks](#when-something-breaks)

---

## The one rule that matters

These files are written in a format called JSON. It has one rule that causes
99% of all problems:

> **Every line needs a comma at the end — except the last one in a group.**

Correct:

```json
{
  "name": "Thanh Vu",
  "role": "Undergraduate Marketing Student",
  "email": "thanh@example.com"
}
```

Notice: the first two lines end with a comma. The last one does **not**.

Two other small rules:

- Text always goes inside `"double quotes"`.
- Numbers and the words `true` / `false` do **not** get quotes.

```json
"sort_order": 1,
"is_published": true,
"title": "My Project"
```

**Tip:** open this project in [VS Code](https://code.visualstudio.com/) (free).
It will underline mistakes in red as you type and tell you what is wrong. The
project is already set up for this — you do not need to configure anything.

---

## Seeing your changes

Open a terminal in the project folder and run:

```bash
npm run dev
```

It prints a web address (usually `http://localhost:5173`). Open it in your
browser. Now, whenever you save a content file, the page updates by itself.

Press `Ctrl+C` in the terminal to stop it when you are done.

---

## Your name, role and bio

**File:** `src/content/profile.json`

```json
{
  "name": "Thanh Vu",
  "role": "Undergraduate Marketing Student",
  "tagline": "Open to marketing internships and entry-level roles",
  "years_experience": 0,
  "specialty": "Marketing",
  "summary": "<p>Write two or three sentences about yourself here.</p>",
  "email": "your.email@example.com",
  "location": "",
  "avatar_url": "/images/avatar.svg"
}
```

| Field | Where it appears |
| --- | --- |
| `name` | Big, on the home page. The **last word** gets the blue highlight. |
| `role` | Under "Role" on the home page, and nowhere else. |
| `tagline` | The small pill above your name. |
| `specialty` | Under "Focus" on the home page. |
| `summary` | The paragraph under your name. Only the first 180 characters show. |
| `email` | The blue contact button near the bottom. |
| `location` | Under "Based in". **Leave it as `""` to hide it completely.** |

### Writing your summary

The `summary` field allows a little formatting. Wrap each paragraph in `<p>`:

```json
"summary": "<p>I am a final-year marketing student focused on brand strategy and social content.</p><p>I am currently looking for a summer internship.</p>"
```

You can also use `<strong>bold text</strong>` and `<em>italic text</em>`.

---

## Your statement of purpose

**File:** `src/content/statement.json`

This is your assignment's required reflection. Keep all **three** sections —
they are the three things you are graded on. Replace the text inside each
`"body"`.

```json
{
  "title": "Statement of Purpose",
  "intro": "A short reflection on where I am heading.",
  "last_updated": "August 2026",
  "sections": [
    {
      "id": "goals",
      "heading": "My goals",
      "summary": "Short-term and long-term.",
      "body": "<p>Write your goals here.</p><p>Add a second paragraph like this.</p>"
    }
  ]
}
```

Only change `heading`, `summary`, `body`, and the fields at the top. **Leave
`id` alone** — it is used for links.

---

## Your documents

**File:** `src/content/documents.json`

Each document needs three things, because your assignment grades all three:
the file itself, how it changed, and what your reviewers said.

### Swapping in your real CV

1. Put your PDF in the folder `public/documents/`
2. Change `file_url` to match the filename exactly:

```json
"file_url": "/documents/thanh-vu-cv.pdf"
```

The path always starts with `/documents/`. If your file is called
`My CV Final.pdf`, **rename it** to something with no spaces, like
`thanh-vu-cv.pdf`, then use that name.

### Editing the CV that is already there

Your CV was rebuilt in code so it stays editable, rather than being a picture
you cannot change. The design lives in **`cv-source/thanh-vu-cv.html`**.

To change it: open that file, edit the text between the `>` and `<` marks
(ignore everything else), save, then run:

```bash
npm run cv
```

That regenerates `public/documents/thanh-vu-cv.pdf` and the site picks it up
straight away.

**To add your photo:** save it as `photo.jpg` inside the `cv-source/` folder,
then run `npm run cv` again. It drops into the circle automatically. Until you
do, the circle shows your initials instead — nothing looks broken.

If you would rather write your CV in Word, that is completely fine. Export it
as a PDF, put it in `public/documents/`, and point `file_url` at it. You can
then delete the `cv-source` folder.

### Sections appear only when you fill them in

A document page can show three things: the file, **How it changed**, and
**Peer feedback**. The last two are required by your assignment, but an empty
heading looks worse than no heading — so each one **stays hidden until there is
something real in it**.

Fill in `revision_narrative`, `process_evidence`, or `peer_feedback` and the
matching section appears on the page by itself. Empty them and it disappears
again. There is no code to change either way.

Your CV page is currently in that state: it shows the CV and nothing else. A
draft of its revision story is parked in **`REVISION-DRAFTS.md`**, ready to
paste back in when you want it.

### Writing the revision story

```json
"revision_narrative": "<p>My first draft listed my duties. After feedback I rewrote every bullet point to show a result instead.</p>",
"process_evidence": [
  {
    "label": "Draft 1",
    "date": "Week 2",
    "note": "Listed responsibilities with no numbers.",
    "file_url": ""
  },
  {
    "label": "Final",
    "date": "Week 6",
    "note": "Rewrote bullets around outcomes.",
    "file_url": "/documents/thanh-vu-cv.pdf"
  }
]
```

Leave `file_url` as `""` if you do not have that draft saved as a file.

### Adding peer feedback

```json
"peer_feedback": [
  {
    "reviewer": "Minh",
    "date": "Week 3",
    "comment": "The summary at the top was too general.",
    "response": "I rewrote it to name the specific role I am applying for."
  }
]
```

To add a second reviewer, copy everything from `{` to `}`, put a **comma**
after the first `}`, and paste:

```json
"peer_feedback": [
  { "reviewer": "Minh", "comment": "...", "response": "..." },
  { "reviewer": "Linh", "comment": "...", "response": "..." }
]
```

---

## Your projects

**File:** `src/content/projects.json`

This file is a **list**, so it starts with `[` and ends with `]`. Each project
sits between `{` and `}`.

### Adding a project

Copy an existing project block, paste it after the last one, and add a comma
between them:

```json
[
  {
    "id": "my-first-project",
    "title": "Brew & Bloom",
    "subtitle": "Launch campaign for a coffee shop",
    "description": "<p>What the project was.</p><h2>What I did</h2><ul><li>First thing</li><li>Second thing</li></ul>",
    "cover_image": "/images/project-campaign.svg",
    "tech_stack": ["Campaign Strategy", "Copywriting", "Canva"],
    "project_role": "Campaign Lead",
    "github_url": "",
    "live_url": "",
    "featured": true,
    "sort_order": 1,
    "is_published": true
  },
  {
    "id": "my-second-project",
    "title": "Your next project"
  }
]
```

| Field | What it does |
| --- | --- |
| `id` | The web address. **Lowercase, no spaces, use hyphens.** Must be different for every project. |
| `featured` | `true` shows a small "Featured" tag. |
| `sort_order` | `1` appears first, then `2`, then `3`. |
| `is_published` | Set to `false` to hide a project without deleting it. |
| `cover_image` | Leave `""` and it shows a letter tile instead. |
| `tech_stack` | Tools and skills. Shows as small pills. |

---

## Your contact links

**File:** `src/content/links.json`

```json
[
  {
    "id": "linkedin",
    "label": "LinkedIn",
    "url": "https://www.linkedin.com/in/your-real-username",
    "icon": "linkedin",
    "sort_order": 1,
    "is_published": true
  }
]
```

`icon` must be **exactly one** of these words:

`linkedin` · `github` · `twitter` · `email` · `globe` · `dribbble` · `medium`

For the email link, `url` is just your address — no `https://`, no `mailto:`:

```json
{ "id": "email", "label": "Email", "url": "thanh@example.com", "icon": "email" }
```

---

## Pictures

1. Put your image file in the folder `public/images/`
2. Refer to it starting with `/images/`

```json
"cover_image": "/images/my-campaign-photo.jpg"
```

**Rules for filenames:** no spaces, no capital letters. Use hyphens.
`my photo.JPG` will break — rename it to `my-photo.jpg`.

**Before uploading:** resize large photos to about 1200 pixels wide. A photo
straight from a phone can be 5MB and will make your site slow to load — which
your assignment specifically marks you on.

---

## Colours

**File:** `src/index.css` (near the top)

You only need the numbers after the colour name. The format is
**hue saturation lightness**:

```css
--primary: 219 92% 64%;
```

- **First number (0–360)** = the colour. `219` is blue. `140` is green.
  `280` is purple. `20` is orange.
- **Second number** = how strong. Higher is more vivid.
- **Third number** = how bright. Higher is lighter.

To change the blue accent to purple, change only the first number:

```css
--primary: 280 92% 64%;
```

> ⚠️ **Careful with the two background colours** (`--background` and
> `--foreground`). Your assignment is marked on text being readable against its
> background. The current combination was measured at 17.6:1, far above the 4.5:1
> required. If you lighten the background or darken the text, you may fail that
> criterion. Change `--primary` freely; leave those two alone unless you check
> the result at [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/).

---

## Publishing your changes

Build the site:

```bash
npm run build
```

This creates a folder called `dist`. That folder **is** your website.

### Putting it online

The simplest option is [Netlify Drop](https://app.netlify.com/drop) — drag the
`dist` folder onto the page and you get a public link straight away. No account
needed to start.

Other free options: [Vercel](https://vercel.com),
[Cloudflare Pages](https://pages.cloudflare.com), GitHub Pages.

### One setting you must not miss

Your site has multiple pages (`/statement-of-purpose`, `/document/cv`, and so
on). Most hosts need to be told to send all addresses to `index.html`, or those
pages will show "404 Not Found" when someone opens them directly — which is
exactly what will happen when your marker clicks your link.

A file named `_redirects` already exists in `public/` to handle this on Netlify.
On other hosts, look for a setting called **"SPA fallback"**, **"rewrite all
routes to index.html"**, or **"single-page application"**.

**Always test your published link by opening a document page directly** before
submitting.

---

## When something breaks

### The site shows a message about the content files

You have a typo in one of the `src/content/` files. Almost always a **missing
comma** or an unclosed `"` quote. Open the file you edited last and check the
line the terminal mentions.

### The terminal shows a red error and the site will not load

Read the first line — it names the file and the line number. Go to that line
and check for a missing comma or quote.

### A picture does not appear

- Is the file inside `public/images/`?
- Does the name in the JSON match **exactly**, including `.jpg` vs `.png`?
- Are there capital letters or spaces in the filename? Rename it.

### A download button gives "404"

The file is not in `public/documents/`, or the name does not match `file_url`.

### I broke something and want to undo it

If you have not saved yet, press `Ctrl+Z` (or `Cmd+Z` on Mac).

If you already saved, this project tracks its own history. To throw away all
your unsaved-to-history changes and return to the last working version:

```bash
git restore src/content/
```

---

## Quick reference

| I want to change… | File |
| --- | --- |
| Name, role, bio, email | `src/content/profile.json` |
| Statement of purpose | `src/content/statement.json` |
| CV, cover letter, LinkedIn | `src/content/documents.json` |
| Projects | `src/content/projects.json` |
| Contact links | `src/content/links.json` |
| Colours | `src/index.css` |
| Pictures | put files in `public/images/` |
| PDFs | put files in `public/documents/` |
