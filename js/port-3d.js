(function () {
  "use strict";

  var contenedor = document.getElementById("contenedor-3d");
  if (!contenedor) return;

  var yaIniciado = false;

  function cargarVisor() {
    if (yaIniciado) return;
    yaIniciado = true;

    // 1. Inyectar el script de model-viewer dinámicamente
    var script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer@4.3.1/dist/model-viewer.min.js";
    document.head.appendChild(script);

    // 2. Crear el elemento model-viewer
    var viewer = document.createElement("model-viewer");
    viewer.id = "modelo-3d";
    viewer.setAttribute("src", "3d/glb-port2026-prueba2.glb");
    viewer.setAttribute("poster", "images/poster-modelo.webp");
    viewer.setAttribute("reveal", "auto");
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("disable-pan", "");
    viewer.setAttribute("autoplay", "");
    viewer.style.width = "100%";
    viewer.style.height = "100%";

    // 3. Arrancar animación al cargar
    viewer.addEventListener("load", function () {
      viewer.animationName = "kirbyAction";
      viewer.play();
    });

    // 4. Reemplazar el poster/placeholder por el viewer real
    contenedor.innerHTML = "";
    contenedor.appendChild(viewer);
  }

  // --- Estrategia de carga ---

  // IntersectionObserver: carga cuando el contenedor
  //    está a 300px de entrar en pantalla
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            cargarVisor();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "300px" },
    );
    observer.observe(contenedor);
  } else {
    // Fallback: carga tras 2 segundos si no hay IntersectionObserver
    setTimeout(cargarVisor, 2000);
  }

  //  Si el usuario hace hover/touch sobre el poster, carga inmediato
  contenedor.addEventListener("mouseenter", cargarVisor, { once: true });
  contenedor.addEventListener("touchstart", cargarVisor, {
    once: true,
    passive: true,
  });
})();
