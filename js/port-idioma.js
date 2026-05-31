const btn = document.getElementById("btnIdioma");
const btnCV = document.getElementById("btnCV");

let idioma = localStorage.getItem("idioma") || "es";

function aplicarIdioma() {
  // Cambia el atributo lang del HTML
  document.documentElement.lang = idioma;

  // Cambia texto del botón de idioma
  if (btn) {
    btn.textContent = idioma.toUpperCase();
  }

  // Traduce todos los elementos con data-es / data-en
  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);
    if (texto) {
      el.innerHTML = texto;
    }
  });

  // Cambia el CV según idioma
  if (btnCV) {
    if (idioma === "es") {
      btnCV.href = "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-ES.pdf";
    }
    if (idioma === "en") {
      btnCV.href = "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-EN.pdf";
    }
  }

  if (typeof actualizarTituloCertificado === "function") {
    actualizarTituloCertificado();
  }
}

// Ejecutar al cargar
aplicarIdioma();

// Evento click para cambiar idioma
if (btn) {
  btn.addEventListener("click", () => {
    idioma = idioma === "es" ? "en" : "es";
    localStorage.setItem("idioma", idioma);
    aplicarIdioma();
  });
}

/* ===========================
   TITULO DINAMICO CERTIFICADOS
=========================== */

function actualizarTituloCertificado() {
  const sliderCert = document.getElementById("slider-cert");
  const tituloCert = document.getElementById("titulo-certificado");

  if (!sliderCert || !tituloCert) return;

  const cards = sliderCert.querySelectorAll(".cert-card");

  if (!cards.length) return;

  let cardActiva = cards[0];

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();

    if (rect.left >= 0 && rect.left <= 200) {
      cardActiva = card;
    }
  });

  tituloCert.textContent =
    idioma === "es" ? cardActiva.dataset.certEs : cardActiva.dataset.certEn;
}

/* ===========================
   IDIOMA
=========================== */

function aplicarIdioma() {
  document.documentElement.lang = idioma;

  if (btn) {
    btn.textContent = idioma.toUpperCase();
  }

  document.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);

    if (texto) {
      el.innerHTML = texto;
    }
  });

  if (btnCV) {
    if (idioma === "es") {
      btnCV.href = "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-ES.pdf";
    } else {
      btnCV.href = "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-EN.pdf";
    }
  }

  actualizarTituloCertificado();
}

/* ===========================
   INICIALIZACION
=========================== */

window.addEventListener("DOMContentLoaded", () => {
  aplicarIdioma();

  const sliderCert = document.getElementById("slider-cert");

  if (sliderCert) {
    sliderCert.addEventListener("scroll", actualizarTituloCertificado);
  }
});
