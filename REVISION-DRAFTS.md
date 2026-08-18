# Revision drafts — parking space

Your assignment requires two things on every document page, alongside the file
itself (slide 6 of the brief):

- **a revision narrative and evidence of process** — how the document changed
- **peer feedback documentation** — what a reviewer said, and what you did

Those sections are currently **hidden** on your site, because there is nothing
real in them yet. The moment you paste content into
`src/content/documents.json`, the section reappears on the page by itself. You
do not need to change any code.

This file is just a parking space so the draft below is not lost. Nothing in
here appears on your website.

---

## CV — revision narrative (draft)

This is a factual account of what actually changed when your CV was rebuilt.
**Rewrite it in your own voice before submitting** — a marker is looking for
your thinking, not mine.

> My first version was written in Vietnamese and was really a personal profile
> card: a photo, my date of birth, and a list of fifteen separate achievements.
> It was the right document for a university application, because every item on
> it was an admissions result — IOE prizes, IELTS, exam scores, scholarship
> offers, and the universities that accepted me.
>
> It was the wrong document for a job. An employer reading it would learn what I
> scored at seventeen and nothing about what I can do. There was no experience
> section at all, and the fifteen awards took up so much of the page that the
> three activities where I had done real marketing work were buried at the
> bottom.
>
> So I rewrote it in English around what an employer is looking for. I added a
> two-line profile at the top stating what I study and what I want. I promoted
> my club and volunteering roles into a proper Leadership & Activities section
> with a line each on what I actually did. I condensed the fifteen awards into
> five grouped lines — English, competition, athletics, scholarships, offers —
> which kept every fact but cut the space they occupy by roughly two thirds. I
> also removed my date of birth and phone number, which employers do not need
> and which do not belong on a page that lives on a public website.

**Worth adding in your own words:** anything you were unsure about, and
anything you decided to keep even though you were advised to cut it. Markers
reward that kind of honesty — it shows judgement rather than compliance.

### The two versions, as evidence of process

| Version | What it was |
| --- | --- |
| Vietnamese profile card | Photo, date of birth, fifteen achievements listed one per line. No experience section, no statement of what you were applying for. |
| English, restructured | Profile statement, education, Leadership & Activities, awards condensed into five grouped lines. |

You still have the original. If you want to show it as evidence, export the
Vietnamese version as a PDF, put it in `public/documents/`, and point the first
`process_evidence` entry at it.

---

## How to put this back on the site

Open `src/content/documents.json`, find the document, and fill in the fields.
The section reappears as soon as any of them has content.

```json
"revision_narrative": "<p>My first version was in Vietnamese and was really a profile card...</p><p>So I rewrote it in English...</p>",

"process_evidence": [
  {
    "label": "Version 1 — Vietnamese profile card",
    "date": "Before revision",
    "note": "Photo, date of birth, and fifteen achievements. No experience section.",
    "file_url": ""
  },
  {
    "label": "Version 2 — English, restructured",
    "date": "Current",
    "note": "Rebuilt for a job application, with the awards condensed.",
    "file_url": "/documents/thanh-vu-cv.pdf"
  }
],

"peer_feedback": [
  {
    "reviewer": "Name of your reviewer",
    "date": "Week 3",
    "comment": "What they actually said. Keep it specific — vague praise is not evidence.",
    "response": "What you did about it. It is fine to say you disagreed, as long as you say why."
  }
]
```

Wrap each paragraph of `revision_narrative` in `<p>` tags, as above.

---

## Still to write

- [ ] CV — peer feedback (nothing recorded yet)
- [ ] Cover letter — revision narrative and peer feedback
- [ ] LinkedIn — revision narrative and peer feedback

The cover letter and LinkedIn pages still carry the original prompt text, which
describes what belongs in each field. Read it there before you overwrite it.
