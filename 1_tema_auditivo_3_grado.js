/* 
Este script implementa un juego educativo interactivo sobre la lectura de horas en un reloj analógico, diseñado para niños. 
El juego tiene múltiples niveles, cada uno con una hora objetivo que el niño debe marcar moviendo las manecillas del reloj. 
Incluye videos de instrucción, verificación de la hora marcada, animación de confeti al acertar y un sistema de estrellas basado en errores cometidos. 
Al finalizar, se desbloquea un héroe de Nicaragua que se muestra en una colección, y el usuario puede cerrar la colección para continuar a otra pantalla.

Funciones principales:
- Normalización y cálculo de ángulos de manecillas.
- Arrastrar y soltar manecillas con el mouse.
- Mostrar la hora que el usuario está marcando.
- Reproducción de videos de instrucción y refuerzo.
- Verificación de la hora marcada con tolerancia de errores.
- Animación de confeti para celebrar aciertos.
- Sistema de puntuación con estrellas según los errores.
- Desbloqueo y visualización de héroes.
- Pantallas inicial y final con interacción del usuario.
*/

const nivelHoras = [
    {h:3, m:30, video:"videos/3.mp4", descripcion:"Coloca la manecilla roja en 3 y la manecilla azul en 30 minutos"},
    {h:7, m:0, video:"videos/7.mp4", descripcion:"Coloca la manecilla roja en 7 y la manecilla azul en 00"},
    {h:10, m:45, video:"videos/10.mp4", descripcion:"Coloca la manecilla roja en 10 y la manecilla azul en 45"}
];

let nivelActual = 0;
let errores = 0;
let heroesDesbloqueados = [];

const heroes = [
    {nombre:"Ruben", imagen:"ruben.png", descripcion:"Un héroe valiente de Nicaragua"},
    {nombre:"Sandino", imagen:"sandino.png", descripcion:"Defendió la libertad de su pueblo"},
    {nombre:"Benjain", imagen:"benjain.png", descripcion:"Luchó por la educación y la justicia"},
    {nombre:"Mongalo", imagen:"mongalo.png", descripcion:"Ejemplo de valentía y sabiduría"}
];

const heroeFinal = heroes[0];

const horaElem = document.getElementById("hora");
const minutoElem = document.getElementById("minuto");
const horaObjetivoElem = document.getElementById("horaObjetivo");
const horaMarcada = document.getElementById("horaMarcada");
const mensaje = document.getElementById("mensaje");
const pantallaCompleta = document.getElementById("pantallaCompleta");
const maxTexto = document.getElementById("maxTexto");
const modalColeccion = document.getElementById("modalColeccion");
const heroesDiv = document.getElementById("heroesDesbloqueados");
const cerrarColeccionBtn = document.getElementById("cerrarColeccion");
const modalVideo = document.getElementById("modalVideo");
const videoElem = document.getElementById("video");
const saltarVideoBtn = document.getElementById("saltarVideo");
const descripcionVideo = document.getElementById("descripcionVideo");

let rotHora = 0, rotMinuto = 0;
actualizarRotacion();

function normalizar(a){ 
    let x = a % 360; 
    if(x < 0) x += 360; 
    return x; 
}

function mostrarHoraMarcada(){
    let h = Math.floor(normalizar(rotHora)/30) % 12;
    let m = Math.round(normalizar(rotMinuto)/6) % 60;
    let horaReal = h === 0 ? 12 : h;
    horaMarcada.textContent = `Hora que estás marcando: ${horaReal}:${m.toString().padStart(2,"0")}`;
}

function actualizarRotacion(){
    horaElem.style.transform = `translate(-50%,0) rotate(${rotHora}deg)`;
    minutoElem.style.transform = `translate(-50%,0) rotate(${rotMinuto}deg)`;
    mostrarHoraMarcada();
}

function diferenciaAngulo(a,b){ 
    let diff = Math.abs(a-b)%360; 
    if(diff>180) diff=360-diff; 
    return diff;
}

function gradosHoraMinuto(h,m){
    return {gh:h*30 + m*0.5, gm:m*6};
}

let arrastrando = null, centroReloj = null;

document.addEventListener("mousedown", iniciar);
document.addEventListener("mousemove", mover);
document.addEventListener("mouseup", soltar);

function iniciar(e){ 
    if(e.target.classList.contains("manecilla")){
        arrastrando = e.target;
        const rect = document.getElementById("reloj").getBoundingClientRect();
        centroReloj = {x: rect.left + rect.width/2, y: rect.top + rect.height/2};
    }
}

function mover(e){ 
    if(!arrastrando) return;
    const dx = e.clientX - centroReloj.x;
    const dy = e.clientY - centroReloj.y;
    const ang = Math.atan2(dx, -dy) * (180/Math.PI);
    if(arrastrando.id === "hora") rotHora = ang; 
    else rotMinuto = ang;
    actualizarRotacion();
}

function soltar(){ arrastrando = null; }

function mostrarPantallaInicial(){
    pantallaCompleta.style.display = "flex";
    pantallaCompleta.onclick = null;
    maxTexto.textContent = "¡Hola! Hoy aprenderemos sobre las horas y los minutos 😊";
    pantallaCompleta.onclick = function(){
        pantallaCompleta.style.display = "none";
        reproducirVideo("videos/veremos.mp4", iniciarNivel, "Hola, hoy aprenderemos sobre las horas y los minutos");
    }
}

function reproducirVideo(src, callback, descripcion = ""){
    modalVideo.style.display = "flex";
    videoElem.src = src;
    descripcionVideo.textContent = descripcion;
    descripcionVideo.style.color = "#1976d2";
    videoElem.play();

    function terminarVideo(){
        videoElem.pause();
        videoElem.currentTime = 0;
        modalVideo.style.display = "none";
        callback && callback();
    }

    saltarVideoBtn.onclick = terminarVideo;
    videoElem.onended = terminarVideo;
}

function iniciarNivel(){
    if(nivelActual >= nivelHoras.length){ 
        mostrarVentanaFinal(); 
        return; 
    }

    const n = nivelHoras[nivelActual];

    pantallaCompleta.style.display = "flex";
    pantallaCompleta.onclick = null;
    maxTexto.textContent = `¡Ayúdame a encontrar las ${n.h}:${n.m.toString().padStart(2,"0")}!`;
    pantallaCompleta.onclick = function(){
        pantallaCompleta.style.display = "none";
        horaObjetivoElem.textContent = `Coloca las manecillas en: ${n.h}:${n.m.toString().padStart(2,"0")}`;
        rotHora = 0; rotMinuto = 0; 
        actualizarRotacion();
        reproducirVideo(n.video, null, n.descripcion);
    }
}

document.getElementById("verificar").addEventListener("click", ()=>{
    const n = nivelHoras[nivelActual];
    const {gh, gm} = gradosHoraMinuto(n.h,n.m);

    const hOk = diferenciaAngulo(normalizar(rotHora), gh) <= 20;
    const mOk = diferenciaAngulo(normalizar(rotMinuto), gm) <= 10;

    if(hOk && mOk){
        mensaje.textContent = "🎉 Muy bien! 🎉";
        confetiAnimacion();

        nivelActual++;
        mensaje.textContent = "";
        if(nivelActual < nivelHoras.length){
            iniciarNivel();
        } else {
            mostrarVentanaFinal();
        }
    } else {
        errores++;
        mensaje.textContent = "❌ Vamos, inténtalo otra vez";
        reproducirVideo("videos/otra_vez.mp4", null, "Intenta de nuevo la hora");
    }
});

function confetiAnimacion(){
    for(let i=0;i<50;i++){
        const c = document.createElement("div");
        c.className = "confeti";
        c.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
        c.style.left = Math.random()*window.innerWidth + "px";
        c.style.top = "-20px";
        c.style.width = c.style.height = Math.random()*10 + 5 + "px";
        document.body.appendChild(c);
        setTimeout(()=>document.body.removeChild(c),1500);
    }
}

function mostrarVentanaFinal(){
    pantallaCompleta.style.display = "flex";
    pantallaCompleta.onclick = null;
    let estrellas = 1;
    if(errores <=2) estrellas=3;
    else if(errores <=5) estrellas=2;

    maxTexto.innerHTML = `<div style="color:#000; background:#fff; padding:20px; border-radius:10px;">
        <h2>¡Felicidades, haz completado el juego! 🎉</h2>
        <p>Ganaste ${estrellas} ${estrellas===1?'estrella':'estrellas'} ⭐</p>
        <button id="cerrarEstrellas" style="padding:10px 15px; font-size:1rem; border-radius:8px; background:#43a047; color:#fff; border:none; cursor:pointer;">Cerrar</button>
    </div>`;

    document.getElementById("cerrarEstrellas").onclick = function(){
        pantallaCompleta.style.display = "none";
        heroesDesbloqueados.push(heroeFinal);
        modalColeccion.style.display = "flex";
        mostrarColeccion();
    };
}

function mostrarColeccion(){
    heroesDiv.innerHTML = "";
    heroesDesbloqueados.forEach(h=>{
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = `imagenes/${h.imagen}`;
        const p = document.createElement("p");
        p.innerHTML = `<strong>${h.nombre}</strong><br>${h.descripcion}`;
        div.appendChild(img);
        div.appendChild(p);
        heroesDiv.appendChild(div);
    });
}

cerrarColeccionBtn.onclick = function(){ window.location = "mapa_auditivo.html"; }

mostrarPantallaInicial();
