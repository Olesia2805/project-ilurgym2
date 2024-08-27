document.addEventListener("DOMContentLoaded", function() {

  const navLinks = document.querySelectorAll('.nav-link');

  let currentUrl = window.location.pathname.split('/').pop();

  if (currentUrl !== 'index.html' && currentUrl !== 'favorites.html') {
    currentUrl = 'index.html';
  };

  navLinks.forEach(link => {
      if (link.getAttribute('href') === currentUrl) {
          link.classList.add('active');
      }
  });
});

const header = document.querySelector('.js-header'),
  main = document.querySelector('main'),
  headerScrollClass = 'is-scrolling',
  toggleHeaderScrollingClass = e => {
    e
      ? header.classList.add(headerScrollClass)
      : header.classList.remove(headerScrollClass);
  },
  toggleMainScrollingStyles = e => {
    e
      ? (main.style.marginTop = `${header.offsetHeight}px`)
      : (main.style.marginTop = 0);
  },
  scrollHandler = () => {
    let e = window.scrollY > header.offsetTop;
    toggleHeaderScrollingClass(e), toggleMainScrollingStyles(e);
  };
document.addEventListener('DOMContentLoaded', () => {
  scrollHandler(), document.addEventListener('scroll', scrollHandler);
});