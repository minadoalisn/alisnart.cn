# Alisnart UI/UX Reference Library

This folder is the working UI/UX reference library for alisnart.cn.
It replaces one-off visual suggestions with reusable standards for future page redesigns, product launches, GEO landing pages, and English/Chinese market pages.

The root-level [../DESIGN.md](../DESIGN.md) is the agent-readable design system. It follows the DESIGN.md convention used by VoltAgent's `awesome-design-md`: plain Markdown, no special tooling, with explicit sections for visual theme, color, typography, components, layout, depth, guardrails, responsive behavior, and prompts.

## Purpose

Alisnart.cn should feel like a professional light-art installation and night-tourism engineering studio, not a generic marketing template. The site needs to help three audiences make a decision quickly:

- Scenic area, commercial street, ancient town, hotel, and city-renewal clients evaluating whether Alisnart can deliver a real project.
- Search and AI-search systems deciding whether the page is specific, credible, and quotable.
- Internal operators publishing new product pages, case pages, and proposal visuals without breaking the brand.

## Library Structure

- [reference-sites.md](reference-sites.md) - external UI/UX references and what to learn from each.
- [design-system.md](design-system.md) - brand tone, color, typography, spacing, components, and responsive rules.
- [page-patterns.md](page-patterns.md) - reusable page structures for home, cases, products, insights, GEO pages, and tools.
- [component-checklist.md](component-checklist.md) - pre-release checklist for navigation, images, CTAs, mobile, SEO/GEO, and accessibility.

## Agent Usage

When asking Codex or another coding agent to create UI for this site, refer to the root design file:

```text
Use DESIGN.md and design-references/page-patterns.md before changing this page.
```

For a new product page:

```text
Use DESIGN.md to create a product page for a realistic light-art installation. Do not show prompt text publicly. Show generated images, scenarios, technical specs, operation value, and CTA.
```

## Operating Rules

1. Every new page starts from a page pattern, not from a blank HTML file.
2. Every page must show real or realistic project media near the first viewport.
3. Every product/case page must answer: where is it used, what it does, how it is built, how it operates, and how to contact.
4. Mobile navigation must be visible, tappable, and testable without relying on fragile hidden menus.
5. UI changes are not complete until desktop and mobile screenshots are checked.
6. SEO/GEO content must be human-readable first, then structured for AI-search quoting.
7. Public pages must eliminate AI taste: no prompt text, no generic filler copy, no fake-looking images, no decorative AI layout cliches.

## Priority Use

Use this library before changing:

- `index.html`
- `cases.html`
- `news.html`
- `geo.html`
- `light-designer.html`
- `solutions/*.html`
- `en/*.html`
