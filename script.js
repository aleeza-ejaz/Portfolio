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


// ── Work — entry data & detail view ──────────────────────


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
