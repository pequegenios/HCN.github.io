/* 
  Este archivo implementa un juego educativo de figuras geométricas para niños, adaptado al idioma miskito con traducciones al español. 
  La lógica del juego incluye:
  - Configuración de figuras y héroes nacionales con imágenes y descripciones.
  - Traducciones de mensajes y comandos de voz para guiar al niño durante el juego.
  - Gestión de elementos del DOM para mostrar instrucciones, figuras, canvas de dibujo, resultados y héroes desbloqueables.
  - Ajuste dinámico del tamaño del canvas para dibujar según el tamaño de la pantalla.
  - Funcionalidad de síntesis de voz para dar instrucciones y felicitaciones.
  - Reconocimiento de voz para que el niño repita el nombre de la figura antes de dibujar.
  - Lógica de dibujo sobre un canvas, incluyendo soporte para mouse y touch, y una guía visual semitransparente de la figura a dibujar.
  - Evaluación del dibujo comparando la forma trazada con la figura esperada mediante análisis de puntos, perímetro, área, circularidad y esquinas.
  - Botón "Terminé" para evaluar si el dibujo es correcto; reproduce sonidos de acierto o error, y avanza a la siguiente figura o solicita reintento.
  - Final del juego que muestra un modal de resultados con estrellas según el número de errores cometidos.
  - Desbloqueo de un héroe aleatorio y posibilidad de abrir un álbum con todos los héroes.
  - Pre-carga de imágenes para evitar retrasos durante la ejecución.
  Todo esto permite que el niño aprenda figuras geométricas mientras interactúa con la aplicación de manera lúdica, guiado por voz y visualmente.
*/

const IMAGES_PATH = 'imagenes/';
const SOUNDS_PATH = 'sonidos/';

const FIGURAS = [
  { id: 'circulo', file: 'circulo.jpg', display: 'Círculo' },
  { id: 'cuadrado', file: 'cuadrado.jpg', display: 'Cuadrado' },
  { id: 'rombo', file: 'rombo.jpg', display: 'Rombo' }
];

const HEROES = [
  { id:'ruben', name:'Rubén Darío', img:'ruben.png', desc:'Poeta nicaragüense muy importante.' },
  { id:'sandino', name:'Augusto C. Sandino', img:'sandino.png', desc:'Líder revolucionario nicaragüense.' },
  { id:'benjamin', name:'Benjamín Zeledón', img:'benjamin.png', desc:'Héroe nacional.' },
  { id:'mongalo', name:'Enmanuel Mongalo', img:'mongalo.png', desc:'Héroe del pueblo.' }
];

const TRANSLATIONS = {
  introGreetingText: "¡Naksa! Yang Max ¿kaya lilka sat ka wira lan takaya?",
  introGreetingVoice: "¡Naksa! Yang Max ¿kaya lilka sat ka wira lan takaya?",
  sayRepeat: (shape) => `Kaya, this is ${shape}. Repeti: ${shape}`,
  goodRepeat: (shape) => `Wal, nanka. Ani nanar ${shape} dibujar.`,
  tryAgain: "Kli ta wina dauks, man sipsma",
  correctPraise: "¡Uba pain! ¡Work painkira!",
  instructionDraw: "Baha lilka bui pas pizarra nara",
  nextDraw: "Uba pain! Namit lilka kli paskaya, kainara maiwi katna baku",
  resultTitle: "Resultado",
  starsText: (nErrores, estrellas)=>`Has tenido ${nErrores} errores. Estrellas: ${estrellas}`
};

const introModal = document.getElementById('introModal');
const introText = document.getElementById('introText');
const startBtn = document.getElementById('startBtn');
const avatarSmall = document.getElementById('avatarSmall');
const figureImg = document.getElementById('figureImg');
const figureName = document.getElementById('figureName');
const drawZone = document.getElementById('drawZone');
const instruction = document.getElementById('instruction');
const limpiarBtn = document.getElementById('limpiarBtn');
const doneBtn = document.getElementById('doneBtn');
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const starsWrap = document.getElementById('stars');
const resultText = document.getElementById('resultText');
const closeResultBtn = document.getElementById('closeResultBtn');
const heroModal = document.getElementById('heroModal');
const heroName = document.getElementById('heroName');
const heroImg = document.getElementById('heroImg');
const heroDesc = document.getElementById('heroDesc');
const openAlbumBtn = document.getElementById('openAlbumBtn');
const closeHeroBtn = document.getElementById('closeHeroBtn');
const albumModal = document.getElementById('albumModal');
const albumGrid = document.getElementById('albumGrid');
const closeAlbumBtn = document.getElementById('closeAlbumBtn');
const voiceLabel = document.getElementById('voiceLabel');
const sndCorrect = document.getElementById('sndCorrect');
const sndError = document.getElementById('sndError');
const canvas = document.getElementById('drawCanvas');
const overlay = document.getElementById('overlayCanvas');
const ctx = canvas.getContext('2d');
const octx = overlay.getContext('2d');

let currentIndex = 0;
let errorsCount = 0;
let isListening = false;
let drawing = false;
let points = [];

function resizeCanvases(){
  const rect = canvas.parentElement.getBoundingClientRect();
  [canvas, overlay].forEach(c=>{
    c.width = rect.width * devicePixelRatio;
    c.height = rect.height * devicePixelRatio;
    c.style.width = rect.width + "px";
    c.style.height = rect.height + "px";
  });
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  octx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  drawGuide();
}
window.addEventListener('resize', resizeCanvases);

const synth = window.speechSynthesis;
function speak(text) {
  if (!synth) { voiceLabel.textContent = text; return; }
  const u = new SpeechSynthesisUtterance(text);
  const v = synth.getVoices().find(v=>v.lang.startsWith('es')) || synth.getVoices()[0];
  u.voice = v; u.lang = v.lang;
  u.onstart = ()=> voiceLabel.textContent = text;
  u.onend = ()=> voiceLabel.textContent = "";
  synth.cancel(); synth.speak(u);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.onresult = (ev)=>{
    const transcript = ev.results[0][0].transcript.toLowerCase();
    handleTranscript(transcript);
  };
  recognition.onend = ()=> isListening=false;
}

function startListening(){
  if (!recognition || isListening) return;
  recognition.start(); isListening=true;
  voiceLabel.textContent="🎤 Escuchando...";
}
function stopListening(){
  if (recognition) recognition.stop();
  isListening=false;
}

startBtn.addEventListener('click', ()=>{
  introModal.classList.add('hidden');
  resizeCanvases();
  startRound();
});

function startRound(){
  if (currentIndex >= FIGURAS.length){ finishGame(); return; }
  const fig = FIGURAS[currentIndex];
  figureImg.src = IMAGES_PATH + fig.file;
  figureName.textContent = fig.display;
  speak(TRANSLATIONS.sayRepeat(fig.display));
  drawZone.classList.add('hidden');
  setTimeout(()=>startListening(),800);
}

function handleTranscript(text){
  const expected = FIGURAS[currentIndex].display.toLowerCase();
  if (text.includes(expected.substring(0,5))) {
    stopListening();
    speak(TRANSLATIONS.goodRepeat(FIGURAS[currentIndex].display));
    setTimeout(()=>{
      drawZone.classList.remove('hidden');
      resizeCanvases();
      instruction.textContent = TRANSLATIONS.instructionDraw;
    },1000);
  } else {
    speak(TRANSLATIONS.tryAgain);
    setTimeout(()=>startListening(),1000);
  }
}

function getPos(e){
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x:(clientX - rect.left), y:(clientY - rect.top) };
}

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  points=[];
  drawGuide();
}
limpiarBtn.addEventListener('click',clearCanvas);

function startDraw(e){
  drawing=true;
  const p=getPos(e);
  ctx.beginPath();
  ctx.moveTo(p.x,p.y);
}
function drawMove(e){
  if(!drawing)return;
  const p=getPos(e);
  ctx.lineWidth=6;
  ctx.lineCap='round';
  ctx.strokeStyle='#fff';
  ctx.lineTo(p.x,p.y);
  ctx.stroke();
  points.push([p.x,p.y]);
}
function endDraw(){drawing=false; ctx.closePath();}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawMove);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchstart', e=>{ e.preventDefault(); startDraw(e); });
canvas.addEventListener('touchmove', e=>{ e.preventDefault(); drawMove(e); });
canvas.addEventListener('touchend', e=>{ e.preventDefault(); endDraw(); });

function drawGuide(){
  octx.clearRect(0,0,overlay.width,overlay.height);
  const w = overlay.width/devicePixelRatio;
  const h = overlay.height/devicePixelRatio;
  const cx=w/2, cy=h/2, s=Math.min(w,h)*0.6;
  octx.save(); octx.globalAlpha=0.25; octx.lineWidth=5; octx.strokeStyle='#fff';
  const name = FIGURAS[currentIndex]?.id || '';
  octx.beginPath();
  if(name.includes('circulo')) octx.ellipse(cx,cy,s*0.4,s*0.4,0,0,Math.PI*2);
  else if(name.includes('cuadrado')) octx.rect(cx-s*0.35,cy-s*0.35,s*0.7,s*0.7);
  else if(name.includes('rombo')){
    octx.moveTo(cx, cy-s*0.4);
    octx.lineTo(cx+s*0.35, cy);
    octx.lineTo(cx, cy+s*0.4);
    octx.lineTo(cx-s*0.35, cy);
    octx.closePath();
  }
  octx.stroke(); octx.restore();
}

function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);}
function polygonArea(pts){let s=0;for(let i=0;i<pts.length;i++){const j=(i+1)%pts.length;s+=pts[i][0]*pts[j][1]-pts[j][0]*pts[i][1];}return s/2;}
function countCorners(pts){const L=pts.length;if(L<10)return 0;let c=0;for(let i=2;i<L;i++){const a=pts[i-2],b=pts[i-1],d=pts[i];let ang=Math.abs(Math.atan2(d[1]-b[1],d[0]-b[0])-Math.atan2(b[1]-a[1],b[0]-a[0]));if(ang>Math.PI)ang=2*Math.PI-ang;if(ang>0.9)c++;}return c;}
function analyzeDrawing(){
  if(points.length<5) return {ok:false};
  let per=0;for(let i=1;i<points.length;i++) per+=dist(points[i-1],points[i]);
  const area=Math.abs(polygonArea(points));
  const circ=4*Math.PI*area/(per*per||1);
  return{circularity:circ,corners:countCorners(points)};
}

function evaluateShape(a) {
  const t = FIGURAS[currentIndex].id;
  if (points.length < 15) return false;
  const minX = Math.min(...points.map(p => p[0]));
  const maxX = Math.max(...points.map(p => p[0]));
  const minY = Math.min(...points.map(p => p[1]));
  const maxY = Math.max(...points.map(p => p[1]));
  const w = maxX - minX;
  const h = maxY - minY;
  const ratio = w / h;
  if (t === 'circulo') return a.circularity > 0.45 && a.circularity < 1.2;
  if (t === 'cuadrado') return ratio > 0.75 && ratio < 1.25;
  if (t === 'rombo') return ratio > 0.6 && ratio < 1.4 && a.circularity < 0.4;
  return false;
}

doneBtn.addEventListener('click',()=>{
  if(points.length<5){
    speak("Aún no has dibujado la figura. Intenta trazarla.");
    return;
  }
  const a=analyzeDrawing();
  const ok=evaluateShape(a);
  if(ok){
    sndCorrect.play?.();
    speak(TRANSLATIONS.correctPraise);
    clearCanvas();
    currentIndex++;
    setTimeout(startRound,1200);
  } else {
    sndError.play?.();
    errorsCount++;
    speak(TRANSLATIONS.tryAgain);
    setTimeout(clearCanvas,800);
  }
});

function finishGame(){
  resultModal.classList.remove('hidden');
  resultModal.classList.add('show');
  resultTitle.textContent=TRANSLATIONS.resultTitle;
  let e=errorsCount<=2?3:errorsCount<=5?2:1;
  starsWrap.innerHTML='';
  for(let i=0;i<3;i++){
    const s=document.createElement('div');
    s.className='star'+(i<e?' on':'');
    s.textContent='★';
    starsWrap.appendChild(s);
  }
  resultText.textContent=TRANSLATIONS.starsText(errorsCount,e);
}

closeResultBtn.addEventListener('click',()=>{
  resultModal.classList.add('hidden');
  heroModal.classList.remove('hidden');
  heroModal.classList.add('show');
  const hero=HEROES[Math.floor(Math.random()*HEROES.length)];
  heroName.textContent=hero.name;
  heroImg.src=IMAGES_PATH+hero.img;
  heroDesc.textContent=hero.desc;
});

openAlbumBtn.addEventListener('click',()=>{
  heroModal.classList.add('hidden');
  albumGrid.innerHTML='';
  HEROES.forEach(h=>{
    const div=document.createElement('div');
    div.className='heroCard';
    div.innerHTML=`<img src="${IMAGES_PATH}${h.img}" style="width:100%;border-radius:8px"/><div>${h.name}</div>`;
    albumGrid.appendChild(div);
  });
  albumModal.classList.remove('hidden');
});
closeHeroBtn.addEventListener('click',()=>location.href='mapa_miskito.html');
closeAlbumBtn.addEventListener('click',()=>location.href='mapa_miskito.html');

function init(){
  introText.textContent = TRANSLATIONS.introGreetingText; 
  speak(TRANSLATIONS.introGreetingVoice); 
  FIGURAS.forEach(f => new Image().src = IMAGES_PATH + f.file);
  HEROES.forEach(h => new Image().src = IMAGES_PATH + h.img);
}
init();
