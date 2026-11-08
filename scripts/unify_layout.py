#!/usr/bin/env python3
"""Apply the shared Chinese header and footer to every public zh page.

Run after adding a new zh page (solutions/, cases/, podcast/ or root):

    python3 scripts/unify_layout.py

The script is idempotent. It replaces the first <header class="site-header">
block (or a legacy bare <nav class="nav"> directly after <body>) and every
<footer class="site-footer"> block. English pages under en/ are not touched.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]

SKIP = {
    "admin.html", "ai-faq.html", "ai-tutorial.html", "copywriting.html",
    "baidu_verify_codeva-im4D9lRCYA.html",
}

NAV = [
    ("home", "/", "首页"),
    ("art", "/art-installations.html", "艺术装置"),
    ("stage", "/stage-installations.html", "舞美装置"),
    ("banquet", "/cultural-banquet-show.html", "宫宴餐秀"),
    ("renewal", "/urban-renewal.html", "城市更新"),
    ("cases", "/cases.html", "方案参考"),
    ("answers", "/ai-answer-hub.html", "项目问答"),
    ("news", "/news.html", "洞察"),
    ("podcast", "/podcast.html", "播客"),
    ("about", "/about.html", "关于"),
    ("brief", "/light-designer.html", "项目资料"),
]

SECTION_BY_PAGE = {
    "index.html": "home",
    "art-installations.html": "art",
    "stage-installations.html": "stage",
    "cultural-banquet-show.html": "banquet",
    "urban-renewal.html": "renewal",
    "cases.html": "cases",
    "ai-answer-hub.html": "answers",
    "geo-promotion.html": "answers",
    "news.html": "news",
    "news-detail.html": "news",
    "podcast.html": "podcast",
    "about.html": "about",
    "light-designer.html": "brief",
}

FOOTER_TOPICS = [
    ("/solutions/outdoor-light-art-installation-geo.html", "户外长期灯光装置"),
    ("/solutions/night-tourism-project-cost.html", "夜游项目预算构成"),
    ("/solutions/lake-floating-stage-light-show.html", "湖面演艺装置"),
    ("/solutions/ancient-town-lantern-route.html", "古镇夜游动线"),
    ("/solutions/light-show-control-system.html", "灯光控制系统"),
    ("/geo-promotion.html", "装置选型指南"),
]


def section_for(rel: str) -> str | None:
    if rel in SECTION_BY_PAGE:
        return SECTION_BY_PAGE[rel]
    top = rel.split("/")[0]
    return {"cases": "cases", "solutions": "answers", "podcast": "podcast"}.get(top)


def english_target(rel: str, text: str) -> str:
    match = re.search(r'<a\b[^>]*class="[^"]*\b(?:lang-switch|header-lang)\b[^"]*"[^>]*>', text)
    if match:
        href = re.search(r'href="([^"]+)"', match.group(0))
        if href and not href.group(1).startswith(("http", "#")):
            base = PurePosixPath("/" + rel).parent
            parts: list[str] = []
            for piece in (base / href.group(1)).parts[1:]:
                if piece == "..":
                    if parts:
                        parts.pop()
                elif piece != ".":
                    parts.append(piece)
            target = "/" + "/".join(parts)
            if href.group(1).endswith("/") and not target.endswith("/"):
                target += "/"
            if (ROOT / target.lstrip("/")).exists() or target.endswith("/"):
                return target
    return "/en/"


def header_html(rel: str, text: str) -> str:
    active = section_for(rel)
    items = []
    for key, href, label in NAV:
        attrs = ' class="active" aria-current="page"' if key == active else ""
        items.append(f'<li><a{attrs} href="{href}">{label}</a></li>')
    return (
        '<header class="site-header"><nav class="nav" aria-label="主导航">'
        '<a class="brand" href="/" aria-label="艾里森光电首页"><img class="brand-logo" '
        'src="/assets/alisn-logo-header.webp" alt="艾里森 ALISN" width="279" height="81"></a>'
        f'<ul class="nav-links" id="primary-navigation">{"".join(items)}</ul>'
        f'<a class="header-lang" href="{english_target(rel, text)}" hreflang="en" lang="en" aria-label="English site">EN</a>'
        "</nav></header>"
    )


def footer_html() -> str:
    business = "".join(f'<a href="{h}">{l}</a>' for k, h, l in NAV[1:5])
    topics = "".join(f'<a href="{h}">{l}</a>' for h, l in FOOTER_TOPICS)
    return (
        '<footer class="site-footer"><div class="wrap footer-grid footer-grid-wide">'
        '<div><h3>广东艾里森光电技术有限公司</h3><p>文旅夜游灯光艺术装置、舞美装置、宫宴餐秀与城市更新，'
        '从方案、制造到安装维护。</p></div>'
        f'<div><h3>业务</h3><p class="footer-links">{business}<a href="/services.html">交付方式</a></p></div>'
        f'<div><h3>技术专题</h3><p class="footer-links">{topics}</p></div>'
        '<div><h3>联系</h3><p class="footer-links"><a href="tel:+8618026422225">180 2642 2225</a>'
        '<a href="mailto:lansenlight@gmail.com">lansenlight@gmail.com</a>'
        '<span>广东省江门市江海区东升路南山工业园西区一号厂房</span></p></div>'
        '</div><div class="wrap copyright">© 2026 广东艾里森光电技术有限公司 · '
        '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">粤ICP备2026035496号</a> · '
        '<a href="/ai-answer-hub.html">项目问答</a> · <a href="/en/">English</a></div></footer>'
    )


HEADER_RE = re.compile(r'<header class="site-header">.*?</header>', re.S)
LEGACY_NAV_RE = re.compile(r'(<body[^>]*>\s*)<nav class="nav">.*?</nav>', re.S)
FOOTER_RE = re.compile(r'[ \t]*<footer class="site-footer">.*?</footer>\n?', re.S)


def apply(path: Path) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding="utf-8")
    header = header_html(rel, text)
    if HEADER_RE.search(text):
        new = HEADER_RE.sub(lambda _: header, text, count=1)
    elif LEGACY_NAV_RE.search(text):
        new = LEGACY_NAV_RE.sub(lambda m: m.group(1) + header, text, count=1)
    else:
        print(f"skip (no header): {rel}", file=sys.stderr)
        return False
    footer = footer_html()
    if FOOTER_RE.search(new):
        new = FOOTER_RE.sub("", new)
    new = new.replace("</main>", "</main>\n  " + footer, 1) if "</main>" in new else new
    if new != text:
        path.write_text(new, encoding="utf-8")
        return True
    return False


def targets() -> list[Path]:
    files = [p for p in ROOT.glob("*.html") if p.name not in SKIP and not p.name.endswith("-final.html")]
    for folder in ("solutions", "cases", "podcast"):
        files += sorted((ROOT / folder).glob("*.html"))
    return sorted(files)


def main() -> int:
    changed = [p for p in targets() if apply(p)]
    print(f"layout applied: {len(changed)} file(s) changed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
