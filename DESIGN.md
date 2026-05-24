# Alisnart.cn DESIGN.md

This file defines how alisnart.cn should look and feel. Coding agents should read this before creating or changing UI.

Inspired by the DESIGN.md pattern: a plain Markdown design system that agents can use directly, with sections for theme, color, typography, components, layout, depth, guardrails, responsive behavior, and prompt guidance.

## 1. Visual Theme & Atmosphere

Alisnart.cn is a night-tourism light art and engineering website. The visual language should feel like walking through a scenic area at night where light installations are the main attraction and every UI element exists to explain, sell, or prove those installations.

The site is dark, cinematic, and practical. It uses black surfaces to create a night-scene frame, warm gold as the business signal, white type for clarity, and real or realistic installation imagery for emotional weight. It should not feel like a SaaS dashboard, a generic agency portfolio, a decorative festival poster, or an AI-generated template.

The site must eliminate "AI taste": generic layouts, vague copy, fake-looking images, prompt-like public text, over-polished but empty sections, and decorative elements that feel machine-generated instead of designed for real project buyers.

The emotional hierarchy is:

1. Real light-art scene.
2. Clear business value: traffic, check-in, interaction, night-tour route, operation.
3. Engineering credibility: material, structure, control, waterproofing, maintenance.
4. Direct contact path.

Key characteristics:

- Dark night-gallery canvas.
- Warm gold accent used sparingly.
- Photography and generated realistic installation images carry the visual impact.
- UI surfaces are restrained, with 8px or smaller radius.
- Buyer-facing copy is concrete and operational.
- Mobile navigation is visible and reliable.
- English and Chinese contact channels can differ and must not be mixed.
- No public-facing page should look like it was generated from a prompt.

## 2. Color Palette & Roles

### Primary

- **Night Black** `#050505` - main page background.
- **Deep Surface** `#0a0a0a` - cards, media bodies, alternate sections.
- **Alisnart Gold** `#d4af37` - primary CTA, active nav, tags, key facts.

### Text

- **Pure White** `#ffffff` - headings, primary button labels, key UI labels.
- **Soft Grey** `#aaaaaa` - body copy, metadata, secondary descriptions.
- **Dim Grey** `rgba(255,255,255,0.62)` - tertiary details only.

### Structure

- **Hairline Border** `rgba(255,255,255,0.1)` - card borders, section separators.
- **Gold Glow** `rgba(212,175,55,0.4)` - used only on important hover/focus states.

### Rules

- Gold is a signal color, not a background theme.
- Do not add purple-blue gradients, beige/brown luxury palettes, or random neon colors.
- Do not put gold text on gold backgrounds.
- If a page feels monochrome, add better imagery before adding more colors.

## 3. Typography Rules

### Font Family

Use the existing system stack:

```css
font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", system-ui, sans-serif;
```

### Hierarchy

| Role | Size | Weight | Line Height | Notes |
| --- | --- | --- | --- | --- |
| Hero H1 | `clamp(36px, 7vw, 72px)` | 800 | 1.15 | Strong first-viewport message |
| Compact Hero H1 | `clamp(32px, 5vw, 54px)` | 800 | 1.18 | Interior pages |
| Section Title | `clamp(28px, 5vw, 44px)` | 700 | 1.25 | One idea per section |
| Card Title | 18-22px | 600 | 1.35 | Must fit in compact cards |
| Body | 15-17px | 400 | 1.7 | Human-readable and AI-quotable |
| Tag / Metadata | 12-13px | 700 | 1.4 | Scenario, category, date, spec |
| Button | 15-16px | 700 | 1 | Must stay readable on mobile |

### Rules

- Do not scale body text with viewport width.
- Avoid negative letter spacing except tested hero headings.
- Do not use visible instructional text like "click here to use this feature" inside UI.
- English links must wrap cleanly.

## 4. Component Styling

### Header / Navigation

Desktop:

- Fixed top header, 70px height.
- Dark translucent background with blur.
- Brand mark left, nav right.
- Active nav is gold or high-contrast white/gold.

Mobile:

- Prefer visible horizontal nav rail over fragile hidden hamburger menus.
- Tap targets must be at least 44px high.
- Language switch must be readable in both active and inactive states.
- Do not ship a nav button that only changes icon without revealing links.

### Buttons

Primary CTA:

- Background `#d4af37`.
- Text `#000000`.
- Height 52px desktop, at least 48px mobile.
- Border radius 6px.
- Hover: white or brighter gold with subtle glow.

Secondary CTA:

- Transparent background.
- White text.
- 1.5px translucent white border.
- Hover: stronger border and slight surface fill.

### Cards

Default:

- Background `rgba(255,255,255,0.02)`.
- Border `1px solid rgba(255,255,255,0.1)`.
- Radius 8px maximum.
- Padding 22-28px.
- Hover may lift slightly, but never rely on hover for meaning.

Media card:

- Image ratio 16:10.
- `object-fit: cover`.
- Text area below image.
- No emoji placeholder images.

### Tags

- Gold text.
- Thin gold border.
- Small uppercase or concise Chinese label.
- Used for scenario, product type, or GEO category.

### Forms / Tools

- Inputs must have visible labels.
- Result panel must include concrete next steps.
- Quote tools should output a useful result without requiring AI.
- Mobile users must complete the flow without horizontal overflow.

## 5. Layout Principles

### Spacing

Use an 8px base rhythm:

```text
8, 16, 24, 32, 48, 64, 80, 96
```

### Containers

- Standard content: max width 1200px.
- Image-heavy galleries: max width 1400px.
- Horizontal padding: 32px desktop, 20-24px tablet, 16-20px mobile.

### Sections

- Desktop section padding: 80-100px.
- Mobile section padding: 48-64px.
- Every section should communicate one major idea.

### First Viewport

Required:

- Brand visible.
- Category or market offer visible.
- Realistic product/place image visible.
- Primary CTA visible.
- A hint of the next section visible when possible.

## 6. Depth & Elevation

Depth comes from real images, light, contrast, and content hierarchy, not decorative UI effects.

| Level | Treatment | Use |
| --- | --- | --- |
| 0 | Flat black page | Default background |
| 1 | Dark card with hairline border | Repeated content cards |
| 2 | Image overlay / dark gradient | Hero readability |
| 3 | Subtle gold glow | Primary CTA hover/focus only |

Rules:

- Avoid large drop shadows.
- Avoid decorative gradient blobs, bokeh, or orbs.
- Use overlay gradients only to make text readable over real images.
- Do not nest cards inside cards.

## 7. Do's and Don'ts

### Do

- Use real or realistic light-art installation images.
- Show product scale with people, streets, buildings, water, or landscape context.
- Include engineering details near visual claims.
- Make CTA paths obvious: cases, products, quote, WhatsApp/contact.
- Keep navigation stable and visible on mobile.
- Make product pages reusable as proposal modules.
- Keep GEO answer pages readable by humans.

### Don't

- Do not display AI prompts on the public website.
- Do not use emoji or blank color blocks as product images.
- Do not use obvious AI filler copy: "innovative solution", "seamless integration", "empower", "cutting-edge technology", unless it is immediately backed by concrete project details.
- Do not use AI-looking image artifacts: warped people, unreadable signs, impossible lighting, floating structures, fake construction details, plastic materials, over-smooth render texture, or fantasy scenery with no installation logic.
- Do not use generic AI landing page patterns: oversized vague hero, feature cards with no proof, gradient blobs, fake dashboards, meaningless icons, or repeated section rhythm.
- Do not publish pages that read like prompts, specs without context, or SEO text stitched together from keywords.
- Do not promote test posts on the homepage.
- Do not hide important navigation behind unreliable toggles.
- Do not use abstract hero graphics when a real installation image is needed.
- Do not make cards overly rounded.
- Do not add generic marketing adjectives without evidence.
- Do not mix Chinese and English contact rules.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Behavior |
| --- | --- | --- |
| Mobile | `< 768px` | Single column, visible nav rail, stacked CTAs |
| Tablet | `768-1024px` | 2-column grids where useful |
| Desktop | `1024-1440px` | Full nav, 3-column cards, wide hero |
| Large Desktop | `> 1440px` | Keep content centered; avoid overstretched text |

### Touch Targets

- Buttons: 48px minimum height.
- Nav links: 44px minimum touch height.
- Cards used as links: full card should be clickable.

### Image Behavior

- Hero images: full-bleed or wide, object-fit cover.
- Product images: stable 16:10 or 4:5.
- Social/proposal images: 1:1 and 9:16 variants when needed.
- Generated images must be checked for scale, material, text errors, and impossible structures.

## 9. Anti-AI-Taste Rules

Every new or revised page must pass this section before release.

### Copy

Write like a project director explaining a real installation to a client. Good copy includes scenario, object, scale, operation, material, control, maintenance, and next action.

Avoid:

- Vague claims without proof.
- Repeated "future", "immersive", "innovative", "empower", "scenario", "traffic password" phrasing without concrete context.
- Long paragraphs that sound like SEO filler.
- Prompt fragments, negative prompt language, or image-generation instructions.

Use instead:

- "For a 300-800 meter scenic route, place one entrance landmark, two photo nodes, and one terminal performance point."
- "Use stainless steel frame, acrylic diffuser, RGBW LED, DMX/Art-Net control, and IP65 outdoor connectors."
- "Maintenance access is hidden in the base; the light program can switch between normal night mode and festival mode."

### Images

Images must look like a scene a client could visit or build.

Reject images when:

- People have distorted hands, faces, or scale.
- Text/signage is fake or unreadable.
- The installation floats without foundation.
- Materials look like toy plastic.
- Lighting is overexposed and hides structure.
- The background is fantasy scenery unrelated to scenic areas, lakes, commercial streets, ancient towns, hotels, or plazas.

Accept images when:

- The installation has a visible base or structural logic.
- The image shows scale with people/buildings/ground/water.
- Materials are inspectable.
- The lighting effect is attractive but not physically impossible.
- It can be reused in a proposal without explaining that it is AI-generated.

### Layout

Reject layouts when they look like default AI website output:

- Same-size cards repeated without editorial priority.
- Too many generic icons.
- Sections that alternate mechanically with no narrative.
- Decorative gradients replacing real product proof.
- Text blocks that exist only to fill space.

Use layouts that create buyer progression:

1. See the installation.
2. Understand where it is used.
3. Understand why it brings traffic or operational value.
4. Trust that it can be engineered.
5. Contact with site information.

### GEO / SEO

GEO pages must sound like expert answers, not AI summaries. The first paragraph should answer the question directly. The rest should include parameters, tradeoffs, and quote requirements.

Never hide keyword stuffing in cards, footers, or low-contrast text.

## 10. Page Pattern Guide

### Homepage

Build as: hero, credibility facts, service categories, featured cases/products, operational value, contact.

Never let internal test/GEO pages dominate homepage content.

### Case Page

Build as: hero, quick facts, client objective, solution, visitor journey, engineering details, result, CTA.

### Product Page

Build as: product image, fit statement, scenarios, visitor value, technical spec, operation model, proposal assets, CTA.

Prompt text stays internal; generated image and explanation are public.

### GEO / Insight Page

Build as: question H1, direct answer, verifiable parameters, scenario advice, mistakes, quote requirements, related links, contact.

### English Pages

Use the English contact block exactly:

```text
Official Website: www.alisnart.com
Social Media
Facebook: https://www.facebook.com/alisnartsculpture/
Instagram: https://www.instagram.com/vicky_alisnart/
LinkedIn: www.linkedin.com/in/vicky-llh
WhatsApp: +86 15791503693
Xiaohongshu IDs: 26812150420，94106741441

All pictures, videos and project cases published on our official website and above social platforms including Xiaohongshu can be directly used for proposal design reference
```

## 11. Agent Prompt Guide

Use these prompts when asking an AI coding agent to modify UI.

### Homepage

```text
Redesign the homepage using Alisnart.cn DESIGN.md. Keep the dark night-gallery canvas, gold CTA, visible mobile nav, real installation imagery, and buyer-focused sections. Remove AI taste: no vague filler copy, no decorative blobs, no prompt-like text, no generic feature-card rhythm, and no fake-looking images.
```

### Product Page

```text
Create a product page using Alisnart.cn DESIGN.md. Show generated product images, scenarios, visitor value, technical specs, operating modes, proposal asset formats, and a contact CTA. Do not display prompts publicly. Reject images and copy that look AI-generated; make every visual and paragraph usable in a client proposal.
```

### Case Page

```text
Create a case page using Alisnart.cn DESIGN.md. Include hero image, quick facts, design solution, visitor route, engineering details, operational value, related products, and CTA.
```

### Mobile Fix

```text
Audit this page against DESIGN.md mobile rules and anti-AI-taste rules. Fix navigation visibility, tap targets, text overflow, image ratios, CTA access, vague copy, fake-looking images, and generic AI layout patterns at 360px, 390px, 430px, and 768px widths.
```

### GEO Page

```text
Write a GEO answer page using DESIGN.md. Put the direct answer in the first paragraph, include verifiable parameters, keep it human-readable, link related products/cases, and use the market-correct contact block.
```
