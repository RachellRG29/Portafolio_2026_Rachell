/* CERTIFICADOS — Sliders + Modal
   Sin dependencia de Phosphor. Iconos vía CSS (ver certificados.css).
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  /* ── Referencias al modal ── */
  const modal = document.getElementById("cert-modal");
  if (!modal) return; // guard: si el HTML no está aún, salir

  const mImg = modal.querySelector(".cert-modal__img");
  const mCur = modal.querySelector(".cert-modal__counter-cur");
  const mTot = modal.querySelector(".cert-modal__counter-tot");
  const mBackdrop = modal.querySelector(".cert-modal__backdrop");
  const mClose = modal.querySelector(".cert-modal__close");
  const mPrev = modal.querySelector(".cert-modal__nav--prev");
  const mNext = modal.querySelector(".cert-modal__nav--next");

  /* ── Estado del modal ── */
  let gallery = []; // [{ src, alt }, …]
  let gIdx = 0;
  let isOpen = false;

  /* ── Estado drag (mouse) ── */
  let dragSlider = null;
  let dragStartX = 0;
  let dragScrollL = 0;

  /* ── Estado swipe (touch sliders) ── */
  let touchSlider = null;
  let touchStartX = 0;
  let touchScrollL = 0;

  /* ── Estado swipe (touch modal) ── */
  let modalTouchX = 0;

  /* ==========================================================
     SCROLL DEL SLIDER — circular
     ========================================================== */
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

  /* ==========================================================
     MODAL — mostrar imagen
     ========================================================== */
  function showImage(idx) {
    gIdx = (idx + gallery.length) % gallery.length;
    mImg.src = gallery[gIdx].src;
    mImg.alt = gallery[gIdx].alt;
    mCur.textContent = gIdx + 1;
  }

  /* ==========================================================
     MODAL — abrir
     ========================================================== */
  function openModal(cards, clickedCard) {
    gallery = cards.map((c) => ({
      src: c.dataset.modalSrc || "",
      alt: c.dataset.modalAlt || "",
    }));

    gIdx = cards.indexOf(clickedCard);
    if (gIdx < 0) gIdx = 0;

    mTot.textContent = gallery.length;

    /* Ocultar flechas cuando solo hay 1 imagen */
    const solo = gallery.length <= 1;
    modal.classList.toggle("solo", solo);
    mPrev.hidden = solo;
    mNext.hidden = solo;

    showImage(gIdx);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    isOpen = true;
    mClose.focus();
  }

  /* ==========================================================
     MODAL — cerrar
     ========================================================== */
  function closeModal() {
    if (!isOpen) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    isOpen = false;
    /* Limpiar src solo después de la transición CSS */
    setTimeout(() => {
      if (!isOpen) mImg.src = "";
    }, 340);
  }

  /* ==========================================================
     DELEGACIÓN DE CLICS
     ========================================================== */
  document.addEventListener("click", (e) => {
    /* Botones ← → del slider */
    const scrollBtn = e.target.closest(".scroll-cert");
    if (scrollBtn) {
      const slider = document.getElementById(scrollBtn.dataset.target);
      if (slider) scrollSlider(slider, Number(scrollBtn.dataset.dir));
      return;
    }

    /* Botón "ver completo" */
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

    /* Click en la imagen del modal también abre nada nuevo,
       pero permite cerrar si se hace clic fuera del box */
    if (e.target === mBackdrop || e.target.closest(".cert-modal__close")) {
      closeModal();
      return;
    }

    /* Nav del modal */
    if (e.target.closest(".cert-modal__nav--prev")) {
      showImage(gIdx - 1);
      return;
    }
    if (e.target.closest(".cert-modal__nav--next")) {
      showImage(gIdx + 1);
      return;
    }
  });

  /* ==========================================================
     DRAG CON MOUSE
     ========================================================== */
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

  /* ==========================================================
     TOUCH — sliders
     ========================================================== */
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

  /* ==========================================================
     TOUCH — modal (swipe izq/der para navegar)
     ========================================================== */
  modal.addEventListener(
    "touchstart",
    (e) => {
      modalTouchX = e.touches[0].clientX;
    },
    { passive: true },
  );

  modal.addEventListener(
    "touchend",
    (e) => {
      if (!isOpen) return;
      const diff = modalTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 40) return;
      showImage(diff > 0 ? gIdx + 1 : gIdx - 1);
    },
    { passive: true },
  );

  /* ==========================================================
     TECLADO
     ========================================================== */
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showImage(gIdx - 1);
    if (e.key === "ArrowRight") showImage(gIdx + 1);
  });

  /* ==========================================================
     TRADUCCIÓN DE TÍTULOS DE GRUPO
     ========================================================== */
  function traducirTitulosGrupos(lang) {
    document.querySelectorAll(".titulo-grupo-cert").forEach((span) => {
      span.textContent = span.dataset[lang] || span.dataset.es || "";
    });
  }

  /* Exponer para el sistema i18n externo */
  window.traducirTitulosGrupos = traducirTitulosGrupos;

  /* Inicializar con el idioma actual */
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
