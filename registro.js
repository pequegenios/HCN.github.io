// Este código gestiona un formulario de registro y seguimiento de estudiantes, 
// incluyendo carga automática de datos desde un JSON predefinido, manejo de secciones 
// habilitadas según la acción del usuario, gestión de historial de notas con opción de
//  agregar nuevas notas mediante un modal, selección dinámica de municipios según el
//  departamento, almacenamiento de los estudiantes registrados en localStorage, validación
//  de códigos duplicados, y generación de credenciales y PDF con los datos del estudiante.

const btnCargar = document.getElementById("btnCargar");
const inputCodigo = document.getElementById("codigo_mined");
const selectGrado = document.getElementById("grado");
const selectDepartamento = document.getElementById("departamento");
const selectMunicipio = document.getElementById("municipio");

const camposAuto = {
  nombre1: document.getElementById("nombre1"),
  nombre2: document.getElementById("nombre2"),
  apellido1: document.getElementById("apellido1"),
  apellido2: document.getElementById("apellido2"),
  fecha_nacimiento: document.getElementById("fecha_nacimiento")
};

const secciones = {
  datosEscolares: document.querySelector(".datos-escolares"),
  datosTutor: document.querySelector(".datos-tutor"),
  historial: document.querySelector(".historial"),
  registroFinal: document.querySelector(".registro-final")
};

const btnRegistrar = document.getElementById("btnRegistrar");
const btnHistorial = document.getElementById("btnHistorial");

const modal = document.getElementById("modalMensaje");
const textoModal = document.getElementById("textoModal");
const cerrarModal = document.getElementById("cerrarModal");

function mostrarModal(mensaje){
  textoModal.innerHTML = mensaje;
  modal.style.display = "block";
}
cerrarModal.addEventListener("click", ()=> modal.style.display="none");
window.addEventListener("click", e=>{ if(e.target===modal) modal.style.display="none"; });

const modalAgregarNota = document.getElementById("modalAgregarNota");
const inputNota = document.getElementById("inputNota");
const btnAceptarNota = document.getElementById("btnAceptarNota");
const btnCancelarNota = document.getElementById("btnCancelarNota");


let estudiantesRegistrados = JSON.parse(localStorage.getItem("estudiantesRegistrados")) || [];


const estudiantesJSON = [
  {"codigo_mined":"20250001","nombre1":"Carlos","nombre2":"Eduardo","apellido1":"Martinez","apellido2":"Lopez","fecha_nacimiento":"2012-05-03"},
  {"codigo_mined":"20250002","nombre1":"Ana","nombre2":"Maria","apellido1":"Gonzalez","apellido2":"Perez","fecha_nacimiento":"2011-08-12"},
  {"codigo_mined":"20250003","nombre1":"Luis","nombre2":"Alberto","apellido1":"Rodriguez","apellido2":"Mena","fecha_nacimiento":"2010-11-22"},
  {"codigo_mined":"20250004","nombre1":"Sofia","nombre2":"Isabel","apellido1":"Torres","apellido2":"Diaz","fecha_nacimiento":"2012-01-15"},
  {"codigo_mined":"20250005","nombre1":"Miguel","nombre2":"Angel","apellido1":"Ramirez","apellido2":"Vega","fecha_nacimiento":"2011-06-18"},
  {"codigo_mined":"20250006","nombre1":"Laura","nombre2":"Fernanda","apellido1":"Lopez","apellido2":"Garcia","fecha_nacimiento":"2010-09-20"},
  {"codigo_mined":"20250007","nombre1":"Jose","nombre2":"Antonio","apellido1":"Hernandez","apellido2":"Cruz","fecha_nacimiento":"2012-02-10"},
  {"codigo_mined":"20250008","nombre1":"Mariana","nombre2":"Lucia","apellido1":"Ramirez","apellido2":"Torres","fecha_nacimiento":"2011-07-05"},
  {"codigo_mined":"20250009","nombre1":"David","nombre2":"Fernando","apellido1":"Gomez","apellido2":"Diaz","fecha_nacimiento":"2010-03-30"},
  {"codigo_mined":"20250010","nombre1":"Isabel","nombre2":"Camila","apellido1":"Santos","apellido2":"Morales","fecha_nacimiento":"2012-04-08"}
];


const municipios = {
  "Matagalpa":["Matagalpa","San Ramón"],
  "Esteli":["Estelí","San Juan de Limay"],
  "Jinotega":["Jinotega","La Concordia"]
};


btnCargar.addEventListener("click", () => {
  const codigo = inputCodigo.value.trim();
  if (!codigo) return mostrarModal("Ingrese código MINED");

  if (estudiantesRegistrados.some(e => e.codigo_mined === codigo)) {
    return mostrarModal("Upss, estudiante ya registrado");
  }

  const estudiante = estudiantesJSON.find(e => e.codigo_mined === codigo);
  if (!estudiante) return mostrarModal("Código no encontrado");

  Object.keys(camposAuto).forEach(k => camposAuto[k].value = estudiante[k]);

  Object.values(secciones).forEach(sec => {
    sec.classList.remove("bloqueado");
    sec.querySelectorAll("input, select, button").forEach(c => c.disabled = false);
  });

  selectMunicipio.innerHTML = '<option value="">Seleccione...</option>';
  const dep = selectDepartamento.value;
  if (dep && municipios[dep]) {
    municipios[dep].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m; opt.textContent = m;
      selectMunicipio.appendChild(opt);
    });
  }

  mostrarModal(`Datos cargados correctamente para ${estudiante.nombre1} ${estudiante.apellido1}`);
});

selectDepartamento.addEventListener("change", () => {
  selectMunicipio.innerHTML = '<option value="">Seleccione...</option>';
  const dep = selectDepartamento.value;
  if (dep && municipios[dep]) {
    municipios[dep].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m; opt.textContent = m;
      selectMunicipio.appendChild(opt);
    });
  }
});

let historialNotas = {}; 
let codigoActual = null;
let parcialActual = 0;

btnHistorial.addEventListener("click", () => {
  codigoActual = inputCodigo.value.trim();
  if (!codigoActual) return;
  mostrarHistorial(codigoActual);
});

function inicializarNotas(grado){
  if(grado==="2") return [100,90,80,96];
  if(grado==="3") return [90,98,80,84,95,90,80];
  if(grado==="4") return [80,82,85,88,90,92,95,97,100];
  return [];
}

function mostrarHistorial(codigo){
  let notas = historialNotas[codigo] || inicializarNotas(selectGrado.value);
  historialNotas[codigo] = notas;

  let contenido = `<strong>Historial de Matemáticas:</strong><br>`;
  if (notas.length === 0) contenido += "Aún no hay notas registradas<br>";
  else notas.forEach((n,i) => contenido += `Parcial ${i+1}: ${n}<br>`);
  contenido += `<br><button id="btnAgregarNota">Agregar Nota</button>`;
  mostrarModal(contenido);

  document.getElementById("btnAgregarNota").addEventListener("click", () => {
    parcialActual = notas.length + 1;
    inputNota.value = "";
    modalAgregarNota.style.display = "block";
  });
}

btnCancelarNota.addEventListener("click", () => modalAgregarNota.style.display="none");

btnAceptarNota.addEventListener("click", () => {
  let valor = parseInt(inputNota.value);
  if(isNaN(valor) || valor < 0) valor = 0;
  if(valor > 100) valor = 100;

  let notas = historialNotas[codigoActual] || [];
  notas.push(valor);
  historialNotas[codigoActual] = notas;

  modalAgregarNota.style.display = "none";
  mostrarHistorial(codigoActual);
});

btnRegistrar.addEventListener("click", () => {
  const codigo = inputCodigo.value.trim();
  if (!codigo) return mostrarModal("Ingrese código MINED");

  if (estudiantesRegistrados.some(e => e.codigo_mined === codigo)) {
    return mostrarModal("Upss, estudiante ya registrado");
  }

  const estudiante = {
    codigo_mined: codigo,
    nombre1: camposAuto.nombre1.value,
    nombre2: camposAuto.nombre2.value,
    apellido1: camposAuto.apellido1.value,
    apellido2: camposAuto.apellido2.value,
    fecha_nacimiento: camposAuto.fecha_nacimiento.value,
    departamento: selectDepartamento.value,
    municipio: selectMunicipio.value,
    escuela: document.getElementById("escuela").value,
    grado: selectGrado.value,
    seccion: document.getElementById("seccion").value,
    condicion: document.getElementById("condicion").value,
    nombre_tutor: document.getElementById("nombre_tutor").value,
    telefono_tutor: document.getElementById("telefono_tutor").value,
    correo_tutor: document.getElementById("correo_tutor").value,
    notas: historialNotas[codigo] || []
  };

  estudiantesRegistrados.push(estudiante);
  localStorage.setItem("estudiantesRegistrados", JSON.stringify(estudiantesRegistrados));

  const year = new Date().getFullYear();
  const usuario = estudiante.nombre1.toLowerCase() + year;
  const fechaNac = new Date(estudiante.fecha_nacimiento);
  const contrasena = `MINED${fechaNac.getFullYear()}`;

  mostrarModal(`
    Usuario: ${usuario}<br>
    Contraseña: ${contrasena}<br><br>
    <button id="btnDescargarPDF">Descargar PDF</button>
    <button id="btnCerrarModal">Cerrar</button>
  `);

  document.getElementById("btnCerrarModal").addEventListener("click", ()=> modal.style.display="none");
  document.getElementById("btnDescargarPDF").addEventListener("click", ()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Expediente del Estudiante", 20, 20);
    let y=30;
    Object.entries(estudiante).forEach(([k,v])=>{
      doc.text(`${k}: ${v}`, 20, y); y+=10;
    });
    doc.save(`${estudiante.nombre1}_${estudiante.apellido1}_Expediente.pdf`);
  });
});
