# Alisnart UI/UX Reference Library Design

Date: 2026-05-24

## Objective

Create a reusable UI/UX reference library and design standard for alisnart.cn so future homepage, case, product, GEO, and English-market updates follow one consistent design system.

## Scope

The deliverable is documentation, not a visual redesign implementation. It creates:

- A reference library entry point.
- External reference site notes.
- A design system.
- Page pattern rules.
- A release checklist.

## Design Direction

Alisnart should be positioned as a professional cultural-tourism light art installation and night-tourism engineering company. The website should combine emotional night-scene visuals with credible project delivery details: materials, controls, waterproofing, installation, maintenance, and operation value.

## Chosen Structure

The library is stored in `design-references/`:

- `README.md`
- `reference-sites.md`
- `design-system.md`
- `page-patterns.md`
- `component-checklist.md`

The project root also includes `DESIGN.md`, an agent-readable design system following the DESIGN.md convention popularized by Google Stitch and documented in VoltAgent's `awesome-design-md` collection.

This structure is intentionally simple so it can be used by operators and developers without extra tooling.

## Reference Logic

The reference set focuses on:

- Lighting design studios for professional service framing.
- Experiential/public art studios for visitor-flow and immersive storytelling.
- Performance/atmosphere lighting studios for emotional tone.

The library explicitly avoids copying visual details from any one reference site. It extracts reusable UX patterns and adapts them to Alisnart's needs.

## Non-Goals

- No website redesign is included in this change.
- No new runtime dependency is added.
- No image generation is performed.
- No Refero Pro/MCP dependency is required.

## Success Criteria

- Future page updates can start from a documented page pattern.
- AI coding agents can read root `DESIGN.md` without needing extra tooling.
- The design system includes hard anti-AI-taste rules for copy, images, layouts, and GEO content.
- English contact wording is preserved as a market-specific rule.
- Mobile navigation and real-image requirements are documented.
- Product pages avoid showing prompts and instead show generated results.
- The release checklist can be used before deployment.

## Self-Review

- No placeholder sections remain.
- The scope is limited to reference documentation.
- The structure does not conflict with existing CSS or page templates.
- The design rules are specific enough to guide future implementation.
