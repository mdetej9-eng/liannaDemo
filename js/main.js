/* ============================================================
   Сайт-визитка — интерактив (меню, анимации, лайтбокс галереи)
   ============================================================ */
(function () {
  'use strict';

  /* ===== Header: фон при прокрутке ===== */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== Мобильное меню ===== */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    const toggleMenu = (open) => {
      nav.classList.toggle('nav--open', open);
      header.classList.toggle('header--menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('nav--open')));
    nav.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => toggleMenu(false))
    );
  }

  /* ===== Появление блоков при прокрутке ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (i % 4) * 90 + 'ms';
            entry.target.classList.add('reveal--visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('reveal--visible'));
  }

  /* ===== Лайтбокс галереи ===== */
  const items = Array.from(document.querySelectorAll('.gallery__item'));
  const lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  let current = 0;

  const show = (i) => {
    current = (i + items.length) % items.length;
    lbImg.src = items[current].dataset.full;
    lbImg.alt = items[current].querySelector('img').alt;
  };
  const open = (i) => {
    show(i);
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((item, i) =>
    item.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    })
  );
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();