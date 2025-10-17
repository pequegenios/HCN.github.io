(() => {
  const nivel1 = document.getElementById('nivel1');
  const nivel2 = document.getElementById('nivel2');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');

  nivel1.addEventListener('click', () => {
    window.location.href = '1_tema_auditivo_3_grado.html';
  });

  nivel2.addEventListener('click', () => {
    popup.classList.add('active');
  });

  closePopup.addEventListener('click', () => {
    popup.classList.remove('active');
  });
})();
