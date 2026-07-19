function initSiteNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const nav = document.querySelector(".nav");
  const state = document.querySelector(".nav-menu-state");

  if (!toggle || !links || toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  function setMenu(isOpen) {
    links.classList.toggle("open", isOpen);
    nav?.classList.toggle("nav-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    if (state) state.checked = isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function isMenuOpen() {
    return Boolean(state?.checked || links.classList.contains("open"));
  }

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenu(!isMenuOpen());
  });

  if (state) {
    state.addEventListener("change", () => setMenu(state.checked));
  }

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav?.contains(event.target)) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 901px)").matches) setMenu(false);
  });
}

initSiteNav();
document.addEventListener("DOMContentLoaded", initSiteNav);

const estimator = document.querySelector("[data-estimator]");

if (estimator) {
  const output = estimator.querySelector("[data-result]");
  const inputs = estimator.querySelectorAll("select, textarea, input");
  const isEnglishEstimator = document.documentElement.lang.toLowerCase().startsWith("en");

  let scenes = {
    scenic: {
      title: "景区主游线",
      image: "cases-images/golden-leaf-tunnel.webp",
      modules: ["入口光影门", "2-3 个主拍照装置", "低眩光导视灯线", "终点演艺或消费节点"],
      advice: "先用入口仪式感和强记忆点拉出主游线，再决定是否增加投影、雾森或演艺内容。",
      constraint: "主游线要控制眩光和排队拥堵，检修口不要放在游客拍照正面。"
    },
    lake: {
      title: "湖面演艺",
      image: "cases-images/case-water-show.webp",
      modules: ["湖心浮台或岸线主秀", "岸线补光", "RGBW 演艺灯具", "一键开演控制"],
      advice: "先确认水深、锚泊、岸电和观演方向，再配置灯具密度和节目时长。",
      constraint: "湖面项目优先核查水位变化、强风、漏保、锚固和夜间维护通道。"
    },
    street: {
      title: "商业街区",
      image: "cases-images/crystal-gate-lanterns.webp",
      modules: ["节庆门头", "可换主题灯饰", "互动橱窗", "街区导流节点"],
      advice: "重点做可复用、可换主题、可拍照传播的装置，让每个节日都能低成本更新。",
      constraint: "商业街要给消防通道、店招、雨棚和临时活动预留净空。"
    },
    commercial: {
      title: "商业街区",
      image: "cases-images/crystal-gate-lanterns.webp",
      modules: ["节庆门头", "可换主题灯饰", "互动橱窗", "街区导流节点"],
      advice: "重点做可复用、可换主题、可拍照传播的装置，让每个节日都能低成本更新。",
      constraint: "商业街要给消防通道、店招、雨棚和临时活动预留净空。"
    },
    town: {
      title: "古镇夜游",
      image: "cases-images/ancient-town-lantern-route-hero.png",
      modules: ["牌坊入口", "水巷灯影", "非遗主题装置", "小型光影演出"],
      advice: "控制光污染，把建筑、街巷、水面和地方文化串成慢游路线。",
      constraint: "古镇项目要避开文保立面破坏，灯具安装尽量可逆、可检修。"
    },
    city: {
      title: "城市更新",
      image: "cases-images/lantern-tree-plaza.webp",
      modules: ["建筑立面光影", "街区节点装置", "公共艺术灯光", "慢行导视系统"],
      advice: "先打造一段可被市民记住的夜间界面，再逐步扩展到街区和城市更新片区。",
      constraint: "城市更新要兼顾居民眩光投诉、交通视线和长期电费。"
    },
    stage: {
      title: "舞台演艺",
      image: "cases-images/swan-drone-show.webp",
      modules: ["演艺灯具", "舞台机械接口", "节目控制系统", "观众区补光"],
      advice: "把灯光、机械、屏幕和表演节奏一起设计，优先保证现场安全与维护效率。",
      constraint: "演艺项目要提前确认承重、吊点、控制室视线和应急切换。"
    },
    hotel: {
      title: "酒店入口",
      image: "cases-images/tropical-resort-archway.webp",
      modules: ["迎宾光廊", "品牌发光装置", "车道引导灯", "节庆换装系统"],
      advice: "优先解决第一眼识别、夜间到达感和社媒拍照点，不建议一开始做复杂演艺。",
      constraint: "酒店入口要把车行视线、门童动线、雨棚高度和品牌色温统一考虑。"
    }
  };

  let budgets = {
    light: { label: "20-50 万", level: "轻量打卡版", pace: "15-25 天", density: "1 个主装置 + 少量氛围灯" },
    standard: { label: "50-150 万", level: "标准运营版", pace: "25-45 天", density: "2-4 个核心节点 + 控制系统" },
    system: { label: "150-500 万", level: "动线系统版", pace: "45-75 天", density: "完整动线 + 互动/演艺/运维预案" },
    flagship: { label: "500 万以上", level: "旗舰夜游版", pace: "75 天以上", density: "多区联动 + 内容系统 + 长期运营机制" }
  };

  let goals = {
    photo: "打卡传播",
    flow: "引流停留",
    show: "演艺主秀",
    renewal: "城市更新"
  };

  if (isEnglishEstimator) {
    scenes = {
      scenic: { title: "Scenic visitor route", image: "../cases-images/golden-leaf-tunnel.webp", modules: ["Arrival landmark", "Two or three photo nodes", "Low-glare route lighting", "Final show or commercial node"], advice: "Create a clear arrival and one memorable stopping point before adding projection, mist, or show content.", constraint: "Control glare, queues, fire access, and maintenance panels along the primary route." },
      lake: { title: "Waterfront show", image: "../cases-images/case-water-show.webp", modules: ["Water or shoreline focal point", "Shoreline fill lighting", "Show lighting and control", "Normal and festival modes"], advice: "Confirm water level, anchoring, shore power, wind, and viewing direction before selecting the show system.", constraint: "Verify electrical protection, anchoring, emergency access, and maintenance routes." },
      street: { title: "Commercial street", image: "../cases-images/crystal-gate-lanterns.webp", modules: ["Seasonal arrival gateway", "Replaceable theme elements", "Interactive storefront", "Pedestrian wayfinding nodes"], advice: "Prioritize reusable structures and replaceable content so seasonal updates do not require rebuilding everything.", constraint: "Maintain fire lanes, storefront visibility, canopy clearance, and event access." },
      town: { title: "Old-town night route", image: "../cases-images/ancient-town-lantern-route-hero.png", modules: ["Arrival gateway", "Waterfront reflections", "Local-culture light nodes", "Small closing performance"], advice: "Use restrained lighting to connect architecture, streets, water, and local culture into a slow visitor route.", constraint: "Avoid irreversible work on protected façades; keep installation and maintenance access reversible where required." },
      hotel: { title: "Hotel arrival", image: "../cases-images/tropical-resort-archway.webp", modules: ["Arrival light corridor", "Brand landmark", "Vehicle guidance", "Seasonal change system"], advice: "Focus on recognition, nighttime arrival, and one social-photo moment before considering complex show content.", constraint: "Coordinate vehicle sightlines, porte-cochère height, guest circulation, weather, and brand color temperature." }
    };
    budgets = {
      light: { label: "RMB 200k–500k", level: "Focused landmark", pace: "Schedule to be verified", density: "One primary node plus supporting light" },
      standard: { label: "RMB 500k–1.5m", level: "Operational route", pace: "Schedule to be verified", density: "Two to four nodes plus control" },
      system: { label: "RMB 1.5m–5m", level: "Integrated route", pace: "Schedule to be verified", density: "Route, interaction, show, and maintenance plan" },
      flagship: { label: "RMB 5m+", level: "Multi-zone program", pace: "Schedule to be verified", density: "Phased zones and long-term content operation" }
    };
    goals = { photo: "photography and sharing", flow: "traffic and dwell time", show: "a primary show moment", renewal: "urban or district renewal" };
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function render() {
    const scene = scenes[estimator.querySelector("[name='type']")?.value] || scenes.scenic;
    const budget = budgets[estimator.querySelector("[name='budget']")?.value] || budgets.standard;
    const scale = estimator.querySelector("[name='scale']")?.value || "node";
    const goalValue = estimator.querySelector("[name='goal']")?.value?.trim();
    const goal = goals[goalValue] || goalValue || goals.photo;
    const note = estimator.querySelector("[name='note']")?.value?.trim() || "";
    const emptyValue = isEnglishEstimator ? "Not provided" : "未填写";
    const contactName = estimator.querySelector("[name='contactName']")?.value?.trim() || emptyValue;
    const contactCompany = estimator.querySelector("[name='contactCompany']")?.value?.trim() || emptyValue;
    const contactMethod = estimator.querySelector("[name='contactMethod']")?.value?.trim() || emptyValue;
    const desiredDate = estimator.querySelector("[name='desiredDate']")?.value || (isEnglishEstimator ? "Not set" : "未确定");
    const scaleLabel = isEnglishEstimator
      ? (scale === "district" ? "District" : scale === "route" ? "Visitor route" : "Single node")
      : (scale === "district" ? "片区级" : scale === "route" ? "动线级" : "单点级");
    const routeFocus = isEnglishEstimator
      ? (scale === "district"
          ? " Define arrival, primary route, waterfront or plaza, and the final commercial zone so the work can be phased."
          : scale === "route"
            ? " Build a clear sequence of arrival, stopping points, and a closing moment based on verified site dimensions."
            : " Make the single installation highly recognizable while concealing its base, power, and maintenance access.")
      : (scale === "district"
          ? "先划分入口、主街、水面/广场和收尾消费区，分期落地。"
          : scale === "route"
            ? "建议用 300-800 米动线组织节奏，每 80-150 米设置一个停留点。"
            : "单点装置要优先做成高识别拍照面，同时把底座、检修和供电隐藏好。");
    const sourceUrl = window.location.href;
    const briefText = (isEnglishEstimator
      ? [
          "Alisn Lighting Project Brief",
          "",
          `Scenario: ${scene.title}`,
          `Scale: ${scaleLabel}`,
          `Working budget: ${budget.label}`,
          `Primary goal: ${goal}`,
          `Target opening date: ${desiredDate}`,
          `Contact: ${contactName}`,
          `Company / project: ${contactCompany}`,
          `Email / WhatsApp: ${contactMethod}`,
          `Site notes: ${note || emptyValue}`,
          "",
          `Suggested scope: ${scene.modules.join(", ")}`,
          `Engineering note: ${scene.constraint}`,
          `Source page: ${sourceUrl}`,
          "",
          "Note: This is an early communication brief, not a final quotation or engineering commitment."
        ]
      : [
          "艾里森光电项目资料",
          "",
          `场景：${scene.title}`,
          `尺度：${scaleLabel}`,
          `预算：${budget.label}`,
          `核心目标：${goal}`,
          `期望开放日期：${desiredDate}`,
          `联系人：${contactName}`,
          `公司 / 项目：${contactCompany}`,
          `联系方式：${contactMethod}`,
          `现场补充：${note || emptyValue}`,
          "",
          `建议配置：${scene.modules.join("、")}`,
          `工程提醒：${scene.constraint}`,
          `来源页面：${sourceUrl}`,
          "",
          "说明：以上为前期沟通摘要，不是最终报价或工程承诺。"
        ]).join("\n");

    const labels = isEnglishEstimator
      ? {
          alt: `${scene.title} lighting installation reference`, tag: "Working direction",
          summary: `${scaleLabel} project focused on ${goal}. ${scene.advice}${routeFocus}`,
          budget: "Working budget", pace: "Schedule", density: "Scope density",
          modules: "Suggested scope", constraints: "Engineering constraints",
          constraintsText: `${scene.constraint} Outdoor ratings, structural loads, power distribution, access, and controls must be confirmed against the actual site.`,
          next: "What to send next",
          nextText: "Send site photos or video, a plan with dimensions, power locations, target opening date, audience, and budget ceiling. We will use them to prepare a quotation-ready direction.",
          note: "Site note:", send: "Send via WhatsApp", copy: "Copy brief", download: "Download brief"
        }
      : {
          alt: `${scene.title}灯光艺术装置参考场景`, tag: "预估方案",
          summary: `${scaleLabel}项目，核心目标是${goal}。${scene.advice}${routeFocus}`,
          budget: "建议预算", pace: "预估周期", density: "配置密度",
          modules: "推荐配置", constraints: "工程约束",
          constraintsText: `${scene.constraint} 户外部分建议按 IP65、耐候结构、隐藏检修口和独立控制回路预留。`,
          next: "下一步资料",
          nextText: "准备现场照片、平面尺寸、供电位置、开放时间、目标客流和预算上限，我们可以据此输出可报价的深化方案。",
          note: "现场备注：", send: "邮件发送资料", copy: "复制项目摘要", download: "下载摘要"
        };

    output.innerHTML = `
      <figure class="result-visual">
        <img src="${scene.image}" alt="${labels.alt}">
      </figure>
      <div class="result-head">
        <span class="tag">${labels.tag}</span>
        <h2>${scene.title} · ${budget.level}</h2>
        <p>${labels.summary}</p>
      </div>
      <div class="result-metrics">
        <div><strong>${budget.label}</strong><span>${labels.budget}</span></div>
        <div><strong>${budget.pace}</strong><span>${labels.pace}</span></div>
        <div><strong>${budget.density}</strong><span>${labels.density}</span></div>
      </div>
      <div class="result-block">
        <h3>${labels.modules}</h3>
        <ul>${scene.modules.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="result-block">
        <h3>${labels.constraints}</h3>
        <p>${labels.constraintsText}</p>
      </div>
      <div class="result-block">
        <h3>${labels.next}</h3>
        <p>${labels.nextText}</p>
        ${note ? `<p class="note"><strong>${labels.note}</strong>${escapeHtml(note)}</p>` : ""}
      </div>
      <div class="brief-actions">
        <button class="button primary" type="button" data-brief-email>${labels.send}</button>
        <button class="button secondary" type="button" data-brief-copy>${labels.copy}</button>
        <button class="button secondary" type="button" data-brief-download>${labels.download}</button>
      </div>
      <p class="brief-status" data-brief-status aria-live="polite"></p>
    `;

    const status = output.querySelector("[data-brief-status]");
    output.querySelector("[data-brief-email]")?.addEventListener("click", () => {
      if (isEnglishEstimator) {
        window.open(`https://wa.me/8618026422225?text=${encodeURIComponent(briefText)}`, "_blank", "noopener,noreferrer");
        if (status) status.textContent = "WhatsApp opened. Add site photos, plans, or video before sending.";
      } else {
        const subject = encodeURIComponent(`项目资料｜${contactCompany}｜${scene.title}`);
        window.location.href = `mailto:lansenlight@gmail.com?subject=${subject}&body=${encodeURIComponent(briefText)}`;
        if (status) status.textContent = "已打开邮件应用；请附上现场照片、平面图或视频后发送。";
      }
    });
    output.querySelector("[data-brief-copy]")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(briefText);
        if (status) status.textContent = isEnglishEstimator ? "Project brief copied." : "项目摘要已复制。";
      } catch {
        if (status) status.textContent = isEnglishEstimator ? "Copy was blocked. Please use Download brief." : "浏览器未允许复制，请使用“下载摘要”。";
      }
    });
    output.querySelector("[data-brief-download]")?.addEventListener("click", () => {
      const file = new Blob([briefText], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `alisnart-project-brief-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
      if (status) status.textContent = isEnglishEstimator ? "Project brief downloaded." : "项目摘要已下载。";
    });
  }

  inputs.forEach((input) => input.addEventListener("input", render));
  render();
}

function initPremiumSite() {
  document.documentElement.classList.add("premium-site");

  const revealTargets = document.querySelectorAll(".section-head, .case-feature, .scene-panel, .story-step, .card, .cta-panel");
  revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  const path = window.location.pathname.toLowerCase();
  const legacyCase = document.querySelector("main.case-detail");
  if (legacyCase && !legacyCase.querySelector(".concept-notice")) {
    const notice = document.createElement("p");
    notice.className = "concept-notice";
    notice.textContent = document.documentElement.lang.toLowerCase().startsWith("en")
      ? "Concept reference — final dimensions, materials, ratings, schedules, and costs depend on site verification and detailed engineering."
      : "方案参考｜最终尺寸、材质、防护等级、工期与费用，以现场勘察和深化设计为准。";
    legacyCase.prepend(notice);
  }

  if (!path.endsWith("light-designer.html") && !document.querySelector(".project-fab")) {
    const isEnglish = path.includes("/en/") || document.documentElement.lang.toLowerCase().startsWith("en");
    const link = document.createElement("a");
    link.className = "project-fab";
    if (path.includes("/en_site/projects/")) {
      link.href = "../../en/light-designer.html";
    } else if (path.includes("/en_site/")) {
      link.href = "../en/light-designer.html";
    } else if (path.includes("/en/")) {
      link.href = `${path.includes("/solutions/") ? "../" : ""}light-designer.html`;
    } else {
      link.href = `${path.includes("/solutions/") || path.includes("/cases/") ? "../" : ""}light-designer.html`;
    }
    link.textContent = isEnglish ? "Project brief →" : "整理项目资料 →";
    link.setAttribute("aria-label", isEnglish ? "Open project brief tool" : "打开项目资料工具");
    document.body.appendChild(link);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPremiumSite);
} else {
  initPremiumSite();
}
