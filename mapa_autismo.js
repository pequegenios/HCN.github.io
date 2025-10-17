(() => {
  localStorage.removeItem('nivel1Completado');

  const nivel1 = document.getElementById('nivel1');
  const nivel2 = document.getElementById('nivel2');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');

  nivel1.addEventListener('click', () => {
    window.location.href = "1_tema_autismo_1_grado.html";
  });

  nivel2.addEventListener('click', () => {
    const nivel1Completado = localStorage.getItem('nivel1Completado');
    if (nivel1Completado === 'true') {
      window.location.href = "2_tema_autismo_1_grado.html";
    } else {
      popup.classList.add('active');
    }
  });

  closePopup.addEventListener('click', () => {
    popup.classList.remove('active');
  });
})();
