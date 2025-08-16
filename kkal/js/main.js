(function(){
  // Mobile menu toggle (scoped)
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    });
  }

  // 키워드 입력 기능 제거에 따른 정리: 남아있는 요소가 있더라도 아무 동작하지 않게 처리
  const seedForm = document.getElementById('seed-form');
  if (seedForm) seedForm.style.display = 'none';
})();
