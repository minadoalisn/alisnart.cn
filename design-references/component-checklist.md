# UI/UX Release Checklist

Run this checklist before publishing any page update.

## Navigation

- [ ] Desktop nav links are visible and clickable.
- [ ] Mobile nav links are visible or reliably accessible.
- [ ] Active nav state has enough contrast.
- [ ] Language switch is readable in active and inactive states.
- [ ] No important action depends on hover.

## First Viewport

- [ ] Brand is visible.
- [ ] Product/service category is clear.
- [ ] Primary CTA is visible.
- [ ] A real or realistic image is visible.
- [ ] The next section is hinted below the fold on mobile and desktop.

## Images

- [ ] No emoji placeholder is used as project image.
- [ ] Image subject is inspectable, not overly dark.
- [ ] Aspect ratio is stable.
- [ ] Alt text describes the installation and scenario.
- [ ] Generated images do not show impossible floating structures, broken scale, fake text, or distorted people.
- [ ] Images do not have obvious AI artifacts: warped hands/faces, fake signage, plastic material, impossible reflections, or fantasy backgrounds unrelated to the buyer scenario.
- [ ] Product visuals include visible structural logic: base, ground contact, scale reference, maintenance or installation plausibility where relevant.

## Cards And Content

- [ ] Cards are not nested inside other cards.
- [ ] Card radius is 8px or less.
- [ ] Each card has title, scenario/value, and clear click target.
- [ ] Test posts and AI-only internal pages are not promoted as top homepage content.
- [ ] Long English links wrap without overflowing.
- [ ] No card copy reads like AI filler or generic feature text.
- [ ] Repeated cards have editorial priority, not a mechanical same-size same-rhythm layout.

## Forms And Tools

- [ ] Inputs are labelled.
- [ ] Result updates are clear.
- [ ] The next step is obvious.
- [ ] Mobile users can complete the flow with one thumb.

## SEO/GEO

- [ ] H1 answers the page intent.
- [ ] First paragraph gives a direct answer.
- [ ] Page includes specific parameters where relevant.
- [ ] Related case/product links are present.
- [ ] Contact block is market-correct.
- [ ] `scripts/seo_geo_guard.py` passes.
- [ ] GEO text reads like an expert answer, not a keyword-stuffed AI summary.

## Anti-AI Taste

- [ ] No public prompt text is visible.
- [ ] No generic AI phrases remain: "innovative solution", "seamless integration", "empower", "cutting-edge", unless backed by specific details.
- [ ] No decorative gradient blobs, meaningless icons, or fake dashboard-like sections were added.
- [ ] Every section has a buyer purpose: proof, explanation, comparison, specification, contact, or conversion.
- [ ] The page could be shown to a real client as a proposal reference without apologizing for AI artifacts.

## Accessibility

- [ ] Keyboard focus is visible.
- [ ] Text contrast is readable on dark backgrounds.
- [ ] Touch targets are at least 44-48px high.
- [ ] No text overlaps at 360px width.
- [ ] Images have alt attributes.

## Verification

- [ ] Check desktop viewport.
- [ ] Check mobile viewport.
- [ ] Check live URL after deployment.
- [ ] Confirm cache-busted CSS/JS version if styles changed.
