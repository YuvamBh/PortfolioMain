// Site motion: Lenis smooth scroll + GSAP ScrollTrigger.
// Content is fully visible without this script; with reduced motion nothing animates.
// Section reveals replay each time a section comes back into view.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

declare global {
  interface Window { __motionReady?: boolean; __lenis?: Lenis }
}

const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wrap each word in a span so it can animate on its own. Words stay readable to screen readers.
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return Array.from(el.querySelectorAll<HTMLElement>('.split-word > span'));
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const outer = document.createElement('span'); outer.className = 'split-word';
          const inner = document.createElement('span'); inner.textContent = p;
          outer.appendChild(inner); frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as HTMLElement).matches('.sr-only')) {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.splitDone = '1';
  return Array.from(el.querySelectorAll<HTMLElement>('.split-word > span'));
}

// Letters, for the hero name. The heading keeps its full text as its accessible name.
function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text.trim());
  const holder = document.createElement('span'); holder.setAttribute('aria-hidden', 'true');
  text.split(/(\s+)/).forEach((w) => {
    if (!w) return;
    if (/^\s+$/.test(w)) { holder.appendChild(document.createTextNode(' ')); return; }
    const word = document.createElement('span'); word.className = 'split-word'; word.style.whiteSpace = 'nowrap';
    [...w].forEach((ch) => { const c = document.createElement('span'); c.className = 'split-char'; c.textContent = ch; word.appendChild(c); });
    holder.appendChild(word);
  });
  el.replaceChildren(holder);
  return Array.from(el.querySelectorAll<HTMLElement>('.split-char'));
}

// The dissolve used by the hero's rotating line: words come into focus from a soft blur.
const dissolveIn = (words: Element[]) =>
  gsap.fromTo(words, { opacity: 0, y: 10, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.035 });
const dissolveOut = (words: Element[]) =>
  gsap.to(words, { opacity: 0, y: -6, filter: 'blur(6px)', duration: 0.38, ease: 'power2.in', stagger: 0.012 });

// The hero's rotating highlights: one line at a time, dissolving into the next. Pauses on hover,
// focus or the pause button (auto-rotating text must be pausable).
function cycleLines() {
  const el = document.querySelector<HTMLElement>('[data-cycle]');
  const box = document.querySelector<HTMLElement>('[data-cycle-box]');
  const ctrl = document.querySelector<HTMLElement>('[data-cycle-ctrl]');
  const pauseBtn = document.querySelector<HTMLButtonElement>('[data-cycle-pause]');
  if (!el || !box) return;
  const lines: string[] = JSON.parse(el.dataset.lines || '[]');
  if (lines.length < 2) return;
  const dashes = Array.from(ctrl?.querySelectorAll('i') ?? []);
  if (ctrl) ctrl.hidden = false;
  let i = 0; let hovering = false; let stopped = false; let busy = false;
  const show = (k: number) => {
    busy = true;
    dissolveOut(Array.from(el.querySelectorAll('.split-word > span'))).eventCallback('onComplete', () => {
      el.textContent = lines[k];
      el.dataset.splitDone = '';
      dissolveIn(splitWords(el)).eventCallback('onComplete', () => { busy = false; });
      dashes.forEach((d, n) => d.classList.toggle('on', n === k));
    });
  };
  splitWords(el);
  setInterval(() => {
    if (document.hidden || hovering || stopped || busy) return;
    i = (i + 1) % lines.length; show(i);
  }, 4800);
  box.addEventListener('mouseenter', () => { hovering = true; });
  box.addEventListener('mouseleave', () => { hovering = false; });
  box.addEventListener('focusin', () => { hovering = true; });
  box.addEventListener('focusout', () => { hovering = false; });
  pauseBtn?.addEventListener('click', () => {
    stopped = !stopped;
    pauseBtn.setAttribute('aria-pressed', String(stopped));
    pauseBtn.setAttribute('aria-label', stopped ? 'Play the rotating highlights' : 'Pause the rotating highlights');
  });
}

// Plays an entrance each time the element comes into view, from above or below. It resets only once the
// element is completely off screen, so the reset is never seen.
function onView(el: Element, play: () => void, reset: () => void) {
  reset();
  ScrollTrigger.create({ trigger: el, start: 'top 88%', end: 'bottom 12%', onEnter: play, onEnterBack: play });
  ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onLeave: reset, onLeaveBack: reset });
}

// The hero's role line, written like a code comment: it deletes and retypes between the phrases.
function typeRoles() {
  const el = document.querySelector<HTMLElement>('[data-typed]');
  if (!el) return;
  const words: string[] = JSON.parse(el.dataset.words || '[]');
  if (words.length < 2) return;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let w = 0; let text = words[0];
  (async () => {
    await sleep(1600);
    for (;;) {
      if (document.hidden) { await sleep(600); continue; }
      while (text.length) { text = text.slice(0, -1); el.textContent = text; await sleep(26); }
      await sleep(180);
      w = (w + 1) % words.length;
      const next = words[w];
      for (let i = 1; i <= next.length; i++) { text = next.slice(0, i); el.textContent = text; await sleep(52 + Math.random() * 30); }
      await sleep(2100);
    }
  })();
}

function init() {
  if (reduce) {
    const typed = document.querySelector<HTMLElement>('[data-typed]');
    if (typed) typed.textContent = 'product · full-stack · ai & machine learning';
    window.__motionReady = true; return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Smooth wheel scrolling; touch keeps native momentum.
  const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page links glide to their section.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector<HTMLElement>(url.hash);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    history.pushState(null, '', url.hash);
    target.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), 900);
  });

  // Hero entrance (once): the name dissolves in letter by letter, then the rest fades up.
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    const title = hero.querySelector<HTMLElement>('[data-hero-title]');
    const chars = title ? splitChars(title) : [];
    gsap.set(chars, { opacity: 0, filter: 'blur(10px)' });
    if (title) gsap.set(title, { opacity: 1 });
    const fades = hero.querySelectorAll('[data-hero-fade]');
    gsap.set(fades, { opacity: 0, y: 18 });
    gsap.timeline({ delay: 0.15 })
      .to(chars, { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out', stagger: 0.04 })
      .to(fades, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, '-=0.5')
      .add(() => { cycleLines(); typeRoles(); });
    const orb = hero.querySelector('[data-orb]');
    if (orb) gsap.to(orb, { xPercent: 10, yPercent: -6, scale: 1.06, duration: 10, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(hero.querySelector('[data-hero-inner]'), {
      yPercent: -10, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  const mm = gsap.matchMedia();
  // Everything below is tied to the scroll position itself, so it plays forward on the way down and
  // runs back on the way up, at exactly the speed of the scroll (no pop-in, no resets).

  // Section headings: letters rise out of a soft blur each time the heading comes into view.
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const chars = splitChars(el);
    gsap.set(el, { opacity: 1 });
    onView(el,
      () => gsap.to(chars, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, ease: 'expo.out', stagger: 0.016, overwrite: true }),
      () => gsap.set(chars, { yPercent: 55, opacity: 0, filter: 'blur(8px)', overwrite: true }));
  });

  // Project cards rise in, a beat apart across each row; replayed on every return.
  document.querySelectorAll<HTMLElement>('[data-card]').forEach((card, i) => {
    const delay = [0, 0.1, 0, 0.08, 0.16][i % 5];
    onView(card,
      () => gsap.to(card, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay, overwrite: true }),
      () => gsap.set(card, { y: 48, opacity: 0, overwrite: true }));
  });

  // Experience rows: the card slides in from its side, the picture opens outward from the spine, the
  // node pops. Replayed on every return, like the headings.
  document.querySelectorAll<HTMLElement>('[data-xp]').forEach((row) => {
    const card = row.querySelector('[data-xp-card]');
    const pic = row.querySelector('[data-xp-pic]');
    const img = row.querySelector('[data-xp-pic] img');
    const node = row.querySelector('[data-xp-node]');
    const right = row.classList.contains('is-right');
    const narrow = () => window.innerWidth <= 860;
    onView(row,
      () => {
        if (card) gsap.to(card, { x: 0, y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', overwrite: true });
        if (pic) gsap.to(pic, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', delay: 0.08, overwrite: true });
        if (img) gsap.to(img, { scale: 1, duration: 1.5, ease: 'expo.out', overwrite: true });
        if (node) gsap.to(node, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', delay: 0.15, overwrite: true });
      },
      () => {
        if (card) gsap.set(card, narrow() ? { x: 0, y: 30, opacity: 0 } : { x: right ? 70 : -70, y: 0, opacity: 0 });
        if (pic) gsap.set(pic, { clipPath: narrow() ? 'inset(0% 0% 100% 0%)' : right ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' });
        if (img) gsap.set(img, { scale: 1.12 });
        if (node) gsap.set(node, { scale: 0 });
      });
  });

  // Fade-ups.
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 78%', scrub: 0.5 },
    });
  });

  // Statement: each word brightens as you scroll through it.
  document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.12, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: true },
    });
  });

  // Numbers count with the scroll.
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count); const obj = { v: 0 };
    const fmt = () => { el.textContent = Number.isInteger(to) ? Math.round(obj.v).toString() : obj.v.toFixed(1); };
    gsap.fromTo(obj, { v: 0 }, {
      v: to, ease: 'power1.out', onUpdate: fmt,
      scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 62%', scrub: 0.6 },
    });
  });

  // Photo wipes up with the scroll. The trigger is its container, since the photo itself is sticky.
  document.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top 88%', end: 'top 40%', scrub: 0.6 },
    });
  });

  mm.add('(min-width: 1024px)', () => {
    // Project screenshots drift slightly inside their frames as the page scrolls.
    document.querySelectorAll<HTMLElement>('[data-card-img]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('[data-card]'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // Gentle parallax on large screens only.
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amt = Number(el.dataset.parallax || 8);
      gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // Experience timeline line draws as you scroll.
    document.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
      gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: true } });
    });
  });

  // Recalculate every trigger whenever the page changes height (tabs, the projects index, images,
  // fonts, live reload), so no reveal waits at a position that no longer exists.
  let refreshTimer = 0;
  const ro = new ResizeObserver(() => { clearTimeout(refreshTimer); refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120); });
  ro.observe(document.body);
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__motionReady = true;
}

init();
