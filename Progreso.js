// Este código crea un gráfico de barras que muestra el desempeño de un estudiante de 1° 
// grado en diferentes temas de Matemática, y actualiza en el HTML los temas con mejor y
//  peor desempeño junto con una recomendación personalizada.


document.addEventListener("DOMContentLoaded", () => {
  const temas = [
    "Números del 1 al 20",
    "Sumas simples",
    "Restas simples",
    "Figuras geométricas",
    "Comparación de cantidades",
  ];

  const puntajes = [85, 92, 70, 88, 75];

  const ctx = document.getElementById("graficoMatematicas");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: temas,
      datasets: [
        {
          label: "Desempeño (%)",
          data: puntajes,
          backgroundColor: [
            "#0057a3",
            "#1976d2",
            "#4da3ff",
            "#5db0ff",
            "#a4d1ff",
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });

  const mejor = temas[puntajes.indexOf(Math.max(...puntajes))];
  const peor = temas[puntajes.indexOf(Math.min(...puntajes))];

  document.getElementById("temaAlto").textContent = `${mejor} (${Math.max(...puntajes)}%)`;
  document.getElementById("temaBajo").textContent = `${peor} (${Math.min(...puntajes)}%)`;
  document.getElementById("recomendacion").textContent =
    peor === "Restas simples"
      ? "Practiquen restas con objetos del hogar "
      : `Repasen juntos el tema de ${peor} con ejemplos prácticos `;
});
