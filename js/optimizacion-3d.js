(function () {
  "use strict";

  const modelViewer = document.getElementById("modelo-3d");
  const imgEstatica = document.querySelector(".modelo-3d-static");

  if (!modelViewer) return;

  cargarModelViewer().then(() => {
    mostrarModelo();
  });

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
      /*console.log("💻 Escritorio: modelo 3D");*/
      mostrarModelo();
    } else {
      /*console.log("📱 Móvil: imagen estática");*/
      mostrarImagen();
    }
  }

  function cargarModelViewer() {
    if (window.customElements?.get("model-viewer")) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  window.addEventListener("resize", actualizarPorResolucion);
  actualizarPorResolucion();

  modelViewer.addEventListener("load", () => {
    /*console.log("🎬 Modelo 3D cargado");*/

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
    /*console.error("❌ Error cargando modelo 3D");*/
    mostrarImagen();
  });
})();
