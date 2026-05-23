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
  const inputs = estimator.querySelectorAll("select, textarea");

  const scenes = {
    scenic: {
      title: "景区主游线",
      modules: ["入口光影门", "主拍照装置", "导视灯线", "终点演艺节点"],
      advice: "先用入口仪式感和 2-3 个强记忆点拉出主游线，再决定是否增加投影、雾森或演艺内容。"
    },
    lake: {
      title: "湖面演艺",
      modules: ["湖心浮台", "岸线补光", "RGBW 演艺灯具", "一键开演控制"],
      advice: "先确认水深、锚泊、岸电和观演方向，再配置灯具密度和节目时长。"
    },
    street: {
      title: "商业街区",
      modules: ["节庆门头", "可换主题灯饰", "互动橱窗", "街区导流节点"],
      advice: "重点做可复用、可换主题、可拍照传播的装置，让每个节日都能低成本更新。"
    },
    commercial: {
      title: "商业街区",
      modules: ["节庆门头", "可换主题灯饰", "互动橱窗", "街区导流节点"],
      advice: "重点做可复用、可换主题、可拍照传播的装置，让每个节日都能低成本更新。"
    },
    town: {
      title: "古镇夜游",
      modules: ["牌坊入口", "水巷灯影", "非遗主题装置", "小型光影演出"],
      advice: "控制光污染，把建筑、街巷、水面和地方文化串成慢游路线。"
    },
    city: {
      title: "城市更新",
      modules: ["建筑立面光影", "街区节点装置", "公共艺术灯光", "慢行导视系统"],
      advice: "先打造一段可被市民记住的夜间界面，再逐步扩展到街区和城市更新片区。"
    },
    stage: {
      title: "舞台演艺",
      modules: ["演艺灯具", "舞台机械接口", "节目控制系统", "观众区补光"],
      advice: "把灯光、机械、屏幕和表演节奏一起设计，优先保证现场安全与维护效率。"
    },
    hotel: {
      title: "酒店入口",
      modules: ["迎宾光廊", "品牌发光装置", "车道引导灯", "节庆换装系统"],
      advice: "优先解决第一眼识别、夜间到达感和社媒拍照点，不建议一开始做复杂演艺。"
    }
  };

  const budgets = {
    light: { label: "20-50 万", level: "轻量打卡版", pace: "15-25 天", density: "1 个主装置 + 少量氛围灯" },
    standard: { label: "50-150 万", level: "标准运营版", pace: "25-45 天", density: "2-4 个核心节点 + 控制系统" },
    system: { label: "150-500 万", level: "动线系统版", pace: "45-75 天", density: "完整动线 + 互动/演艺/运维预案" },
    flagship: { label: "500 万以上", level: "旗舰夜游版", pace: "75 天以上", density: "多区联动 + 内容系统 + 长期运营机制" }
  };

  const goals = {
    photo: "打卡传播",
    flow: "引流停留",
    show: "演艺主秀",
    renewal: "城市更新"
  };

  function render() {
    const scene = scenes[estimator.querySelector("[name='type']")?.value] || scenes.scenic;
    const budget = budgets[estimator.querySelector("[name='budget']")?.value] || budgets.standard;
    const scale = estimator.querySelector("[name='scale']")?.value || "node";
    const goalValue = estimator.querySelector("[name='goal']")?.value?.trim();
    const goal = goals[goalValue] || goalValue || goals.photo;
    const note = estimator.querySelector("[name='note']")?.value?.trim() || "";
    const scaleLabel = scale === "district" ? "片区级" : scale === "route" ? "动线级" : "单点级";

    output.innerHTML = `
      <div class="result-head">
        <span class="tag">预估方案</span>
        <h2>${scene.title} · ${budget.level}</h2>
        <p>${scaleLabel}项目，核心目标是${goal}。${scene.advice}</p>
      </div>
      <div class="result-metrics">
        <div><strong>${budget.label}</strong><span>建议预算</span></div>
        <div><strong>${budget.pace}</strong><span>预估周期</span></div>
        <div><strong>${budget.density}</strong><span>配置密度</span></div>
      </div>
      <div class="result-block">
        <h3>推荐配置</h3>
        <ul>${scene.modules.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="result-block">
        <h3>下一步资料</h3>
        <p>准备现场照片、平面尺寸、供电位置、开放时间、目标客流和预算上限，我们可以据此输出可报价的深化方案。</p>
        ${note ? `<p class="note"><strong>现场备注：</strong>${note}</p>` : ""}
      </div>
    `;
  }

  inputs.forEach((input) => input.addEventListener("input", render));
  render();
}
