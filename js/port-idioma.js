const btn = document.getElementById("btnIdioma");
const btnCV = document.getElementById("btnCV");

let idioma = localStorage.getItem("idioma") || "es";

/* TRADUCCIÓN */
function aplicarIdioma(raiz) {
  const contenedor = raiz || document;

  document.documentElement.lang = idioma;

  if (btn) btn.textContent = idioma.toUpperCase();

  // Traduce todos los elementos con data-es / data-en dentro del contenedor
  contenedor.querySelectorAll("[data-es]").forEach((el) => {
    const texto = el.getAttribute(`data-${idioma}`);
    if (texto) el.innerHTML = texto;
  });

  // CV
  if (btnCV) {
    btnCV.href =
      idioma === "es"
        ? "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-ES.pdf"
        : "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-EN.pdf";
  }

  // Títulos de grupos de certificados (función de port-certificados.js)
  if (typeof window.traducirTitulosGrupos === "function") {
    window.traducirTitulosGrupos(idioma);
  }
}

/*  CLICK BOTÓN IDIOMA */
if (btn) {
  btn.addEventListener("click", () => {
    idioma = idioma === "es" ? "en" : "es";
    localStorage.setItem("idioma", idioma);
    aplicarIdioma(); // traduce todo el DOM actual
  });
}

/*  Contenido dinamico */
window.aplicarIdiomaEnContenido = function (raiz) {
  aplicarIdioma(raiz);
};

/* INICIALIZACIÓN */
window.addEventListener("DOMContentLoaded", () => {
  aplicarIdioma();
});
