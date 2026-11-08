#!/usr/bin/env python3
"""Write the podcast and insights lists into static HTML.

Crawlers behind Chinese AI assistants (Baidu, Bytespider, Yisouspider, Sogou)
often do not execute JavaScript, so list pages must contain their links in the
HTML itself. Run after adding a podcast episode or a topic page:

    python3 scripts/prerender_lists.py

podcast.html: episode cards and the full archive, from data/podcast.json.
news.html:    curated insights = latest technical topics, product notes and
              the latest podcast episodes. data/news.json is intentionally not
              used: most of its items are promotional headlines without
              supporting data.
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TOPICS = [
    ("/solutions/outdoor-light-art-installation-geo.html", "户外长期灯光装置，不能只看 IP65", "防护、控制、接插件与维护"),
    ("/solutions/night-tourism-project-cost.html", "景区夜游项目预算，应该按节点拆", "七部分预算构成与常见超支原因"),
    ("/solutions/night-tourism-roi.html", "夜游项目多久能回本？先把三个数算清楚", "回收期公式与客流假设的影响"),
    ("/solutions/light-show-control-system.html", "景区灯光控制系统：先分区和模式，再选平台", "DMX / Art-Net、断网运行、故障告警"),
    ("/solutions/ancient-town-lighting.html", "古镇夜游亮化，先保护建筑，再谈光影效果", "可逆安装、色温、投影条件与审批"),
    ("/solutions/commercial-street-lighting.html", "商业街灯光美陈，要让人停下来，也要让人走得通", "净空、荷载、消防与节庆换装"),
    ("/custom-light-installation.html", "定制灯光艺术装置：投产前要确认什么", "图纸、制造分工、验收与交付文件"),
    ("/solutions/interactive-light-installations.html", "互动灯光装置：感应越简单，长期越可靠", "感应方式对比与维护"),
    ("/solutions/light-festival-planning.html", "城市灯光节：好看只是开始，人流和安全才是主线", "布局、人流组织、审批与复用"),
]

PRODUCTS = [
    ("/solutions/lake-floating-stage-light-show.html", "湖心浮岛光舞秀台", "景区湖面夜游的主秀装置：水深、锚泊、岸电与观演方向"),
    ("/solutions/tidal-light-corridor.html", "潮汐光巷互动连廊", "商业街主通道的互动停留装置"),
    ("/solutions/ancient-town-lantern-route.html", "古镇灯语游线", "古镇水巷夜游动线与消费引流"),
    ("/cases/swan-drone-show.html", "水上无人机自动巡游天鹅", "水面自主巡游装置与空中无人机协同演出"),
]


def esc(text: str) -> str:
    return html.escape(text or "", quote=True)


def episodes() -> list[dict]:
    items = json.loads((ROOT / "data/podcast.json").read_text(encoding="utf-8"))
    items = [i for i in items if (ROOT / i.get("url", "")).exists()]
    return sorted(items, key=lambda i: (str(i.get("date", "")), int(i.get("id", 0))), reverse=True)


def episode_card(item: dict, prefix: str = "") -> str:
    meta = " · ".join(x for x in [item.get("date", ""), item.get("duration", "")] if x)
    return (
        f'<a class="card" href="{prefix}{esc(item["url"])}"><span class="tag">{esc(item.get("category") or "文旅新声")}</span>'
        f'<h3>{esc(item.get("title"))}</h3><p>{esc(item.get("description"))}</p>'
        f'<p class="card-meta">{esc(meta)}</p></a>'
    )


def replace_between(text: str, name: str, content: str) -> str:
    start, end = f"<!-- {name}:start -->", f"<!-- {name}:end -->"
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
    if not pattern.search(text):
        raise SystemExit(f"marker {name} not found")
    return pattern.sub(lambda _: start + content + end, text, count=1)


def podcast_page() -> None:
    path = ROOT / "podcast.html"
    text = path.read_text(encoding="utf-8")
    eps = episodes()
    text = replace_between(text, "podcast-grid", "".join(episode_card(i) for i in eps[:12]))
    archive = "".join(f'<li><a href="{esc(i["url"])}">{esc(i["title"])}</a> <span class="archive-date">{esc(i.get("date", ""))}</span></li>' for i in eps)
    text = replace_between(text, "podcast-archive", archive)
    path.write_text(text, encoding="utf-8")


def news_page() -> None:
    path = ROOT / "news.html"
    text = path.read_text(encoding="utf-8")
    topics = "".join(f'<a class="card" href="{u}"><span class="tag">技术专题</span><h3>{esc(t)}</h3><p>{esc(d)}</p></a>' for u, t, d in TOPICS)
    products = "".join(f'<a class="card" href="{u}"><span class="tag">产品方案</span><h3>{esc(t)}</h3><p>{esc(d)}</p></a>' for u, t, d in PRODUCTS)
    pods = "".join(episode_card(i, "/") for i in episodes()[:6])
    text = replace_between(text, "news-topics", topics)
    text = replace_between(text, "news-products", products)
    text = replace_between(text, "news-podcast", pods)
    path.write_text(text, encoding="utf-8")


def main() -> int:
    podcast_page()
    news_page()
    print("prerendered podcast.html and news.html")
    return 0


if __name__ == "__main__":
    sys.exit(main())
