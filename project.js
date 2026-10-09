
/*
  GOOPYVR PROJECT DATABASE
  ------------------------
  Add your own downloads by copying a project below.

  category: Tools, Mods, Builds, or Other
  download: a public download URL
  featured: true to show on the homepage
*/

const PROJECTS = [
  {
    id: "example-tool",
    title: "Example VR Tool",
    category: "Tools",
    version: "v1.0.0",
    date: "October 2026",
    description: "A placeholder for your first awesome project.",
    details: "Replace this text with installation instructions, requirements, changelog notes, or anything else your visitors need to know.",
    download: "https://github.com/",
    fileLabel: "Get download",
    featured: true
  },
  {
    id: "example-mod",
    title: "Example Mod Pack",
    category: "Mods",
    version: "v1.2.0",
    date: "October 2026",
    description: "Your mods, custom files and community projects go here.",
    details: "Describe what this mod does and explain how to install it.",
    download: "https://github.com/",
    fileLabel: "Get mod",
    featured: true
  },
  {
    id: "example-build",
    title: "Experiment 003",
    category: "Builds",
    version: "v0.3.0",
    date: "October 2026",
    description: "Showcase your builds, experiments and other creations.",
    details: "Add your build information and any important instructions here.",
    download: "https://github.com/",
    fileLabel: "Get build",
    featured: true
  }
];

// You normally only need to edit the list above.
(() => {
  const app = document.getElementById("app");
  const params = new URLSearchParams(location.search);
  const page = params.get("page") || "home";
  const requestedId = params.get("id");

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const safeURL = value => {
    try {
      const url = new URL(value, location.href);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.href;
      }
    } catch (_) {}
    return "";
  };

  const icons = {
    Tools: "⌘",
    Mods: "✳",
    Builds: "⬡",
    Other: "✦"
  };

  function card(project, index) {
    const href = `?page=project&id=${encodeURIComponent(project.id)}`;

    return `
      <article class="card" style="animation-delay:${index * 50}ms">
        <a href="${href}" aria-label="View ${escapeHTML(project.title)}">
          <div class="card-art">
            <span class="card-number">GOOPYVR / ${String(index + 1).padStart(2, "0")}</span>
            <span class="card-symbol">${icons[project.category] || "✦"}</span>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="tag">${escapeHTML(project.category)}</span>
              <span>${escapeHTML(project.version)}</span>
            </div>
            <h3>${escapeHTML(project.title)}</h3>
            <p>${escapeHTML(project.description)}</p>
            <div class="card-bottom">
              <span>${escapeHTML(project.date)}</span>
              <strong>↗</strong>
            </div>
          </div>
        </a>
        <a class="card-link" href="${href}">
          View download page <span>↗</span>
        </a>
      </article>`;
  }

  function renderHome() {
    document.title = "GoopyVR — Download Hub";

    const featured = PROJECTS.filter(p => p.featured).slice(0, 3);

    app.innerHTML = `
      <section class="hero wrap">
        <div class="hero-copy">
          <div class="eyebrow">THE OFFICIAL DOWNLOAD HUB</div>
          <h1>Your next download.<br><span class="red">Starts here.</span></h1>
          <p class="hero-description">
            Mods, tools, builds and experiments — all in one place.
            Find your next favourite drop.
          </p>
          <div class="actions">
            <a class="button" href="?page=downloads">Browse downloads ↗</a>
            <a class="button secondary" href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
          <p class="hero-note">✦ &nbsp; Fresh drops. Direct links. No clutter.</p>
        </div>
        <div class="hero-art" aria-label="Abstract red goo artwork">
          <div class="goo"></div>
        </div>
      </section>

      <section class="section wrap">
        <div class="section-heading">
          <div>
            <div class="eyebrow">THE GOOD STUFF</div>
            <h2>Featured <span class="red">drops.</span></h2>
          </div>
          <a class="text-link" href="?page=downloads">View all <span>↗</span></a>
        </div>
        <div class="download-grid">
          ${featured.length
            ? featured.map(card).join("")
            : '<p>No featured projects yet. Add one in projects.js.</p>'}
        </div>
      </section>

      <section class="banner wrap" id="about">
        <div class="banner-mark">GV</div>
        <div>
          <h2>Small projects. <span class="red">Big energy.</span></h2>
          <p>Everything GoopyVR makes, collected in one spot.</p>
        </div>
        <a class="button secondary" href="?page=downloads">Find your next drop ↗</a>
      </section>`;
  }

  function renderDownloads() {
    document.title = "Downloads — GoopyVR";

    app.innerHTML = `
      <section class="listing wrap">
        <div class="eyebrow">THE GOOPYVR LIBRARY</div>
        <h1 class="page-title">All the <span class="red">drops.</span></h1>
        <p class="page-description">
          Browse the collection. Find what you need. Get straight to the download.
        </p>

        <div class="toolbar">
          <input class="search" id="search" type="search"
            placeholder="Search downloads..." aria-label="Search downloads">
          <div class="filters" id="filters">
            ${["All", "Tools", "Mods", "Builds", "Other"].map(category =>
              `<button class="chip ${category === "All" ? "selected" : ""}"
                data-category="${category}">${category}</button>`
            ).join("")}
          </div>
        </div>

        <div class="results">
          <span id="result-count"></span>
          <span>THE GOOPYVR COLLECTION</span>
        </div>

        <div class="download-grid" id="results-grid"></div>
      </section>`;

    let activeCategory = "All";
    const search = document.getElementById("search");
    const grid = document.getElementById("results-grid");

    function update() {
      const query = search.value.trim().toLowerCase();

      const results = PROJECTS.filter(project => {
        const matchesCategory =
          activeCategory === "All" || project.category === activeCategory;

        const text = [
          project.title,
          project.category,
          project.description,
          project.version
        ].join(" ").toLowerCase();

        return matchesCategory && text.includes(query);
      });

      document.getElementById("result-count").textContent =
        `${results.length} ${results.length === 1 ? "download" : "downloads"}`;

      grid.innerHTML = results.length
        ? results.map(card).join("")
        : `<div class="empty">
             <h2>No drops found.</h2>
             <p>Try a different search or category.</p>
           </div>`;
    }

    search.addEventListener("input", update);

    document.getElementById("filters").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      activeCategory = button.dataset.category;

      document.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("selected", chip === button);
      });

      update();
    });

    update();
  }

  function renderProject() {
    const project = PROJECTS.find(p => p.id === requestedId);

    if (!project) {
      document.title = "Not found — GoopyVR";

      app.innerHTML = `
        <section class="listing wrap">
          <div class="eyebrow">404 / DROP NOT FOUND</div>
          <h1 class="page-title">Nothing <span class="red">here.</span></h1>
          <p class="page-description">
            This project doesn't exist. Head back to the library to find another.
          </p>
          <a class="button" href="?page=downloads">Browse downloads ↗</a>
        </section>`;
      return;
    }

    document.title = `${project.title} — GoopyVR`;

    const downloadURL = safeURL(project.download);

    app.innerHTML = `
      <section class="detail wrap">
        <a class="back" href="?page=downloads">← Back to all downloads</a>

        <div class="detail-layout">
          <div class="detail-art">
            <span>${icons[project.category] || "✦"}</span>
          </div>

          <div class="detail-copy">
            <div class="eyebrow">GOOPYVR DROP / ${escapeHTML(project.category)}</div>
            <h1>${escapeHTML(project.title)}</h1>
            <p class="detail-description">${escapeHTML(project.description)}</p>

            <div class="info-grid">
              <div><small>CATEGORY</small><strong>${escapeHTML(project.category)}</strong></div>
              <div><small>VERSION</small><strong>${escapeHTML(project.version)}</strong></div>
              <div><small>RELEASE</small><strong>${escapeHTML(project.date)}</strong></div>
            </div>

            <div class="detail-actions">
              ${downloadURL
                ? `<a class="button" href="${escapeHTML(downloadURL)}"
                     target="_blank" rel="noopener noreferrer">
                     ${escapeHTML(project.fileLabel || "Download")} ↓
                   </a>`
                : `<p>Download link not set yet.</p>`}
              <a class="button secondary" href="?page=downloads">More downloads</a>
            </div>

            <div class="notes">
              <h2>About this <span class="red">drop.</span></h2>
              <p>${escapeHTML(project.details || project.description)}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  if (page === "downloads") {
    renderDownloads();
  } else if (page === "project") {
    renderProject();
  } else {
    renderHome();
  }
})();
