// Este código gestiona la visualización y filtrado de una lista de alumnos con distintas 
// condiciones (autismo, dificultad visual, dificultad auditiva, normal, miskito), mostrando
//  su estado de tareas, cantidad de errores y una barra de progreso. Incluye funciones para
//  generar estrellas según los errores cometidos, mostrar los alumnos filtrados por tipo o por
//  búsqueda de texto, actualizar una barra de avance según cuántos han completado la tarea, y
//  abrir un modal con detalles del alumno al hacer clic, incluyendo manejo de cierre del modal.

const alumnos = [
  { nombre: "Ana Pérez Gómez", tipo: "autismo", hecho: true, errores: 2 },
  { nombre: "Luis Martínez López", tipo: "dificultad_auditiva", hecho: false, errores: 0 },
  { nombre: "María Torres Rivera", tipo: "autismo", hecho: true, errores: 6 },
  { nombre: "Carlos Fernández Díaz", tipo: "dificultad_visual", hecho: true, errores: 3 },
  { nombre: "Mateo Gómez Ramírez", tipo: "normal", hecho: true, errores: 0 },
  { nombre: "Valeria Ruiz Ortega", tipo: "normal", hecho: false, errores: 0 },
  { nombre: "Camila Herrera Jiménez", tipo: "dificultad_visual", hecho: false, errores: 0 },
  { nombre: "Tomás Aguilar Rivas", tipo: "dificultad_auditiva", hecho: true, errores: 0 },
  { nombre: "Carlos Juan Gómez", tipo: "miskito", hecho: false, errores: 0 }
];


const alumnosContainer = document.getElementById("alumnos-container");
const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrar-modal");
const modalBody = document.getElementById("modal-body");
const porcentaje = document.getElementById("porcentaje");
const barra = document.getElementById("barra");
const filtroBtns = document.querySelectorAll(".filtro-btn");


function generarEstrellas(errores) {
  let estrellas = 3;
  if (errores >= 6) estrellas = 1;
  else if (errores >= 3) estrellas = 2;
  let html = '';
  for (let i = 0; i < estrellas; i++) {
    html += `<div class="estrella" title="Errores: ${errores}"></div>`;
  }
  return html;
}

function mostrarAlumnos(filtro = "todos") {
  alumnosContainer.innerHTML = '';
  
  const filtrados = alumnos.filter(a => {
    if (filtro === 'todos') return true;
    if (filtro === 'alumnos_sin_condicion') return a.tipo === 'normal';
    return a.tipo === filtro;
  });

  filtrados.forEach(alumno => {
    const div = document.createElement('div');
    div.classList.add('alumno');
    div.classList.add(alumno.hecho ? 'hecho' : 'pendiente');
    div.innerHTML = `
      <h3>${alumno.nombre}</h3>
      <div class="estado">${alumno.hecho ? '✅ Hecho' : '❌ Por hacer'}</div>
    `;
    div.addEventListener('click', () => mostrarModal(alumno));
    alumnosContainer.appendChild(div);
  });

  actualizarBarra(filtrados);
}

function actualizarBarra(filtrados) {
  const hecho = filtrados.filter(a => a.hecho).length;
  const total = filtrados.length;
  const avance = total ? Math.round((hecho / total) * 100) : 0;
  porcentaje.textContent = `${avance}%`;
  barra.style.width = `${avance}%`;
}

function mostrarModal(alumno) {
  modalBody.innerHTML = '';
  if (alumno.hecho) {
    modalBody.innerHTML = `
      <h2>${alumno.nombre}</h2>
      <p>Errores: ${alumno.errores}</p>
      <div class="estrellas">${generarEstrellas(alumno.errores)}</div>
    `;
  } else {
    modalBody.innerHTML = `
      <h2>${alumno.nombre}</h2>
      <p style="color:red; font-weight:bold;">Tarea aún no realizada</p>
    `;
  }
  modal.style.display = 'block';
}

cerrarModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => mostrarAlumnos(btn.dataset.filter));
});

mostrarAlumnos();


const searchBar = document.querySelector('.search-bar');

searchBar.addEventListener('input', () => {
  const filtroTexto = searchBar.value.toLowerCase();

  alumnosContainer.innerHTML = '';

  const filtrados = alumnos.filter(a => {
    return a.nombre.toLowerCase().includes(filtroTexto);
  });

  filtrados.forEach(alumno => {
    const div = document.createElement('div');
    div.classList.add('alumno');
    div.classList.add(alumno.hecho ? 'hecho' : 'pendiente');
    div.innerHTML = `
      <h3>${alumno.nombre}</h3>
      <div class="estado">${alumno.hecho ? '✅ Hecho' : '❌ Por hacer'}</div>
    `;
    div.addEventListener('click', () => mostrarModal(alumno));
    alumnosContainer.appendChild(div);
  });

  actualizarBarra(filtrados);
});
