import { addToFavorites, removeFromFavorites } from './favorites.js';
import { renderFavorites } from './filters.js';
import { showIziToast } from './services/iziToast.js';
import icons from '../img/icons/icons.svg';

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

function openRatingModal() {
  const exerciseId = document
    .querySelector('.modal__block')
    .getAttribute('data-id');
  if (exerciseId) {
    closeModal(); // Закриваємо модальне вікно вправи перед відкриттям модального вікна рейтингу
    const ratingModal = document.getElementById('ratingModal');
    if (ratingModal) {
      resetRatingForm(); // Очищаємо форму перед відкриттям модального вікна
      ratingModal.setAttribute('data-exercise-id', exerciseId);
      ratingModal.classList.add('is-visible');
      setupStarRating(); // Ініціалізуємо зірочки при відкритті модального вікна рейтингу
    }
  } else {
    showIziToast(
      'Exercise ID is missing when trying to open the rating modal.',
      'Error ❌'
    );
  }
}

// Закриття модального вікна по хрестику
document.addEventListener('click', function (event) {
  if (event.target.closest('.rating-modal__exit')) {
    closeRatingModal();
  }
});

// Закриття модального вікна по кліку поза модальним вікном
document.addEventListener('click', function (event) {
  const ratingModal = document.getElementById('ratingModal');
  const modalBlock = document.querySelector('.rating-modal__block');
  const isVisible = ratingModal.classList.contains('is-visible');

  // Якщо модальне вікно відкрите і клік поза межами блоку модального вікна, закриваємо його
  if (isVisible && ratingModal && !modalBlock.contains(event.target)) {
    closeRatingModal();
  }
});

// Закриття модального вікна по натисканню на клавішу Esc
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeRatingModal();
  }
});

// Закриття модального вікна по кліку на кнопці Cancel
document.addEventListener('click', function (event) {
  if (event.target.matches('.rating-modal__cancel-btn')) {
    closeRatingModal();
  }
});

// Функція для закриття модального вікна
function closeRatingModal() {
  const ratingModal = document.getElementById('ratingModal');
  if (ratingModal) {
    ratingModal.classList.remove('is-visible');
    resetRatingForm(); // Скидаємо форму після закриття модального вікна
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function setupStarRating() {
  const starsContainer = document.querySelector('.rating-modal__stars');

  if (!starsContainer) return;

  const stars = starsContainer.querySelectorAll('span');

  if (stars.length === 0) return;

  stars.forEach((star, index) => {
    star.addEventListener('click', function () {
      stars.forEach(s => s.classList.remove('selected'));

      for (let i = 0; i <= index; i++) {
        stars[i].classList.add('selected');
      }

      const ratingValue = index + 1;
      const ratingValueElement = document.querySelector('.rating-modal__value');
      if (ratingValueElement) {
        ratingValueElement.textContent = ratingValue.toFixed(1);
        ratingValueElement.setAttribute('data-selected-rating', ratingValue);
      }
    });
  });
}

function resetRatingForm() {
  const emailInput = document.querySelector('.rating-modal__email');
  const commentInput = document.querySelector('.rating-modal__comment');
  const stars = document.querySelectorAll('.rating-modal__stars span');
  const ratingValue = document.querySelector('.rating-modal__value');

  if (emailInput) {
    emailInput.value = '';
  }

  if (commentInput) {
    commentInput.value = '';
  }

  if (stars.length > 0) {
    stars.forEach(s => s.classList.remove('selected'));
  }

  if (ratingValue) {
    ratingValue.textContent = '0.0';
    ratingValue.removeAttribute('data-selected-rating');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
    if (event.target.matches('.rating-btn')) {
      openRatingModal();
    }
    if (event.target.matches('.rating-modal__submit-btn')) {
      const ratingModal = document.getElementById('ratingModal');
      const exerciseId = ratingModal?.getAttribute('data-exercise-id');

      if (!exerciseId) {
        alert('Exercise ID is missing.');
        return;
      }

      const selectedRating = document
        .querySelector('.rating-modal__value')
        ?.getAttribute('data-selected-rating');
      if (!selectedRating) {
        alert('Please select a rating.');
        return;
      }

      const email = document
        .querySelector('.rating-modal__email')
        ?.value.trim();
      const comment = document
        .querySelector('.rating-modal__comment')
        ?.value.trim();

      if (!selectedRating || !email || !comment) {
        alert('Please fill out all fields.');
        return;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const requestData = {
        rate: Number(selectedRating),
        email: email,
        review: comment,
      };

      fetch(
        `https://your-energy.b.goit.study/api/exercises/${exerciseId}/rating`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      )
        .then(response => {
          if (response.status === 409) {
            return response.json().then(err => {
              throw new Error(
                `Rating already submitted with this email: ${err.message}`
              );
            });
          }
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(`Failed to submit rating: ${err.message}`);
            });
          }
          return response.json();
        })
        .then(data => {
          showIziToast(`Thank you for your feedback`, 'Done ✅');
          closeRatingModal();
        })

        .catch(error => {
          if (
            error.message.includes('Rating already submitted with this email')
          ) {
            showIziToast(
              'You have already submitted a rating using this email address.',
              'Error ❌'
            );
          } else {
            showIziToast(
              'Error submitting rating. Please try again later.',
              'Error ❌'
            );
          }
        });
    }
  });
});

const renderRating = rating => {
  const fullStars = Math.round(rating);
  const fullStarsMarkup = Array(fullStars).fill(
    `<svg class="icon-star"><use href="${icons}#icon-star-full"></use></svg>`
  );
  const emptyStarsMarkup = Array(5 - fullStars).fill(
    `<svg class="icon-star"><use href="${icons}#icon-star-empty"></use></svg>`
  );

  return `
    ${fullStarsMarkup.join('')}
    ${emptyStarsMarkup.join('')}
  `;
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
  modalDescription.textContent =
    exercise.description || 'No description available';
  ratingBlock.innerHTML = `
    <span>${exercise.rating}</span>
    <span>${renderRating(exercise.rating)}</span>
  `;

  // Оновлюємо кнопки в модальному вікні
  const modalButtons = document.querySelector('.modal__btns');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.find(item => item._id === exercise._id);

  modalButtons.innerHTML = `
    <button class="favorites-btn">
      ${isFavorite ? 'Remove' : 'Add to favorites'}
      ${isFavorite ? '' : '<svg class="fa-heart" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">\n  <path d="M17.3666 3.84172C16.941 3.41589 16.4356 3.0781 15.8794 2.84763C15.3232 2.61716 14.727 2.49854 14.1249 2.49854C13.5229 2.49854 12.9267 2.61716 12.3705 2.84763C11.8143 3.0781 11.3089 3.41589 10.8833 3.84172L9.99994 4.72506L9.1166 3.84172C8.25686 2.98198 7.0908 2.49898 5.87494 2.49898C4.65907 2.49898 3.49301 2.98198 2.63327 3.84172C1.77353 4.70147 1.29053 5.86753 1.29053 7.08339C1.29053 8.29925 1.77353 9.46531 2.63327 10.3251L3.5166 11.2084L9.99994 17.6917L16.4833 11.2084L17.3666 10.3251C17.7924 9.89943 18.1302 9.39407 18.3607 8.83785C18.5912 8.28164 18.7098 7.68546 18.7098 7.08339C18.7098 6.48132 18.5912 5.88514 18.3607 5.32893C18.1302 4.77271 17.7924 4.26735 17.3666 3.84172Z" stroke="#242424" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg></button>'}
    <button class="rating-btn">Give a rating</button>
  `;

  const favoritesButton = document.querySelector('.favorites-btn');
  const favoritesContainer = document.getElementById('favorites');
  favoritesButton.addEventListener('click', function () {
    if (isFavorite) {
      const removeFavoriteCallback = favoritesContainer
        ? renderFavorites
        : undefined;
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
document.addEventListener('click', event => {
  const modal = document.querySelector('.modal');
  const modalBlock = document.querySelector('.modal__block');
  if (
    modal &&
    modalBlock &&
    modal.classList.contains('is-visible') &&
    !modalBlock.contains(event.target)
  ) {
    closeModal();
  }
});

// Закриття модального вікна при натисканні клавіші Esc
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
