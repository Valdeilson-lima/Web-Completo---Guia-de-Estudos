/* ═══════════════════════════════════════════════════════════
   WEB COMPLETO — Guia de Estudo
   scripts/main.js
   Lógica global: navegação, tema claro/escuro, progresso de
   estudo, cópia de código, tempo de leitura, acessibilidade
   e micro-interações. 100% vanilla, sem dependências.
   ═══════════════════════════════════════════════════════════ */
"use strict";

(() => {
  /* ── Constantes ── */
  const LS_THEME = "webcompleto.theme";
  const LS_PROGRESS = "webcompleto.progress.v1";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const root = document.documentElement;

  /* ════════════════════════════════════════════
     1. TEMA CLARO / ESCURO
     ════════════════════════════════════════════ */
  function getStoredTheme() {
    try {
      return localStorage.getItem(LS_THEME);
    } catch {
      return null;
    }
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem(LS_THEME, theme);
      } catch {
        /* armazenamento indisponível */
      }
    }
    syncThemeButtons();
  }

  function toggleTheme() {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next, true);
  }

  function syncThemeButtons() {
    const dark = root.dataset.theme !== "light";
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.innerHTML = dark ? "☀️" : "🌙";
      btn.title = dark ? "Mudar para tema claro" : "Mudar para tema escuro";
      btn.setAttribute("aria-label", btn.title);
      btn.setAttribute("aria-pressed", String(dark));
    });
  }

  /* ════════════════════════════════════════════
     2. PROGRESSO DE ESTUDO (localStorage)
     ════════════════════════════════════════════ */
  function getPageKey() {
    const p = location.pathname.replace(/\/+$/, "");
    if (p === "" || p.endsWith("index.html")) return "inicio";
    return p.split("/").pop() || "inicio";
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(store) {
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(store));
    } catch {
      /* armazenamento indisponível */
    }
  }

  function getPageProgress() {
    const store = loadProgress();
    const key = getPageKey();
    return store[key] || { done: [] };
  }

  function isSectionDone(id) {
    return id ? getPageProgress().done.includes(id) : false;
  }

  function setSectionDone(id, done) {
    const store = loadProgress();
    const key = getPageKey();
    const page = store[key] || { done: [] };
    page.done = done
      ? Array.from(new Set([...page.done, id]))
      : page.done.filter((d) => d !== id);
    store[key] = page;
    saveProgress(store);
    updateProgressUI();
  }

  let headerProgressEl = null;

  function updateProgressUI() {
    const sections = document.querySelectorAll(".topic");
    if (!sections.length) return;
    const total = sections.length;
    let doneCount = 0;
    sections.forEach((s) => {
      if (isSectionDone(s.id)) {
        doneCount += 1;
        s.classList.add("is-done");
      } else {
        s.classList.remove("is-done");
      }
    });

    if (headerProgressEl) {
      headerProgressEl.style.setProperty(
        "--pct",
        Math.round((doneCount / total) * 100) + "%"
      );
      const num = headerProgressEl.querySelector(".header-progress__num");
      if (num) num.textContent = doneCount + "/" + total;
    }

    document.querySelectorAll(".toc a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        link.classList.toggle("is-done", isSectionDone(href.slice(1)));
      }
    });
  }

  /* ════════════════════════════════════════════
     3. INJEÇÃO DE ELEMENTOS NO CABEÇALHO
     ════════════════════════════════════════════ */
  function buildHeaderActions() {
    const headerInner = document.querySelector(".site-header .header-inner");
    if (!headerInner) return;

    if (document.querySelector(".topic")) {
      headerProgressEl = document.createElement("div");
      headerProgressEl.className = "header-progress";
      headerProgressEl.title = "Tópicos concluídos nesta página";
      headerProgressEl.innerHTML =
        '<span class="header-progress__num">0/0</span>';
      headerInner.appendChild(headerProgressEl);
    }

    const themeBtn = document.createElement("button");
    themeBtn.type = "button";
    themeBtn.className = "theme-toggle";
    themeBtn.setAttribute("aria-label", "Alternar tema");
    themeBtn.addEventListener("click", toggleTheme);
    headerInner.appendChild(themeBtn);
    syncThemeButtons();
  }

  /* ════════════════════════════════════════════
     4. MARCAÇÃO DE TÓPICO CONCLUÍDO
     ════════════════════════════════════════════ */
  function buildTopicDoneButtons() {
    document.querySelectorAll(".topic").forEach((section) => {
      if (section.querySelector(".topic-done")) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "topic-done";
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML =
        '<span class="topic-done__check">✓</span>' +
        '<span class="topic-done__label">Concluir</span>';
      btn.title = "Marcar tópico como concluído";

      const updateBtn = () => {
        const done = isSectionDone(section.id);
        btn.classList.toggle("is-done", done);
        btn.setAttribute("aria-pressed", String(done));
        btn.innerHTML =
          '<span class="topic-done__check">✓</span>' +
          '<span class="topic-done__label">' +
          (done ? "Concluído" : "Concluir") +
          "</span>";
      };

      btn.addEventListener("click", () => {
        setSectionDone(section.id, !isSectionDone(section.id));
        updateBtn();
      });

      updateBtn();
      section.appendChild(btn);
    });
  }

  /* ════════════════════════════════════════════
     5. BOTÃO "COPIAR" EM BLOCOS DE CÓDIGO
     ════════════════════════════════════════════ */
  function buildCopyButtons() {
    document.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".code-copy")) return;
      if (!pre.textContent.trim()) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "Copiar";
      btn.setAttribute("aria-label", "Copiar código");

      btn.addEventListener("click", async () => {
        const text = pre.textContent.replace(/\n$/, "");
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        btn.textContent = "✓ Copiado!";
        btn.classList.add("is-copied");
        setTimeout(() => {
          btn.textContent = "Copiar";
          btn.classList.remove("is-copied");
        }, 1600);
      });

      pre.appendChild(btn);
    });
  }

  /* ════════════════════════════════════════════
     6. TEMPO DE LEITURA
     ════════════════════════════════════════════ */
  function buildReadingTime() {
    const title = document.querySelector(".page-title p");
    if (!title || title.querySelector(".reading-time")) return;

    const main = document.querySelector("main.page-wrapper");
    const text = (main && main.textContent) || "";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));

    const badge = document.createElement("span");
    badge.className = "reading-time";
    badge.textContent = "⏱ " + minutes + " min de leitura";
    title.appendChild(document.createTextNode(" "));
    title.appendChild(badge);
  }

  /* ════════════════════════════════════════════
     6b. PROGRESSO NA LANDING (cards + geral)
     ════════════════════════════════════════════ */
  function buildLandingProgress() {
    const store = loadProgress();
    const cards = document.querySelectorAll(".card-progress[data-page]");
    if (!cards.length) return;

    let overallDone = 0;
    let overallTotal = 0;

    cards.forEach((card) => {
      const pageKey = card.dataset.page;
      const done = (store[pageKey] && store[pageKey].done.length) || 0;

      // O total é lido do rótulo ("0/15 concluídos")
      const label = card.querySelector(".card-progress__label");
      const match = label
        ? label.textContent.match(/(\d+)\s*\/\s*(\d+)/)
        : null;
      const total = match ? parseInt(match[2], 10) : 0;
      if (!total) return;

      card.style.setProperty(
        "--pct",
        Math.min(100, Math.round((done / total) * 100)) + "%"
      );
      if (label) label.textContent = done + "/" + total + " concluídos";
      overallDone += Math.min(done, total);
      overallTotal += total;
    });

    const pct = overallTotal
      ? Math.round((overallDone / overallTotal) * 100)
      : 0;

    const pctEl = document.getElementById("overall-pct");
    const barEl = document.getElementById("overall-bar");
    const detailEl = document.getElementById("overall-detail");

    if (pctEl) pctEl.textContent = pct + "%";
    if (barEl) barEl.style.setProperty("--pct", pct + "%");
    if (detailEl) {
      if (overallDone === 0) {
        detailEl.innerHTML =
          "<span>Comece marcando tópicos como concluídos ✓</span>";
      } else if (overallDone === overallTotal) {
        detailEl.innerHTML =
          "<span>🎉 Parabéns! Você concluiu todo o guia!</span>";
      } else {
        detailEl.innerHTML =
          "<span><b>" +
          overallDone +
          "</b> de <b>" +
          overallTotal +
          "</b> tópicos concluídos</span>";
      }
    }
  }

  /* ════════════════════════════════════════════
     7. REVELAÇÃO AO ROLAR (IntersectionObserver)
     ════════════════════════════════════════════ */
  function buildScrollReveals() {
    const items = document.querySelectorAll(".topic");
    if (!items.length) return;

    items.forEach((el) => {
      el.dataset.reveal = "";
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    items.forEach((el) => io.observe(el));
  }

  /* ════════════════════════════════════════════
     8. BARRA DE PROGRESSO DE ROLAGEM
     ════════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = document.querySelector(".progress-bar");
    if (!bar) return;

    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      bar.style.setProperty("--progress", progress + "%");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ════════════════════════════════════════════
     9. INDICADOR DE SCROLL DAS ABAS
     ════════════════════════════════════════════ */
  function initTabScroll() {
    const wrapper = document.querySelector(".tabs-wrapper");
    const scrollEl = document.querySelector(".tabs-scroll");
    if (!wrapper || !scrollEl) return;

    const check = () => {
      scrollEl.classList.toggle(
        "can-scroll",
        wrapper.scrollWidth > wrapper.clientWidth
      );
    };
    check();
    window.addEventListener("resize", check);
    wrapper.addEventListener("scroll", check, { passive: true });
  }

  /* ════════════════════════════════════════════
     10. SCROLLSPY — destaca a seção ativa no sumário
     ════════════════════════════════════════════ */
  function initScrollSpy() {
    const links = document.querySelectorAll('.toc a[href^="#"]');
    const map = [];
    links.forEach((link) => {
      const el = document.getElementById(link.getAttribute("href").slice(1));
      if (el) map.push({ link, el });
    });
    if (!map.length) return;

    const update = () => {
      const pos = window.scrollY + 220;
      let current = map[0];
      map.forEach((entry) => {
        if (pos >= entry.el.offsetTop) current = entry;
      });
      map.forEach(({ link }) =>
        link.classList.toggle("is-active", link === current.link)
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ════════════════════════════════════════════
     11. VOLTAR AO TOPO
     ════════════════════════════════════════════ */
  function initScrollTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    const toggle = () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ════════════════════════════════════════════
     12. ATALHOS DE TECLADO
     ════════════════════════════════════════════ */
  function navigateSection(dir) {
    const sections = Array.from(document.querySelectorAll(".topic"));
    if (!sections.length) return;
    const currentIndex = sections.findIndex((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= 140 && r.bottom > 140;
    });
    const target =
      sections[currentIndex + dir] ||
      (dir > 0 ? sections[0] : sections[sections.length - 1]);
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function initShortcuts() {
    document.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        e.target.isContentEditable
      ) {
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "t":
          toggleTheme();
          break;
        case "[":
          navigateSection(-1);
          break;
        case "]":
          navigateSection(1);
          break;
      }
    });
  }

  /* ════════════════════════════════════════════
     BOOTSTRAP — aplica o tema o mais cedo possível
     ════════════════════════════════════════════ */
  applyTheme(getStoredTheme() || (prefersDark ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", () => {
    buildHeaderActions();
    buildTopicDoneButtons();
    buildCopyButtons();
    buildReadingTime();
    buildScrollReveals();
    initScrollProgress();
    initTabScroll();
    initScrollSpy();
    initScrollTop();
    initShortcuts();
    updateProgressUI();
    buildLandingProgress();
  });
})();
