(function () {
  const esEscritorio = window.matchMedia("(min-width: 769px)").matches;

  const modelViewer = document.getElementById("modelo-3d");
  const imgEstatica = document.querySelector(".modelo-3d-static");

  if (!modelViewer) return;

  // MÓVIL
  if (!esEscritorio) {
    modelViewer.style.display = "none";

    if (imgEstatica) {
      imgEstatica.style.display = "block";
    }

    return;
  }

  // ESCRITORIO
  if (imgEstatica) {
    imgEstatica.style.display = "none";
  }

  modelViewer.style.display = "block";

  setTimeout(() => {
    modelViewer.src = modelViewer.dataset.src;
  }, 450);
})();
