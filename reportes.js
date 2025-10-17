// Este código crea un gráfico de barras usando Chart.js, mostrando el porcentaje 
// de logro en distintas áreas (Sumas, Restas, Multiplicaciones, Divisiones, Geometría)
//  con barras azules, bordes redondeados y un eje Y que va de 0 a 100, sin mostrar la
//  leyenda y con diseño responsivo.

const ctx = document.getElementById("chartRendimiento");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Sumas", "Restas", "Multiplicaciones", "Divisiones", "Geometría"],
    datasets: [{
      label: "Porcentaje de Logro",
      data: [90, 85, 75, 70, 88],
      backgroundColor: "#4da3ff",
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});
