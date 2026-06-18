// footer_animacion.js

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".footer-container");
  const wrapper = document.querySelector(".folder-wrapper");

  if (!footer || !wrapper) return;

  // Mostrar iconos al cargar
  footer.classList.add("abierto");

  // Ocultar iconos al pasar el mouse
  wrapper.addEventListener("mouseenter", () => {
    footer.classList.remove("abierto");
  });

  // Volver a mostrar iconos al salir
  wrapper.addEventListener("mouseleave", () => {
    footer.classList.add("abierto");
  });
});