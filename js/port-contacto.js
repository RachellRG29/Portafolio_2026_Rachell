(function () {
  const MALAS_PALABRAS = [
    "mierda",
    "puta",
    "puto",
    "pendejo",
    "pendeja",
    "idiota",
    "imbecil",
    "imbécil",
    "estupido",
    "estúpido",
    "cabron",
    "cabrón",
    "hdp",
    "verga",
    "chinga",
    "chingada",
    "joder",
    "coño",
    "gilipollas",
    "mamada",
    "culero",
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "damn",
    "crap",
    "wtf",
  ];

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const SOLO_LETRAS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,80}$/;

  function contieneMalasPalabras(texto) {
    const lower = texto.toLowerCase().replace(/[^a-záéíóúñü\s]/gi, " ");
    return MALAS_PALABRAS.some(
      (p) => lower.split(/\s+/).includes(p) || lower.includes(p),
    );
  }

  function mostrarError(campo, msg) {
    const el = document.getElementById("error-" + campo);
    const input =
      document.getElementById(campo) || document.getElementById("mensaje");
    if (el) el.textContent = msg;
    if (input) input.classList.toggle("--error", !!msg);
  }

  function limpiarError(campo) {
    mostrarError(campo, "");
  }

  function validarCampo(id, valor) {
    valor = valor.trim();
    switch (id) {
      case "nombre":
        if (!valor) return "El nombre es obligatorio.";
        if (!SOLO_LETRAS_RE.test(valor))
          return "Solo letras, espacios y guiones.";
        if (contieneMalasPalabras(valor))
          return "Por favor usa un lenguaje apropiado.";
        return "";
      case "correo":
        if (!valor) return "El correo es obligatorio.";
        if (!EMAIL_RE.test(valor)) return "Ingresa un correo válido.";
        return "";
      case "asunto":
        if (!valor) return "Por favor selecciona un tipo de servicio.";
        return "";
      case "mensaje":
        if (!valor) return "El mensaje es obligatorio.";
        if (valor.length < 10)
          return "El mensaje debe tener al menos 10 caracteres.";
        if (contieneMalasPalabras(valor))
          return "Por favor usa un lenguaje apropiado.";
        return "";
      default:
        return "";
    }
  }

  const campos = ["nombre", "correo", "asunto", "mensaje"];

  campos.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", function () {
      mostrarError(id, validarCampo(id, el.value));
    });
    el.addEventListener("input", function () {
      if (el.classList.contains("--error")) {
        limpiarError(id);
      }
    });
  });

  var form = document.getElementById("formContacto");
  var btn = document.getElementById("btnEnviar");
  var feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var valido = true;
    campos.forEach(function (id) {
      var el = document.getElementById(id);
      var error = validarCampo(id, el ? el.value : "");
      mostrarError(id, error);
      if (error) valido = false;
    });

    if (!valido) return;

    btn.disabled = true;
    btn.querySelector(".contacto__btn-texto").textContent = "Enviando…";
    feedback.className = "contacto__feedback";
    feedback.textContent = "";

    var data = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        if (res.ok) {
          feedback.className = "contacto__feedback --success";
          feedback.textContent = "¡Mensaje enviado! Te responderé pronto. 🎉";
          form.reset();
          campos.forEach(function (id) {
            limpiarError(id);
          });
        } else {
          throw new Error("server");
        }
      })
      .catch(function () {
        feedback.className = "contacto__feedback --error";
        feedback.textContent =
          "Hubo un error al enviar. Intenta de nuevo o escríbeme directamente.";
      })
      .finally(function () {
        btn.disabled = false;
        btn.querySelector(".contacto__btn-texto").textContent =
          "Enviar mensaje";
      });
  });
})();
