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
// highlight, and the tag chips. Add a 4th category later by adding one
// line here.
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


// ── Content file parser ──────────────────────────────────────
// Turns a plain .txt file into an array of section objects. The only
// syntax it understands:
//   ## Label             -> starts a new section (plain text)
//   ## Label {box}       -> sidebar box; one item per line
//   ## Label {box table} -> sidebar box; "Label: value" lines become a
//                           borderless two-column grid instead of plain lines
//   ## Label {outcome}   -> highlighted outcome box
//   ## Label {gallery}   -> image carousel; lines are "path | caption"
//   ## Label {image}     -> single embedded image; "path | caption"
//   blank line          -> paragraph break, preserved exactly as typed
//   **text**            -> bold
//   `text`              -> inline code
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function parseContentFile(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;

  lines.forEach(line => {
    // Brace content can now hold more than one word — e.g. "{box table}" —
    // so the first word is the section type and any remaining words are
    // modifiers (currently just "table").
    const header = line.match(/^##\s+(.+?)(?:\s*\{([^}]+)\})?\s*$/);
    if (header) {
      if (current) sections.push(current);
      const tokens = header[2] ? header[2].trim().split(/\s+/) : [];
      current = {
        label: header[1].trim(),
        type: tokens[0] || null,
        table: tokens.includes('table'),
        raw: [],
      };
    } else if (current) {
      current.raw.push(line);
    }
  });
  if (current) sections.push(current);

  return sections.map(s => {
    const body = s.raw.join('\n').trim();

    if (s.type === 'gallery' || s.type === 'image') {
      const images = body.split('\n').filter(Boolean).map(line => {
        const [src, caption] = line.split('|').map(x => x.trim());
        return { src, caption: caption || '' };
      });
      return { label: s.label, type: s.type, images };
    }

    if (s.type === 'box' && s.table) {
      // {box table} — "Label: value" lines become a borderless two-column grid.
      const items = body.split('\n').map(l => l.trim()).filter(Boolean).map(rawLine => {
        const line = rawLine.replace(/^[-+*]\s+/, ''); // strip an optional leading bullet marker
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
          return { label: line.slice(0, colonIndex).trim(), value: line.slice(colonIndex + 1).trim() };
        }
        return { label: null, value: line };
      });
      return { label: s.label, type: 'box', table: true, items };
    }

    if (s.type === 'box') {
      // Plain {box} — original behavior: one line per item, no table parsing.
      const items = body.split('\n').map(l => l.trim()).filter(Boolean);
      return { label: s.label, type: 'box', table: false, items };
    }

    const paragraphs = body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    return { label: s.label, type: s.type, paragraphs };
  });
}


// ── Content file section renderer ───────────────────────────
function renderSection(s, color) {
  if (s.type === 'image') {
    const img = s.images[0];
    if (!img) return '';
    return `<div class="work-block">
      <div class="work-block-label ${color}">${s.label}</div>
      <figure class="work-single-image">
        <img src="${img.src}" alt="${img.caption || s.label}" loading="lazy">
        ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
      </figure>
    </div>`;
  }

  if (s.type === 'gallery') {
    const slidesHTML = s.images.map(img => `
      <div class="carousel-slide">
        <div class="carousel-slide-inner">
          <img src="${img.src}" alt="${img.caption || s.label}" style="width:100%;height:100%;object-fit:cover;">
        </div>
      </div>`).join('');
    const dotsHTML = s.images.map((_, i) =>
      `<div class="dot${i === 0 ? ' active' : ''}" data-dot="${i}"></div>`
    ).join('');

    return `<div class="work-block">
      <div class="work-block-label ${color}">${s.label}</div>
      <div class="work-gallery card-carousel ${color}">
        <div class="carousel-image-area">
          <div class="carousel-track-wrap">
            <div class="carousel-track">${slidesHTML}</div>
          </div>
          <div class="carousel-dots">${dotsHTML}</div>
        </div>
        <div class="carousel-caption-bar">
          <button class="carousel-arrow arrow-prev" aria-label="Previous image">&#8249;</button>
          <span class="caption-label">${s.images[0].caption}</span>
          <button class="carousel-arrow arrow-next" aria-label="Next image">&#8250;</button>
        </div>
      </div>
    </div>`;
  }

  if (s.type === 'box' && s.table) {
    // Each label/value is its own grid cell (not wrapped in a per-row div),
    // so every row shares one set of column tracks and lines up with every
    // other row instead of each row sizing its own columns independently.
    const cells = s.items.map(item => {
      if (item.label) {
        return `<span class="work-sidebar-table-label">${formatInline(item.label)}</span><span class="work-sidebar-table-value">${formatInline(item.value)}</span>`;
      }
      return `<span class="work-sidebar-table-full">${formatInline(item.value)}</span>`;
    }).join('');

    return `<div class="work-sidebar-box ${color}">
      <div class="work-sidebar-box-label">${s.label}</div>
      <div class="work-sidebar-box-content work-sidebar-box-content--table">${cells}</div>
    </div>`;
  }

  if (s.type === 'box') {
    return `<div class="work-sidebar-box ${color}">
      <div class="work-sidebar-box-label">${s.label}</div>
      <div class="work-sidebar-box-content">${s.items.map(formatInline).join('<br>')}</div>
    </div>`;
  }

  const paras = s.paragraphs.map(p => `<p class="work-block-text">${formatInline(p)}</p>`).join('');
  const inner = s.type === 'outcome' ? `<div class="work-outcome-box">${paras}</div>` : paras;
  return `<div class="work-block">
    <div class="work-block-label ${color}">${s.label}</div>
    ${inner}
  </div>`;
}


// ── Gallery carousel wiring (generalized — works for any gallery,
//    not just a fixed Wall-page set) ─────────────────────────
function initGalleryCarousel(container, images, color) {
  const track   = container.querySelector('.carousel-track');
  const dots    = container.querySelectorAll('.dot');
  const caption = container.querySelector('.caption-label');
  const prev    = container.querySelector('.arrow-prev');
  const next    = container.querySelector('.arrow-next');
  const wrap    = container.querySelector('.carousel-track-wrap');
  let idx = 0;
  let didSwipe = false; // distinguishes a drag from a tap, so a swipe doesn't also open the lightbox

  function goTo(to) {
    idx = Math.max(0, Math.min(to, images.length - 1));
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    caption.textContent = images[idx].caption;
    prev.classList.toggle('dimmed', idx === 0);
    next.classList.toggle('dimmed', idx === images.length - 1);
  }

  prev.addEventListener('click', e => { e.stopPropagation(); goTo(idx - 1); });
  next.addEventListener('click', e => { e.stopPropagation(); goTo(idx + 1); });
  dots.forEach(d => d.addEventListener('click', e => {
    e.stopPropagation();
    goTo(Number(d.dataset.dot));
  }));

  let touchStartX = null;
  wrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    didSwipe = false;
  }, { passive: true });
  wrap.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? idx + 1 : idx - 1);
      didSwipe = true;
    }
    touchStartX = null;
  });

  // Tap/click the image to open it fullscreen — skipped if that tap
  // was actually a swipe that just changed slides.
  wrap.addEventListener('click', () => {
    if (didSwipe) { didSwipe = false; return; }
    openLightbox(images, idx, color);
  });

  goTo(0);
}


// ── Fullscreen image lightbox ────────────────────────────────
// One shared overlay, reused for whichever gallery opened it.
let lightboxImages = [];
let lightboxIndex  = 0;

function ensureLightbox() {
  if (document.getElementById('image-lightbox')) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'image-lightbox';
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-arrow lightbox-prev" aria-label="Previous image">&#8249;</button>
    <img class="lightbox-image" src="" alt="">
    <button class="lightbox-arrow lightbox-next" aria-label="Next image">&#8250;</button>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lightbox);

  const imgEl     = lightbox.querySelector('.lightbox-image');
  const captionEl = lightbox.querySelector('.lightbox-caption');

  function render() {
    const img = lightboxImages[lightboxIndex];
    imgEl.src = img.src;
    imgEl.alt = img.caption || '';
    captionEl.textContent = img.caption || '';
  }

  function show(delta) {
    lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;
    render();
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')    close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });

  let touchStartX = null;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) show(dx < 0 ? 1 : -1);
    touchStartX = null;
  });

  lightbox._render = render;
}

function openLightbox(images, startIndex, color) {
  ensureLightbox();
  lightboxImages = images;
  lightboxIndex  = startIndex;
  const lightbox = document.getElementById('image-lightbox');
  lightbox.className = `lightbox-overlay active ${color || ''}`.trim();
  lightbox._render();
  document.body.style.overflow = 'hidden';
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

async function buildWorkDetail(id) {
  const p = workProjects.find(proj => proj.id === id);
  if (!p || !workDetailContent) return;

  const color = categoryColor(p.category);

  let sections = [];
  try {
    const res = await fetch(p.contentFile);
    sections = parseContentFile(await res.text());
  } catch (err) {
    console.error(`Could not load ${p.contentFile}`, err);
    // Same file:// caveat as loadWorkData() — needs a local server.
  }

  const mainSections    = sections.filter(s => s.type !== 'box');
  const sidebarSections = sections.filter(s => s.type === 'box');

  const mainHTML    = mainSections.map(s => renderSection(s, color)).join('');
  const sidebarHTML = sidebarSections.map(s => renderSection(s, color)).join('');

  workDetailContent.innerHTML = `
    <div class="work-detail-header ${color}">
      <span class="section-label">${p.type}</span>
      <h2 class="work-detail-title">${highlightedTitle(p.title, color)}</h2>
      <div class="work-detail-tags">${renderTags(p.tags, color)}</div>
    </div>
    <hr class="work-detail-divider">
    <div class="work-detail-layout">
      <div class="work-detail-body">
        ${mainHTML}
        <div class="work-detail-links">
          ${(p.links || []).map(l =>
            `<a href="${l.href}" class="work-link${l.primary ? ' work-link--primary' : ''}" target="_blank" rel="noopener">${l.label}</a>`
          ).join('')}
        </div>
      </div>
      ${sidebarHTML ? `<aside class="work-detail-sidebar">${sidebarHTML}</aside>` : ''}
    </div>`;

  // Wire up any galleries that just got rendered
  workDetailContent.querySelectorAll('.work-gallery').forEach((el, i) => {
    const gallerySections = mainSections.filter(s => s.type === 'gallery');
    const section = gallerySections[i];
    if (section) initGalleryCarousel(el, section.images, color);
  });

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