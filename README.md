# AYLA RIVERA — Influencer Site

A top-tier, interactive single-page website for the (fictional) lifestyle creator **Ayla Rivera**. Built with vanilla HTML, CSS and JavaScript — no frameworks, no build step.

## Highlights

- Cinematic hero with kinetic typography and a gradient that shifts in real time
- Custom soft-follow cursor with hover affordances
- Magnetic buttons and 3D tilt cards
- Letter-by-letter loader and scroll-progress bar
- Ambient gradient orbs that drift on scroll (parallax)
- Sticky portrait with a rotating `textPath` SVG badge
- Animated stat counters using `IntersectionObserver`
- Marquee ticker, glassmorphic nav, fluid reveal-on-scroll
- Fully responsive, with `prefers-reduced-motion` respected

## Run locally

This is a static site — open `index.html` in a browser, or serve the folder:

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
.
├── index.html
├── assets/
│   ├── css/style.css
│   └── js/main.js
└── README.md
```

## Tech / Design notes

- **Type**: Fraunces (display serif), Inter (UI), Space Grotesk (mono accents)
- **Palette**: warm dark base with coral / honey / violet accents
- **Motion**: pure CSS keyframes + tiny JS interaction layer (~5KB)
- **Accessibility**: keyboard-focusable, reduced-motion aware, semantic landmarks
