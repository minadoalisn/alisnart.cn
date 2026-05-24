# Alisnart UI/UX Design System

This file is the detailed companion to the root [../DESIGN.md](../DESIGN.md). If there is a conflict, `DESIGN.md` is the source of truth for AI agents, and this file provides operational detail for maintainers.

## Brand Position

Alisnart is a cultural-tourism light art installation and night-tourism engineering company. The site should communicate:

- Light art with real engineering delivery.
- Scenic-area and commercial-operation value, not only visual decoration.
- Reliable project execution: structure, waterproofing, controls, maintenance, installation.
- Strong visual material suitable for official website, proposal pages, product pages, and social media covers.

## Visual Tone

Use: dark night-scene base, controlled gold accent, real project photography, clear engineering details.

Avoid: generic tech gradients, purple-blue SaaS visuals, abstract decorative blobs, emoji placeholders, fantasy-only images, over-rounded cards, and low-density marketing copy.

Hard rule: remove AI taste. The website must not look like a prompt result. Avoid generic section rhythm, vague AI copy, fake-looking generated images, impossible installation structures, and public prompt language.

## Color Tokens

Current CSS already uses a useful base. Keep it restrained.

```css
:root {
  --bg: #050505;
  --bg-card: #0a0a0a;
  --text: #ffffff;
  --text-muted: #aaaaaa;
  --accent-gold: #d4af37;
  --accent-glow: rgba(212, 175, 55, 0.4);
  --border: rgba(255,255,255,0.1);
}
```

### Usage

- `--bg`: page background and night-scene frame.
- `--bg-card`: repeated cards, compact panels, media bodies.
- `--accent-gold`: primary CTA, active nav, small tags, key facts.
- White: main headings and action labels.
- Muted grey: supporting text, metadata, technical notes.

### Rules

- Gold should highlight decisions, not cover entire sections.
- Do not create gold-on-gold text.
- Do not create one-color pages; add visual depth through real images, spacing, and content hierarchy.

## Typography

Use the existing system font stack:

```css
--font: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", system-ui, sans-serif;
```

### Scale

- Hero H1: `clamp(36px, 7vw, 72px)`, line-height `1.15`.
- Section title: `clamp(28px, 5vw, 44px)`, line-height `1.25`.
- Card title: `18-22px`, line-height `1.35`.
- Body: `15-17px`, line-height `1.7`.
- Metadata/tags: `12-13px`, bold.

### Rules

- Do not scale body text with viewport width.
- Avoid negative letter spacing except already tested hero headings.
- Button labels must fit on mobile without wrapping awkwardly.
- English pages need enough width for long social links; allow wrapping.

## Layout

### Desktop

- Header fixed at 70px.
- Main content width: 1200px for normal sections; 1400px for image-heavy galleries.
- Section padding: 80-100px desktop.
- Grid gap: 20-28px.
- Cards: maximum 8px border radius.

### Mobile

- Avoid hidden hamburger for primary navigation if it has failed in production.
- Prefer visible horizontal navigation rail with scroll-snap and clear active state.
- CTA buttons should be at least 48px high.
- Use one-column content unless the component is explicitly designed for horizontal scrolling.
- First viewport must still show brand, main claim, CTA, and a hint of visual context.

## Media Rules

Every image used on the website must pass at least four checks:

1. It shows a real or realistic place, product, object, or installation.
2. The subject is not too dark to inspect.
3. It does not look like a placeholder, emoji, stock abstraction, or low-detail AI render.
4. It supports the page purpose: lead generation, case proof, product explanation, or proposal reference.
5. It has stable aspect ratio in CSS.
6. It has meaningful alt text.

Reject any image with AI artifacts: distorted people, fake text, impossible reflections, floating structures, plastic material, overexposed light that hides the product, or fantasy scenery unrelated to a real buyer scenario.

Preferred ratios:

- Hero: 16:9 or full-bleed responsive.
- Product/card image: 16:10.
- Product detail: 4:5 or 3:4 when used for vertical social/proposal assets.
- Social cover: 1:1 and 9:16 variants generated from the same product concept.

## Core Components

### Header

Required:

- Brand mark and Chinese/English brand text.
- Visible nav links.
- Clear active state.
- Language switch with high contrast.
- Mobile behavior tested at 360px, 390px, 430px, 768px.

Do not ship:

- A nav toggle that changes icon but does not reveal links.
- Tiny top-right tap targets.
- Language switch text that blends into the active state.

### Hero

Required:

- Real or realistic product/place image.
- One sentence explaining the category and buyer value.
- Two CTAs: view cases/products, contact/quote.
- 2-3 credibility facts only if they are meaningful.

Avoid:

- Abstract slogans without product proof.
- Hero text inside a decorative card.
- Split hero where the product is hidden below the fold.

### Case/Product Card

Required fields:

- Image
- Tag: scenario or product type
- Title
- One-sentence value
- Date or category metadata when relevant

Optional:

- `IP65`, `DMX/Art-Net`, `RGBW`, `installation cycle`, `budget range`

### CTA Block

Required:

- Direct contact path.
- Specific request prompt: site photos, plan, budget, schedule.
- WhatsApp for English market; local contact path for Chinese market.

## Interaction

- Hover states should improve clarity but never be required.
- Mobile primary actions must work by tap.
- Forms/tools must update results instantly and show clear next action.
- Avoid decorative animations that slow the site or obscure content.

## Accessibility And Technical UX

- Contrast must pass practical readability in dark mode.
- Links need visible focus states.
- Buttons need semantic anchors/buttons.
- Images need width/height or aspect-ratio to prevent layout shift.
- Avoid text overlap at 360px mobile width.
- Do not use hidden content for important SEO/GEO answers unless also present in readable page content.

## Anti-AI Copy Standard

Replace generic AI phrasing with concrete project language.

Bad:

- "We create innovative immersive experiences with cutting-edge technology."
- "This solution empowers cultural tourism scenarios and unlocks traffic value."
- "A futuristic dreamlike installation for all kinds of spaces."

Good:

- "For a 300-800 meter scenic route, use one entrance landmark, two photo nodes, and one terminal performance point."
- "The installation uses stainless steel frame, acrylic diffuser, RGBW LED, DMX/Art-Net control, and IP65 outdoor connectors."
- "The base hides maintenance access and cable routing; light programs can switch between normal night mode and festival mode."
