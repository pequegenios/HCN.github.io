// Este código gestiona una agenda simple en la que se almacenan tareas,
//  eventos y recordatorios. Contiene un arreglo de ejemplo con objetos 
// que representan cada elemento de la agenda, incluyendo su tipo, título,
//  descripción, fecha y estado. La función `renderAgenda` se encarga de
//  mostrar los elementos en el HTML, aplicando filtros opcionales por
//  tipo y fecha, y mostrando un mensaje si no hay elementos. Se utilizan
//  funciones auxiliares: `iconoPorTipo` para asignar un icono según
//  el tipo de elemento y `formatearFecha` para mostrar la fecha en formato
//  legible en español. Además, se agrega un listener al botón de filtrar para
//  actualizar la vista según las selecciones del usuario, y finalmente se inicializa
//  la agenda mostrando todos los elementos.

const agenda = [
  { tipo: "tarea", titulo: "Tarea de Matemática", descripcion: "Resolver páginas 20-22 del libro.", fecha: "2025-10-16", estado: "pendiente" },
  { tipo: "evento", titulo: "Reunión de padres", descripcion: "Charla informativa sobre progreso escolar.", fecha: "2025-10-18", estado: "pendiente" },
  { tipo: "recordatorio", titulo: "Enviar material de arte", descripcion: "Traer pinturas y pinceles el lunes.", fecha: "2025-10-17", estado: "completado" },
  { tipo: "tarea", titulo: "Lectura de Lenguaje", descripcion: "Leer el cuento 'El sol curioso'.", fecha: "2025-10-20", estado: "pendiente" }
];


function renderAgenda(filtroTipo = "todos", filtroFecha = "") {
  const contenedor = document.getElementById("listaAgenda");
  contenedor.innerHTML = "";

  const filtrados = agenda.filter(item => {
    const tipoOK = filtroTipo === "todos" || item.tipo === filtroTipo;
    const fechaOK = !filtroFecha || item.fecha === filtroFecha;
    return tipoOK && fechaOK;
  });

  if (filtrados.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; color:#555;">No hay elementos para mostrar</p>`;
    return;
  }

  filtrados.forEach(item => {
    const div = document.createElement("div");
    div.className = "item-agenda";
    div.innerHTML = `
      <div class="item-info">
        <i class="fa-solid ${iconoPorTipo(item.tipo)}"></i>
        <div class="item-text">
          <h4>${item.titulo}</h4>
          <p>${item.descripcion}</p>
          <small>📅 ${formatearFecha(item.fecha)}</small>
        </div>
      </div>
      <span class="estado ${item.estado}">${item.estado.toUpperCase()}</span>
    `;
    contenedor.appendChild(div);
  });
}

function iconoPorTipo(tipo) {
  switch (tipo) {
    case "tarea": return "fa-book";
    case "evento": return "fa-calendar-check";
    case "recordatorio": return "fa-bell";
    default: return "fa-note-sticky";
  }
}

function formatearFecha(fecha) {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}


document.getElementById("btnFiltrar").addEventListener("click", () => {
  const tipo = document.getElementById("filtroTipo").value;
  const fecha = document.getElementById("filtroFecha").value;
  renderAgenda(tipo, fecha);
});


renderAgenda();
