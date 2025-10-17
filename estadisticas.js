/* 
Este código administra la visualización de estadísticas de estudiantes en
 una plataforma infantil. Primero obtiene referencias a elementos del DOM 
 para mostrar KPIs, botones y la tabla de estudiantes, y configura los gráficos.
  Mantiene un estado con los estudiantes y su resumen, incluyendo total, registrados,
   promedio de progreso, riesgo y distribución por condición. Las funciones principales
    calculan el resumen, actualizan los KPIs, renderizan la tabla de estudiantes y crean
     tres gráficos usando Chart.js: un gráfico circular de condiciones, un gráfico de línea
      del progreso promedio por unidad y un gráfico de barras de distribución de progreso.
       También permite regenerar toda la información con un botón y exportar los datos y 
       gráficos a un PDF usando jsPDF, incluyendo la tabla y los gráficos en la misma página 
       o en varias páginas según sea necesario.
*/

const kTotalEstudiantes = document.getElementById("k_totalEstudiantes");
const kRegistrados = document.getElementById("k_registrados");
const kPromedioProgreso = document.getElementById("k_promedioProgreso");
const kRiesgo = document.getElementById("k_riesgo");
document.getElementById("exportPdf").addEventListener("click", exportarConGraficos);
const btnRegenerar = document.getElementById("regenerar");

const tablaBody = document.querySelector("#tablaEstudiantes tbody");

let chartCondiciones, chartUnidades, chartDistribucion;

let estado = {
  estudiantes: [
    { id:1, nombre:"Ana Pérez Gómez", condicion:"Autismo", unidad:"Tema 1", progreso:86 },
    { id:2, nombre:"Luis Martínez López", condicion:"Dificultad auditiva", unidad:"Tema 2", progreso:55 },
    { id:3, nombre:"María Torres Rivera", condicion:"Autismo", unidad:"Tema 1", progreso:86 },
    { id:4, nombre:"Carlos Fernández Díaz", condicion:"Dificultad visual", unidad:"Tema 3", progreso:12 },
    { id:5, nombre:"Mateo Gómez Ramírez", condicion:"Normal", unidad:"Tema 2", progreso:55 },
    { id:6, nombre:"Valeria Ruiz Ortega", condicion:"Normal", unidad:"Tema 1", progreso:86 },
    { id:7, nombre:"Camila Herrera Jiménez", condicion:"Dificultad visual", unidad:"Tema 3", progreso:12 },
    { id:8, nombre:"Tomás Aguilar Rivas", condicion:"Dificultad auditiva", unidad:"Tema 2", progreso:55 },
    { id:9, nombre:"Carlos Juan Gómez", condicion:"Miskito", unidad:"Tema 1", progreso:86 }
  ],
  resumen: {}
};

function calcularResumen(){
  const total = estado.estudiantes.length;
  const registrados = total;
  const progresoPromedio = Math.round(estado.estudiantes.reduce((s,e)=>s+e.progreso,0)/total);
  const riesgo = estado.estudiantes.filter(s=>s.progreso < 30).length;

  const porCondicion = {};
  estado.estudiantes.forEach(s=>{
    porCondicion[s.condicion] = (porCondicion[s.condicion] || 0) + 1;
  });

  estado.resumen = { total, registrados, progresoPromedio, riesgo, porCondicion };
  actualizarKPIs();
}

function actualizarKPIs(){
  kTotalEstudiantes.textContent = estado.resumen.total;
  kRegistrados.textContent = estado.resumen.registrados;
  kPromedioProgreso.textContent = estado.resumen.progresoPromedio + "%";
  kRiesgo.textContent = estado.resumen.riesgo;
}

function renderTabla(){
  tablaBody.innerHTML = "";
  estado.estudiantes.forEach(est=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${est.id}</td>
      <td>${est.nombre}</td>
      <td>${est.unidad}</td>
      <td>${est.progreso}%</td>
      <td>${est.condicion}</td>
    `;
    tablaBody.appendChild(tr);
  });
}

function crearGraficas(){
  const azulOscuro = "#1a237e";
  const azulMedio = "#3949ab";
  const azulClaro = "#5c6bc0";
  const celeste = "#90caf9";

  // Condiciones (pie)
  const ctxC = document.getElementById("chartCondiciones").getContext("2d");
  if(chartCondiciones) chartCondiciones.destroy();
  chartCondiciones = new Chart(ctxC, {
    type: 'pie',
    data: {
      labels: Object.keys(estado.resumen.porCondicion),
      datasets: [{
        data: Object.values(estado.resumen.porCondicion),
        backgroundColor: [azulOscuro, azulMedio, azulClaro, celeste, "#bbdefb"],
        borderColor: "#ffffff",
        borderWidth: 2
      }]
    },
    options: { 
      responsive: true, 
      plugins: { 
        legend: { position: 'bottom', labels: { color: azulOscuro } }
      } 
    }
  });

  const temas = ["Tema 1","Tema 2","Tema 3"];
  const promedios = temas.map(t=>{
    const filtrado = estado.estudiantes.filter(e=>e.unidad===t);
    if(filtrado.length===0) return 0;
    return Math.round(filtrado.reduce((s,e)=>s+e.progreso,0)/filtrado.length);
  });
  const ctxU = document.getElementById("chartUnidades").getContext("2d");
  if(chartUnidades) chartUnidades.destroy();
  chartUnidades = new Chart(ctxU, {
    type:'line',
    data:{
      labels:temas,
      datasets:[{
        label:'Progreso promedio',
        data:promedios,
        fill:false,
        tension:0.3,
        borderColor: azulOscuro,
        backgroundColor: azulMedio,
        pointBackgroundColor: azulOscuro,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: azulOscuro
      }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ position:'bottom', labels:{ color: azulOscuro } } },
      scales:{
        x:{ ticks:{ color: azulOscuro } },
        y:{ ticks:{ color: azulOscuro } }
      }
    }
  });

  const bins = [0,20,40,60,80,100];
  const counts = bins.slice(0,-1).map((b,i)=>{
    const min=b, max=bins[i+1];
    return estado.estudiantes.filter(s=>s.progreso>=min && s.progreso<max).length;
  });
  counts.push(estado.estudiantes.filter(s=>s.progreso===100).length);
  const ctxDist = document.getElementById("chartDistribucion").getContext("2d");
  if(chartDistribucion) chartDistribucion.destroy();
  chartDistribucion = new Chart(ctxDist, {
    type:'bar',
    data:{
      labels:["0-19","20-39","40-59","60-79","80-99","100"],
      datasets:[{
        label:'Estudiantes',
        data:counts,
        backgroundColor: azulMedio,
        borderColor: azulOscuro,
        borderWidth: 1
      }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ ticks:{ color: azulOscuro } },
        y:{ ticks:{ color: azulOscuro } }
      }
    }
  });
}

function inicializar(){
  calcularResumen();
  renderTabla();
  crearGraficas();
}

btnRegenerar.addEventListener("click", ()=>inicializar());

inicializar();

async function exportarConGraficos() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');

  doc.setFontSize(18);
  doc.text("📊 Estadísticas - Plataforma Infantil", 40, 40);

  doc.setFontSize(12);
  let startY = 60;
  const headers = [["ID","Nombre","Unidad","Progreso","Condición"]];
  const rows = estado.estudiantes.map(e=>[e.id,e.nombre,e.unidad,e.progreso+"%",e.condicion]);

  doc.autoTable({
    startY: startY,
    head: headers,
    body: rows,
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  startY = doc.lastAutoTable.finalY + 20;

  const graficos = [
    { id: "chartCondiciones", titulo: "Distribución por condición" },
    { id: "chartUnidades", titulo: "Progreso promedio por unidad" },
    { id: "chartDistribucion", titulo: "Distribución de progreso (bins)" }
  ];

  for (let g of graficos) {
    const canvas = document.getElementById(g.id);
    const imgData = canvas.toDataURL("image/png", 1.0);

    doc.setFontSize(14);
    doc.text(g.titulo, 40, startY);
    doc.addImage(imgData, 'PNG', 40, startY + 10, 250, 200);
    startY += 220;

    if (startY > 700) {
      doc.addPage();
      startY = 40;
    }
  }

  doc.save("estadisticas_plataforma.pdf");
}
