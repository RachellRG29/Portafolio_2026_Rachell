const btnRegresar = document.getElementById("btnRegresar");

if (btnRegresar) {
  btnRegresar.addEventListener("click", function (e) {
    e.preventDefault();

    // guardar última sección visitada
    localStorage.setItem("ultimaSeccion", "proyectos");

    // redirigir
    window.location.href = "../../../index.html";
  });
}
