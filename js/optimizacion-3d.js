(function () {
  "use strict";

  const modelViewer = document.getElementById("modelo-3d");
  const imgEstatica = document.querySelector(".modelo-3d-static");

  if (!modelViewer) return;

  // Guardamos el src original
  const modelSrc = modelViewer.getAttribute("src");

  let modeloCargado = false;

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

  function cargarModelo() {
    if (modeloCargado) return;

    modelViewer.setAttribute("src", modelSrc);
    modeloCargado = true;

    console.log("🚀 Modelo 3D cargándose...");
  }

  function actualizarPorResolucion() {
    const esDesktop = window.matchMedia("(min-width: 769px)").matches;

    if (esDesktop) {
      // Si nunca se cargó, cargarlo ahora
      if (!modeloCargado) {
        cargarModelo();
      }

      mostrarModelo();
    } else {
      mostrarImagen();

      // Evita descargar el GLB en móviles
      if (!modeloCargado) {
        modelViewer.removeAttribute("src");
      }
    }
  }

  // Inicialmente ocultar el src
  modelViewer.removeAttribute("src");

  // Detectar cuando la sección entra en pantalla
  const observer = new IntersectionObserver(
    (entries) => {
      const esDesktop = window.matchMedia("(min-width: 769px)").matches;

      entries.forEach((entry) => {
        if (entry.isIntersecting && esDesktop) {
          cargarModelo();
          observer.disconnect();
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "200px",
    },
  );

  observer.observe(modelViewer);

  window.addEventListener("resize", actualizarPorResolucion);

  actualizarPorResolucion();

  modelViewer.addEventListener("load", () => {
    console.log("🎬 Modelo 3D cargado");

    setTimeout(() => {
      if (modelViewer.availableAnimations?.length > 0) {
        modelViewer.animationName = modelViewer.availableAnimations[0];

        modelViewer.autoplay = true;
      }

      try {
        const r = modelViewer.play?.();
        if (r?.catch) r.catch(() => {});
      } catch (_) {}
    }, 100);
  });

  modelViewer.addEventListener("error", () => {
    console.error("❌ Error cargando modelo");
    mostrarImagen();
  });
})();
