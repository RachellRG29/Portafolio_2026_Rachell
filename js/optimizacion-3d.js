(function () {
  "use strict";

  const modelViewer = document.getElementById("modelo-3d");
  const imgEstatica = document.querySelector(".modelo-3d-static");

  if (!modelViewer) return;

  function mostrarModelo() {
    if (imgEstatica) {
      imgEstatica.style.display = "none";
    }

    modelViewer.style.visibility = "visible";
    modelViewer.style.opacity = "1";
    modelViewer.style.pointerEvents = "auto";
  }

  function mostrarImagen() {
    modelViewer.style.visibility = "hidden";
    modelViewer.style.opacity = "0";
    modelViewer.style.pointerEvents = "none";

    if (imgEstatica) {
      imgEstatica.style.display = "block";
    }
  }

  function actualizarPorResolucion(e) {
    const escritorio =
      e?.matches ?? window.matchMedia("(min-width: 769px)").matches;

    if (escritorio) {
      mostrarModelo();
    } else {
      mostrarImagen();
    }
  }

  // Solo se dispara cuando cambia entre móvil/escritorio
  const mediaQuery = window.matchMedia("(min-width: 769px)");

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", actualizarPorResolucion);
  } else {
    // Compatibilidad con navegadores antiguos
    mediaQuery.addListener(actualizarPorResolucion);
  }

  actualizarPorResolucion(mediaQuery);

  modelViewer.addEventListener(
    "load",
    () => {
      if (modelViewer.availableAnimations?.length > 0) {
        modelViewer.animationName = modelViewer.availableAnimations[0];
      }

      try {
        modelViewer.play?.();
      } catch (_) {}
    },
    { once: true },
  );

  modelViewer.addEventListener(
    "error",
    () => {
      mostrarImagen();
    },
    { once: true },
  );
})();
