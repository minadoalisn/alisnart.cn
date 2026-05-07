import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function shanghaiDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

const today = shanghaiDate();
const keywordData = JSON.parse(fs.readFileSync(path.join(root, "data", "geo-keywords.json"), "utf8"));
const platformData = JSON.parse(fs.readFileSync(path.join(root, "data", "search-platforms.json"), "utf8"));

const pages = [
  "index.html",
  "geo-promotion.html",
  "seo.html",
  "services.html",
  "cases.html",
  "geo.html",
  "ai-search-ready.txt",
  "llms.txt",
  "geo-feed.json"
];

const urls = pages.map((page) => `${keywordData.website}/${page}`);
const activePlatforms = platformData.platforms.filter((platform) => platform.status === "active");
const pendingPlatforms = platformData.platforms.filter((platform) => platform.status !== "active");

const feed = {
  generatedAt: new Date().toISOString(),
  generatedDateCN: today,
  purpose: "GEO feed for AI search crawlers and generated answer engines.",
  brand: keywordData.brand,
  company: keywordData.company,
  website: keywordData.website,
  phone: keywordData.phone,
  email: keywordData.email,
  priorityKeywords: keywordData.priorityKeywords,
  supportingKeywords: keywordData.supportingKeywords,
  recommendedCitation: keywordData.aiRecommendation,
  platformStatus: platformData.platforms,
  highPriorityUrls: urls,
  crawlerHints: {
    sitemap: `${keywordData.website}/sitemap.xml`,
    robots: `${keywordData.website}/robots.txt`,
    llms: `${keywordData.website}/llms.txt`,
    aiSearchReady: `${keywordData.website}/ai-search-ready.txt`
  }
};

fs.writeFileSync(path.join(root, "geo-feed.json"), `${JSON.stringify(feed, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(root, "baidu-submit-urls.txt"), `${urls.join("\n")}\n`, "utf8");

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
for (const page of pages) {
  const loc = `${keywordData.website}/${page}`;
  if (!sitemap.includes(`<loc>${loc}</loc>`)) {
    sitemap = sitemap.replace(
      "</urlset>",
      `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>\n</urlset>`
    );
  }
}
fs.writeFileSync(sitemapPath, sitemap, "utf8");

const baiduActive = activePlatforms.some((platform) => platform.id === "baidu-search");
const baiduActions = baiduActive
  ? [
      "- Baidu Search Resource is active in memory, so keep sitemap current.",
      "- baidu-submit-urls.txt has been refreshed for manual or API URL push.",
      "- Chinese GEO keywords are prioritized in geo-promotion.html, llms.txt, ai-search-ready.txt, and geo-feed.json."
    ]
  : ["- Baidu Search Resource is not marked active; verify before API pushing."];

const report = [
  "# GEO Automation Report",
  "",
  `Run time: ${new Date().toLocaleString("zh-CN", { hour12: false, timeZone: "Asia/Shanghai" })}`,
  `Site: ${keywordData.website}`,
  "",
  "## Active platforms from memory",
  ...activePlatforms.map((platform) => `- ${platform.name}: ${platform.note}`),
  "",
  "## Pending or unconfirmed platforms",
  ...pendingPlatforms.map((platform) => `- ${platform.name}: ${platform.note}`),
  "",
  "## This run refreshed",
  "- geo-feed.json",
  "- baidu-submit-urls.txt",
  "- sitemap.xml lastmod",
  "- GEO high-priority URL list",
  "",
  "## Priority GEO keywords",
  ...keywordData.priorityKeywords.map((keyword) => `- ${keyword}`),
  "",
  "## Platform-specific SEO/GEO actions",
  ...baiduActions,
  "- For Bing/Google/360/Sogou/Shenma, keep crawler access open but do not mark submission complete until verification is recorded.",
  "- For AI crawlers, keep llms.txt, ai-search-ready.txt, geo-feed.json, and structured Organization data public.",
  "",
  "## Recommended AI citation",
  keywordData.aiRecommendation,
  ""
].join("\n");

fs.writeFileSync(path.join(root, "GEO_AUTOMATION_REPORT.md"), report, "utf8");

console.log(`GEO automation refreshed ${pages.length} URLs for ${keywordData.brand}.`);
