// Fixed-layer experiments page
(() => {
  const art = document.getElementById("exp-art");
  const list = document.getElementById("exp-list");
  const selector = document.getElementById("exp-selector");
  const items = Array.from(document.querySelectorAll(".exp-item"));

  if (!art || !list || !items.length) return;

  /* ---------- 1) Background swap (hover + active) ---------- */
  function setArt(url, subtle = false) {
    if (!url) return;
    // subtle parallax nudge on change
    art.style.opacity = ".85";
    if (subtle) art.style.transform = "scale(1.015)";
    art.style.backgroundImage = `url("${url}")`;
    // settle
    requestAnimationFrame(() => {
      setTimeout(() => {
        art.style.opacity = "1";
        art.style.transform = "scale(1)";
      }, 20);
    });
  }

  // Initial art from the first active item
  const initial = items.find(i => i.classList.contains("is-active")) || items[0];
  if (initial) setArt(initial.dataset.bg || "", false);

  // Hover updates background immediately
  items.forEach((el) => {
    el.addEventListener("mouseenter", () => setArt(el.dataset.bg || "", true));
  });

  /* ---------- 2) Active item based on scroll position ---------- */
  function updateActiveByScroll() {
    const viewTop = list.scrollTop;
    const viewMid = viewTop + list.clientHeight * 0.45; // prefer mid-of-viewport
    let closest = items[0];
    let bestDist = Infinity;

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elMid = rect.top + list.scrollTop + rect.height / 2;
      const d = Math.abs(elMid - viewMid);
      if (d < bestDist) { bestDist = d; closest = el; }
    });

    if (closest && !closest.classList.contains("is-active")) {
      items.forEach((i) => i.classList.remove("is-active"));
      closest.classList.add("is-active");
      setArt(closest.dataset.bg || "", true);
    }
  }
  list.addEventListener("scroll", () => {
    // throttle with rAF for smoothness
    if (updateActiveByScroll._busy) return;
    updateActiveByScroll._busy = true;
    requestAnimationFrame(() => {
      updateActiveByScroll();
      updateActiveByScroll._busy = false;
    });
  });

  

  /* ---------- 3) Mouse-follow selector on the menu layer ---------- */
  list.addEventListener("mousemove", (e) => {
    const rect = list.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    selector.style.transform = `translate(${x - 9}px, ${y - 9}px)`; // center 18px dot
  });
  list.addEventListener("mouseleave", () => {
    selector.style.transform = "translate(-100px, -100px)";
  });

  /* ---------- 4) Keyboard convenience: up/down to scroll the menu ---------- */
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      list.scrollBy({ top: list.clientHeight * 0.9, behavior: "smooth" });
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      list.scrollBy({ top: -list.clientHeight * 0.9, behavior: "smooth" });
    }
  });
})();


