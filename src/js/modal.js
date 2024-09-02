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

      // Завантаження даних рейтингу з локального сховища
      const savedRating = loadRatingFromLocalStorage(exerciseId);
      if (savedRating) {
        document.querySelector('.rating-modal__email').value =
          savedRating.email;
        document.querySelector('.rating-modal__comment').value =
          savedRating.review;
        const ratingValueElement = document.querySelector(
          '.rating-modal__value'
        );
        if (ratingValueElement) {
          ratingValueElement.textContent = savedRating.rate.toFixed(1);
          ratingValueElement.setAttribute(
            'data-selected-rating',
            savedRating.rate
          );
        }
        const stars = document.querySelectorAll('.rating-modal__stars span');
        stars.forEach((star, index) => {
          if (index < savedRating.rate) {
            star.classList.add('selected');
          }
        });
      }

      ratingModal.setAttribute('data-exercise-id', exerciseId);
      ratingModal.classList.add('is-visible');
      setupStarRating(); // Ініціалізуємо зірочки при відкритті модального вікна рейтингу

      // Закриття модального вікна по натисканню на клавішу Esc
      document.addEventListener('keydown', closeRatingModalHandler);
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

const closeRatingModalHandler = (event) => {
  if (event.key === 'Escape') {
    closeRatingModal();
  }
};

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
    document.removeEventListener('keydown', closeRatingModalHandler);
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
        return;
      }

      const selectedRating = document
        .querySelector('.rating-modal__value')
        ?.getAttribute('data-selected-rating');
      if (!selectedRating) {
        showIziToast('Please select a rating.', 'Error ❌');
        return;
      }

      const email = document
        .querySelector('.rating-modal__email')
        ?.value.trim();
      const comment = document
        .querySelector('.rating-modal__comment')
        ?.value.trim();

      if (!selectedRating || !email || !comment) {
        showIziToast('Please fill in all fields.', 'Error ❌');
        return;
      }

      if (!validateEmail(email)) {
        showIziToast('Please enter a valid email address.', 'Error ❌');
        return;
      }

      const requestData = {
        rate: Number(selectedRating),
        email: email,
        review: comment,
      };

      // Збереження рейтингу до локального сховища
      saveRatingToLocalStorage(exerciseId, requestData);

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

function saveRatingToLocalStorage(exerciseId, ratingData) {
  const ratings = JSON.parse(localStorage.getItem('exerciseRatings')) || {};
  ratings[exerciseId] = ratingData;
  localStorage.setItem('exerciseRatings', JSON.stringify(ratings));
}

function loadRatingFromLocalStorage(exerciseId) {
  const ratings = JSON.parse(localStorage.getItem('exerciseRatings')) || {};
  return ratings[exerciseId] || null;
}

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

const handlerVisibility = (nodes, isVisible) => {
  nodes.forEach((node) => node.style.display = isVisible ? 'block' : 'none');
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
  const removeButton = document.querySelectorAll('.js-favorite-remove');
  const addButton = document.querySelectorAll('.js-favorite-add');

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.find(item => item._id === exercise._id);

  handlerVisibility(removeButton, isFavorite);
  handlerVisibility(addButton, !isFavorite);

  const favoritesButton = document.querySelector('.favorites-btn');
  const favoritesContainer = document.getElementById('favorites');

  favoritesButton.addEventListener('click', function (e) {
    e.stopImmediatePropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.find(item => item._id === exercise._id);

    if (isFavorite) {
      const removeFavoriteCallback = favoritesContainer
        ? renderFavorites
        : undefined;
      removeFromFavorites(exercise._id, removeFavoriteCallback);
      handlerVisibility(removeButton, false);
      handlerVisibility(addButton, true);
    } else {
      addToFavorites(exercise);
      handlerVisibility(removeButton, true);
      handlerVisibility(addButton, false);
    }
    favoritesButton.blur();
  });
}

function showModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.add('is-visible');
    document.addEventListener('keydown', closeModalHandler);
  } else {
    showIziToast('Modal element is missing.', 'Error ❌');
  }
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.remove('is-visible');
    document.removeEventListener('keydown', closeModalHandler);
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
  if (
    modal &&
    modalBlock &&
    modal.classList.contains('is-visible') &&
    !modalBlock.contains(event.target)
  ) {
    closeModal();
  }
});

const closeModalHandler = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};
