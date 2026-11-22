/* alisnart.cn Awwwards P1+P2 — 2026-11-22
   Vanilla JS only, no new library. Pairs with assets/css/awwwards.css.
   Everything here is progressive enhancement: with JS off, the pages
   render exactly as before (no data-reveal dependency, no hidden content). */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  var isEN = (root.lang || "").toLowerCase().indexOf("en") === 0;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionOff = false;
  try { motionOff = localStorage.getItem("alisnart-motion-off") === "1"; } catch (e) {}
  if (motionOff) root.classList.add("aw-motion-off");
  var animate = !reduced && !motionOff;
  var desktop = window.matchMedia("(min-width: 901px)").matches;

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

  /* ---------- skip-motion control (F: every motion has a way out) ---------- */
  var heroH1 = $("main h1");
  if (animate && heroH1) {
    var skipBtn = doc.createElement("button");
    skipBtn.type = "button";
    skipBtn.className = "aw-skip-motion";
    skipBtn.textContent = isEN ? "Skip motion" : "跳过动效";
    skipBtn.addEventListener("click", function () {
      root.classList.add("aw-motion-off");
      try { localStorage.setItem("alisnart-motion-off", "1"); } catch (e) {}
      if (skipBtn.parentNode) skipBtn.parentNode.removeChild(skipBtn);
    });
    doc.body.appendChild(skipBtn);
    window.setTimeout(function () {
      if (skipBtn.parentNode) skipBtn.parentNode.removeChild(skipBtn);
    }, 6000);
  }

  /* ---------- A. hero letter fade-in (≤0.8s total) ---------- */
  function splitTextNode(node) {
    var text = node.nodeValue;
    var frag = doc.createDocumentFragment();
    var isCJK = /[\u4e00-\u9fff]/.test(text);
    var tokens = isCJK ? text.split("") : text.split(/(\s+)/);
    tokens.forEach(function (tok) {
      if (!tok) return;
      if (/^\s+$/.test(tok)) { frag.appendChild(doc.createTextNode(tok)); return; }
      var s = doc.createElement("span");
      s.className = "aw-char";
      s.textContent = tok;
      frag.appendChild(s);
    });
    node.parentNode.replaceChild(frag, node);
  }
  function splitElement(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) { if (node.nodeValue.trim()) splitTextNode(node); }
      else if (node.nodeType === 1 && node.tagName !== "BR") { splitElement(node); }
    });
  }
  if (animate && heroH1) {
    splitElement(heroH1);
    var chars = $$(".aw-char", heroH1);
    chars.forEach(function (c, i) {
      c.style.transitionDelay = Math.min(i * 30, 350) + "ms";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        chars.forEach(function (c) { c.classList.add("aw-in"); });
      });
    });
  }

  /* ---------- C. reveal extension (site.js already reveals its own set) ---------- */
  var extra = $$(".business-card, .case-category-head, .banquet-case-grid article, .banquet-method, .banquet-contact-grid, .banquet-intro-grid, .banquet-values");
  extra.forEach(function (el) { el.setAttribute("data-reveal", ""); el.classList.add("aw-extra"); });
  if (extra.length) {
    if (animate && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
      extra.forEach(function (el) { io.observe(el); });
    } else {
      extra.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- C. gentle parallax on key imagery (desktop only) ---------- */
  var pxImgs = $$(".premium-hero-visual img, .scene-panel img");
  if (animate && desktop && pxImgs.length && "requestAnimationFrame" in window) {
    root.classList.add("aw-parallax");
    var ticking = false;
    var range = window.innerHeight || 800;
    function applyParallax() {
      ticking = false;
      pxImgs.forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.bottom < -80 || r.top > range + 80) return;
        var center = r.top + r.height / 2;
        var d = Math.max(-1, Math.min(1, (range / 2 - center) / (range / 2)));
        var max = img.closest(".premium-hero-visual") ? 14 : 10;
        img.style.setProperty("--aw-px", (d * max).toFixed(1) + "px");
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); }
    }, { passive: true });
    applyParallax();
  }

  /* ---------- B. case three-view + search + filter (cases.html) ---------- */
  var tools = $(".aw-case-tools");
  if (tools) {
    var main = tools.closest("main");
    var items = $$("[data-scene]", main);
    var viewBtns = $$("[data-view]", tools);
    var search = $("input[type='search']", tools);
    var catSel = $("select[data-filter='cat']", tools);
    var sceneSel = $("select[data-filter='scene']", tools);
    var countEl = $(".aw-count", tools);
    var empty = doc.createElement("p");
    empty.className = "aw-empty aw-hidden";
    empty.textContent = isEN ? "No matching concepts. Try another keyword or clear the filters."
      : "没有匹配的案例，换个关键词或清空筛选试试。";
    tools.parentNode.insertBefore(empty, tools.nextSibling);

    var savedView = "grid";
    try { savedView = localStorage.getItem("alisnart-case-view") || "grid"; } catch (e) {}
    if (["grid", "list", "gallery"].indexOf(savedView) < 0) savedView = "grid";
    function setView(v) {
      main.setAttribute("data-case-view", v);
      viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === v)); });
      try { localStorage.setItem("alisnart-case-view", v); } catch (e) {}
    }
    viewBtns.forEach(function (b) {
      b.addEventListener("click", function () { setView(b.getAttribute("data-view")); });
    });
    setView(savedView);

    function filter() {
      var q = (search.value || "").trim().toLowerCase();
      var cat = catSel.value, scene = sceneSel.value, shown = 0;
      items.forEach(function (it) {
        var text = (it.textContent || "").toLowerCase();
        var ok = (!q || text.indexOf(q) > -1) &&
          (!cat || it.getAttribute("data-cat") === cat) &&
          (!scene || it.getAttribute("data-scene") === scene);
        it.classList.toggle("aw-hidden", !ok);
        if (ok) shown++;
      });
      $$(".case-category, .aw-detail-list", main).forEach(function (sec) {
        var kids = $$("[data-scene]", sec);
        if (!kids.length) return;
        sec.classList.toggle("aw-hidden", kids.every(function (k) { return k.classList.contains("aw-hidden"); }));
      });
      if (countEl) {
        countEl.textContent = isEN
          ? items.length + " items · " + shown + " shown"
          : "共 " + items.length + " 项 · 显示 " + shown + " 项";
      }
      empty.classList.toggle("aw-hidden", shown !== 0);
    }
    search.addEventListener("input", filter);
    catSel.addEventListener("change", filter);
    sceneSel.addEventListener("change", filter);
    filter();
  }

  /* ---------- E. nav roll-over (double-layer, pure CSS transition) ---------- */
  $$(".nav-links a:not(.lang-switch)").forEach(function (a) {
    var text = (a.textContent || "").trim();
    if (!text || a.querySelector(".aw-roll")) return;
    a.textContent = "";
    var wrap = doc.createElement("span");
    wrap.className = "aw-roll";
    var top = doc.createElement("span"); top.textContent = text;
    var bottom = doc.createElement("span"); bottom.textContent = text; bottom.setAttribute("aria-hidden", "true");
    wrap.appendChild(top); wrap.appendChild(bottom);
    a.appendChild(wrap);
  });

  /* ---------- E. fixed language switch (bottom-right, above the project fab) ---------- */
  var altEN = $("link[rel='alternate'][hreflang='en']");
  var altZH = $("link[rel='alternate'][hreflang='zh-CN']");
  var target = isEN ? (altZH && altZH.href) : (altEN && altEN.href);
  if (target && !$(".aw-lang-fixed")) {
    var langFab = doc.createElement("a");
    langFab.className = "aw-lang-fixed";
    langFab.href = target;
    langFab.textContent = isEN ? "中文" : "EN";
    langFab.setAttribute("aria-label", isEN ? "切换至中文" : "Switch to English");
    doc.body.appendChild(langFab);
  }

  /* ---------- C. chapter progress ("02 / 05") on long pages ---------- */
  var chapters = $$("main .section").filter(function (sec) {
    return sec.querySelector("h2") && sec.offsetParent !== null;
  });
  if (desktop && chapters.length >= 3) {
    var prog = doc.createElement("div");
    prog.className = "aw-chapter-progress";
    prog.setAttribute("aria-hidden", "true");
    doc.body.appendChild(prog);
    var total = chapters.length < 10 ? "0" + chapters.length : String(chapters.length);
    var cur = 1, pTicking = false;
    function updateProgress() {
      pTicking = false;
      var mid = (window.innerHeight || 800) * 0.4, idx = 0;
      chapters.forEach(function (sec, i) {
        if (sec.getBoundingClientRect().top < mid) idx = i;
      });
      cur = idx + 1;
      var curStr = cur < 10 ? "0" + cur : String(cur);
      prog.innerHTML = "<b>" + curStr + "</b> / " + total;
    }
    window.addEventListener("scroll", function () {
      if (!pTicking) { pTicking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();
  }

  /* ---------- E. footer marquee: duplicate the track for a seamless loop ---------- */
  $$(".aw-marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });
})();
