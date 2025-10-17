/*
  Este código es un módulo autoejecutable que implementa un **juego interactivo de secuencia numérica** para niños, con elementos visuales, sonoros y recompensas por completar niveles. 

  Funcionalidades principales:
  - Generación de un tablero de 10 números (1 a 10) en orden aleatorio.
  - Colores distintos para cada número para mejorar la identificación visual.
  - Seguimiento de la secuencia correcta (next) y control de errores.
  - Animaciones visuales al seleccionar correctamente (movimiento hacia la sección "completado" y partículas de confeti).
  - Sonidos de acierto y error.
  - Sistema de recompensas: desbloqueo de héroes y colección de imágenes.
  - Mostrar estrellas al final según desempeño.
  - Funcionalidad de pistas, reinicio de nivel, y navegación entre pantallas.
  - Responsive: el lienzo de partículas se ajusta al tamaño de la ventana.

  Estructura detallada:

  1. **Variables y constantes globales:**
     - `numbers`: array con números del 1 al 10.
     - `colors`: array con colores únicos para cada número.
     - `board`, `status`, `result`, `completed`: referencias a elementos HTML donde se muestran los números, el estado del juego, el resultado y los números completados.
     - Popups y botones: manejo de héroes desbloqueados (`popupHero`, `collectBtn`), colección de héroes (`collectionPopup`, `collectionDiv`, `closeCollection`), reinicio (`resetBtn`), pistas (`hintBtn`), navegación (`backBtn`), sonidos (`correctSound`, `wrongSound`) y final del juego (`endPopup`, `retryBtn`, `mapBtn`).
     - `canvas` y `ctx`: canvas HTML para dibujar partículas de confeti.
     - `particles` y `unlockedHeroes`: arrays para animación de partículas y almacenamiento de héroes desbloqueados.
     - Variables de control: `next` (número esperado), `errors` (errores cometidos), `startTime` (tiempo inicial del nivel), `hintShown` (control de pistas).

  2. **Funciones principales:**

     - `resizeCanvas()`: ajusta el tamaño del canvas a la ventana. Se llama al iniciar y al redimensionar la ventana.
     - `shuffle(arr)`: devuelve un array mezclado aleatoriamente (utilizado para desordenar los números en el tablero).
     - `render()`: genera el tablero de números, asigna colores y eventos de clic, y reinicia variables de control.
     - `onSelect(e)`: función ejecutada al hacer clic en un número:
       - Verifica si el número es el esperado (`next`). 
       - Si es correcto: anima la ficha, reproduce sonido, genera partículas y actualiza el estado.
       - Si es incorrecto: incrementa errores, reproduce sonido de error y muestra mensaje.
     - `moveToCompleted(tile)`: mueve visualmente la ficha seleccionada al área de "completado" con transición y escalado.
     - `createParticles(el)`: genera partículas de confeti alrededor del elemento seleccionado, agregando propiedades de movimiento, color y tamaño.
     - `updateParticles()`: actualiza la posición, transparencia y renderizado de todas las partículas usando `requestAnimationFrame`.
     - `finish()`: muestra el popup de héroe desbloqueado y guarda su imagen en `unlockedHeroes`.
     - `showStarsPopup()`: crea dinámicamente un popup que muestra estrellas y un mensaje de desempeño según la cantidad de errores cometidos.
  
  3. **Eventos de botones y popups:**
     - `collectBtn`: muestra la colección de héroes desbloqueados.
     - `closeCollection`: oculta el popup de colección y muestra el popup de estrellas; activa el popup de fin del nivel (`endPopup`).
     - `retryBtn`: reinicia el tablero y oculta el popup de fin.
     - `mapBtn`: desbloquea nivel y redirige a la página de mapa.
     - `resetBtn`: reinicia el tablero.
     - `hintBtn`: resalta el número que sigue si se activa la pista.
     - `backBtn`: redirige a la página de mapa.

  4. **Animaciones y efectos visuales:**
     - Movimiento de fichas hacia el área de completado.
     - Confeti con partículas que se dispersan y desvanecen.
     - Escalado animado para la pista.
     - Popup de estrellas con animación de escala y opacidad.

  5. **Inicio del juego:**
     - Se llama a `render()` inmediatamente para generar el tablero y preparar el juego al cargar la página.

  En resumen, este código combina **lógica de juego, animaciones, efectos de sonido y gestión de popups** para crear una experiencia interactiva y atractiva para los niños, fomentando la secuencia numérica, la retroalimentación positiva y la recompensa visual.
*/

(() => {
  const numbers = Array.from({length:10},(_,i)=>i+1);
  const colors = ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50'];
  const board = document.getElementById('board');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const completed = document.getElementById('completed');

  const popupHero = document.getElementById('popupHero');
  const heroImg = popupHero.querySelector('img');
  const collectBtn = document.getElementById('collectBtn');

  const collectionPopup = document.getElementById('collectionPopup');
  const collectionDiv = document.getElementById('collection');
  const closeCollection = document.getElementById('closeCollection');

  const resetBtn = document.getElementById('reset');
  const hintBtn = document.getElementById('hint');
  const backBtn = document.getElementById('back');
  const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');

  const endPopup = document.getElementById('endPopup');
  const retryBtn = document.getElementById('retryBtn');
  const mapBtn = document.getElementById('mapBtn');

  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let unlockedHeroes = [];

  let next=1, errors=0, startTime=Date.now(), hintShown=false;

  function resizeCanvas(){canvas.width=window.innerWidth; canvas.height=window.innerHeight;}
  window.addEventListener('resize',resizeCanvas);
  resizeCanvas();

  function shuffle(arr){return arr.slice().sort(()=>Math.random()-0.5);}

  function render(){
    board.innerHTML='';
    completed.innerHTML='';
    const order = shuffle(numbers);
    order.forEach(n=>{
      const t = document.createElement('button');
      t.className='tile';
      t.textContent=n;
      t.dataset.num=n;
      t.style.background = colors[n-1];
      t.addEventListener('click', onSelect);
      board.appendChild(t);
    });
    next=1; errors=0; startTime=Date.now(); hintShown=false;
    status.textContent='Sigue el orden: comienza con 1';
    result.textContent='';
  }

  function onSelect(e){
    const n = Number(e.currentTarget.dataset.num);
    if(n===next){
      e.currentTarget.classList.add('correct');
      e.currentTarget.disabled=true;
      correctSound.currentTime=0; correctSound.play();
      moveToCompleted(e.currentTarget);
      createParticles(e.currentTarget);
      next++;
      status.textContent=`¡Bien! Sigue con ${next<=10?next:'🎉 Completado!'}`;
      if(next>10) finish();
    } else {
      errors++;
      e.currentTarget.classList.add('wrong');
      setTimeout(()=>e.currentTarget.classList.remove('wrong'),350);
      wrongSound.currentTime=0; wrongSound.play();
      status.textContent=`Ese no es el número correcto. Toca ${next}`;
    }
  }

  function moveToCompleted(tile){
    const rect = tile.getBoundingClientRect();
    const compRect = completed.getBoundingClientRect();
    const dx = compRect.left + compRect.width/2 - (rect.left + rect.width/2);
    const dy = compRect.top + compRect.height/2 - (rect.top + rect.height/2);
    tile.style.transition='transform 0.7s ease-out, opacity 0.7s';
    tile.style.transform=`translate(${dx}px,${dy}px) scale(0.6)`;
    setTimeout(()=>{
      tile.style.transition='none';
      tile.style.transform='none';
      completed.appendChild(tile);
    },700);
  }

  function createParticles(el){
    const rect = el.getBoundingClientRect();
    for(let i=0;i<20;i++){
      particles.push({
        x:rect.left+rect.width/2,
        y:rect.top+rect.height/2,
        vx:(Math.random()-0.5)*6,
        vy:(Math.random()-3)*3,
        size:Math.random()*6+4,
        color:el.style.background,
        alpha:1
      });
    }
  }

  function updateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; p.alpha-=0.02;
      ctx.fillStyle=p.color; ctx.globalAlpha=p.alpha;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,2*Math.PI); ctx.fill();
      if(p.alpha<=0) particles.splice(i,1);
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(updateParticles);
  }
  updateParticles();

function finish(){
    const estrellas = errors <= 2 ? 3 : errors <= 5 ? 2 : 1;

    // ⚡ Desbloquea el nivel 2
    completarNivel1();  

    // Guardar progreso detallado (opcional)
    localStorage.setItem("progreso_nivel1", JSON.stringify({
      completado: true,
      estrellas: estrellas
    }));

    popupHero.classList.remove('hidden');
    unlockedHeroes.push(heroImg.src);
}



  collectBtn.addEventListener('click', ()=>{
    popupHero.classList.add('hidden');
    collectionDiv.innerHTML='';
    unlockedHeroes.forEach(src=>{
      const img = document.createElement('img');
      img.src=src;
      collectionDiv.appendChild(img);
    });
    collectionPopup.classList.remove('hidden');
  });

  function showStarsPopup() {
    const starsPopup = document.createElement("div");
    starsPopup.className = 'popup';
    starsPopup.style.background = 'rgba(0,0,0,0.6)';
    starsPopup.style.display = 'flex';
    starsPopup.style.alignItems = 'center';
    starsPopup.style.justifyContent = 'center';
    starsPopup.style.zIndex = 2000;

    const starsContent = document.createElement("div");
    starsContent.style.background = '#fff';
    starsContent.style.padding = '30px';
    starsContent.style.borderRadius = '20px';
    starsContent.style.textAlign = 'center';
    starsContent.style.maxWidth = '350px';
    starsContent.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
    starsPopup.appendChild(starsContent);

    let stars = 1;
    let message = '';
    if(errors <= 2) { stars = 3; message = '¡Increíble! Has completado el nivel casi sin errores 🎉'; }
    else if(errors >= 3 && errors <= 5) { stars = 2; message = '¡Muy bien! Has completado el nivel 👍'; }
    else { stars = 1; message = '¡No te rindas! Puedes intentarlo otra vez 💪'; }

    const msgEl = document.createElement('p');
    msgEl.textContent = message;
    msgEl.style.fontSize = '1.2rem';
    msgEl.style.marginBottom = '16px';
    starsContent.appendChild(msgEl);

    const starsDiv = document.createElement('div');
    starsDiv.style.display = 'flex';
    starsDiv.style.justifyContent = 'center';
    starsDiv.style.gap = '10px';
    starsDiv.style.fontSize = '2.5rem';
    for(let i=0;i<3;i++){
      const star = document.createElement('span');
      star.textContent = i < stars ? '⭐' : '☆';
      star.style.opacity = 0;
      star.style.transform = 'scale(0)';
      starsDiv.appendChild(star);
      setTimeout(()=>{ 
        star.style.transition = 'all 0.5s ease';
        star.style.opacity = 1; 
        star.style.transform = 'scale(1.2)';
        setTimeout(()=>star.style.transform='scale(1)',300);
      }, i*300);
    }
    starsContent.appendChild(starsDiv);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cerrar';
    closeBtn.className = 'btn link';
    closeBtn.style.marginTop = '20px';
    closeBtn.addEventListener('click',()=>{
      starsPopup.remove();
    });
    starsContent.appendChild(closeBtn);

    document.body.appendChild(starsPopup);
  }

  closeCollection.addEventListener('click', ()=>{
    collectionPopup.classList.add('hidden');
    showStarsPopup(); 
    endPopup.classList.remove('hidden');
  });

  retryBtn.addEventListener('click', ()=>{
    endPopup.classList.add('hidden');
    render();
  });

  mapBtn.addEventListener('click', ()=>{
    localStorage.setItem("nivel_autismo_2", "unlocked");
    window.location.href = 'mapa_autismo.html';
  });

  resetBtn.addEventListener('click', render);

  hintBtn.addEventListener('click',()=>{
    hintShown=!hintShown;
    const tiles=Array.from(board.querySelectorAll('.tile'));
    const target=tiles.find(t=>Number(t.dataset.num)===next);
    if(hintShown && target){
      target.animate([{transform:'scale(1)'},{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:700});
      status.textContent=`Pista: toca el número ${next}`;
    } else status.textContent=`Sigue con ${next}`;
  });

  backBtn.addEventListener('click',()=>{ window.location.href='mapa_autismo.html'; });

  render();




  function completarNivel1() {
  localStorage.setItem('nivel1Completado', 'true');
}


})();
