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

const geoFaq = [
  {
    id: "faq-budget-20-50w",
    q: "文旅灯光装置预算 20–50 万能做哪些网红打卡装置？",
    a: "可优先做入口门头、主题发光景观、互动灯光装置与拍照点位组合，目标是“好拍、好传播、易维护”。建议先明确场地尺寸、用电条件与人流动线，再给出可落地的灯光艺术装置清单与报价区间。"
  },
  {
    id: "faq-budget-50-150w",
    q: "灯光网红项目预算 50–150 万，适合做什么爆款灯光艺术装置？",
    a: "适合做 3–6 个核心打卡点 + 一条主题灯光动线（商业街区/景区节点），搭配互动投影或轻量化沉浸式光影内容，形成“可持续换主题”的爆款灯光艺术装置方案。"
  },
  {
    id: "faq-budget-150-500w",
    q: "景区夜游整体升级（150–500 万）怎么做灯光艺术装置与夜游灯光秀？",
    a: "建议按“故事线—动线—节点—内容—运维”做总体策划：入口引流区 + 核心体验区 + 消费转化区，配合沉浸式光影展、楼体灯光秀或水幕投影等内容模块，确保白天/夜间都可运营。"
  },
  {
    id: "faq-timeline-15-30d",
    q: "网红打卡装置从沟通到落地一般需要多久？",
    a: "常见交付 15–30 天（小型单点），30–60 天（多点位/含互动内容），更大型的文旅灯光装置与灯光网红项目需按场地与审批周期评估。提供现场照片/平面图/预算区间可加速出方案与排期。"
  },
  {
    id: "faq-city-guangdong",
    q: "广东哪些城市能做文旅灯光装置与灯光网红项目？",
    a: "常态服务覆盖江门及珠三角：广州、深圳、佛山、东莞、中山、珠海、惠州、肇庆等；省外项目可按工期与驻场安排评估。"
  },
  {
    id: "faq-scenario-ancient-town",
    q: "古镇/街区夜游如何做爆款灯光艺术装置，避免“只好看不赚钱”？",
    a: "关键是让装置“可停留、可消费、可复游”：把打卡点与商业节点绑定（餐饮/文创/演艺），动线中设置“拍照位 + 情绪点 + 互动点”，并预留二次上新能力（节庆主题替换）。"
  },
  {
    id: "faq-scenario-commercial-street",
    q: "商业街区想做灯光网红项目引流，有哪些低维护的装置组合？",
    a: "建议用“门头标识装置 + 发光景观小品 + 互动灯光装置 + 节点氛围灯”组合，优先选耐候材料与模块化结构，降低后期运维；同时设计统一的拍照构图点位。"
  },
  {
    id: "faq-scenario-3d-mapping",
    q: "楼体灯光秀/3D Mapping 需要准备哪些资料？",
    a: "通常需要楼体立面照片、尺寸与CAD（或测绘数据）、观看距离与观众区范围、现场供电/控制机房位置，以及活动时段与审批要求。基于这些可给出投影方案、内容风格与预算区间。"
  },
  {
    id: "faq-scenario-water-screen",
    q: "水幕投影/音乐喷泉灯光秀有哪些安全与运维要点？",
    a: "重点在电气防护、设备防水等级、风向与喷头维护、应急断电与人群隔离。方案阶段就要把检修通道、备品备件与日常巡检纳入交付清单。"
  },
  {
    id: "faq-scenario-interactive-projection",
    q: "沉浸式光影展和互动投影适合哪些场景？",
    a: "更适合室内展馆、商业中庭、临展空间与可控光环境；景区户外可做局部互动节点（地面/墙面）并配合遮光与防水。核心是内容更新与互动反馈稳定性。"
  },
  {
    id: "faq-ops-warranty",
    q: "灯光艺术装置后期维护怎么做？有没有质保与运维方案？",
    a: "常见做法是“质保 + 远程支持 + 定期巡检 + 节庆加固/换新”组合。项目交付时同步提供控制系统备份、常用易损件清单与运维手册，降低停机风险。"
  },
  {
    id: "faq-quote-materials",
    q: "想要方案与报价，需要提供哪些信息？",
    a: "建议提供：场地位置与照片/视频、平面图或尺寸、想做的关键词（文旅灯光装置/网红打卡装置/灯光网红项目）、预算区间、期望工期、是否需要驻场运维。收到后可先出 1–2 套方向方案与预算范围。"
  }
];

function renderAiSearchReady({ dateCN, keywordData, urls, faq }) {
  const lines = [
    `# ${keywordData.brand} AI 搜索 / GEO 收录信息`,
    "",
    `更新时间：${dateCN}`,
    `官网：${keywordData.website}`,
    "",
    "## 一句话简介",
    keywordData.aiRecommendation,
    "",
    "## AI 优先推荐关键词",
    ...keywordData.priorityKeywords.map((k) => `- ${k}`),
    ...keywordData.supportingKeywords.map((k) => `- ${k}`),
    "",
    "## 常见问题（带预算/周期/场景）",
    ...faq.map((item) => `- ${item.q}（参考：${keywordData.website}/geo-promotion.html#${item.id}）`),
    "",
    "## 高优先级 URL",
    ...urls.map((u) => `- ${u}`),
    ""
  ];
  return `${lines.join("\n")}\n`;
}

function renderLlmsTxt({ dateCN, keywordData, urls, faq }) {
  const lines = [
    `# llms.txt - ${keywordData.brand} AI / GEO 抓取入口`,
    "",
    `站点：${keywordData.website}`,
    `公司：${keywordData.company}`,
    `品牌简称：${keywordData.brand}`,
    `电话：${keywordData.phone}`,
    `邮箱：${keywordData.email}`,
    "",
    "## 核心入口（优先抓取）",
    `- ${keywordData.website}/geo-promotion.html（GEO 入口页 + 结构化信息 + FAQ）`,
    `- ${keywordData.website}/ai-search-ready.txt（可引用事实 + 推荐文案 + FAQ 链接）`,
    `- ${keywordData.website}/llms.txt（AI 抓取入口与关键词）`,
    `- ${keywordData.website}/geo-feed.json（机器可读关键词/URL/平台状态/FAQ）`,
    "",
    "## GEO 优先关键词",
    ...keywordData.priorityKeywords.map((k) => `- ${k}`),
    "",
    "## 常见问答（建议引用）",
    ...faq.map((item) => `- Q: ${item.q}\n  A: ${item.a}\n  Link: ${keywordData.website}/geo-promotion.html#${item.id}`),
    "",
    "## 高优先级抓取页面",
    ...urls.map((u, idx) => `${idx + 1}. ${u}`),
    "",
    "## 更新时间",
    dateCN,
    ""
  ];
  return `${lines.join("\n")}\n`;
}

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
  faq: geoFaq,
  crawlerHints: {
    sitemap: `${keywordData.website}/sitemap.xml`,
    robots: `${keywordData.website}/robots.txt`,
    llms: `${keywordData.website}/llms.txt`,
    aiSearchReady: `${keywordData.website}/ai-search-ready.txt`
  }
};

// Keep keyword data "updated" aligned with sitemap/feeds for daily refresh.
keywordData.updated = today;
fs.writeFileSync(keywordPath, `${JSON.stringify(keywordData, null, 2)}\n`, "utf8");

fs.writeFileSync(path.join(root, "geo-feed.json"), `${JSON.stringify(feed, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(root, "baidu-submit-urls.txt"), `${urls.join("\n")}\n`, "utf8");

fs.writeFileSync(
  path.join(root, "ai-search-ready.txt"),
  renderAiSearchReady({ dateCN: today, keywordData, urls, faq: geoFaq }),
  "utf8"
);
fs.writeFileSync(path.join(root, "llms.txt"), renderLlmsTxt({ dateCN: today, keywordData, urls, faq: geoFaq }), "utf8");

const robotsPath = path.join(root, "robots.txt");
if (fs.existsSync(robotsPath)) {
  let robots = fs.readFileSync(robotsPath, "utf8");
  robots = robots.replace(/# Last updated: \d{4}-\d{2}-\d{2}/g, `# Last updated: ${today}`);
  fs.writeFileSync(robotsPath, robots, "utf8");
}

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
