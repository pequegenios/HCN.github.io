/* 
Este script implementa un juego educativo para niños en el que deben enlazar números con la cantidad correspondiente de frutas o animales. 
Incluye:

1. Manejo de contenedores para números, imágenes pendientes y correctas.
2. Reproducción de sonidos de acierto y error.
3. Gestión de múltiples modales:
   - Modal de estrellas obtenidas al finalizar el juego.
   - Modal de personaje desbloqueado.
   - Modal de colección de personajes.
   - Modal motivacional con opciones de repetir o volver al mapa.
   - Modal de bienvenida al iniciar el juego.
4. Uso de LocalStorage para guardar la colección de personajes desbloqueados.
5. Datos del juego: objetos (números e imágenes) y héroes de Nicaragua.
6. Funciones de texto a voz para guiar al niño durante el juego usando SpeechSynthesis.
7. Funciones para generar los números y las imágenes de manera aleatoria.
8. Drag & Drop para arrastrar números a las imágenes correctas, con validación de aciertos y errores.
9. Frases motivacionales según si el jugador acierta o falla.
10. Lógica de desbloqueo de personajes y actualización de la colección.
11. Modal de bienvenida con botón para iniciar automáticamente el juego.
*/

const numerosContainer = document.getElementById("numeros");
const imagenesPendientesContainer = document.getElementById("imagenesPendientes");
const imagenesCorrectasContainer = document.getElementById("imagenesCorrectas");

const correctoSound = document.getElementById("correcto");
const errorSound = document.getElementById("error");

const modalEstrellas = document.getElementById("modalEstrellas");
const estrellasModal = document.getElementById("estrellasModal");
const cerrarModalEstrellas = document.getElementById("cerrarModalEstrellas");
const aceptarEstrellasBtn = document.getElementById("aceptarEstrellas");

const modalPersonaje = document.getElementById("modalPersonaje");
const personajeDesbloqueadoImg = document.getElementById("personajeDesbloqueado");
const nombrePersonajeEl = document.getElementById("nombrePersonaje");
const descripcionPersonajeEl = document.getElementById("descripcionPersonaje");
const verColeccionBtn = document.getElementById("verColeccion");
const aceptarPersonajeBtn = document.getElementById("aceptarPersonaje");

const modalColeccion = document.getElementById("modalColeccion");
const coleccionPersonajesDiv = document.getElementById("coleccionPersonajes");
const cerrarColeccionBtn = document.getElementById("cerrarColeccion");

const modalMotivacional = document.getElementById("modalMotivacional");
const volverMapaBtn = document.getElementById("volverMapa");
const repetirJuegoBtn = document.getElementById("repetirJuego");

let coleccion = JSON.parse(localStorage.getItem("coleccionPersonajes")) || [];

const objetos = [
    {num: 1, img: "imagenes/1 sandia.png"},
    {num: 2, img: "imagenes/2 mariquitas.png"},
    {num: 3, img: "imagenes/3 bananas.png"},
    {num: 4, img: "imagenes/4 vacas.png"},
    {num: 5, img: "imagenes/5 piñas.png"},
    {num: 6, img: "imagenes/6 gallinas.png"},
    {num: 7, img: "imagenes/7 limones.png"},
    {num: 8, img: "imagenes/8 cerditos.png"},
    {num: 9, img: "imagenes/9 gatos.png"},
    {num: 10, img: "imagenes/10 zanahorias.png"}
];

const personajes = [
    {img: "ruben.png", nombre: "Rubén Darío", descripcion: "Es un héroe valiente y curioso, conocido como el máximo poeta de Nicaragua."},
    {img: "sandino.png", nombre: "Augusto César Sandino", descripcion: "Siempre busca aventuras y lucha por la justicia de su pueblo."},
    {img: "benjamin.png", nombre: "Benjamín Zeledón", descripcion: "Es inteligente y creativo, defensor de la patria."},
    {img: "mongalo.png", nombre: "Enmanuel Mongalo", descripcion: "Divertido y muy amigable, un héroe nicaragüense que inspiró cambios."}
];

let dragged = null;
let numerosPendientes = objetos.map(obj => obj.num);
let errores = 0;
let juegoIniciado = false;

const frasesCorrecto = ["¡Muy bien!","¡Excelente!","¡Lo lograste!","¡Eres increíble!","¡Genial!"];
const frasesError = ["Intenta otra vez","¡Casi! Prueba de nuevo","No te rindas","¡Vamos, tú puedes!"];
const frasesNumeros = {
    1: "Busca 1 sandía",
    2: "Busca 2 mariquitas",
    3: "Busca 3 bananas",
    4: "Busca 4 vacas",
    5: "Busca 5 piñas",
    6: "Busca 6 gallinas",
    7: "Busca 7 limones",
    8: "Busca 8 cerditos",
    9: "Busca 9 gatos",
    10: "Busca 10 zanahorias"
};

const vozCola = [];
let hablando = false;

function speak(text){
    vozCola.push(text);
    if(!hablando) hablarSiguiente();
}

function hablarSiguiente(){
    if(vozCola.length === 0){
        hablando = false;
        return;
    }

    hablando = true;
    const texto = vozCola.shift();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-MX";
    utterance.rate = 1.05;
    utterance.pitch = 1.3;
    utterance.volume = 1.0;

    utterance.onend = () => {
        hablando = false;
        hablarSiguiente();
    };

    window.speechSynthesis.speak(utterance);
}

function generarNumeros(){
    numerosContainer.innerHTML = "";
    objetos.forEach(obj => {
        const numero = document.createElement("div");
        numero.classList.add("numero");
        numero.draggable = true;
        numero.textContent = obj.num;
        numero.dataset.num = obj.num;
        numerosContainer.appendChild(numero);
    });
}

function generarImagenes(){
    imagenesPendientesContainer.innerHTML = "";
    let imagenesDesordenadas = [...objetos].sort(()=> Math.random() - 0.5);
    imagenesDesordenadas.forEach(obj => {
        const imagen = document.createElement("div");
        imagen.classList.add("imagen");
        imagen.dataset.num = obj.num;
        const imgEl = document.createElement("img");
        imgEl.src = obj.img;
        imgEl.style.width = "110px";
        imagen.appendChild(imgEl);
        imagenesPendientesContainer.appendChild(imagen);
    });
}

function highlightCorrect(num){
    document.querySelectorAll(".imagen").forEach(img=>{
        img.classList.toggle("highlight", parseInt(img.dataset.num) === num);
    });
}

function clearHighlights(){
    document.querySelectorAll(".imagen").forEach(img=> img.classList.remove("highlight"));
}

function instruccionSiguiente(){
    if(!juegoIniciado){
        juegoIniciado = true;
        speak("Vamos a enlazar los números con la cantidad de frutas o animales. ¡Hazlo genial!");
        setTimeout(() => {
            if(numerosPendientes.length > 0){
                const siguiente = numerosPendientes[0];
                highlightCorrect(siguiente);
                speak(frasesNumeros[siguiente]);
            }
        }, 1400);
    } else if(numerosPendientes.length > 0){
        const siguiente = numerosPendientes[0];
        highlightCorrect(siguiente);
        speak(frasesNumeros[siguiente]);
    } else {
        mostrarEstrellas();
    }
}

document.addEventListener("dragstart", e=>{
    if(e.target.classList.contains("numero")){
        dragged = e.target;
        clearHighlights();
        const num = parseInt(dragged.dataset.num);
        if(numerosPendientes.includes(num)) highlightCorrect(num);
    }
});
document.addEventListener("dragend", e=> clearHighlights());

imagenesPendientesContainer.addEventListener("dragover", e=> e.preventDefault());
imagenesPendientesContainer.addEventListener("drop", e=>{
    if(e.target.classList.contains("imagen") || e.target.tagName==="IMG"){
        const target = e.target.classList.contains("imagen") ? e.target : e.target.parentElement;
        const numDragged = parseInt(dragged.dataset.num);

        if(numDragged === parseInt(target.dataset.num)){
            correctoSound.play();
            target.appendChild(dragged);
            dragged.draggable = false;
            dragged.classList.add("correcto");

            numerosPendientes = numerosPendientes.filter(n=> n !== numDragged);
            imagenesCorrectasContainer.appendChild(target);

            speak(frasesCorrecto[Math.floor(Math.random()*frasesCorrecto.length)]);
            setTimeout(()=> { 
                dragged.classList.remove("correcto"); 
                instruccionSiguiente(); 
            }, 800);
        }else{
            errorSound.play();
            errores++;
            dragged.classList.add("incorrecto");
            speak(frasesError[Math.floor(Math.random()*frasesError.length)]);
            setTimeout(()=> dragged.classList.remove("incorrecto"), 500);
        }
    }
});

function mostrarEstrellas(){
    estrellasModal.innerHTML="";
    let cantidad=1;
    if(errores <= 2) cantidad=3;
    else if(errores <=5) cantidad=2;

    for(let i=0; i<cantidad; i++){
        const star = document.createElement("span");
        star.textContent = "⭐";
        star.style.fontSize="3rem";
        star.style.margin="0 5px";
        estrellasModal.appendChild(star);
    }
// Guardar progreso nivel 2
localStorage.setItem("progreso_nivel2", JSON.stringify({
  completado: true,
  estrellas: cantidad
}));

    modalEstrellas.style.display = "flex";
    speak(`¡Juego terminado! Obtuviste ${cantidad} estrellas.`);
}

cerrarModalEstrellas.onclick = ()=> modalEstrellas.style.display = "none";
aceptarEstrellasBtn.onclick = ()=> {
    modalEstrellas.style.display = "none";
    setTimeout(mostrarPersonajeDesbloqueado, 300);
}

function mostrarPersonajeDesbloqueado(){
    const disponibles = personajes.filter(p => !coleccion.includes(p.img));
    let seleccionado;

    if(disponibles.length > 0){
        seleccionado = disponibles[Math.floor(Math.random()*disponibles.length)];
        coleccion.push(seleccionado.img);
        localStorage.setItem("coleccionPersonajes", JSON.stringify(coleccion));
    } else {
        seleccionado = personajes[Math.floor(Math.random()*personajes.length)];
    }

    personajeDesbloqueadoImg.src = "imagenes/" + seleccionado.img;
    nombrePersonajeEl.textContent = seleccionado.nombre;
    descripcionPersonajeEl.textContent = seleccionado.descripcion;

    modalPersonaje.style.display = "flex";
    setTimeout(() => speak(`Felicidades, has desbloqueado a ${seleccionado.nombre}`), 300);
}

verColeccionBtn.onclick = ()=>{
    coleccionPersonajesDiv.innerHTML="";
    coleccion.forEach(p=>{
        const personaje = personajes.find(obj=> obj.img === p);
        if(personaje){
            const img = document.createElement("img");
            img.src = "imagenes/" + personaje.img;
            img.style.width = "80px";
            img.style.margin = "5px";
            coleccionPersonajesDiv.appendChild(img);
        }
    });
    modalColeccion.style.display = "flex";
}

cerrarColeccionBtn.onclick = ()=> modalColeccion.style.display = "none";

aceptarPersonajeBtn.onclick = ()=>{
    modalPersonaje.style.display = "none";
    modalMotivacional.style.display = "flex";
}

volverMapaBtn.onclick = ()=> location.href="mapa_autismo.html";

repetirJuegoBtn.onclick = ()=> location.reload();

const modalBienvenida = document.createElement("div");
modalBienvenida.id = "modalBienvenida";
modalBienvenida.style.position = "fixed";
modalBienvenida.style.top = 0;
modalBienvenida.style.left = 0;
modalBienvenida.style.width = "100%";
modalBienvenida.style.height = "100%";
modalBienvenida.style.backgroundColor = "rgba(0,0,0,0.7)";
modalBienvenida.style.display = "flex";
modalBienvenida.style.flexDirection = "column";
modalBienvenida.style.justifyContent = "center";
modalBienvenida.style.alignItems = "center";
modalBienvenida.style.zIndex = 9999;

const bienvenidaImg = document.createElement("img");
bienvenidaImg.src = "imagenes/mx.jpg";
bienvenidaImg.style.width = "200px";
bienvenidaImg.style.marginBottom = "20px";

const bienvenidaText = document.createElement("h2");
bienvenidaText.textContent = "¡Bienvenido soy Max, vincularemos los numeros con la cantidad de fruras!";

const iniciarBtn = document.createElement("button");
iniciarBtn.textContent = "Iniciar Juego";
iniciarBtn.style.fontSize = "1.5rem";
iniciarBtn.style.padding = "10px 20px";
iniciarBtn.style.marginTop = "10px";

modalBienvenida.appendChild(bienvenidaImg);
modalBienvenida.appendChild(bienvenidaText);
modalBienvenida.appendChild(iniciarBtn);
document.body.prepend(modalBienvenida);

iniciarBtn.addEventListener("click", ()=>{
    modalBienvenida.style.display = "none";
    generarNumeros();
    generarImagenes();
    instruccionSiguiente();
});
