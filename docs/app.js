const BASE = new URL("./content/", import.meta.url);
const STARTER_BASE = new URL("./starters/", import.meta.url);

async function loadJSON(name) {
  const res = await fetch(new URL(name, BASE));
  if (!res.ok) throw new Error(`Failed to load ${name} (${res.status})`);
  return res.json();
}

async function loadText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return res.text();
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
      return el("article", { className: "clock-card", "data-testid": `clock-${clock.id}` }, [
        el("div", { className: "label", text: clock.label }),
        el("div", { className: "age" }, [age.primary, el("span", { text: age.secondary })]),
        el("p", { className: "blurb", text: `${clock.blurb} Started ${clock.start}.` }),
      ]);
    }),
  );
}

function renderStats(data) {
  document.querySelector("#stat-strip").replaceChildren(
    ...data.metrics.map((m) =>
      el("span", {}, [el("strong", { text: m.label }), document.createTextNode(` ${m.value}`)]),
    ),
    el("span", { text: `As of ${data.as_of}` }),
  );
  const note = document.querySelector("#stats-note");
  if (note) note.textContent = data.growthNote || data.disclaimer || "";
}

function renderMessaging(data) {
  document.querySelector("#messaging-title").textContent = data.title;
  document.querySelector("#messaging-intro").textContent = data.intro;
  document.querySelector("#messaging-stance").textContent = data.stance;
  document.querySelector("#messaging-caps").replaceChildren(
    ...data.capabilities.map((c) =>
      el("article", { className: "case-card" }, [
        el("h3", { text: c.title }),
        el("p", { text: c.body }),
      ]),
    ),
  );
  document.querySelector("#messaging-do").replaceChildren(
    ...data.practices.map((p) => el("li", { text: p })),
  );
  document.querySelector("#messaging-not").replaceChildren(
    ...data.not.map((p) => el("li", { text: p })),
  );
}

function renderIngest(data) {
  document.querySelector("#ingest-title").textContent = data.title;
  document.querySelector("#ingest-intro").textContent = data.intro;
  document.querySelector("#ingest-flows").replaceChildren(
    ...data.flows.map((f) =>
      el("article", { className: "case-card" }, [
        el("h3", { text: f.title }),
        el("p", { text: f.body }),
      ]),
    ),
  );
  document.querySelector("#ingest-do").replaceChildren(
    ...data.practices.map((p) => el("li", { text: p })),
  );
  document.querySelector("#ingest-not").replaceChildren(
    ...data.not.map((p) => el("li", { text: p })),
  );
}

function renderTokens(data) {
  document.querySelector("#tokens-title").textContent = data.title;
  document.querySelector("#tokens-intro").textContent = data.intro;
  document.querySelector("#tokens-why").textContent = data.why;
  document.querySelector("#tokens-practices").replaceChildren(
    ...data.practices.map((p) =>
      el("article", { className: "steal-card" }, [
        el("h3", { text: p.title }),
        el("p", { text: p.body }),
      ]),
    ),
  );
  document.querySelector("#tokens-anti").replaceChildren(
    ...data.antiPatterns.map((p) => el("li", { text: p })),
  );
}

function renderSurfaces(data) {
  document.querySelector("#surfaces-title").textContent = data.title;
  document.querySelector("#surfaces-intro").textContent = data.intro;
  document.querySelector("#surfaces-grid").replaceChildren(
    ...data.surfaces.map((s) =>
      el("article", { className: "case-card", "data-surface": s.id }, [
        el("h3", { text: s.title }),
        el("p", { text: s.body }),
        el("p", { className: "lesson", text: s.lesson }),
      ]),
    ),
  );
}

function renderPublish(data) {
  document.querySelector("#publish-title").textContent = data.title;
  document.querySelector("#publish-intro").textContent = data.intro;
  document.querySelector("#publish-grid").replaceChildren(
    ...data.items.map((item) =>
      el("article", { className: "band-card", "data-publish": item.id }, [
        el("h3", { text: item.title }),
        el("p", { text: item.body }),
        el("p", { className: "lesson", text: item.lesson }),
      ]),
    ),
  );
}

function renderRuntime(data) {
  document.querySelector("#runtime-intro").textContent = data.intro;
  document.querySelector("#runtime-stance").textContent = data.stance;
  document.querySelector("#runtime-together").textContent = data.together;

  function block(key, obj) {
    return el("article", { className: "case-card", "data-runtime": key }, [
      el("div", { className: "label", text: key === "preloop" ? "Policy / audit" : "Model routing" }),
      el("h3", { text: obj.title }),
      el("p", { text: obj.lede }),
      el("p", {}, [
        el("a", {
          className: "text-link",
          href: obj.docs,
          target: "_blank",
          rel: "noopener noreferrer",
          text: "Docs",
        }),
      ]),
      el("h4", { className: "minihead", text: "Do" }),
      el(
        "ul",
        { className: "tip-list" },
        obj.practices.map((p) => el("li", { text: p })),
      ),
      el("h4", { className: "minihead", text: "Not" }),
      el(
        "ul",
        { className: "tip-list" },
        obj.not.map((p) => el("li", { text: p })),
      ),
    ]);
  }

  document.querySelector("#runtime-cols").replaceChildren(
    block("preloop", data.preloop),
    block("openrouter", data.openrouter),
  );
}

function renderLearning(data) {
  document.querySelector("#learning-intro").textContent = data.intro;
  document.querySelector("#learning-loop-line").textContent = data.loopOneLiner;
  document.querySelector("#learning-flow").replaceChildren(
    ...data.flow.map((step, index) =>
      el("li", { className: "flow-card" }, [
        el("div", { className: "step-num", text: `${index + 1}. ${step.name}` }),
        el("div", { className: "subtitle", text: step.gloss }),
        el("p", { text: step.body }),
      ]),
    ),
  );
  document.querySelector("#mempalace-lede").textContent = data.mempalace.lede;
  document.querySelector("#mempalace-do").replaceChildren(
    ...data.mempalace.practices.map((p) => el("li", { text: p })),
  );
  document.querySelector("#mempalace-not").replaceChildren(
    ...data.mempalace.not.map((p) => el("li", { text: p })),
  );
  document.querySelector("#twp-grid").replaceChildren(
    ...data.twpMembers.map((m) =>
      el("article", { className: "band-card" }, [
        el("h3", { text: m.name }),
        el("p", { text: m.role }),
      ]),
    ),
  );
}

function renderPlaybook(data) {
  document.querySelector("#playbook-intro").textContent = data.intro;
  document.querySelector("#principle-strip").replaceChildren(
    ...data.principles.map((p) => el("span", { className: "principle", text: p })),
  );
  document.querySelector("#playbook-steps").replaceChildren(
    ...data.steps.map((step) =>
      el("li", { className: "step-card" }, [
        el("div", { className: "step-num", text: `Step ${step.id}` }),
        el("h3", { text: step.title }),
        el("p", { text: step.body }),
        el("p", { className: "done-line" }, [el("strong", { text: "Done when: " }), step.done]),
      ]),
    ),
  );
  document.querySelector("#anti-grid").replaceChildren(
    ...data.antiPatterns.map((a) =>
      el("article", { className: "steal-card" }, [
        el("h3", { text: a.name }),
        el("p", { text: a.body }),
      ]),
    ),
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
      el("li", { style: `animation-delay:${Math.min(index, 8) * 50}ms` }, [
        el("time", { text: item.date }),
        el("h3", { text: item.title }),
        el("p", { text: item.body }),
        link,
      ]),
    );
  });
  panel.replaceChildren(
    data.intro ? el("p", { className: "panel-intro", text: data.intro }) : null,
    list,
  );
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
          layer.tips
            ? el(
                "ul",
                { className: "tip-list" },
                layer.tips.map((t) => el("li", { text: t })),
              )
            : null,
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
        el("span", {}, [
          row.note,
          row.band ? el("div", { className: "band", text: row.band }) : null,
        ]),
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
          p.signals
            ? el(
                "ul",
                { className: "tip-list" },
                p.signals.map((s) => el("li", { text: s })),
              )
            : null,
        ]),
      ),
    ),
  );
}

function renderGlossary(data) {
  const panel = document.querySelector("#panel-glossary");
  panel.replaceChildren(
    el("p", { className: "panel-intro", text: data.intro }),
    el(
      "dl",
      { className: "glossary" },
      data.terms.flatMap((t) => [el("dt", { text: t.term }), el("dd", { text: t.def })]),
    ),
    el("h3", { className: "subhead", text: "FAQ" }),
    el(
      "div",
      { className: "faq" },
      data.faq.map((item) =>
        el("details", { className: "faq-item" }, [
          el("summary", { text: item.q }),
          el("p", { text: item.a }),
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
          item.use ? el("p", { className: "use-line", text: `Use: ${item.use}` }) : null,
        ]),
      ),
    ),
    data.readingOrder
      ? el(
          "ol",
          { className: "ritual" },
          data.readingOrder.map((r) => el("li", { text: r })),
        )
      : null,
  );
}

function renderCases(data) {
  document.querySelector("#cases-intro").textContent = data.intro;
  document.querySelector("#case-grid").replaceChildren(
    ...data.cases.map((c) =>
      el("article", { className: "case-card", "data-case": c.id }, [
        el("div", { className: "label", text: c.domain }),
        el("h3", { text: c.title }),
        el("p", {}, [el("strong", { text: "Before. " }), c.before]),
        el("p", {}, [el("strong", { text: "After. " }), c.after]),
        el(
          "ul",
          { className: "tip-list" },
          c.harness.map((h) => el("li", { text: h })),
        ),
        el("p", { className: "lesson", text: c.lesson }),
      ]),
    ),
  );
}

function renderMeasure(data) {
  document.querySelector("#measure-intro").textContent = data.intro;
  document.querySelector("#measure-grid").replaceChildren(
    ...data.metrics.map((m) =>
      el("article", { className: "measure-card" }, [
        el("h3", { text: m.name }),
        el("p", {}, [el("strong", { text: "What. " }), m.what]),
        el("p", {}, [el("strong", { text: "Why. " }), m.why]),
        el("p", { className: "trap", text: `Trap: ${m.trap}` }),
      ]),
    ),
  );
  document.querySelector("#band-grid").replaceChildren(
    ...data.comparisonBands.map((b) =>
      el("article", { className: "band-card" }, [
        el("h3", { text: b.label }),
        el("p", { text: b.use }),
      ]),
    ),
  );
  document.querySelector("#ritual-list").replaceChildren(
    ...data.weeklyRitual.map((r) => el("li", { text: r })),
  );
}

async function renderStarters(data) {
  document.querySelector("#starters-intro").textContent = data.intro;
  const list = document.querySelector("#starter-list");
  list.replaceChildren();

  for (const t of data.templates) {
    const body = await loadText(new URL(t.filename, STARTER_BASE));
    const pre = el("pre", { className: "starter-body" }, [body]);
    const btn = el("button", { type: "button", className: "copy-btn", text: "Copy" });
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(body);
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 1500);
      } catch {
        btn.textContent = "Select manually";
      }
    });
    list.append(
      el("article", { className: "starter-card", "data-starter": t.id }, [
        el("div", { className: "starter-head" }, [
          el("div", {}, [
            el("h3", { text: t.title }),
            el("p", { text: t.blurb }),
            el("code", { className: "filename", text: t.filename }),
          ]),
          btn,
        ]),
        pre,
      ]),
    );
  }
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

  tabs.forEach((tab) => tab.addEventListener("click", () => activate(tab)));

  // Deep-link: #explore?tab=stack or hash panel ids via data
  const params = new URLSearchParams(location.search);
  const tabName = params.get("tab");
  if (tabName) {
    const match = tabs.find((t) => t.textContent.trim().toLowerCase() === tabName.toLowerCase());
    if (match) activate(match);
  }
}

async function main() {
  const [
    clocks,
    stats,
    playbook,
    learning,
    runtime,
    messaging,
    ingest,
    tokens,
    surfaces,
    publish,
    timeline,
    stack,
    capabilities,
    patterns,
    glossary,
    literature,
    cases,
    measure,
    starters,
  ] = await Promise.all([
    loadJSON("clocks.json"),
    loadJSON("stats.json"),
    loadJSON("playbook.json"),
    loadJSON("learning.json"),
    loadJSON("runtime.json"),
    loadJSON("messaging.json"),
    loadJSON("ingest.json"),
    loadJSON("tokens.json"),
    loadJSON("surfaces.json"),
    loadJSON("publish.json"),
    loadJSON("timeline.json"),
    loadJSON("stack.json"),
    loadJSON("capabilities.json"),
    loadJSON("patterns.json"),
    loadJSON("glossary.json"),
    loadJSON("literature.json"),
    loadJSON("cases.json"),
    loadJSON("measure.json"),
    loadJSON("starters.json"),
  ]);

  renderClocks(clocks);
  renderStats(stats);
  renderPlaybook(playbook);
  renderLearning(learning);
  renderRuntime(runtime);
  renderMessaging(messaging);
  renderIngest(ingest);
  renderTokens(tokens);
  renderSurfaces(surfaces);
  renderPublish(publish);
  renderTimeline(timeline);
  renderStack(stack);
  renderCapabilities(capabilities);
  renderPatterns(patterns);
  renderGlossary(glossary);
  renderLiterature(literature);
  renderCases(cases);
  renderMeasure(measure);
  await renderStarters(starters);
  wireTabs();
  document.body.dataset.ready = "true";
}

main().catch((err) => {
  console.error(err);
  document.body.dataset.ready = "error";
});
