/* projects.js
   Projects page with full-bleed background + centered slides.
   - Scroll anywhere; each slide == panel height.
   - Background crossfades per slide.
   - Buttons live inside the same slide and remain clickable.
*/
(() => {
  const list = document.getElementById('list');
  const frame = document.getElementById('frame');
  const bgA  = document.getElementById('bgA');
  const bgB  = document.getElementById('bgB');
  if (!list || !frame || !bgA || !bgB) return;

  const items = Array.from(list.querySelectorAll('.proj-item'));

  function sizeSlides() {
    const h = list.clientHeight;
    items.forEach(el => { el.style.height = h + 'px'; });
    const idx = Math.round(list.scrollTop / h);
    items[idx]?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  const ro = new ResizeObserver(sizeSlides);
  ro.observe(list);
  requestAnimationFrame(sizeSlides);
  list.style.scrollSnapStop = 'always';

  /* 2) Route wheel from anywhere to the list (page itself doesn’t scroll) */
  const wheelToList = (e) => {
    e.preventDefault();
    list.scrollBy({ top: e.deltaY, behavior: 'auto' });
  };
  window.addEventListener('wheel', wheelToList, { passive: false });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      list.scrollBy({ top: list.clientHeight, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      list.scrollBy({ top: -list.clientHeight, behavior: 'smooth' });
    }
  });

  let showingA = true;
  function setBackground(url) {
    if (!url) return;
    const next = showingA ? bgB : bgA;
    const curr = showingA ? bgA : bgB;

    const img = new Image();
    img.onload = () => {
      next.style.backgroundImage = `url("${url}")`;
      next.classList.add('is-show');
      curr.classList.remove('is-show');
      showingA = !showingA;
    };
    img.src = url;
  }

  // Initialize background from the first item
  const first = items[0];
  if (first) {
    const url = first.getAttribute('data-bg') || '';
    bgA.style.backgroundImage = `url("${url}")`;
    bgA.classList.add('is-show');
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        items.forEach(i => i.classList.remove('is-active'));
        el.classList.add('is-active');
        setBackground(el.getAttribute('data-bg'));
      }
    });
  }, { root: list, threshold: [0.6] });
  items.forEach(el => io.observe(el));

  let scrollTimer = null;
  list.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const h = list.clientHeight;
      const maxTop = (items.length - 1) * h;
      if (list.scrollTop > maxTop) {
        list.scrollTo({ top: maxTop, behavior: 'auto' });
      } else {
        const idx = Math.round(list.scrollTop / h);
        items[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 90);
  });

})();