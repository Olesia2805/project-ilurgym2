import { addToFavorites, removeFromFavorites } from './favorites.js';
import { renderFavorites } from './filters.js';
import { showIziToast } from './services/iziToast.js';

export function openExerciseModal(exerciseId, isFavoritesPage) {
  fetch(`https://your-energy.b.goit.study/api/exercises/${exerciseId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch exercise details.');
      }
      return response.json();
    })
    .then(exercise => {
      fillExerciseModal(exercise, isFavoritesPage);
      showModal(); // Показуємо модальне вікно після заповнення даними
    })
    .catch(error => {
      showIziToast(`Error fetching exercise details: ${error}`, 'Error ❌');
    });
}

const renderRating = (rating) => {
  const fullStart = Math.round(rating);
  const fullStarsMarkup = Array(fullStart).fill('<svg class="icon-star"><use href="./img/icons/icons.svg#icon-star"></use></svg>');
  const emptyStarsMarkup = Array(5 - fullStart).fill('<svg class="icon-star"><use href="./img/icons/icons.svg#icon-star-empty"></use></svg>');
  return `
    ${fullStarsMarkup.join('')}
    ${emptyStarsMarkup.join('')}
  `
};

function fillExerciseModal(exercise) {
  const modalTitle = document.querySelector('.modal-title');
  const modalImage = document.querySelector('.modal-image');
  const modalTarget = document.querySelector('.modal-target');
  const modalBodyPart = document.querySelector('.modal-bodyPart');
  const modalEquipment = document.querySelector('.modal-equipment');
  const modalCalories = document.querySelector('.modal-calories');
  const modalDescription = document.querySelector('.modal__description');
  const modalBlock = document.querySelector('.modal__block');
  const ratingBlock = document.querySelector('.modal__rating');

  // Зберігаємо ID вправи в атрибуті data-id модального вікна
  modalBlock.setAttribute('data-id', exercise._id);

  // Заповнення даних модального вікна
  modalTitle.textContent = exercise.name || 'No name available';
  modalImage.src = exercise.gifUrl || '';
  modalImage.alt = exercise.name || 'Exercise image';
  modalTarget.textContent = exercise.target || 'No target available';
  modalBodyPart.textContent = exercise.bodyPart || 'No body part available';
  modalEquipment.textContent = exercise.equipment || 'No equipment available';
  modalCalories.textContent = `${exercise.burnedCalories || 'N/A'}`;
  modalDescription.textContent = exercise.description || 'No description available';
  ratingBlock.innerHTML = `
    <span>${exercise.rating}</span>
    <span>${renderRating(exercise.rating)}</span>
  `;

  // Оновлюємо кнопки в модальному вікні
  const modalButtons = document.querySelector('.modal__btns');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.find((item) => item._id === exercise._id);

  modalButtons.innerHTML = `
    <button class="favorites-btn">${isFavorite ? 'Remove' : 'Add to favorites'}</button>
<!--    <button class="rating-btn">Give a rating</button>-->
  `;

  const favoritesButton = document.querySelector('.favorites-btn');
  const favoritesContainer = document.getElementById('favorites');
  favoritesButton.addEventListener('click', function () {
    if (isFavorite) {
      const removeFavoriteCallback = favoritesContainer ? renderFavorites : undefined;
      removeFromFavorites(exercise._id, removeFavoriteCallback);
    } else {
      addToFavorites(exercise);
    }
    closeModal(); // Закриваємо модальне вікно після додавання/видалення
  });
}

function showModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.add('is-visible');
  } else {
    showIziToast('Modal element is missing.', 'Error ❌');
  }
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.remove('is-visible');
  } else {
    showIziToast('Modal element is missing.', 'Error ❌');
  }
}

const closeModalButton = document.querySelector('.modal-close');
if (closeModalButton) {
  closeModalButton.addEventListener('click', closeModal);
}

// Закриття модального вікна при натисканні за його межами
document.addEventListener('click', (event) => {
  const modal = document.querySelector('.modal');
  const modalBlock = document.querySelector('.modal__block');
  if (modal && modalBlock && modal.classList.contains('is-visible') && !modalBlock.contains(event.target)) {
    closeModal();
  }
});

// Закриття модального вікна при натисканні клавіші Esc
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});