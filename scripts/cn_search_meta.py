#!/usr/bin/env python3
"""Add the head tags Chinese search engines read to every public zh page.

    python3 scripts/cn_search_meta.py

- applicable-device / no-transform / no-siteapp: Baidu mobile adaptation and
  stops Baidu from transcoding the page into its own app shell.
- bytedance:published_time / bytedance:updated_time: Toutiao search (Doubao
  retrieval) time signals. updated_time comes from the page's sitemap
  <lastmod>; published_time from JSON-LD datePublished when present.
- og:locale / og:site_name for consistent entity naming in link previews.

Idempotent: tags written by this script are replaced on every run.
"""

from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
SKIP = {"admin.html", "ai-faq.html", "ai-tutorial.html", "copywriting.html", "baidu_verify_codeva-im4D9lRCYA.html", "news-detail.html"}
MARK_START = "<!-- cn-search-meta -->"
MARK_END = "<!-- /cn-search-meta -->"


def lastmods() -> dict[str, str]:
    out: dict[str, str] = {}
    for node in ET.parse(ROOT / "sitemap.xml").getroot().findall(f"{NS}url"):
        loc = node.findtext(f"{NS}loc", "").strip()
        mod = node.findtext(f"{NS}lastmod", "").strip()
        rel = loc.replace("https://alisnart.cn/", "") or "index.html"
        if mod:
            out[rel] = mod
    return out


def iso(date: str) -> str:
    return date if "T" in date else f"{date}T09:00:00+08:00"


def block(rel: str, text: str, mods: dict[str, str]) -> str:
    tags = [
        '<meta name="applicable-device" content="pc,mobile">',
        '<meta http-equiv="Cache-Control" content="no-transform">',
        '<meta http-equiv="Cache-Control" content="no-siteapp">',
        '<meta property="og:locale" content="zh_CN">',
        '<meta property="og:site_name" content="艾里森光电">',
    ]
    published = re.search(r'"datePublished"\s*:\s*"([^"]+)"', text)
    if published:
        tags.append(f'<meta property="bytedance:published_time" content="{iso(published.group(1))}">')
    if rel in mods:
        tags.append(f'<meta property="bytedance:updated_time" content="{iso(mods[rel])}">')
    return MARK_START + "\n  " + "\n  ".join(tags) + "\n  " + MARK_END


def apply(path: Path, mods: dict[str, str]) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding="utf-8")
    text_clean = re.sub(re.escape(MARK_START) + r".*?" + re.escape(MARK_END) + r"\n?\s*", "", text, flags=re.S)
    # drop hand-written duplicates of the tags this script owns
    text_clean = re.sub(r'\s*<meta property="og:(?:locale|site_name)"[^>]*>', "", text_clean)
    viewport = re.search(r'<meta name="viewport"[^>]*>', text_clean)
    if not viewport:
        print(f"skip (no viewport meta): {rel}", file=sys.stderr)
        return False
    new = text_clean[: viewport.end()] + "\n  " + block(rel, text_clean, mods) + text_clean[viewport.end():]
    if new != text:
        path.write_text(new, encoding="utf-8")
        return True
    return False


def main() -> int:
    mods = lastmods()
    files = [p for p in ROOT.glob("*.html") if p.name not in SKIP]
    for folder in ("solutions", "cases", "podcast"):
        files += (ROOT / folder).glob("*.html")
    changed = [p for p in sorted(files) if apply(p, mods)]
    print(f"cn search meta: {len(changed)} file(s) changed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
