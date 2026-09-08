# Apex Hearo Construction — Website

A static marketing site for Apex Hearo Construction. Plain HTML/CSS/vanilla JS —
no build step, no server-side code, no framework. Deployable to GitHub Pages as-is.

## Folder structure

```
.
├── index.html            Home page
├── services.html         All services, one page with anchored sections
├── testimonials.html     Full testimonials grid (data-driven)
├── about.html             Company story, team, licensing, service area
├── contact.html           Contact form (Brevo stub) + contact info
├── CNAME                  Custom domain for GitHub Pages
├── css/
│   └── styles.css        Single stylesheet (design tokens + components + layout)
├── js/
│   ├── main.js            Mobile nav toggle, footer year
│   └── testimonials.js    Fetches data/testimonials.json and renders cards
├── data/
│   └── testimonials.json  Testimonials content — edit this, not the HTML
└── images/
    ├── hero/               Hero/banner images
    ├── team/               Founder/crew photos
    └── services/
        └── {service-slug}/
            └── 01.svg ... 06.svg      Gallery photos (click any to open the lightbox)
```

Service slugs used under `images/services/`: `kitchen`, `bathroom`, `bedroom`, `adus`, `decks`, `living-room`.

Clicking a gallery photo opens a lightbox with next/prev navigation between the
photos in that same gallery (`js/lightbox.js`, included on `services.html`). It's a
progressive enhancement that scans for `.gallery-grid` images automatically, so no
markup changes are needed when you add or remove photos.

## Previewing locally

Because `js/testimonials.js` fetches `data/testimonials.json`, you need to serve the
site over HTTP rather than opening the HTML files directly (browsers block `fetch()`
on `file://` pages). From the project root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any other static file server (e.g. `npx serve`, VS Code's "Live Server") works too.

## How to update things

### 1. Replace placeholder photos

Every image under `images/services/{slug}/` is a labeled placeholder SVG. To swap in
a real photo, just replace the file with a same-named (or renamed + updated `src`)
JPG/PNG/WebP of your project photo — no HTML structure changes needed as long as you
keep the same number of `<figure>` entries in `services.html`, or add/remove
`<figure>` blocks to match how many photos you have for that service.

- Gallery images: `images/services/{slug}/01.svg` .. `06.svg`
- Hero image: `images/hero/hero-home.svg` (used on the home page)
- Page banner image: `images/hero/hero-banner.svg` (used on Services/About/Testimonials/Contact)
- Team photos: `images/team/founder.svg`. The About page's crew-photo slot currently reuses the brand banner (`images/hero/hero-home.svg`) — swap in a real crew/jobsite photo when available.

Keep photos reasonably compressed (a few hundred KB max) so the site stays fast.
Update the `alt` text on each `<img>` in the HTML to describe the real photo.

### 2. Add or edit services

Services live directly in `services.html` as `<section id="{slug}" class="service-section">`
blocks. To add a new service: copy an existing section, change the `id`, heading, and
copy, point the gallery `<img>` sources at a new `images/services/{new-slug}/` folder,
and add a link to it in:
- the home page service cards (`index.html`)
- the "jump to service" list at the top of `services.html`
- the footer "Services" column (every page)

### 3. Add or edit testimonials

Edit `data/testimonials.json` only — the page JS renders it automatically on both
`index.html` (first 3) and `testimonials.html` (all of them). Each entry looks like:

```json
{
  "name": "Sarah M.",
  "projectType": "Kitchen Remodel",
  "location": "Willow Creek",
  "quote": "Apex Hearo turned our cramped, outdated kitchen into the heart of the house.",
  "rating": 5
}
```

`location` and `rating` are optional. No HTML or JS changes required.

### 4. The Brevo contact form

`contact.html` is connected to a live Brevo form. The embed has three parts that
travel together:
- A `<style>` block in `<head>` (Brevo's fonts and form CSS resets)
- The form markup itself, inside `<div id="brevo-form-container">`, marked with
  `<!-- BREVO_FORM_EMBED:START -->` / `:END` comments
- A `<script>` block just before `</body>` (Brevo's validation/submit JS) plus the
  `sibforms.com/.../main.js` script tag

The confirmation page shown after a successful submit is `thank-you.html`
(configured in Brevo under the form's "Confirmation page" setting), which reuses
the site's header/footer and is marked `noindex` so it doesn't show up in search.

To edit the form's fields later, change it in Brevo (**Marketing → Forms**) and
regenerate the embed code, then replace all three pieces above together — don't
edit the field names/IDs by hand, since they're tied to how Brevo maps submissions.

### 5. Update business info (phone, service area, license #)

These are currently repeated in the header/footer of every page and in
`contact.html`/`about.html`:
- Phone: `(714) 232-6699` (appears as both display text and `tel:+17142326699` links)
- Service area: "Orange County & neighboring cities"
- License #: `PLACEHOLDER-000000` — still needs a real license number

Find-and-replace these strings across the `.html` files. There is no business email
or map embed on the site by design — the Contact page form is the only contact
channel besides phone.

### 6. Company story / about page copy

`about.html` has `[Placeholder]`-tagged copy for the company story, mission, founder
bio, years in business, project count, and credentials — replace the bracketed text
with real content.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Edit the `CNAME` file to your real domain (or delete it if you're using the
   default `username.github.io` URL, and remove the custom domain setting in repo
   Settings → Pages).
3. In the repo, go to **Settings → Pages** and set the source to the branch/folder
   this site lives in (e.g. `main`, root).
4. If using a custom domain, point its DNS at GitHub Pages per
   [GitHub's custom domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

No build step is required — GitHub Pages serves the HTML/CSS/JS/images as-is.
