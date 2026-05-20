#!/usr/bin/env python3
"""SEO/GEO guardrail checks for alisnart.cn.

Inspired by Superpowers' verification-before-completion workflow: keep changes
small, testable, and evidence-based before claiming a site optimization is done.
"""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE = "https://alisnart.cn"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

MOJIBAKE_MARKERS = [
    "\u9479",
    "\u59ab",
    "\u9432",
    "\u9239",
    "\u951b",
    "\u6d93",
    "\u9a9e",
    "\ue5c9",
]

HIGH_VALUE_PATHS = [
    "",
    "index.html",
    "services.html",
    "cases.html",
    "geo-promotion.html",
    "llms.txt",
    "ai-search-ready.txt",
    "geo-feed.json",
    "solutions/window-frame-photoelectric-glass-display.html",
]


@dataclass
class Finding:
    level: str
    path: str
    message: str


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def add(findings: list[Finding], level: str, path: Path | str, message: str) -> None:
    findings.append(Finding(level, str(path), message))


def check_utf8_and_mojibake(findings: list[Finding]) -> None:
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if ".git" in path.parts or "_hermes_cache" in path.parts or ".vercel" in path.parts:
            continue
        if path.name == "admin.html":
            continue
        if path.suffix.lower() not in {".html", ".txt", ".json", ".xml", ".js", ".css"}:
            continue
        rel = path.relative_to(ROOT)
        try:
            text = read_text(path)
        except UnicodeDecodeError as exc:
            add(findings, "error", rel, f"not valid UTF-8: {exc}")
            continue
        hits = [marker for marker in MOJIBAKE_MARKERS if marker in text]
        if hits:
            add(findings, "error", rel, "possible mojibake markers found")


def check_json_xml(findings: list[Finding]) -> None:
    for rel in ["geo-feed.json", "schema-markup.json"]:
        path = ROOT / rel
        if path.exists():
            try:
                json.loads(read_text(path))
            except Exception as exc:  # noqa: BLE001
                add(findings, "error", rel, f"invalid JSON: {exc}")

    sitemap = ROOT / "sitemap.xml"
    try:
        ET.parse(sitemap)
    except Exception as exc:  # noqa: BLE001
        add(findings, "error", "sitemap.xml", f"invalid XML: {exc}")


def sitemap_urls() -> set[str]:
    root = ET.parse(ROOT / "sitemap.xml").getroot()
    urls: set[str] = set()
    for node in root.findall(f"{SITEMAP_NS}url"):
        loc = node.find(f"{SITEMAP_NS}loc")
        if loc is not None and loc.text:
            urls.add(loc.text.strip())
    return urls


def url_to_local_path(url: str) -> Path | None:
    parsed = urlparse(url)
    if parsed.netloc != "alisnart.cn":
        return None
    path = parsed.path.lstrip("/")
    if not path:
        path = "index.html"
    return ROOT / path


def check_sitemap_coverage(findings: list[Finding]) -> None:
    urls = sitemap_urls()
    for rel in HIGH_VALUE_PATHS:
        expected = f"{SITE}/{rel}" if rel else f"{SITE}/"
        if expected not in urls:
            add(findings, "error", "sitemap.xml", f"missing high-value URL: {expected}")

    for page in sorted((ROOT / "solutions").glob("*.html")):
        expected = f"{SITE}/solutions/{page.name}"
        if expected not in urls:
            add(findings, "error", "sitemap.xml", f"missing solution page: {expected}")

    for url in sorted(urls):
        local = url_to_local_path(url)
        if local is not None and not local.exists():
            add(findings, "error", "sitemap.xml", f"URL has no local file: {url}")


def check_robots(findings: list[Finding]) -> None:
    text = read_text(ROOT / "robots.txt")
    required = [
        "Sitemap: https://alisnart.cn/sitemap.xml",
        "User-agent: GPTBot",
        "User-agent: OAI-SearchBot",
        "User-agent: ClaudeBot",
        "User-agent: PerplexityBot",
    ]
    for item in required:
        if item not in text:
            add(findings, "error", "robots.txt", f"missing directive: {item}")


def check_html_basics(findings: list[Finding]) -> None:
    for rel in ["index.html", "services.html", "cases.html", "geo-promotion.html"]:
        path = ROOT / rel
        if not path.exists():
            add(findings, "error", rel, "missing HTML entry")
            continue
        text = read_text(path)
        if "<title>" not in text or "</title>" not in text:
            add(findings, "error", rel, "missing title")
        if not re.search(
            r"<meta\b(?=[^>]*\bname=[\"']description[\"'])(?=[^>]*\bcontent=)",
            text,
            re.I,
        ):
            add(findings, "error", rel, "missing meta description")
        if rel in {"index.html", "services.html"} and "application/ld+json" not in text:
            add(findings, "warn", rel, "missing JSON-LD on high-value page")


def main() -> int:
    findings: list[Finding] = []
    check_utf8_and_mojibake(findings)
    check_json_xml(findings)
    check_sitemap_coverage(findings)
    check_robots(findings)
    check_html_basics(findings)

    errors = [finding for finding in findings if finding.level == "error"]
    warnings = [finding for finding in findings if finding.level == "warn"]

    if not findings:
        print("SEO/GEO guard: OK")
        return 0

    for finding in findings:
        print(f"{finding.level.upper()}: {finding.path}: {finding.message}")

    print(f"SEO/GEO guard: {len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
