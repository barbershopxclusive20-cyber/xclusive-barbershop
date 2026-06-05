/* ═══════════════════════════════════════════════════
   XCLUSIVE BARBERSHOP — main.js
   CMS-driven: carga data/data.json antes de renderizar
═══════════════════════════════════════════════════ */

/* ─── applyContent: inyecta JSON en el DOM ────── */
function applyContent(d) {
  if (!d) return;

  /* NAV */
  const navLinks = document.getElementById('navLinks');
  if (navLinks && d.nav?.links) {
    navLinks.innerHTML = d.nav.links.map(l =>
      `<a class="nav__link" href="${l.href}">${l.label}</a>`
    ).join('');
  }
  setAttr('navCta',  'href', d.nav?.ctaHref);
  setText('navCta',  d.nav?.ctaLabel);
  setImg('navLogo',  d.nav?.logo, d.nav?.logoAlt);

  /* HERO */
  setText('heroTag',      d.hero?.tag);
  setText('heroSubtitle', d.hero?.subtitle);
  setAttr('heroCta1', 'href', d.hero?.cta1Href);
  setText('heroCta1', d.hero?.cta1Label);
  setAttr('heroCta2', 'href', d.hero?.cta2Href);
  setText('heroCta2', d.hero?.cta2Label);

  /* ABOUT */
  setText('aboutLabel',        d.about?.label);
  setText('aboutHeadingAccent',d.about?.headingAccent);
  setText('aboutBody1',        d.about?.body1);
  setText('aboutBody2',        d.about?.body2);
  setText('aboutCta',          d.about?.ctaLabel);
  setAttr('aboutCta', 'href',  d.about?.ctaHref);
  setImg('aboutImage', d.about?.image, d.about?.imageAlt);

  const statsEl = document.getElementById('aboutStats');
  if (statsEl && d.about?.stats) {
    statsEl.innerHTML = d.about.stats.map(s => `
      <div data-stagger-item>
        <div class="about__stat-num" data-counter="${s.value}">0+</div>
        <div class="about__stat-label">${s.label}</div>
      </div>`).join('');
  }

  /* SERVICES */
  const servicesList = document.getElementById('servicesList');
  if (servicesList && d.services) {
    servicesList.innerHTML = d.services.map((s, i) => `
      <div class="service-card" data-stagger-item>
        <div class="service-card__name">${s.name}</div>
        <p class="service-card__desc">${s.desc}</p>
        <div class="service-card__price">${s.price} <span>${s.priceNote || ''}</span></div>
      </div>`).join('');
  }

  /* PORTFOLIO */
  const portfolioGrid = document.getElementById('portfolioGrid');
  if (portfolioGrid && d.portfolio) {
    portfolioGrid.innerHTML = d.portfolio.map(p => `
      <div class="portfolio__item" data-stagger-item>
        <img src="${p.image}" alt="${p.alt}" loading="lazy" />
        <div class="portfolio__item-overlay"><span class="portfolio__item-tag">${p.tag}</span></div>
      </div>`).join('');
  }

  /* TEAM */
  const teamGrid = document.getElementById('teamGrid');
  if (teamGrid && d.team) {
    teamGrid.innerHTML = d.team.map(t => `
      <div class="team-card" data-stagger-item>
        <div class="team-card__image">
          <img src="${t.image}" alt="${t.name} — ${t.role}" loading="lazy" />
        </div>
        <div class="team-card__info">
          <div class="team-card__name">${t.name}</div>
          <div class="team-card__role">${t.role}</div>
        </div>
      </div>`).join('');
  }

  /* REVIEWS — dos filas, duplicadas para loop infinito */
  if (d.reviews) {
    const half = Math.ceil(d.reviews.length / 2);
    const row1 = d.reviews.slice(0, half);
    const row2 = d.reviews.slice(half);
    const cardHTML = r => `
      <div class="review-card">
        <div class="review-card__stars">★★★★★</div>
        <p class="review-card__text">"${r.text}"</p>
        <div class="review-card__author">${r.author}</div>
      </div>`;
    const t1 = document.getElementById('reviewsTrack1');
    const t2 = document.getElementById('reviewsTrack2');
    if (t1) t1.innerHTML = [...row1, ...row1].map(cardHTML).join('');
    if (t2) t2.innerHTML = [...row2, ...row2].map(cardHTML).join('');
  }

  /* GALLERY */
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack && d.gallery) {
    galleryTrack.innerHTML = d.gallery.map(g => `
      <div class="gallery__item">
        <img src="${g.image}" alt="${g.alt}" loading="lazy" />
      </div>`).join('');
  }

  /* PRICING */
  const pricingGrid = document.getElementById('pricingGrid');
  if (pricingGrid && d.pricing) {
    pricingGrid.innerHTML = d.pricing.map(p => `
      <div class="pricing-card${p.featured ? ' pricing-card--featured' : ''}" data-stagger-item>
        ${p.badge ? `<div class="pricing-card__badge">${p.badge}</div>` : ''}
        <div class="pricing-card__name">${p.name}</div>
        <div class="pricing-card__price"><sup>$</sup>${p.price}</div>
        <p class="pricing-card__desc">${p.desc}</p>
        <ul class="pricing-card__features">
          ${p.features.map(f => `<li class="pricing-card__feature">${f}</li>`).join('')}
        </ul>
        <a class="btn ${p.featured ? 'btn--primary' : 'btn--outline'}"
           href="${p.ctaHref}"
           style="width:100%;justify-content:center"
           ${p.featured ? 'data-magnetic' : ''}>
          ${p.ctaLabel}
        </a>
      </div>`).join('');
  }

  /* FAQ */
  const faqList = document.getElementById('faqList');
  if (faqList && d.faq) {
    faqList.innerHTML = d.faq.map(f => `
      <div class="faq-item" data-stagger-item>
        <button class="faq-item__trigger" aria-expanded="false">
          ${f.question}
          <span class="faq-item__icon" aria-hidden="true"></span>
        </button>
        <div class="faq-item__body" role="region">
          <div class="faq-item__inner">
            <p class="faq-item__text">${f.answer}</p>
          </div>
        </div>
      </div>`).join('');
  }

  /* BLOG */
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid && d.blog) {
    blogGrid.innerHTML = d.blog.map(b => `
      <article class="blog-card" data-stagger-item>
        <div class="blog-card__image">
          <img src="${b.image}" alt="${b.title}" loading="lazy" />
        </div>
        <div class="blog-card__content">
          <div class="blog-card__cat">${b.cat}</div>
          <h3 class="blog-card__title">${b.title}</h3>
          <p class="blog-card__excerpt">${b.excerpt}</p>
          <div class="blog-card__date">${b.date}</div>
        </div>
      </article>`).join('');
  }

  /* LOCATION */
  if (d.location) {
    const addrEl = document.getElementById('locationAddress');
    if (addrEl) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location.address)}`;
      addrEl.innerHTML = `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;text-underline-offset:3px">${d.location.address.replace(/\n/g, '<br>')}</a>`;
    }

    const phoneEl = document.getElementById('locationPhone');
    if (phoneEl) { phoneEl.textContent = d.location.phone; phoneEl.href = d.location.phoneHref; }

    const emailEl = document.getElementById('locationEmail');
    if (emailEl) { emailEl.textContent = d.location.email; emailEl.href = `mailto:${d.location.email}`; }

    setText('locationHours', d.location.hours);

    const mapEl = document.getElementById('locationMap');
    if (mapEl && d.location.mapEmbed) mapEl.src = d.location.mapEmbed;

    const ctaEl = document.getElementById('locationCta');
    if (ctaEl) {
      ctaEl.href = d.location.phoneHref;
      ctaEl.textContent = `Book Now — ${d.location.phone}`;
    }
  }

  /* FOOTER */
  setImg('footerLogo', d.footer?.logo, d.footer?.logoAlt);
  setText('footerDesc',      d.footer?.desc);
  setText('footerCopyright', d.footer?.copyright);

  const footerPhone = document.getElementById('footerPhone');
  if (footerPhone && d.location) {
    footerPhone.textContent = d.location.phone;
    footerPhone.href = d.location.phoneHref;
  }
  const footerEmail = document.getElementById('footerEmail');
  if (footerEmail && d.location) {
    footerEmail.textContent = 'Email Us';
    footerEmail.href = `mailto:${d.location.email}`;
  }

  const footerSocial = document.getElementById('footerSocial');
  if (footerSocial && d.footer?.social) {
    const icons = {
      instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
      facebook:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      tiktok:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
    };
    footerSocial.innerHTML = Object.entries(d.footer.social).map(([key, href]) =>
      `<a class="footer__social-link" href="${href}" aria-label="${key}">${icons[key] || ''}</a>`
    ).join('');
  }
}

/* ─── Helpers ─────────────────────────────────── */
function setText(id, val) {
  if (!val) return;
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setAttr(id, attr, val) {
  if (!val) return;
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}
function setImg(id, src, alt) {
  const el = document.getElementById(id);
  if (!el) return;
  if (src) el.src = src;
  if (alt) el.alt = alt;
}

/* ─── GSAP + Lenis core ───────────────────────── */
let lenis;
function initCore() {
  try {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch(e) {}
}

/* ─── Loader ──────────────────────────────────── */
function forceShowPage() {
  const loader = document.querySelector('.loader');
  if (loader) loader.style.display = 'none';
  document.body.style.overflow = '';
  try { initHero(); } catch(e) {}
}

function initLoader() {
  const loader      = document.querySelector('.loader');
  const loaderBar   = document.querySelector('.loader__bar');
  const loaderCount = document.querySelector('.loader__count');
  const fallback    = setTimeout(forceShowPage, 2500);

  if (!loader) { clearTimeout(fallback); forceShowPage(); return; }

  let progress = 0;
  const counter = setInterval(() => {
    progress += Math.random() * 22 + 8;
    if (progress >= 100) { progress = 100; clearInterval(counter); }
    if (loaderCount) loaderCount.textContent = Math.round(progress) + '%';
    if (loaderBar)   loaderBar.style.transform = `scaleX(${progress / 100})`;
    if (progress >= 100) setTimeout(hideLoader, 300);
  }, 80);

  function hideLoader() {
    clearTimeout(fallback);
    if (typeof gsap !== 'undefined') {
      gsap.to(loader, {
        yPercent: -100, duration: 0.8, ease: 'power3.inOut',
        onComplete: () => { loader.style.display = 'none'; document.body.style.overflow = ''; try { initHero(); } catch(e) {} }
      });
    } else {
      loader.style.display = 'none';
      document.body.style.overflow = '';
      try { initHero(); } catch(e) {}
    }
  }
}

/* ─── Nav ─────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav || typeof ScrollTrigger === 'undefined') return;
  ScrollTrigger.create({
    start: 80,
    onEnter:     () => nav.classList.add('is-scrolled'),
    onLeaveBack: () => nav.classList.remove('is-scrolled'),
  });
}

/* ─── Hero ────────────────────────────────────── */
function initHero() {
  const title    = document.querySelector('.hero__title');
  const sub      = document.querySelector('.hero__sub');
  const actions  = document.querySelector('.hero__actions');
  const scrollEl = document.querySelector('.hero__scroll');
  const pole     = document.querySelector('.barber-pole');

  if (title && typeof SplitType !== 'undefined') {
    const split = new SplitType(title, { types: 'chars,words' });
    gsap.to(split.chars, { y: 0, duration: 1.0, ease: 'power4.out', stagger: 0.035 });
  }
  if (pole) gsap.to(pole, { opacity: 0.9, duration: 1.2, ease: 'power3.out', delay: 0.6 });
  gsap.to([sub, actions, scrollEl], { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15, delay: 0.7 });
}

/* ─── Reveals ─────────────────────────────────── */
function initReveal() {
  if (typeof gsap === 'undefined') return;

  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.utils.toArray('[data-reveal-right]').forEach(el => {
    gsap.to(el, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.utils.toArray('[data-stagger]').forEach(group => {
    const items = group.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;
    gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 85%' } });
  });
}

/* ─── About counters ──────────────────────────── */
function initAbout() {
  const wrap = document.querySelector('.about__image-wrap');
  if (wrap) {
    gsap.to(wrap, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%' },
      onComplete: () => wrap.classList.add('is-revealed') });
  }
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    const obj = { val: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to(obj, { val: target, duration: 1.6, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; } });
      }
    });
  });
}

/* ─── Services 3D tilt ────────────────────────── */
function initServices() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });
}

/* ─── Gallery horizontal scroll ──────────────── */
function initGallery() {
  const track = document.querySelector('.gallery__track');
  if (!track) return;
  const totalWidth = track.scrollWidth - track.parentElement.offsetWidth;
  if (totalWidth <= 0) return;
  gsap.to(track, {
    x: -totalWidth, ease: 'none',
    scrollTrigger: {
      trigger: '.gallery', start: 'top top',
      end: () => `+=${totalWidth * 1.5}`,
      pin: true, scrub: 1.2, anticipatePin: 1,
    }
  });
}

/* ─── FAQ accordion ───────────────────────────── */
function initFaq() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.faq-item__trigger');
    if (!trigger) return;
    const item   = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach(o => o.classList.remove('is-open'));
    if (!isOpen) item.classList.add('is-open');
  });
}

/* ─── Cursor ──────────────────────────────────── */
function initCursor() {
  const dot     = document.querySelector('.cursor__dot');
  const ring    = document.querySelector('.cursor__ring');
  const cursorEl= document.querySelector('.cursor');
  if (!dot || !ring || typeof gsap === 'undefined') return;

  window.addEventListener('mousemove', (e) => {
    gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none' });
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power2.out' });
  });
  window.addEventListener('mousedown', () => cursorEl.classList.add('cursor--click'));
  window.addEventListener('mouseup',   () => cursorEl.classList.remove('cursor--click'));

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [data-magnetic], .service-card, .portfolio__item, .team-card, .blog-card, .faq-item__trigger')) {
      cursorEl.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, [data-magnetic], .service-card, .portfolio__item, .team-card, .blog-card, .faq-item__trigger')) {
      cursorEl.classList.remove('cursor--hover');
    }
  });

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - rect.left - rect.width/2) * 0.3, y: (e.clientY - rect.top - rect.height/2) * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
    });
  });
}

/* ─── Nav mobile ──────────────────────────────── */
function initNavMobile() {
  const hamburger = document.querySelector('.nav__hamburger');
  const links     = document.getElementById('navLinks');
  if (!hamburger || !links) return;
  let open = false;
  hamburger.addEventListener('click', () => {
    open = !open;
    Object.assign(links.style, open ? {
      display: 'flex', flexDirection: 'column', position: 'fixed',
      top: 'var(--nav-height)', left: '0', right: '0',
      background: 'rgba(10,10,15,0.97)', padding: '2rem var(--space-inline)',
      gap: '1.5rem', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-border)', zIndex: '799'
    } : { display: 'none' });
  });
}

/* ─── Boot ────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  document.body.style.overflow = 'hidden';

  /* Cargar JSON del CMS */
  const data = await Promise.race([
    fetch('data/data.json').then(r => r.json()),
    new Promise(resolve => setTimeout(() => resolve(null), 3000))
  ]).catch(() => null);

  /* Inyectar contenido antes de arrancar animaciones */
  applyContent(data);

  /* Esperar a que los CDNs estén listos */
  function boot() {
    initCore();
    initCursor();
    initLoader();
    initNav();
    initNavMobile();
    initFaq();
    setTimeout(() => {
      initAbout();
      initServices();
      initGallery();
      initReveal();
    }, 200);
  }

  if (typeof gsap !== 'undefined' && typeof Lenis !== 'undefined') {
    boot();
  } else {
    window.addEventListener('load', boot);
  }

  /* ─── Contact Form ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      }).catch(() => null);

      if (res && res.ok) {
        btn.textContent = 'Message Sent ✓';
        contactForm.reset();
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
      } else {
        btn.textContent = 'Error — Try Again';
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
      }
    });
  }
});
