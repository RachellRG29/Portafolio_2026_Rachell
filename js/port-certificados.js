/* CERTIFICADOS — Sliders + Modal */
(function () {
  "use strict";

  const modal = document.getElementById("cert-modal");
  if (!modal) return;

  const mImg = modal.querySelector(".cert-modal__img");
  const mCur = modal.querySelector(".cert-modal__counter-cur");
  const mTot = modal.querySelector(".cert-modal__counter-tot");
  const mBackdrop = modal.querySelector(".cert-modal__backdrop");
  const mClose = modal.querySelector(".cert-modal__close");
  const mPrev = modal.querySelector(".cert-modal__nav--prev");
  const mNext = modal.querySelector(".cert-modal__nav--next");

  let gallery = [];
  let gIdx = 0;
  let isOpen = false;

  let dragSlider = null;
  let dragStartX = 0;
  let dragScrollL = 0;

  let touchSlider = null;
  let touchStartX = 0;
  let touchScrollL = 0;

  let modalTouchX = 0;

  /* ===============================
     Scroll del slider
  =============================== */

  function scrollSlider(slider, dir) {
    slider.scrollBy({
      left: dir * slider.clientWidth,
      behavior: "smooth",
    });
  }

  /* ===============================
     Modal
  =============================== */

  function showImage(idx) {
    if (!gallery.length) return;

    gIdx = (idx + gallery.length) % gallery.length;

    mImg.src = gallery[gIdx].src;
    mImg.alt = gallery[gIdx].alt;
    mCur.textContent = gIdx + 1;
  }

  function openModal(cards, clickedCard) {
    gallery = cards.map((c) => ({
      src: c.dataset.modalSrc || "",
      alt: c.dataset.modalAlt || "",
    }));

    gIdx = cards.indexOf(clickedCard);
    if (gIdx < 0) gIdx = 0;

    mTot.textContent = gallery.length;

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

  function closeModal() {
    if (!isOpen) return;

    modal.classList.remove("is-open");
    document.body.style.overflow = "";

    isOpen = false;

    setTimeout(() => {
      if (!isOpen) {
        mImg.src = "";
      }
    }, 300);
  }

  /* ===============================
     Clicks
  =============================== */

  document.addEventListener("click", (e) => {
    const scrollBtn = e.target.closest(".scroll-cert");

    if (scrollBtn) {
      const slider = document.getElementById(scrollBtn.dataset.target);

      if (slider) {
        scrollSlider(slider, Number(scrollBtn.dataset.dir));
      }

      return;
    }

    const verBtn = e.target.closest(".cert-ver-btn");

    if (verBtn) {
      const card = verBtn.closest(".cert-card");
      const grupo = card?.closest(".cert-grupo");

      if (grupo) {
        const cards = [...grupo.querySelectorAll(".cert-card")];
        openModal(cards, card);
      }

      return;
    }

    if (e.target === mBackdrop || e.target.closest(".cert-modal__close")) {
      closeModal();
      return;
    }

    if (e.target.closest(".cert-modal__nav--prev")) {
      showImage(gIdx - 1);
      return;
    }

    if (e.target.closest(".cert-modal__nav--next")) {
      showImage(gIdx + 1);
      return;
    }
  });

  /* ===============================
     Drag mouse
  =============================== */

  document.addEventListener("mousedown", (e) => {
    const slider = e.target.closest(".cert-scroll");

    if (!slider) return;

    dragSlider = slider;
    dragStartX = e.clientX;
    dragScrollL = slider.scrollLeft;

    slider.classList.add("dragging");

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragSlider) return;

    dragSlider.scrollLeft = dragScrollL - (e.clientX - dragStartX);
  });

  document.addEventListener("mouseup", () => {
    if (!dragSlider) return;

    dragSlider.classList.remove("dragging");
    dragSlider = null;
  });

  /* ===============================
     Touch slider
  =============================== */

  document.addEventListener(
    "touchstart",
    (e) => {
      const slider = e.target.closest(".cert-scroll");

      if (!slider) return;

      touchSlider = slider;
      touchStartX = e.touches[0].clientX;
      touchScrollL = slider.scrollLeft;
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

  /* ===============================
     Swipe modal
  =============================== */

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

  /* ===============================
     Teclado
  =============================== */

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;

    if (e.key === "Escape") closeModal();

    if (e.key === "ArrowLeft") showImage(gIdx - 1);

    if (e.key === "ArrowRight") showImage(gIdx + 1);
  });

  /* ===============================
     Traducción
  =============================== */

  function traducirTitulosGrupos(lang) {
    document.querySelectorAll(".titulo-grupo-cert").forEach((span) => {
      span.textContent = span.dataset[lang] || span.dataset.es || "";
    });
  }

  window.traducirTitulosGrupos = traducirTitulosGrupos;

  const initLang = document.documentElement.lang === "en" ? "en" : "es";

  traducirTitulosGrupos(initLang);
})();
