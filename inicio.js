// Este código define un objeto con datos simulados de un estudiante y 
// selecciona elementos del DOM para mostrar dichos datos; luego, mediante
//  la función cargarDatos, actualiza dinámicamente el contenido y la barra
//  de progreso en la página al cargarse, reflejando progreso, objetivos,
//  asistencia y recomendaciones.

const datos = {
  progreso: 78,
  objetivos: 12,
  asistencia: "95%",
  recomendacion: "Refuerza la suma con actividades interactivas "
};

const barraProgreso = document.getElementById("barraProgreso");
const porcentajeProgreso = document.getElementById("porcentajeProgreso");
const datoProgreso = document.getElementById("datoProgreso");
const datoObjetivos = document.getElementById("datoObjetivos");
const datoAsistencia = document.getElementById("datoAsistencia");
const datoRecomendacion = document.getElementById("datoRecomendacion");

function cargarDatos() {
  barraProgreso.style.width = datos.progreso + "%";
  porcentajeProgreso.textContent = datos.progreso + "%";
  datoProgreso.textContent = datos.progreso + "%";
  datoObjetivos.textContent = datos.objetivos;
  datoAsistencia.textContent = datos.asistencia;
  datoRecomendacion.textContent = datos.recomendacion;
}

window.addEventListener("load", cargarDatos);
