const hidePreloader = () => {
  const preloader = document.querySelector('.preloader');
  preloader.classList.add('preloader--hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    hidePreloader();
  }, 1000);
});