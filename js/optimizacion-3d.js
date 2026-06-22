(function () {
  "use strict";

  const modelViewer = document.getElementById("modelo-3d");
  const imgEstatica = document.querySelector(".modelo-3d-static");

  if (!modelViewer) return;

  function mostrarModelo() {
    if (imgEstatica) imgEstatica.style.display = "none";
    modelViewer.style.visibility = "visible";
    modelViewer.style.opacity = "1";
    modelViewer.style.pointerEvents = "auto";
  }

  function mostrarImagen() {
    modelViewer.style.visibility = "hidden";
    modelViewer.style.opacity = "0";
    modelViewer.style.pointerEvents = "none";

    if (imgEstatica) imgEstatica.style.display = "block";
  }

  function actualizarPorResolucion() {
    if (window.matchMedia("(min-width: 769px)").matches) {
      mostrarModelo();
    } else {
      mostrarImagen();
    }
  }

  window.addEventListener("resize", actualizarPorResolucion);
  actualizarPorResolucion();

  // Pausar/Reanudar el modelo cuando entra o sale del viewport
  const observer3D = new IntersectionObserver(
    ([entry]) => {
      try {
        if (entry.isIntersecting) {
          modelViewer.play?.();
        } else {
          modelViewer.pause?.();
        }
      } catch (_) {
        // Ignorar si el navegador o la versión de model-viewer
        // no soporta play()/pause()
      }
    },
    {
      threshold: 0.1,
    },
  );

  observer3D.observe(modelViewer);

  modelViewer.addEventListener("load", () => {
    mostrarModelo();
  });

  modelViewer.addEventListener("error", () => {
    mostrarImagen();
  });
})();
