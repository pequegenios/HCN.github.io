/* 

  Juego educativo interactivo con audio y personajes

Este script controla un juego educativo dividido en varias etapas:
1. **Capacidad** – El jugador debe llenar un vaso hasta un porcentaje específico.
2. **Longitud** – Debe ajustar una barra hasta una medida indicada.
3. **Estimación** – Debe seleccionar la canasta que contenga la cantidad exacta de frutas mostrada.

El juego usa:
- **speechSynthesis** para dar instrucciones por voz.
- **efectos de sonido** (correcto, error, burbuja) para retroalimentación auditiva.
- **interacción visual** con elementos HTML (vaso, regla, canastas).
- **sistema de puntuación y errores** para medir el desempeño.
- **desbloqueo de personajes históricos nicaragüenses** como recompensa al completar las etapas.

En resumen, este JavaScript ofrece una experiencia lúdica y didáctica que combina sonido, voz y animaciones 
para enseñar conceptos de medida y estimación mientras motiva al jugador con recompensas visuales.

*/

const synth = window.speechSynthesis;
function speak(text){ 
    if(!synth) return; 
    const u = new SpeechSynthesisUtterance(text); 
    u.lang='es-ES'; 
    synth.cancel(); 
    synth.speak(u); 
}

const sounds = {
    correcto: new Audio('sonidos/correcto.mp3'),
    error: new Audio('sonidos/error.mp3'),
    burbuja: new Audio('sonidos/burbuja.mp3')
 
};

let score = 0, errors = 0;

const capValEl = document.getElementById('capVal');
const liquidOverlay = document.getElementById('liquidOverlay');
const capMinus = document.getElementById('capMinus');
const capPlus = document.getElementById('capPlus');
const capConfirm = document.getElementById('capConfirm');
const capTargetDisplay = document.getElementById('capTargetDisplay');

const estSection = document.getElementById('estSection');
const estChoices = document.getElementById('estChoices');
const estTargetEl = document.getElementById('estTarget');

const longSection = document.getElementById('longSection');
const longObj = document.getElementById('longObj');
const longTargetDisplay = document.getElementById('longTargetDisplay');
const ticksContainer = document.getElementById('ticks');
const rulerFill = document.getElementById('rulerFill');

const scoreEl = document.getElementById('score');
const feedback = document.getElementById('feedback');
const nuevo = document.getElementById('nuevo');
const repeat = document.getElementById('repeat');
const help = document.getElementById('help');

const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const starsDiv = document.getElementById('stars');
const restartBtn = document.getElementById('restart');

let capVal = 0, capTarget = 0;

function updateLiquid(){
    liquidOverlay.style.height = capVal + '%';
    capValEl.textContent = capVal + '%';
}

function generateCupMarkers(){
    const markers = document.querySelector('.cup-markers');
    markers.innerHTML = '';
    for(let i=0;i<=10;i++){
        const span = document.createElement('span');
        span.textContent = i*10 + '%';
        markers.appendChild(span);
    }
}

function newCapacity(){
    capTarget = Math.floor(Math.random() * 11) * 10;
    capVal = 0;
    updateLiquid();
    generateCupMarkers();
    document.getElementById('capSection').style.display='block';
    longSection.style.display='none';
    estSection.style.display='none';
    resultSection.style.display='none';
    feedback.textContent='';
    capTargetDisplay.textContent = capTarget; 
    speak('Llena el vaso hasta ' + capTarget + ' por ciento');
}

capPlus.onclick = ()=>{
    if(capVal<100){ capVal+=10; updateLiquid(); sounds.burbuja.play(); speak(capVal); }
};
capMinus.onclick = ()=>{
    if(capVal>0){ capVal-=10; updateLiquid(); sounds.burbuja.play(); speak(capVal); }
};
capConfirm.onclick = ()=>{
    if(capVal===capTarget){
        score+=10; updateScore(); feedback.textContent='¡Correcto!'; 
     
        speak('¡Correcto!');
        setTimeout(newLength,1000);
    } else {
        feedback.textContent='No es correcto, intenta otra vez';
        sounds.error.play(); speak('Inténtalo otra vez');
        errors++;
    }
};

let longPos = 0, longTarget = 0;

function generateTicks(){
    ticksContainer.innerHTML = '';
    for(let i=0;i<=10;i++){
        const tick = document.createElement('span');
        tick.textContent = i*10; 
        tick.style.left = (i*10) + '%';
        tick.style.bottom = '12px';
        tick.style.position = 'absolute';
        tick.style.transform = 'translateX(-50%)';
        tick.style.fontSize = '18px';
        tick.style.fontWeight = 'bold';
        tick.style.color = '#000';
        tick.style.zIndex = 2;
        tick.style.textShadow = '1px 1px 2px #fff';
        ticksContainer.appendChild(tick);
    }
}

function newLength(){
    document.getElementById('capSection').style.display='none';
    longSection.style.display='block';
    estSection.style.display='none';

    longTarget = Math.floor(Math.random() * 11) * 10;
    longPos = 0;
    updateLong();
    generateTicks();

    longTargetDisplay.textContent = longTarget;
    feedback.textContent='';
    speak('Ajusta la longitud hasta ' + longTarget);
}

function updateLong(){
    longObj.style.left = longPos + '%';
    rulerFill.style.width = longPos + '%';
}

document.getElementById('leftBtn').onclick = ()=>{
    longPos = Math.max(longPos-10,0);
    updateLong(); speak(longPos);
};

document.getElementById('rightBtn').onclick = ()=>{
    longPos = Math.min(longPos+10,100);
    updateLong(); speak(longPos);
};

document.getElementById('longConfirm').onclick = ()=>{
    if(longPos===longTarget){
        score+=10; updateScore(); feedback.textContent='¡Correcto!'; 

        speak('¡Correcto!');
        setTimeout(newEstimation,1000);
    } else {
        feedback.textContent='Casi, intenta otra vez';
        sounds.error.play(); speak('Casi, intenta otra vez');
        errors++;
    }
};

// --- Estimación ---
let estTarget = 0;
function newEstimation(){
    longSection.style.display='none';
    estSection.style.display='block';
    resultSection.style.display='none';

    estTarget = Math.floor(Math.random()*6)+3; 
    estTargetEl.textContent = estTarget;
    feedback.textContent='';
    renderEst();
    speak('Elige la canasta que tenga exactamente ' + estTarget + ' frutas');
}

function renderEst(){
    estChoices.innerHTML='';
    const frutas=['manzana','banana','sandia','naranja','fresa'];
    const options=[estTarget, estTarget+1, estTarget-1].filter(n=>n>0);
    shuffle(options).forEach((n,index)=>{
        const btn=document.createElement('button');
        const canastaImg=document.createElement('img');
        canastaImg.src='imagenes/canasta.jpg';
        btn.appendChild(canastaImg);

        const fruitList = [];
        for(let i=0;i<n;i++){
            const fImg=document.createElement('img');
            const fruitName = frutas[Math.floor(Math.random()*frutas.length)];
            const ext = fruitName==='sandia'?'png':'jpg';
            fImg.src='imagenes/'+fruitName+'.'+ext;
            btn.appendChild(fImg);
            fruitList.push(fruitName);
        }

        btn.addEventListener('mouseenter', ()=>{
            const text = `Canasta ${index+1}: ` + fruitList.join(', ');
            speak(text);
        });

        btn.onclick=()=>{
            if(n===estTarget){
                score+=10; updateScore(); feedback.textContent='¡Correcto!'; 
                sounds.correcto.play(); speak('¡Correcto!');
                setTimeout(showResult,500);
            } else {
                feedback.textContent='No es correcto'; sounds.error.play(); speak('Inténtalo otra vez'); 
                errors++;
            }
        };
        estChoices.appendChild(btn);
    });
}

function showResult(){
    estSection.style.display='none';

    let starsCount = 1;
    if(errors<=2) starsCount=3;
    else if(errors<=5) starsCount=2;

    starsDiv.innerHTML='';
    for(let i=0;i<starsCount;i++){
        const s=document.createElement('img'); 
        s.src='imagenes/star.jpg'; 
        starsDiv.appendChild(s);
    }

    resultText.textContent=`Has terminado el juego con ${errors} errores. ¡Tu puntuación es ${score}!`;
    speak(`Juego terminado. Has ganado ${starsCount} estrellas.`);
}

function updateScore(){scoreEl.textContent = score;}
function shuffle(arr){return arr.sort(()=>Math.random()-0.5);}




const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  speak('¡Bienvenido! Empezaremos con la primera prueba. Llena el vaso hasta el porcentaje indicado.');
  nuevo.click(); 
});





nuevo.onclick=()=>{score=0; errors=0; updateScore(); newCapacity();}
restartBtn.onclick=()=>{nuevo.click();}
repeat.onclick=()=>{
    if(document.getElementById('capSection').style.display==='block') speak('Llena el vaso hasta ' + capTarget);
    else if(longSection.style.display==='block') speak('Ajusta la longitud hasta ' + longTarget);
    else if(estSection.style.display==='block') speak('Elige la canasta con ' + estTarget + ' frutas');
};
help.onclick=()=>{speak('Usa los botones grandes. La voz te guiará y verás el resultado al final.');}

nuevo.click();

const characters = [
  {name:'Rubén Darío', file:'ruben.png', desc:'Poeta nicaragüense, padre del modernismo.'},
  {name:'Augusto Sandino', file:'sandino.png', desc:'Héroe nacional que luchó por la soberanía.'},
  {name:'Benjamín Zeledón', file:'benjamin.png', desc:'Militar y político destacado de Nicaragua.'},
  {name:'Mongalo', file:'mongalo.png', desc:'Personaje emblemático de la cultura nicaragüense.'}
];

let unlockedCharacters = [];

const modalResult = document.getElementById('modalResult');
const modalScore = document.getElementById('modalScore');
const modalStars = document.getElementById('modalStars');
const modalNext = document.getElementById('modalNext');

const modalCharacter = document.getElementById('modalCharacter');
const charName = document.getElementById('charName');
const charImage = document.getElementById('charImage');
const charDesc = document.getElementById('charDesc');
const finishBtn = document.getElementById('finishBtn');
const viewCollectionBtn = document.getElementById('viewCollectionBtn');

const modalCollection = document.getElementById('modalCollection');
const collectionList = document.getElementById('collectionList');
const closeCollectionBtn = document.getElementById('closeCollectionBtn');

function showResult(){
    estSection.style.display='none';

    let starsCount = 1;
    if(errors<=2) starsCount=3;
    else if(errors<=5) starsCount=2;

    modalScore.textContent = `Has terminado el juego con ${errors} errores. ¡Tu puntuación es ${score}!`;

    modalStars.innerHTML = '';
    for(let i=0;i<starsCount;i++){
        const s = document.createElement('img'); 
        s.src='imagenes/star.jpg'; 
        modalStars.appendChild(s);
    }

    modalResult.style.display='flex';
    speak(`Juego terminado. Has ganado ${starsCount} estrellas.`);
}

modalNext.onclick = ()=>{
    modalResult.style.display='none';

    const available = characters.filter(c => !unlockedCharacters.includes(c.name));
    if(available.length === 0) {
        window.location.href = 'mapa_visual.html';
        return;
    }
    const char = available[Math.floor(Math.random() * available.length)];
    unlockedCharacters.push(char.name);

    charName.textContent = char.name;
    charImage.src = 'imagenes/' + char.file;
    charDesc.textContent = char.desc;
    modalCharacter.style.display='flex';

    speak(`¡Felicidades! Has desbloqueado a ${char.name}`);
};

finishBtn.onclick = ()=>{
    modalCharacter.style.display='none';
    window.location.href = 'mapa_visual.html';
};

viewCollectionBtn.onclick = ()=>{
    modalCharacter.style.display='none';
    collectionList.innerHTML='';
    unlockedCharacters.forEach(name=>{
        const c = characters.find(ch=>ch.name===name);
        const img = document.createElement('img');
        img.src = 'imagenes/' + c.file;
        img.alt = c.name;
        collectionList.appendChild(img);
    });
    modalCollection.style.display='flex';
};

closeCollectionBtn.onclick = ()=>{
    modalCollection.style.display='none';
    window.location.href = 'mapa_visual.html';
};
