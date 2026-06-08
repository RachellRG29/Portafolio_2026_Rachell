/*CERTIFICADOS — Sliders + Modal  */

(function () {
  "use strict";

  /* ── Estado global de drag ── */
  let dragSlider = null; // slider que se está arrastrando
  let dragStartX = 0;
  let dragScrollL = 0;

  /* ── Estado global del modal ── */
  const modal = document.getElementById("cert-modal");
  const mImg = modal?.querySelector(".cert-modal__img");
  const mCur = modal?.querySelector(".cert-modal__counter-cur");
  const mTot = modal?.querySelector(".cert-modal__counter-tot");

  let gallery = []; // [{src, alt}, ...]
  let gIdx = 0;
  let isOpen = false;

  /* =========================================================
     UTILIDADES
     ========================================================= */

  /** Scroll de un slider en la dirección dada (±1). Circular. */
  function scrollSlider(slider, dir) {
    const max = slider.scrollWidth - slider.clientWidth;
    const step = slider.clientWidth;
    let next;

    if (dir > 0) {
      next = slider.scrollLeft >= max - 10 ? 0 : slider.scrollLeft + step;
    } else {
      next = slider.scrollLeft <= 10 ? max : slider.scrollLeft - step;
    }
    slider.scrollTo({ left: next, behavior: "smooth" });
  }

  /** Muestra la imagen del modal en posición idx (circular). Sin setTimeout. */
  function showImage(idx) {
    gIdx = (idx + gallery.length) % gallery.length;
    mImg.src = gallery[gIdx].src;
    mImg.alt = gallery[gIdx].alt;
    mCur.textContent = gIdx + 1;
  }

  /** Abre el modal con las tarjetas del grupo y foco en la clickeada. */
  function openModal(cards, clickedCard) {
    gallery = cards.map((c) => ({
      src: c.dataset.modalSrc || "",
      alt: c.dataset.modalAlt || "",
    }));

    gIdx = cards.indexOf(clickedCard);
    if (gIdx < 0) gIdx = 0;

    mTot.textContent = gallery.length;
    modal.classList.toggle("solo", gallery.length <= 1);

    showImage(gIdx);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    isOpen = true;
    modal.querySelector(".cert-modal__close")?.focus();
  }

  /** Cierra el modal. */
  function closeModal() {
    if (!isOpen) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    isOpen = false;
    /* Limpiar src solo tras la animación CSS (300 ms) */
    setTimeout(() => {
      if (!isOpen) mImg.src = "";
    }, 340);
  }

  /* =========================================================
     DELEGACIÓN DE CLICS — un único listener en document
     Maneja: .scroll-cert  /  .cert-ver-btn  /  modal controls
     ========================================================= */
  document.addEventListener("click", (e) => {
    /* ── Botones ← → del slider ── */
    const scrollBtn = e.target.closest(".scroll-cert");
    if (scrollBtn) {
      const slider = document.getElementById(scrollBtn.dataset.target);
      if (slider) scrollSlider(slider, Number(scrollBtn.dataset.dir));
      return;
    }

    /* ── Botón "ver completo" de una tarjeta ── */
    const verBtn = e.target.closest(".cert-ver-btn");
    if (verBtn) {
      const card = verBtn.closest(".cert-card");
      const grupo = card?.closest(".cert-grupo");
      if (grupo) {
        const cards = Array.from(grupo.querySelectorAll(".cert-card"));
        openModal(cards, card);
      }
      return;
    }

    /* ── Cerrar: backdrop o botón X ── */
    if (
      e.target.closest(".cert-modal__backdrop") ||
      e.target.closest(".cert-modal__close")
    ) {
      closeModal();
      return;
    }

    /* ── Navegación prev / next del modal ── */
    if (e.target.closest(".cert-modal__nav--prev")) {
      showImage(gIdx - 1);
      return;
    }
    if (e.target.closest(".cert-modal__nav--next")) {
      showImage(gIdx + 1);
      return;
    }
  });

  /* =========================================================
     DRAG CON MOUSE — un único par de listeners en document
     ========================================================= */
  document.addEventListener(
    "mousedown",
    (e) => {
      const slider = e.target.closest(".cert-scroll");
      if (!slider) return;
      dragSlider = slider;
      dragStartX = e.clientX;
      dragScrollL = slider.scrollLeft;
      slider.classList.add("dragging");
      e.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener("mousemove", (e) => {
    if (!dragSlider) return;
    dragSlider.scrollLeft = dragScrollL - (e.clientX - dragStartX);
  });

  document.addEventListener("mouseup", () => {
    if (!dragSlider) return;
    dragSlider.classList.remove("dragging");
    dragSlider = null;
  });

  /* =========================================================
     TOUCH / SWIPE — sliders
     Un único listener en document, identifica el slider tocado
     ========================================================= */
  let touchSlider = null;
  let touchStartX = 0;
  let touchScrollL = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchSlider = e.target.closest(".cert-scroll");
      if (!touchSlider) return;
      touchStartX = e.touches[0].clientX;
      touchScrollL = touchSlider.scrollLeft;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!touchSlider) return;
      touchSlider.scrollLeft =
        touchScrollL - (e.touches[0].clientX - touchStartX);
    },
    { passive: true },
  );

  document.addEventListener(
    "touchend",
    () => {
      touchSlider = null;
    },
    { passive: true },
  );

  /* =========================================================
     SWIPE EN EL MODAL
     ========================================================= */
  let modalTouchX = 0;

  modal?.addEventListener(
    "touchstart",
    (e) => {
      modalTouchX = e.touches[0].clientX;
    },
    { passive: true },
  );

  modal?.addEventListener(
    "touchend",
    (e) => {
      if (!isOpen) return;
      const diff = modalTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 40) return;
      showImage(diff > 0 ? gIdx + 1 : gIdx - 1);
    },
    { passive: true },
  );

  /* =========================================================
     TECLADO
     ========================================================= */
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showImage(gIdx - 1);
    if (e.key === "ArrowRight") showImage(gIdx + 1);
  });

  /* =========================================================
     TRADUCCIÓN DE TÍTULOS DE GRUPO
     ========================================================= */
  function traducirTitulosGrupos(lang) {
    document.querySelectorAll(".titulo-grupo-cert").forEach((span) => {
      span.textContent = span.dataset[lang] || span.dataset.es || "";
    });
  }

  /* Exponer para que tu sistema i18n pueda llamarla */
  window.traducirTitulosGrupos = traducirTitulosGrupos;

  /* Inicializar al cargar */
  const initLang = document.documentElement.lang === "en" ? "en" : "es";
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => traducirTitulosGrupos(initLang),
      { once: true },
    );
  } else {
    traducirTitulosGrupos(initLang);
  }
})();
