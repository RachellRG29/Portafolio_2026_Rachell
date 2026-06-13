(function () {
  // Preconectar a orígenes importantes
  const links = ["https://unpkg.com", "https://fonts.googleapis.com"];

  links.forEach((origin) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    document.head.appendChild(link);
  });

  // Carga diferida de scripts no críticos
  window.addEventListener("load", () => {
    const scripts = [
      "js/port-certificados.js",
      "js/port-contacto.js",
      "js/port-footer.js",
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    });
  });
})();
