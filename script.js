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
document.querySelectorAll('.filter-bar').forEach(bar => {
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
});


/* ── Wall — project data & modal ORIGINAL ────────────────────────────
const projects = {
  jeanbug: {
    type:      'Branding',
    status:    'wip',
    date:      'Started January 2026',
    title:     'Jean Bug',
    tools:     ['Figma', 'Illustrator', 'Procreate'],
    heroStyle: 'background: linear-gradient(135deg,#0d0620,#2d1060);',
    heroImg:   'media/design/jeanBug.png',
    sections: [
      {
        label:   'The Problem',
        content: `Sustainable fashion brands often struggle to feel <strong>approachable and fun</strong> without sacrificing credibility. Jean Bug needed an identity that felt both playful and trustworthy — something that could live comfortably on tags, packaging, and a future storefront without looking like every other eco-brand.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'Research',     body: 'Studied 12 sustainable fashion brands, mapping tone and visual language patterns to find a genuine gap.' },
          { n: '2', title: 'Sketching',    body: '30+ thumbnail explorations of the bug motif, tested across different wordmark combinations and scales.' },
          { n: '3', title: 'Refinement',   body: 'Narrowed to 3 directions and developed full color systems and type pairings for each.' },
          { n: '4', title: 'Application',  body: 'Currently mocking up on hang tags, tote bags, and a landing page template.' },
        ],
      },
      {
        label: 'Work in Progress',
        type:  'wip',
        date:  'Started January 2026',
        note:  'Currently finalising the color palette and type system. Landing page mockup coming next.',
      },
    ],
  },

  resourcecentral: {
    type:      'UI/UX',
    status:    'done',
    title:     'Resource Central',
    tools:     ['Figma', 'UX Research', 'Prototyping'],
    heroStyle: 'background: linear-gradient(135deg,#1a0800,#4d2000);',
    heroImg:   'media/design/resourceCentral_mockups.png',
    sections: [
      {
        label:   'The Problem',
        content: `NYIT students had <strong>no central, intuitive hub</strong> for campus resources — information was buried across 6+ different portals. The goal was a single, accessible interface for finding academic, wellness, and administrative resources without needing to know which portal held what.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'User Research',           body: 'Surveyed 20 students and ran 5 contextual interviews to map real pain points and mental models.' },
          { n: '2', title: 'Information Architecture', body: 'Restructured the entire resource taxonomy, then built low-fi wireframes to test the new structure quickly.' },
          { n: '3', title: 'Hi-Fi Prototype',          body: 'Built a high-fidelity Figma prototype with a full design system.' },
          { n: '4', title: 'Usability Testing',        body: 'Ran moderated usability tests with 8 participants; iterated across two rounds of findings.' },
        ],
      },
      {
        label:   'The Solution',
        content: `A clean, search-first dashboard with <strong>category filters, bookmarks, and a Quick Links tray</strong>. Usability testing showed a 40% reduction in time-to-resource compared to the existing portals — and a measurable increase in user confidence.`,
      },
    ],
  },

  portraitcolors: {
    type:      'Motion',
    status:    'done',
    title:     'Portrait Colors',
    tools:     ['After Effects', 'Procreate'],
    heroStyle: 'background: linear-gradient(135deg,#001220,#003560);',
    heroImg:   'media/design/Portrait_colors.jpg',
    sections: [
      {
        label:   'The Concept',
        content: `An exploration of how <strong>color relationships shift the emotional read of a portrait</strong>. The same composition was animated through four distinct palettes — warm, cool, analogous, and complementary — to isolate color as the variable.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'Illustration',    body: 'Drew the base portrait in Procreate, keeping the line work intentionally flat so color would carry the weight.' },
          { n: '2', title: 'Palette Research', body: 'Studied color theory references and built four distinct palette sets, testing each against the illustration.' },
          { n: '3', title: 'Animation',        body: 'Brought the portrait into After Effects and animated each palette transition using masked layers and color shift keyframes.' },
        ],
      },
      {
        label:   'Outcome',
        content: `A short looping animation demonstrating how dramatically color alone can shift mood, temperature, and perceived depth in portraiture — without changing a single line.`,
      },
    ],
  },

  portfolio: {
    type:      'UI/UX · Web',
    status:    'wip',
    date:      'Started March 2026',
    title:     'Portfolio Site',
    tools:     ['HTML', 'CSS', 'JavaScript'],
    heroStyle: 'background: linear-gradient(135deg,#100020,#300050);',
    heroImg:   'media/design/resourceCentral_mockups.png',
    sections: [
      {
        label:   'The Goal',
        content: `Design and build a portfolio that feels genuinely <strong>mine</strong> — playful but professional, animated but readable, technically solid. No templates, no frameworks, no shortcuts.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'Design System',  body: 'Established a custom CSS design token system — colors, spacing, type scale — before writing a single layout rule.' },
          { n: '2', title: 'Component Build', body: 'Built each section independently: nav, hero, intro, skills marquee, work strips, gallery, footer.' },
          { n: '3', title: 'Responsiveness',  body: 'Tested across mobile, tablet, and desktop at every stage rather than retrofitting at the end.' },
        ],
      },
      {
        label: 'Work in Progress',
        type:  'wip',
        date:  'Started March 2026',
        note:  'Wall, Cloud, and Gallery pages currently in development. Contact section coming next.',
      },
    ],
  },
};

const overlay    = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

function buildModal(key) {
  const p = projects[key];
  if (!p || !overlay) return;

  const heroEl = document.getElementById('modal-hero-img');
  heroEl.style.cssText = p.heroStyle;
  if (p.heroImg) {
    heroEl.style.backgroundImage    = `url('${p.heroImg}')`;
    heroEl.style.backgroundSize     = 'cover';
    heroEl.style.backgroundPosition = 'center';
  }

  document.getElementById('modal-type').textContent = p.type;
  const statusEl = document.getElementById('modal-status');
  if (p.status === 'wip') {
    statusEl.textContent = 'Work in Progress';
    statusEl.className   = 'modal-status modal-status--wip';
  } else {
    statusEl.textContent = 'Complete';
    statusEl.className   = 'modal-status modal-status--done';
  }

  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-tools').innerHTML   = p.tools
    .map(t => `<span class="tool-tag">${t}</span>`).join('');

  document.getElementById('modal-body').innerHTML = p.sections.map(s => {
    if (s.type === 'steps') {
      return `<div class="modal-section">
        <div class="modal-section-label">${s.label}</div>
        <ol class="process-steps">
          ${s.steps.map(step => `
            <li class="process-step">
              <div class="process-step-num">${step.n}</div>
              <div class="process-step-body"><strong>${step.title}</strong> — ${step.body}</div>
            </li>`).join('')}
        </ol>
      </div>`;
    }
    if (s.type === 'wip') {
      return `<div class="modal-section">
        <div class="modal-section-label">${s.label}</div>
        <div class="wip-box">
          <span class="wip-date">${s.date}</span>
          <p class="wip-note">${s.note}</p>
        </div>
      </div>`;
    }
    return `<div class="modal-section">
      <div class="modal-section-label">${s.label}</div>
      <p class="modal-section-text">${s.content}</p>
    </div>`;
  }).join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (modalClose) modalClose.focus();
}

function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.wall-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click',   () => buildModal(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') buildModal(card.dataset.project);
  });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (overlay)    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
*/

/* ============================================================
   WALL PAGE — CAROUSEL ADDITIONS
   ============================================================
   HOW TO INTEGRATE:
   Copy this entire file and paste it at the BOTTOM of your
   existing script.js, replacing only the section marked
   "Wall — project data & modal" (the `const projects = {...}`
   block and everything below it on the Wall page).

   The hamburger, scroll animations, and filter logic at the
   top of your script.js are unchanged — keep all of that.
   ============================================================ */


/* ── NEW: Slide image data ────────────────────────────────────
   Each project gets an array of slides. In the prototype these
   are gradient placeholders — swap `bg` for a real image path
   and add an <img> tag inside .carousel-slide-inner in
   buildCard() once you have your photos ready.

   TO ADD A REAL IMAGE:
     Replace the .slide-placeholder div in buildCard() with:
     <img src="${s.img}" alt="${s.label}" style="width:100%;height:100%;object-fit:cover;">
     and add an `img` key to each slide object below.
──────────────────────────────────────────────────────────────── */
const carouselSlides = {
  jeanbug: [
    { bg: 'linear-gradient(135deg,#1a0040,#4a20a0)', label: 'Logo explorations' },
    { bg: 'linear-gradient(135deg,#120030,#7040c0)', label: 'Color system'       },
    { bg: 'linear-gradient(135deg,#0d0020,#5030a0)', label: 'Type study'         },
    { bg: 'linear-gradient(135deg,#1e0050,#6040b0)', label: 'Packaging mockup'   },
  ],
  resourcecentral: [
    { img: 'media/design/resourceCentral_mockups.png', label: 'Final Product Screens'      },
    { bg: 'linear-gradient(135deg,#1a0800,#5c1a00)', label: 'Wireframes'         },
    { bg: 'linear-gradient(135deg,#3a1200,#8a3800)', label: 'Hi-fi prototype'    },
    { bg: 'linear-gradient(135deg,#0e0500,#4a1200)', label: 'Usability findings' },
  ],
  portraitcolors: [
    { bg: 'linear-gradient(135deg,#001830,#004080)', label: 'Base illustration'    },
    { bg: 'linear-gradient(135deg,#301000,#804000)', label: 'Warm palette'         },
    { bg: 'linear-gradient(135deg,#001828,#003870)', label: 'Cool palette'         },
    { bg: 'linear-gradient(135deg,#280020,#600050)', label: 'Complementary palette'},
  ],
  portfolio: [
    { bg: 'linear-gradient(135deg,#180030,#400070)', label: 'Design system'    },
    { bg: 'linear-gradient(135deg,#100020,#300060)', label: 'Component library'},
    { bg: 'linear-gradient(135deg,#200040,#500090)', label: 'Mobile views'     },
    { bg: 'linear-gradient(135deg,#0a0015,#280050)', label: 'Final prototype'  },
  ],
};


/* ── EXISTING (unchanged): projects data object ───────────────
   This is copied from your original script.js so the file
   is self-contained. You only need one copy — do not duplicate.
──────────────────────────────────────────────────────────────── */
const projects = {
  jeanbug: {
    type:      'Branding',
    status:    'wip',
    date:      'Started January 2026',
    title:     'Jean Bug',
    tools:     ['Figma', 'Illustrator', 'Procreate'],
    heroStyle: 'background: linear-gradient(135deg,#0d0620,#2d1060);',
    heroImg:   'media/design/jeanBug.png',
    sections: [
      {
        label:   'The Problem',
        content: `Sustainable fashion brands often struggle to feel <strong>approachable and fun</strong> without sacrificing credibility. Jean Bug needed an identity that felt both playful and trustworthy — something that could live comfortably on tags, packaging, and a future storefront without looking like every other eco-brand.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'Research',    body: 'Studied 12 sustainable fashion brands, mapping tone and visual language patterns to find a genuine gap.' },
          { n: '2', title: 'Sketching',   body: '30+ thumbnail explorations of the bug motif, tested across different wordmark combinations and scales.' },
          { n: '3', title: 'Refinement',  body: 'Narrowed to 3 directions and developed full color systems and type pairings for each.' },
          { n: '4', title: 'Application', body: 'Currently mocking up on hang tags, tote bags, and a landing page template.' },
        ],
      },
      {
        label: 'Work in Progress',
        type:  'wip',
        date:  'Started January 2026',
        note:  'Currently finalising the color palette and type system. Landing page mockup coming next.',
      },
    ],
  },

  resourcecentral: {
    type:      'UI/UX',
    status:    'done',
    title:     'Resource Central',
    tools:     ['HTML', 'Canva', 'Genially', 'UX Research','Prototyping'],
    heroStyle: 'background: linear-gradient(135deg,#1a0800,#4d2000);',
    heroImg:   'media/design/resourceCentral_mockups.png',
    sections: [
      {
        label:   'The Problem',
        content: `NYIT students had <strong>no central, intuitive hub</strong> for commuter resources — information was fragmented across portals. The goal was a single, accessible interface for finding academic, wellness, and administrative resources without needing to know which portal held what.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'User Research',           body: 'Reviewed analysis reports outlining interview data and findings to begin forming a solution.' },
          { n: '2', title: 'Proposal and Design', body: 'Worked with NYIT Academic Technology Services to propose the creation of a central resource hub. Began designing pages dedicated to each resource type.' },
          { n: '3', title: 'Hi-Fi Prototype',          body: 'Built a high-fidelity Canvas course with interactive elements and clearly sturctured data targeting user need and accesibility. ' },
          { n: '4', title: 'Final Product',        body: 'Ran moderated usability tests with various participants, updating the design based on feedback and publishing the final product for all NYIT students and staff to see.' },
        ],
      },
      {
        label:   'The Solution',
        content: `A clean, organized resource hub centralizing all commuter resources in one place. Students from all campuses now have a single destination for microtransit maps, subsidy information, and quick links to navigation aids.`,
      },
    ],
  },

  portraitcolors: {
    type:      'Motion',
    status:    'done',
    title:     'Portrait Colors',
    tools:     ['After Effects', 'Procreate'],
    heroStyle: 'background: linear-gradient(135deg,#001220,#003560);',
    heroImg:   'media/design/Portrait_colors.jpg',
    sections: [
      {
        label:   'The Concept',
        content: `An exploration of how <strong>color relationships shift the emotional read of a portrait</strong>. The same composition was animated through four distinct palettes — warm, cool, analogous, and complementary — to isolate color as the variable.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'Illustration',     body: 'Drew the base portrait in Procreate, keeping the line work intentionally flat so color would carry the weight.' },
          { n: '2', title: 'Palette Research', body: 'Studied color theory references and built four distinct palette sets, testing each against the illustration.' },
          { n: '3', title: 'Animation',        body: 'Brought the portrait into After Effects and animated each palette transition using masked layers and color shift keyframes.' },
        ],
      },
      {
        label:   'Outcome',
        content: `A short looping animation demonstrating how dramatically color alone can shift mood, temperature, and perceived depth in portraiture — without changing a single line.`,
      },
    ],
  },

  portfolio: {
    type:      'UI/UX · Web',
    status:    'wip',
    date:      'Started March 2026',
    title:     'Portfolio Site',
    tools:     ['HTML', 'CSS', 'JavaScript'],
    heroStyle: 'background: linear-gradient(135deg,#100020,#300050);',
    heroImg:   'media/design/resourceCentral_mockups.png',
    sections: [
      {
        label:   'The Goal',
        content: `Design and build a portfolio that feels genuinely <strong>mine</strong> — playful but professional, animated but readable, technically solid. No templates, no frameworks, no shortcuts.`,
      },
      {
        label: 'Process',
        type:  'steps',
        steps: [
          { n: '1', title: 'Design System',   body: 'Established a custom CSS design token system — colors, spacing, type scale — before writing a single layout rule.' },
          { n: '2', title: 'Component Build', body: 'Built each section independently: nav, hero, intro, skills marquee, work strips, gallery, footer.' },
          { n: '3', title: 'Responsiveness',  body: 'Tested across mobile, tablet, and desktop at every stage rather than retrofitting at the end.' },
        ],
      },
      {
        label: 'Work in Progress',
        type:  'wip',
        date:  'Started March 2026',
        note:  'Wall, Cloud, and Gallery pages currently in development. Contact section coming next.',
      },
    ],
  },
};


/* ── EXISTING (unchanged): modal open/close helpers ───────────
   Kept here for reference — your original versions work fine.
──────────────────────────────────────────────────────────────── */
const overlay    = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

function buildModal(key) {
  const p = projects[key];
  if (!p || !overlay) return;

  const heroEl = document.getElementById('modal-hero-img');
  heroEl.style.cssText = p.heroStyle;
  if (p.heroImg) {
    heroEl.style.backgroundImage    = `url('${p.heroImg}')`;
    heroEl.style.backgroundSize     = 'cover';
    heroEl.style.backgroundPosition = 'center';
  }

  document.getElementById('modal-type').textContent = p.type;
  const statusEl = document.getElementById('modal-status');
  if (p.status === 'wip') {
    statusEl.textContent = 'Work in Progress';
    statusEl.className   = 'modal-status modal-status--wip';
  } else {
    statusEl.textContent = 'Complete';
    statusEl.className   = 'modal-status modal-status--done';
  }

  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-tools').innerHTML   = p.tools
    .map(t => `<span class="tool-tag">${t}</span>`).join('');

  document.getElementById('modal-body').innerHTML = p.sections.map(s => {
    if (s.type === 'steps') {
      return `<div class="modal-section">
        <div class="modal-section-label">${s.label}</div>
        <ol class="process-steps">
          ${s.steps.map(step => `
            <li class="process-step">
              <div class="process-step-num">${step.n}</div>
              <div class="process-step-body"><strong>${step.title}</strong> — ${step.body}</div>
            </li>`).join('')}
        </ol>
      </div>`;
    }
    if (s.type === 'wip') {
      return `<div class="modal-section">
        <div class="modal-section-label">${s.label}</div>
        <div class="wip-box">
          <span class="wip-date">${s.date}</span>
          <p class="wip-note">${s.note}</p>
        </div>
      </div>`;
    }
    return `<div class="modal-section">
      <div class="modal-section-label">${s.label}</div>
      <p class="modal-section-text">${s.content}</p>
    </div>`;
  }).join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (modalClose) modalClose.focus();
}

function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (overlay)    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ── NEW: buildCard() — generates full card HTML ──────────────
   Called once per project to create the split carousel card.
   Previously your wall.html had static <article> tags;
   now all card HTML lives here so slide data stays in sync.

   TO ADD A NEW PROJECT:
     1. Add an entry to `projects` above (same shape as existing ones).
     2. Add an entry to `carouselSlides` above.
     3. Add a new object to the `wallProjects` array below.
   That's it — buildCard() handles the rest automatically.
──────────────────────────────────────────────────────────────── */

/* Order and tag metadata for the Wall grid */
const wallProjects = [
  { id: 'jeanbug',         tags: ['Branding']       },
  { id: 'resourcecentral', tags: ['UI/UX']           },
  { id: 'portraitcolors',  tags: ['Motion']          },
  { id: 'portfolio',       tags: ['UI/UX', 'Web']    },
];

function buildCard(entry) {
  const p      = projects[entry.id];
  const slides = carouselSlides[entry.id];
  if (!p || !slides) return '';

  const tagStr      = entry.tags.join(' ');
  const statusClass = p.status === 'wip' ? 'card-status--wip'  : 'card-status--done';
  const statusText  = p.status === 'wip' ? 'Work in Progress'  : 'Complete';

  /* ── Slide HTML ──
     Each slide is currently a gradient placeholder div.
     When you have real images, swap the .slide-placeholder div for:
       <img src="YOUR_IMAGE_PATH" alt="${s.label}"
            style="width:100%;height:100%;object-fit:cover;display:block;">
  ── */
  const slidesHTML = slides.map(s => `
    <div class="carousel-slide">
      <div class="carousel-slide-inner">
        <img src="${s.img}" alt="${s.label}" style="width:100%;height:100%;object-fit:cover;">
      </div>
    </div>`).join('');

  const dotsHTML = slides.map((_, i) =>
    `<div class="dot${i === 0 ? ' active' : ''}" data-dot="${i}"></div>`
  ).join('');

  return `
  <article class="wall-card" data-tags="${tagStr}" data-project="${entry.id}">

    <!-- NEW: carousel region -->
    <div class="card-carousel">
      <div class="carousel-track-wrap">
        <div class="carousel-track">${slidesHTML}</div>
      </div>

      <span class="card-status ${statusClass}">${statusText}</span>

      <button class="carousel-arrow arrow-prev" aria-label="Previous image">&#8249;</button>
      <button class="carousel-arrow arrow-next" aria-label="Next image">&#8250;</button>

      <div class="carousel-dots">${dotsHTML}</div>

      <div class="carousel-caption">
        <span class="caption-label">${slides[0].label}</span>
      </div>
    </div>
    <!-- /NEW: carousel region -->

    <!-- EXISTING: card body (class names match your original CSS) -->
    <div class="card-body">
      <div class="card-top-row">
        <div class="card-meta">
          <span class="card-type">${p.type}</span>
          <h3 class="card-title">${p.title}</h3>
        </div>
      </div>
      <p class="card-desc">${
        /* NEW: p.sections[0].content used as card blurb.
           Or replace with a dedicated short `desc` field on each project. */
        p.sections[0].content.replace(/<[^>]+>/g, '').slice(0, 100) + '…'
      }</p>
      <div class="card-bottom-row">
        <div class="card-tools">
          ${p.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}
        </div>
        <!-- NEW: inline CTA button (was a separate .work-cta link before) -->
        <button class="card-cta" data-project="${entry.id}">
          Read case study <span class="cta-arrow">→</span>
        </button>
      </div>
    </div>

  </article>`;
}


/* ── NEW: Render all cards into #wall-grid ────────────────────
   Runs once on page load. Previously the grid was static HTML.
──────────────────────────────────────────────────────────────── */
const wallGrid = document.getElementById('wall-grid');
if (wallGrid) {
  wallGrid.innerHTML = wallProjects.map(buildCard).join('');
}


/* ── NEW: initCarousel(card) — wires up one card's carousel ──
   Called for every rendered card after the grid is built.
──────────────────────────────────────────────────────────────── */
function initCarousel(card) {
  const id      = card.dataset.project;
  const slides  = carouselSlides[id];
  if (!slides) return;

  const track   = card.querySelector('.carousel-track');
  const dots    = card.querySelectorAll('.dot');
  const caption = card.querySelector('.caption-label');
  const prev    = card.querySelector('.arrow-prev');
  const next    = card.querySelector('.arrow-next');
  let idx = 0;

  function goTo(to) {
    idx = Math.max(0, Math.min(to, slides.length - 1));
    track.style.transform = `translateX(-${idx * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    caption.textContent = slides[idx].label;

    /* Dim arrows at the ends (no wrapping — feels cleaner for portfolio) */
    prev.classList.toggle('dimmed', idx === 0);
    next.classList.toggle('dimmed', idx === slides.length - 1);
  }

  prev.addEventListener('click', e => { e.stopPropagation(); goTo(idx - 1); });
  next.addEventListener('click', e => { e.stopPropagation(); goTo(idx + 1); });
  dots.forEach(d => d.addEventListener('click', e => {
    e.stopPropagation();
    goTo(Number(d.dataset.dot));
  }));

  /* Touch / swipe support */
  let touchStartX = null;
  const wrap = card.querySelector('.carousel-track-wrap');
  wrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? idx + 1 : idx - 1);
    touchStartX = null;
  });

  goTo(0); /* initialise */
}

/* Run initCarousel on every card */
if (wallGrid) {
  wallGrid.querySelectorAll('.wall-card').forEach(initCarousel);
}


/* ── NEW: Wire up "Read case study" buttons ───────────────────
   Delegated listener on the grid — opens the existing modal.
   Your old code attached listeners directly to .wall-card;
   this replaces that with a button-specific listener so clicks
   on the carousel don't accidentally open the modal.
──────────────────────────────────────────────────────────────── */
if (wallGrid) {
  wallGrid.addEventListener('click', e => {
    const btn = e.target.closest('.card-cta');
    if (btn) buildModal(btn.dataset.project);
  });
}


/* ── EXISTING (adapted): filter logic for the new grid ────────
   Same logic as your original, updated to target #wall-grid
   instead of .wall-grid, and to use .hidden instead of
   display:none so CSS transitions still fire correctly.
──────────────────────────────────────────────────────────────── */
const wallFilterBar = document.querySelector('.wall-section .filter-bar');
if (wallFilterBar) {
  wallFilterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wallFilterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter  = btn.dataset.filter;
      const cards   = wallGrid ? wallGrid.querySelectorAll('.wall-card') : [];
      const noRes   = document.getElementById('no-results');
      let visible   = 0;

      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
    });
  });
}

// ── Cloud — entry data & detail view ──────────────────────


const entries = {
  portfolio: {
    type:  'Web · JavaScript',
    title: 'Portfolio Website',
    tags:  ['HTML', 'CSS', 'JavaScript', '2026'],
    sections: [
      {
        label:   'Overview',
        content: `This portfolio was designed and built entirely from scratch — no templates, no frameworks. The goal was to create something that felt genuinely <strong>mine</strong>: playful but professional, animated but readable, and technically solid under the hood.`,
      },
      {
        label:   'The Challenge',
        content: `Most portfolio templates feel generic. I wanted the site to reflect my dual background in <strong>design and development</strong> — meaning the code itself needed to be as considered as the visuals. That meant building each component intentionally: no Bootstrap grid, no copy-paste CSS.`,
      },
      {
        label:   'Key Implementation',
        content: `The skills marquee uses a duplicated list and a CSS <code>@keyframes</code> animation so it loops infinitely without JavaScript. Edge fades are handled entirely with <code>mask-image</code>. The modal system on the Wall page is vanilla JS — no libraries.`,
        code: {
          label: 'style.css — marquee animation',
          body:
`.skills-track {
  animation: marquee 24s linear infinite;
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}`,
        },
      },
      {
        label:   'What I Learned',
        content: `Working without a framework forced me to deeply understand <strong>CSS layout fundamentals</strong> — especially how stacking contexts, <code>position: sticky</code>, and <code>clamp()</code> interact. I also hit cross-browser issues with <code>backdrop-filter</code> that taught me to test on Safari early.`,
      },
      {
        label:   'Outcome',
        type:    'outcome',
        content: 'A fully responsive, accessible portfolio site with custom animations, zero dependencies, and a clear design system — built and shipped for my 2026 job search.',
      },
    ],
    links: [
      { label: 'View on GitHub ↗', primary: true,  href: 'https://github.com/aleezaejaz' },
      { label: 'Live Site ↗',      primary: false, href: '#' },
    ],
  },

  dataanalysis: {
    type:  'Python · Data',
    title: 'Data Analysis Project',
    tags:  ['Python', 'Pandas', 'Matplotlib', '2025'],
    sections: [
      {
        label:   'Overview',
        content: `A class project exploring a real-world dataset using Python. The goal was to move from raw CSV data to <strong>clear, communicable findings</strong> through cleaning, analysis, and visualization.`,
      },
      {
        label:   'Approach',
        content: `Used Pandas for data cleaning and aggregation, then Matplotlib for charting. Prioritised readability over complexity — the audience was classmates, not data scientists.`,
      },
      {
        label:   'Key Code',
        content: 'Loading and summarising the dataset:',
        code: {
          label: 'analysis.py',
          body:
`import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv')
df.dropna(inplace=True)

summary = df.groupby('category')['value'].mean()
summary.plot(kind='bar', color='#8d79ff')
plt.tight_layout()
plt.savefig('output.png', dpi=150)`,
        },
      },
      {
        label:   'Outcome',
        type:    'outcome',
        content: 'A clean analysis with three data visualizations and a written interpretation. Submitted as part of a research methods course.',
      },
    ],
    links: [
      { label: 'View on GitHub ↗', primary: true, href: 'https://github.com/aleezaejaz' },
    ],
  },

  uxreport: {
    type:  'Documentation · UX',
    title: 'Resource Central — UX Report',
    tags:  ['UX Research', 'Figma', 'PDF', '2025'],
    sections: [
      {
        label:   'Overview',
        content: `A full UX research write-up documenting the end-to-end design process for Resource Central — from initial user interviews through to final prototype and usability test results.`,
      },
      {
        label:   'Contents',
        content: `The report covers: <strong>research methodology</strong>, interview transcripts and affinity mapping, information architecture decisions, wireframe progression (low to high fidelity), usability test protocol and findings, and final design rationale.`,
      },
      {
        label:   'Outcome',
        type:    'outcome',
        content: 'A 24-page documented research process that can stand alone as a portfolio artifact or be shared with employers as evidence of UX process thinking.',
      },
    ],
    links: [
      { label: 'Download PDF ↗', primary: true, href: '#' },
    ],
  },

  javaproject: {
    type:  'Java · OOP',
    title: 'Java Class Project',
    tags:  ['Java', 'OOP', 'GitHub', '2024'],
    sections: [
      {
        label:   'Overview',
        content: `An object-oriented Java application built for an intro to programming course. The project modelled a simple inventory system using core OOP principles: <strong>encapsulation, inheritance, and polymorphism</strong>.`,
      },
      {
        label:   'Structure',
        content: 'The application used a three-layer class hierarchy with a base <code>Item</code> class, extended by <code>PhysicalItem</code> and <code>DigitalItem</code>, each overriding a shared <code>display()</code> method.',
        code: {
          label: 'Item.java',
          body:
`public class Item {
  private String name;
  private double price;

  public Item(String name, double price) {
    this.name  = name;
    this.price = price;
  }

  public void display() {
    System.out.println(name + " — $" + price);
  }
}`,
        },
      },
      {
        label:   'Outcome',
        type:    'outcome',
        content: 'A working inventory management CLI application demonstrating foundational OOP concepts. Submitted with full Javadoc documentation.',
      },
    ],
    links: [
      { label: 'View on GitHub ↗', primary: true, href: 'https://github.com/aleezaejaz' },
    ],
  },
};

const cloudListSection   = document.getElementById('cloud-list-section');
const cloudDetailSection = document.getElementById('cloud-detail-section');
const cloudDetailContent = document.getElementById('cloud-detail-content');
const cloudBackBtn       = document.getElementById('cloud-back-btn');

function buildCloudDetail(key) {
  const e = entries[key];
  if (!e || !cloudDetailContent) return;

  cloudDetailContent.innerHTML = `
    <div class="cloud-detail-header">
      <span class="section-label">${e.type}</span>
      <h2 class="cloud-detail-title">${e.title}</h2>
      <div class="cloud-detail-tags">
        ${e.tags.map(t => `<span class="tool-tag">${t}</span>`).join('')}
      </div>
    </div>
    <hr class="cloud-detail-divider">
    <div class="cloud-detail-body">
      ${e.sections.map(s => {
        if (s.type === 'outcome') {
          return `<div class="cloud-section">
            <div class="cloud-section-label">${s.label}</div>
            <div class="cloud-outcome-box"><p>${s.content}</p></div>
          </div>`;
        }
        let html = `<div class="cloud-section">
          <div class="cloud-section-label">${s.label}</div>
          <p class="cloud-section-text">${s.content}</p>`;
        if (s.code) {
          html += `<div class="code-block">
            <div class="code-label">${s.code.label}</div>
            <pre><code>${s.code.body.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
          </div>`;
        }
        html += `</div>`;
        return html;
      }).join('')}
      <div class="cloud-detail-links">
        ${(e.links || []).map(l =>
          `<a href="${l.href}" class="cloud-link${l.primary ? ' cloud-link--primary' : ''}" target="_blank" rel="noopener">${l.label}</a>`
        ).join('')}
      </div>
    </div>`;

  cloudListSection.style.display   = 'none';
  cloudDetailSection.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.cloud-entry').forEach(entry => {
  entry.addEventListener('click', () => buildCloudDetail(entry.dataset.entry));
});

if (cloudBackBtn) {
  cloudBackBtn.addEventListener('click', () => {
    cloudDetailSection.style.display = 'none';
    cloudListSection.style.display   = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
