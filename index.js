const form = document.getElementById("login-form");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("contraseña");
const modal = document.getElementById("errorModal");
const closeModal = document.getElementById("closeModal");
const loader = document.getElementById("loader");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.textContent = type === "password" ? "visibility_off" : "visibility";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contraseña = passwordInput.value.trim();

  const credenciales = {
    marlingdoc: { pass: "MINED2025", redirect: "inicio2.html" },
    marlingpad: { pass: "EDU2025", redirect: "inicio.html" },
    marling2025: { pass: "MINED310505", redirect: "mapa_autismo.html" },
    marbel2025: { pass: "MINED010101", redirect: "mapa_visual.html" },
    bengee2025: { pass: "MINED020202", redirect: "mapa_miskito.html" },
    hector2025: { pass: "MINED030303", redirect: "mapa_auditivo.html" }
  };

  // 🔹 Validar credenciales
  if (credenciales[usuario] && credenciales[usuario].pass === contraseña) {
    loader.style.display = "flex";
    setTimeout(() => {
      window.location.href = credenciales[usuario].redirect;
    }, 2000);
  } else {
    modal.style.display = "flex";
  }
});
