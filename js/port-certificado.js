/* ===========================
   BOTONES IZQUIERDA / DERECHA
=========================== */

document.querySelectorAll(".scroll-cert").forEach((button) => {
  button.addEventListener("click", () => {
    const slider = document.getElementById(button.dataset.target);

    if (!slider) return;

    const direction = Number(button.dataset.dir);

    const paso = slider.clientWidth; // avanza una vista completa

    const maxScroll = slider.scrollWidth - slider.clientWidth;

    // AVANZAR
    if (direction > 0) {
      if (slider.scrollLeft >= maxScroll - 10) {
        // si está al final vuelve al inicio
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
        setTimeout(actualizarTituloCertificado, 350);
      } else {
        slider.scrollBy({
          left: paso,
          behavior: "smooth",
        });
        setTimeout(actualizarTituloCertificado, 350);
      }
    }

    // RETROCEDER
    if (direction < 0) {
      if (slider.scrollLeft <= 10) {
        // si está al inicio va al final
        slider.scrollTo({
          left: maxScroll,
          behavior: "smooth",
        });
        setTimeout(actualizarTituloCertificado, 350);
      } else {
        slider.scrollBy({
          left: -paso,
          behavior: "smooth",
        });
        setTimeout(actualizarTituloCertificado, 350);
      }
    }
  });
});

/* ===========================
   DRAG CON MOUSE
=========================== */

document.querySelectorAll(".cert-scroll").forEach((slider) => {
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;

    slider.classList.add("dragging");

    startX = e.clientX;
    scrollStart = slider.scrollLeft;

    e.preventDefault();
  });
  setTimeout(actualizarTituloCertificado, 350);

  document.addEventListener("mouseup", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const walk = e.clientX - startX;

    slider.scrollLeft = scrollStart - walk;
  });
  setTimeout(actualizarTituloCertificado, 350);
});

/* ===========================
   TOUCH (CELULAR)
=========================== */

document.querySelectorAll(".cert-scroll").forEach((slider) => {
  let startX = 0;
  let scrollStart = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      scrollStart = slider.scrollLeft;
    },
    { passive: true },
  );

  slider.addEventListener(
    "touchmove",
    (e) => {
      const walk = e.touches[0].clientX - startX;

      slider.scrollLeft = scrollStart - walk;
    },
    { passive: true },
  );
});
