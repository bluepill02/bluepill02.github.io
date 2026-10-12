/**
 * Vinusha Srithar Portfolio Application Logic
 * Interactive SEO Simulator, Skills Filter, Copy Handlers & Toast System
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSeoSimulator();
  initSkillsFilter();
  initCopyButtons();
  initContactForm();
});

/* -------------------------------------------------------------
 * 1. Navbar Scroll & Active State
 * ----------------------------------------------------------- */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Add glass background shadow on scroll
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let currentId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 2. Interactive SEO Audit Simulator
 * ----------------------------------------------------------- */
function initSeoSimulator() {
  const presetSelect = document.getElementById('sim-preset');
  const keywordInput = document.getElementById('sim-keyword');
  const toggles = document.querySelectorAll('.toggle-pill input[type="checkbox"]');
  
  // Output nodes
  const seoScoreEl = document.getElementById('sim-score-seo');
  const perfScoreEl = document.getElementById('sim-score-perf');
  const estTrafficEl = document.getElementById('sim-est-traffic');
  const estImprEl = document.getElementById('sim-est-impr');
  const lcpEl = document.getElementById('sim-lcp');
  const clsEl = document.getElementById('sim-cls');
  const aeoTextEl = document.getElementById('sim-aeo-text');

  const presets = {
    costsmart: {
      keyword: 'google solar savings calculator personal finance',
      toggles: {
        cwv: true,
        schema: true,
        aeo: true,
        caching: true,
        internal_links: true,
        backlinks: false
      }
    },
    vellichor: {
      keyword: 'dark romance book tropes review guide',
      toggles: {
        cwv: true,
        schema: true,
        aeo: true,
        caching: true,
        internal_links: true,
        backlinks: true
      }
    },
    segfault: {
      keyword: 'developer streetwear hoodie developer apparel',
      toggles: {
        cwv: true,
        schema: false,
        aeo: true,
        caching: true,
        internal_links: false,
        backlinks: false
      }
    }
  };

  function updateTogglesState() {
    toggles.forEach(toggle => {
      const parentPill = toggle.closest('.toggle-pill');
      if (toggle.checked) {
        parentPill.classList.add('checked');
      } else {
        parentPill.classList.remove('checked');
      }
    });
  }

  function calculateScores() {
    let seoBase = 58;
    let perfBase = 62;
    let trafficBase = 120;
    let impressionsBase = 800;
    let lcpBase = 3.4; // seconds
    let clsBase = 0.18;

    toggles.forEach(chk => {
      if (chk.checked) {
        switch (chk.dataset.factor) {
          case 'cwv':
            perfBase += 22;
            seoBase += 8;
            lcpBase -= 1.6;
            clsBase -= 0.12;
            break;
          case 'schema':
            seoBase += 12;
            impressionsBase += 1400;
            break;
          case 'aeo':
            seoBase += 9;
            trafficBase += 180;
            break;
          case 'caching':
            perfBase += 14;
            lcpBase -= 0.8;
            break;
          case 'internal_links':
            seoBase += 7;
            trafficBase += 90;
            impressionsBase += 600;
            break;
          case 'backlinks':
            seoBase += 6;
            trafficBase += 150;
            impressionsBase += 950;
            break;
        }
      }
    });

    // Clamp values
    const finalSeo = Math.min(100, Math.round(seoBase));
    const finalPerf = Math.min(100, Math.round(perfBase));
    const finalLcp = Math.max(0.6, lcpBase).toFixed(2);
    const finalCls = Math.max(0.01, clsBase).toFixed(3);
    const finalTraffic = trafficBase + (finalSeo * 3.5);
    const finalImpr = impressionsBase + (finalSeo * 24);

    // Animate display values
    if (seoScoreEl) seoScoreEl.textContent = finalSeo;
    if (perfScoreEl) perfScoreEl.textContent = finalPerf;
    if (estTrafficEl) estTrafficEl.textContent = `${Math.round(finalTraffic).toLocaleString()}/mo`;
    if (estImprEl) estImprEl.textContent = `${Math.round(finalImpr).toLocaleString()}/mo`;
    if (lcpEl) lcpEl.textContent = `${finalLcp}s`;
    if (clsEl) clsEl.textContent = finalCls;

    // Dynamic AEO Snippet guidance
    if (aeoTextEl) {
      const kw = keywordInput.value.trim() || 'high-intent target';
      if (finalSeo >= 95) {
        aeoTextEl.innerHTML = `<strong>AEO Direct Answer Ready:</strong> Entity-dense architecture and valid JSON-LD schema qualify "<em>${escapeHtml(kw)}</em>" for Google AI Overviews and Perplexity direct citation.`;
      } else if (finalSeo >= 80) {
        aeoTextEl.innerHTML = `<strong>Search Snippet Primed:</strong> Strong on-page signals for "<em>${escapeHtml(kw)}</em>". Implement FAQ Schema and speed caching to achieve top AI overview ranking.`;
      } else {
        aeoTextEl.innerHTML = `<strong>Audit Recommendation:</strong> Core Web Vitals and structured data optimizations required to prevent organic drop-off for "<em>${escapeHtml(kw)}</em>".`;
      }
    }
  }

  // Preset changer
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (presets[val]) {
        keywordInput.value = presets[val].keyword;
        toggles.forEach(chk => {
          chk.checked = !!presets[val].toggles[chk.dataset.factor];
        });
        updateTogglesState();
        calculateScores();
      }
    });
  }

  // Toggles click listener
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      updateTogglesState();
      calculateScores();
    });
  });

  // Keyword live typing
  if (keywordInput) {
    keywordInput.addEventListener('input', calculateScores);
  }

  // Initial calculation
  updateTogglesState();
  calculateScores();
}

/* -------------------------------------------------------------
 * 3. Skills Matrix Category Filter
 * ----------------------------------------------------------- */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 4. Copy to Clipboard & Toast System
 * ----------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast('Selection copied.');
      });
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* -------------------------------------------------------------
 * 5. Quick Inquiry Form
 * ----------------------------------------------------------- */
function initContactForm() {
  const templateSelect = document.getElementById('inquiry-template');
  const subjectInput = document.getElementById('inquiry-subject');
  const messageInput = document.getElementById('inquiry-message');
  const sendBtn = document.getElementById('inquiry-send-btn');

  const templates = {
    hire: {
      subject: "Opportunity: SEO Executive Role Discussion",
      message: "Hi Vinusha,\n\nI reviewed your portfolio and technical SEO case studies. We are looking for an SEO Executive / Web Growth Specialist to drive organic growth for our platform. We'd love to set up an introductory discussion."
    },
    audit: {
      subject: "Request: Technical SEO & Site Audit Consultation",
      message: "Hi Vinusha,\n\nWe have a web project and need an expert to audit our Core Web Vitals, organic search structure, and keyword architecture. Let's connect to discuss our goals."
    },
    chat: {
      subject: "Connecting with Vinusha Srithar",
      message: "Hi Vinusha,\n\nCame across your personal projects and Notion operating systems. Loved your work and would love to connect!"
    }
  };

  if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
      const choice = e.target.value;
      if (templates[choice]) {
        subjectInput.value = templates[choice].subject;
        messageInput.value = templates[choice].message;
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = encodeURIComponent(subjectInput.value || "Portfolio Inquiry - Vinusha Srithar");
      const body = encodeURIComponent(messageInput.value || "Hi Vinusha, I would like to connect with you.");
      const mailtoUrl = `mailto:smvinu69@gmail.com?subject=${subject}&body=${body}`;
      
      showToast("Opening email client...");
      window.location.href = mailtoUrl;
    });
  }
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}
