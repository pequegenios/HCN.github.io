// Este código administra y muestra una lista de estudiantes en una tabla HTML,
//  permite filtrar la lista mediante una barra de búsqueda que busca por código,
//  nombre o condición, y además genera un gráfico de avance tipo "doughnut" usando 
// Chart.js para mostrar visualmente el progreso general.

const estudiantes = [
  { codigo: "20250006", nombre: "Ana Pérez Gómez", condicion: "Autismo" },
  { codigo: "20253158", nombre: "Luis Martínez López", condicion: "Dificultad Auditiva" },
  { codigo: "20256455", nombre: "María Torres Rivera", condicion: "Autismo" },
  { codigo: "20258975", nombre: "Carlos Fernández Díaz", condicion: "Dificultad Visual" },
  { codigo: "20253033", nombre: "Mateo Gómez Ramírez", condicion: "Normal" },
  { codigo: "20258509", nombre: "Valeria Ruiz Ortega", condicion: "Normal" },
  { codigo: "20255796", nombre: "Camila Herrera Jiménez", condicion: "Dificultad Visual" },
  { codigo: "20253428", nombre: "Tomás Aguilar Rivas", condicion: "Dificultad Auditiva" },
  { codigo: "20258462", nombre: "Carlos Juan Gómez", condicion: "Miskito" }
];


const tbody = document.getElementById("estudiantesList");

function mostrarEstudiantes(lista) {
  tbody.innerHTML = "";
  lista.forEach(e => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.codigo}</td>
      <td>${e.nombre}</td>
      <td>${e.condicion}</td>
    `;
    tbody.appendChild(row);
  });
}

mostrarEstudiantes(estudiantes);


const searchInput = document.querySelector(".search-bar");

searchInput.addEventListener("input", e => {
  const texto = e.target.value.toLowerCase().trim();

  const filtrados = estudiantes.filter(est =>
    est.codigo.toLowerCase().includes(texto) ||
    est.nombre.toLowerCase().includes(texto) ||
    est.condicion.toLowerCase().includes(texto)
  );

  mostrarEstudiantes(filtrados);
});


const ctx = document.getElementById("avanceChart").getContext("2d");
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Avance", "Faltante"],
    datasets: [{
      data: [60, 40],
      backgroundColor: ["#1E3A8A", "#E5E7EB"],
      borderWidth: 0
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    cutout: "70%"
  }
});
