// Este código implementa un chat educativo inclusivo para docentes, 
// donde al ingresar preguntas o palabras clave relacionadas con la 
// enseñanza de matemáticas (especialmente para niños con necesidades 
// especiales), el sistema responde automáticamente con estrategias
//  pedagógicas adaptadas. Incluye detección de errores ortográficos
//  leves, envío de mensajes del usuario, generación de respuestas y 
// visualización dinámica en pantalla.

const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

const respuestas = {
  "hola": "¡Hola! 😊 Soy tu asistente de matemáticas inclusivo. Puedes preguntarme cómo enseñar sumas, restas, multiplicaciones, divisiones o estrategias para niños con necesidades especiales.",
  "buenos dias": "¡Buenos días! ¿Quieres aprender maneras de enseñar matemáticas a todos tus alumnos?",
  "como estas": "Estoy listo para ayudarte a enseñar matemáticas de manera divertida y accesible.",
  "suma": "Para enseñar sumas, usa objetos concretos: 2 manzanas + 3 manzanas = 5 manzanas. Puedes pedir al niño que las cuente y agrupe.",
  "resta": "Para restas, muestra lo que hay y quita algunos objetos: 5 galletas - 2 galletas = 3 galletas. Usa dibujos, fichas o juguetes.",
  "multiplicacion": "Para multiplicar, usa grupos: 3 grupos de 4 lápices = 12 lápices. Puedes dibujarlo o usar fichas de colores.",
  "division": "Para dividir, reparte objetos: 12 caramelos entre 4 niños = 3 caramelos para cada uno. Hazlo visual y repetitivo.",
  "como enseñar a un niño autista a sumar": "Usa objetos concretos, repite los pasos, mantén rutinas visuales y colores llamativos. Hazlo divertido y usa canciones o dibujos.",
  "como enseñar a un niño autista a restar": "Usa juguetes o fichas. Muéstrale primero la cantidad total, luego quita algunos objetos y cuenten juntos cuántos quedan.",
  "como enseñar a un niño sordo a sumar": "Usa lenguaje de señas, imágenes claras y gestos. Muestra la operación paso a paso con objetos o dibujos.",
  "como enseñar a un niño sordo a restar": "Usa imágenes o tarjetas con números y objetos. Señala cada paso mientras lo explica en lenguaje de señas.",
  "como enseñar a un niño con dificultad visual a sumar": "Usa material táctil, cuentas, números en relieve o fichas con texturas. Que el niño toque y sienta cada cantidad.",
  "como enseñar a un niño con dificultad visual a restar": "Usa objetos contables, retíralos mientras el niño cuenta con sus manos. Repite varias veces hasta que entienda.",
  "estrategias para matematicas": "Usa juegos, canciones, dibujos, objetos concretos y repeticiones. Cada niño aprende diferente; adapta según sus necesidades.",
  "errores comunes": "Los niños confunden los signos +, -, x, ÷. Usa ejemplos visuales y repite varias veces. Hazlo divertido para que no se frustren.",
  "como enseñar a contar": "Usa objetos, dedos o dibujos. Cuenta despacio y pide al niño que repita. Hazlo interactivo y visual.",
  "como enseñar las tablas de multiplicar": "Usa canciones, dibujos, juegos de cartas, fichas de colores o grupos de objetos. Repite todos los días de forma divertida.",
  "como motivar a los niños a aprender matematicas": "Usa juegos, premios simbólicos, colores, historias y ejemplos de la vida real. Haz que participen activamente.",
  "que hacer si un niño no entiende": "Divide el problema en pasos pequeños, usa objetos concretos, repite y hazlo visual. Mantén la paciencia y la rutina.",
  "gracias": "¡De nada! 😊 Estoy aquí para ayudarte a enseñar matemáticas de forma inclusiva.",
  "adios": "¡Hasta luego! Que tengas un gran día enseñando matemáticas."
};

function palabrasSimilares(input, palabra) {
  input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  palabra = palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return palabra.includes(input) || input.includes(palabra);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mensaje = input.value.trim().toLowerCase();
  if (!mensaje) return;

  addMessage(input.value, "user");
  input.value = "";

  setTimeout(() => {
    let respuesta = "No entiendo, prueba otra pregunta de matemáticas o sobre cómo enseñar a niños con necesidades especiales.";

    for (let key in respuestas) {
      if (palabrasSimilares(mensaje, key)) {
        respuesta = respuestas[key];
        break;
      }
    }

    addMessage(respuesta, "bot");
  }, 500);
});

function addMessage(text, role) {
  const msg = document.createElement("div");
  msg.classList.add(role);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
