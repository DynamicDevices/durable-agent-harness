const BASE = new URL("./content/", import.meta.url);

async function loadJSON(name) {
  const res = await fetch(new URL(name, BASE));
  if (!res.ok) throw new Error(`Failed to load ${name} (${res.status})`);
  return res.json();
}

function daysBetween(startIso, asOfIso) {
  const start = new Date(`${startIso}T00:00:00Z`);
  const asOf = new Date(`${asOfIso}T00:00:00Z`);
  return Math.round((asOf - start) / 86400000);
}

function formatAge(days) {
  const months = days / 30.44;
  if (months >= 12) {
    return {
      primary: `${(days / 365.25).toFixed(2)} years`,
      secondary: `${days} days · ~${months.toFixed(1)} months`,
    };
  }
  return {
    primary: `~${months.toFixed(1)} months`,
    secondary: `${days} days`,
  };
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "hidden" && v) node.hidden = true;
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function renderClocks(data) {
  document.querySelector("#clocks-note").textContent = data.note;
  const grid = document.querySelector("#clock-grid");
  grid.replaceChildren(
    ...data.clocks.map((clock) => {
      const days = daysBetween(clock.start, data.as_of);
      const age = formatAge(days);
      return el(
        "article",
        {
          className: "clock-card",
          "data-testid": `clock-${clock.id}`,
        },
        [
          el("div", { className: "label", text: clock.label }),
          el("div", { className: "age" }, [
            age.primary,
            el("span", { text: age.secondary }),
          ]),
          el("p", { className: "blurb", text: `${clock.blurb} Started ${clock.start}.` }),
        ],
      );
    }),
  );
}

function renderStats(data) {
  document.querySelector("#stat-strip").replaceChildren(
    ...data.metrics.map((m) =>
      el("span", {}, [
        el("strong", { text: m.label }),
        document.createTextNode(` ${m.value}`),
      ]),
    ),
    el("span", { text: `As of ${data.as_of}` }),
  );
}

function renderTimeline(data) {
  const panel = document.querySelector("#panel-timeline");
  const list = el("ol", { className: "timeline" });
  data.events.forEach((item, index) => {
    const link = item.link
      ? el("p", {}, [
          el("a", {
            className: "text-link",
            href: item.link.href,
            target: "_blank",
            rel: "noopener noreferrer",
            text: item.link.label,
          }),
        ])
      : null;
    list.append(
      el("li", { style: `animation-delay:${index * 60}ms` }, [
        el("time", { text: item.date }),
        el("h3", { text: item.title }),
        el("p", { text: item.body }),
        link,
      ]),
    );
  });
  panel.replaceChildren(list);
}

function renderStack(data) {
  const panel = document.querySelector("#panel-stack");
  panel.replaceChildren(
    el("p", { className: "panel-intro", text: data.intro }),
    el(
      "div",
      { className: "stack-grid" },
      data.layers.map((layer) =>
        el("article", { className: "stack-card" }, [
          el("h3", { text: layer.title }),
          el("div", { className: "subtitle", text: layer.subtitle }),
          el("p", { text: layer.body }),
        ]),
      ),
    ),
  );
}

function renderCapabilities(data) {
  const panel = document.querySelector("#panel-capability");
  const scale = Object.fromEntries(data.scale.map((s) => [s.id, s.label]));
  const table = el("div", { className: "cap-table" }, [
    el("div", { className: "cap-head" }, [
      el("span", { text: "Outcome" }),
      el("span", { text: "Before AI" }),
      el("span", { text: "Now" }),
      el("span", { text: "Note" }),
    ]),
    ...data.rows.map((row) =>
      el("div", { className: "cap-row" }, [
        el("strong", { text: row.outcome }),
        el("span", { className: "pill", text: scale[row.before] || row.before }),
        el("span", { className: "pill now", text: scale[row.now] || row.now }),
        el("span", { text: row.note }),
      ]),
    ),
  ]);
  panel.replaceChildren(el("p", { className: "panel-intro", text: data.intro }), table);
}

function renderPatterns(data) {
  const panel = document.querySelector("#panel-patterns");
  panel.replaceChildren(
    el("p", { className: "panel-intro", text: data.intro }),
    el(
      "div",
      { className: "steal-grid" },
      data.patterns.map((p) =>
        el("article", { className: "steal-card" }, [
          el("h3", { text: p.name }),
          el("p", {}, [el("strong", { text: "Problem. " }), p.problem]),
          el("p", {}, [el("strong", { text: "Move. " }), p.move]),
        ]),
      ),
    ),
  );
}

function renderLiterature(data) {
  const panel = document.querySelector("#panel-literature");
  panel.replaceChildren(
    el("p", { className: "panel-intro", text: data.intro }),
    el(
      "ul",
      { className: "reading" },
      data.items.map((item) =>
        el("li", {}, [
          el("a", {
            href: item.href,
            target: "_blank",
            rel: "noopener noreferrer",
            text: `${item.title} (${item.year})`,
          }),
          el("p", { text: item.claim }),
        ]),
      ),
    ),
  );
}

function wireTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  function activate(next) {
    tabs.forEach((tab, i) => {
      const selected = tab === next;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      panels[i].hidden = !selected;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab));
  });
}

async function main() {
  const [clocks, stats, timeline, stack, capabilities, patterns, literature] = await Promise.all([
    loadJSON("clocks.json"),
    loadJSON("stats.json"),
    loadJSON("timeline.json"),
    loadJSON("stack.json"),
    loadJSON("capabilities.json"),
    loadJSON("patterns.json"),
    loadJSON("literature.json"),
  ]);

  renderClocks(clocks);
  renderStats(stats);
  renderTimeline(timeline);
  renderStack(stack);
  renderCapabilities(capabilities);
  renderPatterns(patterns);
  renderLiterature(literature);
  wireTabs();
  document.body.dataset.ready = "true";
}

main().catch((err) => {
  console.error(err);
  document.body.dataset.ready = "error";
});
