(function () {
  const track = document.getElementById("testimoniosTrack");
  const btnPrev = document.getElementById("testimonios-prev");
  const btnNext = document.getElementById("testimonios-next");
  const dotsBox = document.getElementById("testimoniosDots");

  if (!track || !btnPrev || !btnNext) return;

  const cards = Array.from(track.querySelectorAll(".testimonio-card"));
  let current = 0;

  function visibles() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  }

  function totalPasos() {
    return Math.ceil(cards.length / visibles());
  }

  function crearDots() {
    dotsBox.innerHTML = "";
    const n = totalPasos();
    for (let i = 0; i < n; i++) {
      const d = document.createElement("button");
      d.className =
        "testimonios__dot" + (i === current ? " testimonios__dot--activo" : "");
      d.setAttribute("aria-label", "Ir al testimonio " + (i * visibles() + 1));
      d.addEventListener("click", () => irA(i));
      dotsBox.appendChild(d);
    }
  }

  function irA(paso) {
    const max = totalPasos() - 1;
    current = Math.max(0, Math.min(paso, max));
    const idx = current * visibles();
    const card = cards[Math.min(idx, cards.length - 1)];
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
    actualizarUI();
  }

  function actualizarUI() {
    const max = totalPasos() - 1;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= max;
    const dots = dotsBox.querySelectorAll(".testimonios__dot");
    dots.forEach((d, i) =>
      d.classList.toggle("testimonios__dot--activo", i === current),
    );
  }

  /* ── Scroll táctil → sincronizar estado ── */
  let scrollTimer;
  track.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const gap = parseInt(getComputedStyle(track).gap) || 24;
        const cardW = cards[0].offsetWidth + gap;
        current = Math.round(track.scrollLeft / cardW / visibles());
        actualizarUI();
      }, 80);
    },
    { passive: true },
  );

  /* ── Drag-to-scroll ── */
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragMoved = false;
  let velX = 0;
  let lastX = 0;
  let lastT = 0;
  let rafId = null;

  track.addEventListener("mousedown", (e) => {
    if (e.target.closest("a, button")) return;

    // cancela cualquier inercia en curso
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    isDragging = true;
    dragMoved = false;
    velX = 0;
    startX = e.clientX;
    lastX = e.clientX;
    lastT = performance.now();
    startScrollLeft = track.scrollLeft;

    // desactiva snap para movimiento libre
    track.style.scrollSnapType = "none";
    track.classList.add("is-dragging");
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const now = performance.now();
    const dt = now - lastT || 1;
    velX = (e.clientX - lastX) / dt; // px/ms
    lastX = e.clientX;
    lastT = now;

    if (Math.abs(e.clientX - startX) > 3) dragMoved = true;
    track.scrollLeft = startScrollLeft - (e.clientX - startX);
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove("is-dragging");

    // inercia suave post-drag
    const friction = 0.92;
    let vel = -velX * 16; // convierte px/ms → px/frame aprox

    function applyInertia() {
      if (Math.abs(vel) < 0.5) {
        // inercia terminó → reactiva snap y sincroniza estado
        track.style.scrollSnapType = "";
        const gap = parseInt(getComputedStyle(track).gap) || 24;
        const cardW = cards[0].offsetWidth + gap;
        current = Math.round(track.scrollLeft / cardW / visibles());
        // snap nativo se encarga del ajuste fino
        actualizarUI();
        rafId = null;
        return;
      }
      track.scrollLeft += vel;
      vel *= friction;
      rafId = requestAnimationFrame(applyInertia);
    }

    rafId = requestAnimationFrame(applyInertia);
  });

  /* bloquea clicks si hubo drag */
  track.addEventListener(
    "click",
    (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  btnPrev.addEventListener("click", () => irA(current - 1));
  btnNext.addEventListener("click", () => irA(current + 1));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      crearDots();
      irA(0);
    }, 200);
  });

  crearDots();
  actualizarUI();
})();
