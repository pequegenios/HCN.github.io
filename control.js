// Este código gestiona la visualización y progreso de unidades y temas de un curso, 
// incluyendo desbloqueo progresivo, activación de temas mediante un modal interactivo,
//  simulación automática de progreso cada 10 segundos, y elementos de interfaz como 
// notificaciones y perfil de usuario emergente. Se renderizan botones para cada unidad 
// y tema, se controlan los estados de desbloqueo y actividad, se muestran mensajes con
//  modal para confirmar acciones o informar progreso, y se manejan interacciones de 
// usuario con botones de cerrar, notificaciones y perfil. Además, el código simula la 
// actualización de progreso, desbloquea temas y unidades según criterios de avance, 
// y gestiona la visibilidad de popups de notificaciones y perfil con eventos de clic.



const unidadesDiv = document.getElementById("unidades");
const temasDiv = document.getElementById("temas");
const modal = document.getElementById("modal");
const modalTexto = document.getElementById("modalTexto");
const modalSi = document.getElementById("modalSi");
const modalNo = document.getElementById("modalNo");

let unidades = [
  {
    id: 1,
    nombre: "Unidad 1",
    desbloqueada: true,
    temas: [
      { id: 1, nombre: "Reconocer números", progreso: 10, desbloqueado: true, activo: true },
      { id: 2, nombre: "Relacionar números con objetos", progreso: 0, desbloqueado: false, activo: false },
      { id: 3, nombre: "Secuencia de números", progreso: 0, desbloqueado: false, activo: false },
    ],
  },
  {
    id: 2,
    nombre: "Unidad 2",
    desbloqueada: false,
    temas: [
      { id: 1, nombre: "Sumas básicas", progreso: 0, desbloqueado: false, activo: false },
      { id: 2, nombre: "Restas básicas", progreso: 0, desbloqueado: false, activo: false },
      { id: 3, nombre: "Comparación de cantidades", progreso: 0, desbloqueado: false, activo: false },
    ],
  },
  {
    id: 3,
    nombre: "Unidad 3",
    desbloqueada: false,
    temas: [
      { id: 1, nombre: "Figuras geométricas", progreso: 0, desbloqueado: false, activo: false },
      { id: 2, nombre: "Medidas básicas", progreso: 0, desbloqueado: false, activo: false },
      { id: 3, nombre: "Series lógicas", progreso: 0, desbloqueado: false, activo: false },
    ],
  },
];

let unidadSeleccionada = null;
let temaSeleccionado = null;


function renderUnidades() {
  unidadesDiv.innerHTML = "";
  unidades.forEach((u) => {
    const btn = document.createElement("button");
    btn.className = "btn-unidad";
    btn.textContent = u.nombre;
    btn.disabled = !u.desbloqueada;
    btn.addEventListener("click", () => seleccionarUnidad(u));
    unidadesDiv.appendChild(btn);
  });
}
renderUnidades();


function seleccionarUnidad(unidad) {
  if (!unidad.desbloqueada) {
    mostrarModal("⚠️ Debes completar la unidad anterior para avanzar.", false);
    return;
  }
  unidadSeleccionada = unidad;
  renderTemas();
}


function renderTemas() {
  temasDiv.innerHTML = "";
  if (!unidadSeleccionada) return;

  unidadSeleccionada.temas.forEach((t, index) => {
    const contenedor = document.createElement("div");
    contenedor.className = "tema-card";

    const progresoBar = document.createElement("div");
    progresoBar.className = "progreso-bar";
    progresoBar.style.width = `${t.progreso}%`;

    const btn = document.createElement("button");
    btn.className = "btn-tema";
    btn.textContent = `${t.nombre} - ${t.progreso}%`;
    btn.disabled = !t.desbloqueado;
    btn.addEventListener("click", () => intentarActivarTema(t));

    contenedor.appendChild(btn);
    contenedor.appendChild(progresoBar);
    temasDiv.appendChild(contenedor);
  });
}


function intentarActivarTema(t) {
  temaSeleccionado = t;
  if (!t.activo) {
    mostrarModal(`¿Deseas activar el avance automático del tema "${t.nombre}"?`, true);
  } else {
    mostrarModal(`✅ ${t.progreso}% completado.`, false);
  }
}


function mostrarModal(texto, preguntar) {
  modalTexto.textContent = texto;
  modal.classList.remove("hidden");
  modal.classList.add("show");

  modalSi.style.display = preguntar ? "inline-block" : "none";
  modalNo.style.display = preguntar ? "inline-block" : "none";
}

modalNo.addEventListener("click", () => cerrarModal());

modalSi.addEventListener("click", () => {
  if (temaSeleccionado && !temaSeleccionado.activo) {
    temaSeleccionado.activo = true;
    cerrarModal();
  }
});

function cerrarModal() {
  modal.classList.remove("show");
  setTimeout(() => modal.classList.add("hidden"), 200);
}

setInterval(() => {
  unidades.forEach((u, ui) => {
    u.temas.forEach((t, ti) => {
      if (t.activo && t.progreso < 100) {
        t.progreso = Math.min(100, t.progreso + 10);

 
        if (t.progreso >= 60 && ti + 1 < u.temas.length) {
          const siguiente = u.temas[ti + 1];
          if (!siguiente.desbloqueado) {
            siguiente.desbloqueado = true;

          }
        }
      }
    });
  });


  for (let i = 1; i < unidades.length; i++) {
    const unidadAnterior = unidades[i - 1];
    const unidadActual = unidades[i];

    const promedio = unidadAnterior.temas.reduce((sum, t) => sum + t.progreso, 0) / unidadAnterior.temas.length;
    if (promedio >= 60) {
      unidadActual.desbloqueada = true;
    }
  }

  renderTemas();
  renderUnidades();
}, 10000);



const cerrarModalBtn = document.getElementById("cerrarModalBtn");

cerrarModalBtn.addEventListener("click", () => cerrarModal());





const notifIcon = document.querySelector(".notif");
const userAvatar = document.querySelector(".user-avatar");

const popupNotif = document.createElement("div");
popupNotif.className = "popup";
popupNotif.innerHTML = `
  <div class="notif-item"><i class="fa-solid fa-bell"></i> Nueva unidad disponible</div>
  <div class="notif-item"><i class="fa-solid fa-check-circle"></i> Completaste el tema 1</div>
  <div class="notif-item"><i class="fa-solid fa-graduation-cap"></i> Felicitaciones por tu progreso</div>
`;
document.body.appendChild(popupNotif);

notifIcon.addEventListener("click", () => {
  popupNotif.classList.toggle("active");
  popupProfile.classList.remove("active");
});


const popupProfile = document.createElement("div");
popupProfile.className = "popup profile-popup";
popupProfile.innerHTML = `
  <img src="https://cdn-icons-png.flaticon.com/512/219/219969.png" alt="user">
  <h3>Silvia Herrera</h3>
  <p>Docente de Matemática - 1° Grado</p>
  <p><i class="fa-solid fa-envelope"></i> silvia.herrera@mined.gob.ni</p>
`;
document.body.appendChild(popupProfile);

userAvatar.addEventListener("click", () => {
  popupProfile.classList.toggle("active");
  popupNotif.classList.remove("active");
});


document.addEventListener("click", (e) => {
  if (!notifIcon.contains(e.target) && !popupNotif.contains(e.target)) {
    popupNotif.classList.remove("active");
  }
  if (!userAvatar.contains(e.target) && !popupProfile.contains(e.target)) {
    popupProfile.classList.remove("active");
  }
});
