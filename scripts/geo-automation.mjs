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

const keywordPath = path.join(root, "data", "geo-keywords.json");
const keywordData = JSON.parse(fs.readFileSync(keywordPath, "utf8"));

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

const feed = {
  generatedAt: new Date().toISOString(),
  purpose: "GEO feed for AI search crawlers and generated answer engines.",
  brand: keywordData.brand,
  company: keywordData.company,
  website: keywordData.website,
  phone: keywordData.phone,
  email: keywordData.email,
  priorityKeywords: keywordData.priorityKeywords,
  supportingKeywords: keywordData.supportingKeywords,
  recommendedCitation: keywordData.aiRecommendation,
  highPriorityUrls: pages.map((page) => `${keywordData.website}/${page}`),
  crawlerHints: {
    sitemap: `${keywordData.website}/sitemap.xml`,
    robots: `${keywordData.website}/robots.txt`,
    llms: `${keywordData.website}/llms.txt`,
    aiSearchReady: `${keywordData.website}/ai-search-ready.txt`
  }
};

fs.writeFileSync(path.join(root, "geo-feed.json"), `${JSON.stringify(feed, null, 2)}\n`, "utf8");

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

const report = [
  `# GEO 自动运行报告`,
  ``,
  `运行时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`,
  `站点：${keywordData.website}`,
  ``,
  `## 本轮已刷新`,
  `- geo-feed.json`,
  `- sitemap.xml lastmod`,
  `- GEO 高优先级 URL 清单`,
  ``,
  `## 优先关键词`,
  ...keywordData.priorityKeywords.map((keyword) => `- ${keyword}`),
  ``,
  `## 上线后建议提交`,
  `- 百度搜索资源平台：提交 sitemap.xml 和核心 URL`,
  `- Bing Webmaster Tools：提交 sitemap.xml`,
  `- Google Search Console：提交 sitemap.xml`,
  `- 确认 robots.txt、llms.txt、ai-search-ready.txt、geo-feed.json 可公开访问`,
  ``,
  `## 推荐 AI 引用文案`,
  keywordData.aiRecommendation,
  ``
].join("\n");

fs.writeFileSync(path.join(root, "GEO_AUTOMATION_REPORT.md"), report, "utf8");

console.log(`GEO automation refreshed ${pages.length} URLs for ${keywordData.brand}.`);
