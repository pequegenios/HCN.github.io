// Este código gestiona una tabla de estudiantes con funcionalidades de visualización, 
// edición, eliminación y búsqueda. Primero obtiene referencias a los elementos del DOM
//  como la tabla, el modal y sus secciones, y establece eventos para cerrar el modal. 
// Luego carga los estudiantes desde localStorage y define la función renderTabla() para 
// mostrar los datos en la tabla, generando filas dinámicamente con botones de acción. Se
//  añade un event listener al cuerpo de la tabla para manejar los clics en los botones 
// "Ver", "Editar" y "Eliminar", mostrando modales correspondientes o eliminando el estudiante
//  del array y actualizando el almacenamiento. Las funciones mostrarModalVer() y 
// mostrarModalEditar() despliegan el modal con los datos del estudiante, permitiendo 
// en el caso de edición modificar los campos, guardar cambios en localStorage y actualizar 
// la tabla. Finalmente, se agrega un input de búsqueda que filtra en tiempo real las filas
//  de la tabla comparando el texto ingresado con código, nombre, grado o sección del estudiante.


const tablaBody = document.querySelector("#tablaEstudiantes tbody");

const modal = document.getElementById("modalVerEditar");
const modalBody = document.getElementById("modalBody");
const modalBotones = document.getElementById("modalBotones");
const cerrarModal = document.getElementById("cerrarModalVerEditar");

cerrarModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

let estudiantes = JSON.parse(localStorage.getItem("estudiantesRegistrados")) || [];


function renderTabla() {
  tablaBody.innerHTML = "";
  estudiantes.forEach((est, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${est.codigo_mined}</td>
      <td>${est.nombre1} ${est.nombre2} ${est.apellido1} ${est.apellido2}</td>
      <td>${est.grado}</td>
      <td>${est.seccion}</td>
      <td>
        <button class="ver" data-index="${index}">Ver</button>
        <button class="editar" data-index="${index}">Editar</button>
        <button class="eliminar" data-index="${index}">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });
}

renderTabla();

tablaBody.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;
  const estudiante = estudiantes[index];

  if (e.target.classList.contains("ver")) mostrarModalVer(estudiante);
  if (e.target.classList.contains("editar")) mostrarModalEditar(estudiante, index);
  if (e.target.classList.contains("eliminar")) {
    if (confirm(`¿Eliminar a ${estudiante.nombre1} ${estudiante.apellido1}?`)) {
      estudiantes.splice(index, 1);
      localStorage.setItem("estudiantesRegistrados", JSON.stringify(estudiantes));
      renderTabla();
    }
  }
});


function mostrarModalVer(est) {
  modalBody.innerHTML = `
    <h3>Datos del Estudiante</h3>
    <p><strong>Código MINED:</strong> ${est.codigo_mined}</p>
    <p><strong>Nombre:</strong> ${est.nombre1} ${est.nombre2} ${est.apellido1} ${est.apellido2}</p>
    <p><strong>Fecha Nacimiento:</strong> ${est.fecha_nacimiento}</p>
    <p><strong>Departamento:</strong> ${est.departamento}</p>
    <p><strong>Municipio:</strong> ${est.municipio}</p>
    <p><strong>Escuela:</strong> ${est.escuela}</p>
    <p><strong>Grado:</strong> ${est.grado}</p>
    <p><strong>Sección:</strong> ${est.seccion}</p>
    <p><strong>Condición:</strong> ${est.condicion}</p>
    <p><strong>Tutor:</strong> ${est.nombre_tutor} | ${est.telefono_tutor} | ${est.correo_tutor}</p>
    <p><strong>Notas Matemáticas:</strong> ${est.notas.join(", ")}</p>
  `;
  modalBotones.innerHTML = `<button id="cerrarVer">Cerrar</button>`;
  document.getElementById("cerrarVer").addEventListener("click", () => modal.style.display = "none");
  modal.style.display = "block";
}


function mostrarModalEditar(est, index) {
  modalBody.innerHTML = `
    <h3>Editar Estudiante</h3>
    <label>Escuela:</label>
    <input type="text" id="editEscuela" value="${est.escuela}">
    <label>Grado:</label>
    <input type="number" id="editGrado" value="${est.grado}" min="1" max="4">
    <label>Sección:</label>
    <input type="text" id="editSeccion" value="${est.seccion}">
    <label>Departamento:</label>
    <input type="text" id="editDep" value="${est.departamento}">
    <label>Municipio:</label>
    <input type="text" id="editMun" value="${est.municipio}">
    <hr>
    <h4>Tutor</h4>
    <label>Nombre:</label>
    <input type="text" id="editTutor" value="${est.nombre_tutor}">
    <label>Teléfono:</label>
    <input type="text" id="editTel" value="${est.telefono_tutor}">
    <label>Correo:</label>
    <input type="email" id="editCorreo" value="${est.correo_tutor}">
    <hr>
    <h4>Notas Matemáticas</h4>
    <input type="text" id="editNotas" value="${est.notas.join(", ")}" placeholder="Separadas por coma">
  `;

  modalBotones.innerHTML = `
    <button id="guardarCambios">Guardar</button>
    <button id="cancelarCambios">Cancelar</button>
  `;

  document.getElementById("cancelarCambios").addEventListener("click", () => modal.style.display = "none");

  document.getElementById("guardarCambios").addEventListener("click", () => {
    est.escuela = document.getElementById("editEscuela").value;
    est.grado = parseInt(document.getElementById("editGrado").value) || 1;
    est.seccion = document.getElementById("editSeccion").value;
    est.departamento = document.getElementById("editDep").value;
    est.municipio = document.getElementById("editMun").value;
    est.nombre_tutor = document.getElementById("editTutor").value;
    est.telefono_tutor = document.getElementById("editTel").value;
    est.correo_tutor = document.getElementById("editCorreo").value;
    est.notas = document.getElementById("editNotas").value
      .split(",")
      .map(n => Math.min(Math.max(parseInt(n.trim()) || 0, 0), 100)); // Solo 0-100

    estudiantes[index] = est;
    localStorage.setItem("estudiantesRegistrados", JSON.stringify(estudiantes));
    renderTabla();
    modal.style.display = "none";
  });

  modal.style.display = "block";
}



const searchInput = document.querySelector(".search-bar");

searchInput.addEventListener("input", () => {
  const filtro = searchInput.value.toLowerCase();
  const filas = tablaBody.querySelectorAll("tr");

  filas.forEach(fila => {
    const codigo = fila.children[0].textContent.toLowerCase();
    const nombre = fila.children[1].textContent.toLowerCase();
    const grado = fila.children[2].textContent.toLowerCase();
    const seccion = fila.children[3].textContent.toLowerCase();

    if (codigo.includes(filtro) || nombre.includes(filtro) || grado.includes(filtro) || seccion.includes(filtro)) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });
});
















