/* ============================================================
   ALEEZA EJAZ — PORTFOLIO SCRIPTS
   ============================================================ */

// ── Nav hamburger ──────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Scroll-triggered animations ───────────────────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.gallery-item, .art-item').forEach(el => {
  el.style.animationPlayState = 'paused';
  fadeObserver.observe(el);
});


// ── Shared filter logic ────────────────────────────────────
// NOTE: work-list items are injected dynamically (see buildWorkList below),
// so this is (re)wired every time the list is rebuilt via wireFilterBar().
function wireFilterBar(bar) {
  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = bar.closest('section');
      if (!section) return;
      const items  = section.querySelectorAll('[data-tags]');
      const noRes  = section.querySelector('.no-results');
      const filter = btn.dataset.filter;

      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visible = 0;
      items.forEach(item => {
        const tags = (item.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        item.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
    });
  });
}

document.querySelectorAll('.filter-bar').forEach(wireFilterBar);


// ── Work page — category color mapping ─────────────────────
// Single source of truth: a project's `category` field drives every bit of
// color on the card automatically — the gradient background, the title
// highlight, and (in rotation) the tag chips. Add a 4th category later by
// adding one line here.
const CATEGORY_COLORS = {
  Cloud:  'blue',
  Wall:   'orange',
  Planet: 'pink',
};

function categoryColor(category) {
  return CATEGORY_COLORS[category] || 'purple';
}

function highlightedTitle(title, color) {
  return `<span class="work-title-highlight ${color}">&nbsp;${title}&nbsp;</span>`;
}

// Every tag on a card shares the card's own category color — same
// black-to-color gradient as the card background, just on a small pill.
function renderTags(tags, color) {
  return tags.map(t => `<span class="work-tag ${color}">${t}</span>`).join('');
}


// ── Work page — load data & render list ─────────────────────
const workListSection   = document.getElementById('work-list-section');
const workListEl        = document.getElementById('work-list');
const workDetailSection = document.getElementById('work-detail-section');
const workDetailContent = document.getElementById('work-detail-content');
const workBackBtn       = document.getElementById('work-back-btn');

let workProjects = [];

async function loadWorkData() {
  if (!workListEl) return; // not on the work page

  try {
    const res  = await fetch('work-data.json');
    const data = await res.json();
    workProjects = data.projects || [];
    buildWorkList();
  } catch (err) {
    console.error('Could not load work-data.json', err);
    // NOTE: fetch() can't read local JSON over file:// — if you're opening
    // work.html directly from disk, run a local server instead
    // (e.g. VS Code "Live Server", or `python3 -m http.server`).
  }
}

function buildWorkList() {
  workListEl.innerHTML = workProjects.map(p => {
    const color = categoryColor(p.category);
    return `
      <li class="work-entry ${color}" data-tags="${p.category}" data-entry="${p.id}">
        <div class="work-entry-info">
          <span class="work-entry-type">${p.type}</span>
          <h3 class="work-entry-title">${highlightedTitle(p.title, color)}</h3>
          <p class="work-entry-desc">${p.description}</p>
          <div class="work-entry-tags">${renderTags(p.tags, color)}</div>
        </div>
        <span class="work-entry-arrow" aria-hidden="true">→</span>
      </li>`;
  }).join('');

  workListEl.querySelectorAll('.work-entry').forEach(entry => {
    entry.addEventListener('click', () => buildWorkDetail(entry.dataset.entry));
  });

  // re-wire this section's filter bar now that items exist in the DOM
  const bar = workListSection && workListSection.querySelector('.filter-bar');
  if (bar) wireFilterBar(bar);
}

function buildWorkDetail(id) {
  const p = workProjects.find(proj => proj.id === id);
  if (!p || !workDetailContent) return;

  const color = categoryColor(p.category);

  workDetailContent.innerHTML = `
    <div class="work-detail-header ${color}">
      <span class="section-label">${p.type}</span>
      <h2 class="work-detail-title">${highlightedTitle(p.title, color)}</h2>
      <div class="work-detail-tags">${renderTags(p.tags, color)}</div>
    </div>
    <hr class="work-detail-divider">
    <div class="work-detail-body">
      ${p.sections.map(s => {
        if (s.type === 'outcome') {
          return `<div class="work-block">
            <div class="work-block-label ${color}">${s.label}</div>
            <div class="work-outcome-box"><p>${s.content}</p></div>
          </div>`;
        }
        let html = `<div class="work-block">
          <div class="work-block-label ${color}">${s.label}</div>
          <p class="work-block-text">${s.content}</p>`;
        if (s.code) {
          html += `<div class="code-block">
            <div class="code-label">${s.code.label}</div>
            <pre><code>${s.code.body.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
          </div>`;
        }
        html += `</div>`;
        return html;
      }).join('')}
      <div class="work-detail-links">
        ${(p.links || []).map(l =>
          `<a href="${l.href}" class="work-link${l.primary ? ' work-link--primary' : ''}" target="_blank" rel="noopener">${l.label}</a>`
        ).join('')}
      </div>
    </div>`;

  workListSection.style.display   = 'none';
  workDetailSection.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (workBackBtn) {
  workBackBtn.addEventListener('click', () => {
    workDetailSection.style.display = 'none';
    workListSection.style.display   = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

loadWorkData();


// ── Gallery page — load data & render art grid ──────────────
const artMasonry = document.getElementById('art-masonry');

async function loadGalleryData() {
  if (!artMasonry) return; // not on the gallery page

  try {
    const res  = await fetch('gallery-data.json');
    const data = await res.json();
    buildArtMasonry(data.art || []);
  } catch (err) {
    console.error('Could not load gallery-data.json', err);
    // fetch() needs a local server, not file:// — see script.js notes above.
  }
}

function buildArtMasonry(items) {
  artMasonry.innerHTML = items.map(a => `
    <figure class="art-item" data-tags="${a.tag}" tabindex="0">
      <img src="${a.src}" alt="${a.alt}" loading="lazy">
      <div class="art-item-overlay">
        <figcaption>
          <span class="art-item-title">${a.title}</span>
          <span class="art-item-meta">${a.meta}</span>
        </figcaption>
      </div>
    </figure>`).join('');

  artMasonry.querySelectorAll('.art-item').forEach(el => {
    el.style.animationPlayState = 'paused';
    fadeObserver.observe(el);
  });

  const bar = artMasonry.closest('section')?.querySelector('.filter-bar');
  if (bar) wireFilterBar(bar);
}

loadGalleryData();