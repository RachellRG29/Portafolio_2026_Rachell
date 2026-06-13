(function () {
  const links = ["https://unpkg.com"];

  links.forEach((origin) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    document.head.appendChild(link);
  });
})();
