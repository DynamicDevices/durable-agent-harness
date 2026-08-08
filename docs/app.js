const MONTH = 30.44;
const YEAR = 365.25;

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function ageParts(startISO, asOfISO) {
  const start = new Date(`${startISO}T00:00:00Z`);
  const asOf = new Date(`${asOfISO}T00:00:00Z`);
  const days = Math.max(0, Math.round((asOf - start) / 86400000));
  return {
    days,
    months: days / MONTH,
    years: days / YEAR,
  };
}

function formatAge(parts) {
  if (parts.years >= 1) {
    return `${parts.years.toFixed(2)} yr`;
  }
  return `${parts.months.toFixed(1)} mo`;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function renderClocks(clocksDoc, asOf) {
  const grid = document.getElementById("clock-grid");
  grid.replaceChildren();
  for (const clock of clocksDoc.clocks) {
    const parts = ageParts(clock.start, asOf);
    const card = el("article", { className: "clock", "data-testid": `clock-${clock.id}` }, [
      el("h3", { text: clock.label }),
      el("p", { className: "age", text: formatAge(parts) }),
      el("p", { className: "start", text: `Since ${clock.start}` }),
      el("p", { text: clock.blurb }),
    ]);
    grid.append(card);
  }
}

function renderStats(statsDoc) {
  const strip = document.getElementById("stat-strip");
  strip.replaceChildren();
  for (const metric of statsDoc.metrics) {
    strip.append(
      el("div", { className: "stat", title: metric.detail }, [
        el("strong", { text: metric.value }),
        el("span", { text: metric.label }),
      ])
    );
  }
}

function renderTimeline(doc) {
  const panel = document.getElementById("panel-timeline");
  const list = el("ol", { className: "timeline" });
  for (const event of doc.events) {
    const link = event.link
      ? el("p", {}, [
          el("a", { href: event.link.href, target: "_blank", rel: "noopener noreferrer", text: event.link.label }),
        ])
      : null;
    list.append(
      el("li", {}, [
        el("time", { text: event.date }),
        el("h3", { text: event.title }),
        el("p", { text: event.body }),
        link,
      ])
    );
  }
  panel.replaceChildren(el("p", { text: "Milestones written for a public audience." }), list);
}

function renderStack(doc) {
  const panel = document.getElementById("panel-stack");
  const grid = el("div", { className: "stack-grid" });
  for (const layer of doc.layers) {
    grid.append(
      el("article", { className: "stack-card" }, [
        el("h3", { text: layer.title }),
        el("p", { className: "sub", text: layer.subtitle }),
        el("p", { text: layer.body }),
      ])
    );
  }
  panel.replaceChildren(el("p", { text: doc.intro }), grid);
}

function renderCapability(doc) {
  const panel = document.getElementById("panel-capability");
  const table = el("table", { className: "cap-table" });
  const thead = el("thead", {}, [
    el("tr", {}, [
      el("th", { text: "Outcome" }),
      el("th", { text: "Before AI" }),
      el("th", { text: "With harness" }),
      el("th", { text: "Note" }),
    ]),
  ]);
  const tbody = el("tbody");
  for (const row of doc.rows) {
    tbody.append(
      el("tr", {}, [
        el("td", { text: row.outcome }),
        el("td", {}, [el("span", { className: `tag before-${row.before}`, text: row.before })]),
        el("td", {}, [el("span", { className: `tag now-${row.now}`, text: row.now })]),
        el("td", { text: row.note }),
      ])
    );
  }
  table.append(thead, tbody);
  panel.replaceChildren(el("p", { text: doc.intro }), table);
}

function renderPatterns(doc) {
  const panel = document.getElementById("panel-patterns");
  const grid = el("div", { className: "pattern-grid" });
  for (const pattern of doc.patterns) {
    grid.append(
      el("article", { className: "pattern-card" }, [
        el("h3", { text: pattern.name }),
        el("p", { className: "sub", text: pattern.problem }),
        el("p", { text: pattern.move }),
      ])
    );
  }
  panel.replaceChildren(el("p", { text: doc.intro }), grid);
}

function renderLiterature(doc) {
  const panel = document.getElementById("panel-literature");
  const list = el("div", { className: "lit-list" });
  for (const item of doc.items) {
    list.append(
      el("article", { className: "lit-card" }, [
        el("h3", {}, [
          el("a", {
            href: item.href,
            target: "_blank",
            rel: "noopener noreferrer",
            text: `${item.title} (${item.year})`,
          }),
        ]),
        el("p", { text: item.claim }),
      ])
    );
  }
  panel.replaceChildren(el("p", { text: doc.intro }), list);
}

function setupTabs() {
  const tabs = [...document.querySelectorAll(".explore-tabs [role='tab']")];
  const panels = {
    timeline: document.getElementById("panel-timeline"),
    stack: document.getElementById("panel-stack"),
    capability: document.getElementById("panel-capability"),
    patterns: document.getElementById("panel-patterns"),
    literature: document.getElementById("panel-literature"),
  };

  function activate(name) {
    for (const tab of tabs) {
      const selected = tab.dataset.panel === name;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const [key, panel] of Object.entries(panels)) {
      const on = key === name;
      panel.classList.toggle("active", on);
      panel.hidden = !on;
    }
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => activate(tab.dataset.panel));
    tab.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp" && ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") {
        return;
      }
      ev.preventDefault();
      const i = tabs.indexOf(tab);
      const delta = ev.key === "ArrowDown" || ev.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(i + delta + tabs.length) % tabs.length];
      next.focus();
      activate(next.dataset.panel);
    });
  }
}

async function main() {
  const [clocks, timeline, stack, capabilities, patterns, literature, stats] = await Promise.all([
    loadJSON("content/clocks.json"),
    loadJSON("content/timeline.json"),
    loadJSON("content/stack.json"),
    loadJSON("content/capabilities.json"),
    loadJSON("content/patterns.json"),
    loadJSON("content/literature.json"),
    loadJSON("content/stats.json"),
  ]);

  const asOf = clocks.as_of || stats.as_of || new Date().toISOString().slice(0, 10);
  renderClocks(clocks, asOf);
  renderStats(stats);
  renderTimeline(timeline);
  renderStack(stack);
  renderCapability(capabilities);
  renderPatterns(patterns);
  renderLiterature(literature);
  setupTabs();
}

main().catch((err) => {
  console.error(err);
  const grid = document.getElementById("clock-grid");
  if (grid) {
    grid.textContent = "Could not load content. Open this site via a local static server or GitHub Pages.";
  }
});
