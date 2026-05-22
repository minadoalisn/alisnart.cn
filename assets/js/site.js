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

  if (state) {
    state.addEventListener("change", () => setMenu(state.checked));
  } else {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      setMenu(!isMenuOpen());
    });
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
  const inputs = estimator.querySelectorAll("input, select, textarea");

  const plans = {
    scenic: "景区夜游：建议先做一条 300-800 米的主游线，用入口仪式感、核心打卡点和终点演艺形成完整动线。",
    commercial: "商业美陈：建议围绕节庆节点做轻量可换装结构，让装置兼顾拍照传播和后续复用。",
    city: "城市更新：建议以建筑立面、街区节点和公共艺术装置组合，先打造一段可被市民记住的夜间界面。",
    stage: "舞台演艺：建议把灯光、机械、屏幕和表演节奏一起设计，优先保证现场安全与维护效率。"
  };

  function render() {
    const type = estimator.querySelector("[name='type']").value;
    const area = Number(estimator.querySelector("[name='area']").value || 0);
    const budget = Number(estimator.querySelector("[name='budget']").value || 0);
    const goal = estimator.querySelector("[name='goal']").value.trim() || "提升夜间停留与传播";
    const level = area > 5000 || budget > 200 ? "完整策划+工程深化" : "概念方案+核心装置样机";

    output.innerHTML = `
      <span class="tag">方案建议</span>
      <h3>${level}</h3>
      <p>${plans[type]}</p>
      <p><strong>项目目标：</strong>${goal}</p>
      <p><strong>建议节奏：</strong>7 天梳理主题与预算，15 天完成视觉方向，30 天输出施工深化与设备清单。</p>
      <p><strong>下一步：</strong>准备现场平面、动线照片、开放时间、供电条件，我们可以快速判断哪些点最值得先亮起来。</p>
    `;
  }

  inputs.forEach((input) => input.addEventListener("input", render));
  render();
}
