(() => {
  let e = document.querySelector('.js-menu-container'),
    s = document.querySelector('.js-open-menu'),
    n = document.querySelector('.js-close-menu'),
    a = [...document.getElementsByClassName('mobile-menu-link')],
    i = () => {
      let n = 'true' === s.getAttribute('aria-expanded');
      s.setAttribute('aria-expanded', !n),
        e.classList.toggle('is-open'),
        (document.body.style.overflow = n ? 'auto' : 'hidden');
    };

  const updateListeners = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      s.addEventListener('click', i);
      n.addEventListener('click', i);
      a.forEach(e => {
        e.addEventListener('click', i);
      });
    } else {
      s.removeEventListener('click', i);
      n.removeEventListener('click', i);
      a.forEach(e => {
        e.removeEventListener('click', i);
      });
      e.classList.remove('is-open');
      s.setAttribute('aria-expanded', !1);
    }
  };

  window.addEventListener('resize', updateListeners);
  updateListeners();
})();
