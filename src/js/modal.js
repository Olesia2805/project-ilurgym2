import { addToFavorites, getFavorites, removeFromFavorites } from './favorites.js';
import { renderFavorites } from './filters.js';
import { showIziToast } from './services/iziToast.js';
import icons from '../img/icons/icons.svg';
import { fetchApi } from './services/api-service';

const getExerciseById = async (exerciseId) => {
  const favorites = getFavorites();
  const isFavorite = favorites.find(item => item._id === exerciseId);
  const exercise = await fetchApi.getExercisesId(exerciseId);
  return {
    exercise,
    isFavorite,
  }
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
      loadRatingFormData(); // Завантажуємо дані з Local Storage
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

        // Збереження рейтингу в Local Storage
        const formData = JSON.parse(localStorage.getItem('rating-form-data')) || {};
        formData.rating = ratingValue;
        localStorage.setItem('rating-form-data', JSON.stringify(formData));
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

  // Очищення Local Storage
  localStorage.removeItem('rating-form-data');
}

function loadRatingFormData() {
  const formFromLS = JSON.parse(localStorage.getItem('rating-form-data'));
  if (formFromLS !== null) {
    if (formFromLS.email) {
      document.querySelector('.rating-modal__email').value = formFromLS.email;
    }
    if (formFromLS.comment) {
      document.querySelector('.rating-modal__comment').value = formFromLS.comment;
    }
    if (formFromLS.rating) {
      const stars = document.querySelectorAll('.rating-modal__stars span');
      stars.forEach((star, index) => {
        if (index < formFromLS.rating) {
          star.classList.add('selected');
        }
      });
      document.querySelector('.rating-modal__value').textContent = formFromLS.rating;
      document.querySelector('.rating-modal__value').setAttribute('data-selected-rating', formFromLS.rating);
    }
  }
}

document.addEventListener('input', event => {
  if (
    event.target.matches('.rating-modal__email') ||
    event.target.matches('.rating-modal__comment')
  ) {
    const email = document.querySelector('.rating-modal__email')?.value.trim();
    const comment = document.querySelector('.rating-modal__comment')?.value.trim();
    const selectedRating = document
      .querySelector('.rating-modal__value')
      ?.getAttribute('data-selected-rating');

    const ratingFormData = {
      email: email || '',
      comment: comment || '',
      rating: selectedRating || ''
    };

    localStorage.setItem('rating-form-data', JSON.stringify(ratingFormData));
  }
});

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

      fetchApi.editExercisesIdRating(exerciseId, requestData)  // Використання fetchApi для відправки рейтингу
        .then(data => {
          showIziToast(`Thank you for your feedback`, 'Done ✅');
          localStorage.removeItem('rating-form-data'); // Очищення Local Storage після успішного відправлення
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

const renderFavoriteOpenButton = () => `
  <span class="js-favorite-add">Add to favorites</span>
  <svg class="js-favorite-add favorite-icon favorite-icon--heart" width="20" height="20">
    <use href="./img/icons/icons.svg#icon-heart" />
  </svg>
`

const renderFavoriteCloseButton = () => `
  <span class="js-favorite-remove">Remove from favorites</span>
  <svg class="js-favorite-remove favorite-icon favorite-icon--trash" width="20" height="20">
    <use href="./img/icons/icons.svg#icon-trash" />
  </svg>
`

const getMarkupExerciseModalWindow = (exercise, isFavorite) => `
  <div class="modal">
    <div class="modal__block" data-id="${exercise._id}">
      <div class="modal__block-content">
        <div class="modal__block-wrapper">
          <svg class="modal__exit modal-close">
            <use href="./img/icons/icons.svg#icon-close"></use>
          </svg>
          <div class="modal__img">
            <img src="${exercise.gifUrl || ''}" class="modal-image" alt="${exercise.name || 'Exercise image'}" />
          </div>
          <div class="modal__content">
            <h2 class="modal-title">${exercise.name || 'No name available'}</h2>
            <div class="modal__rating">
              <span>${exercise.rating}</span>
              <span>${renderRating(exercise.rating)}</span>
            </div>
            <div class="modal__info">
              <div>
                <div>Target</div>
                <div class="modal-target">${exercise.target || 'No target available'}</div>
              </div>
              <div>
                <div>Body Part</div>
                <div class="modal-bodyPart">${exercise.bodyPart || 'No body part available'}</div>
              </div>
              <div>
                <div>Equipment</div>
                <div class="modal-equipment">${exercise.equipment || 'No equipment available'}</div>
              </div>
              <div>
                <div>Popular</div>
                <div class="modal-popular">${exercise.popularity || 0}</div>
              </div>
              <div>
                <div>Burned calories</div>
                <div class="modal-calories">${exercise.burnedCalories || 'N/A'}</div>
              </div>
            </div>
            <p class="modal__description">
              ${exercise.description || 'No description available'}
            </p>
          </div>
        </div>
        <div class="modal__btns">
          <button class="favorites-btn" data-id="${exercise._id}">
            ${isFavorite ? renderFavoriteCloseButton() : renderFavoriteOpenButton()}
          </button>
          <button class="rating-btn">Give a rating</button>
        </div>
      </div>
    </div>
  </div>
`

export async function showModal(exerciseId) {
  const { exercise, isFavorite } = await getExerciseById(exerciseId);

  const modal = getMarkupExerciseModalWindow(exercise, isFavorite);
  document.body.insertAdjacentHTML('beforeend', modal);

  const favoritesButton = document.querySelector('.favorites-btn');
  favoritesButton.addEventListener('click', favoriteClickEventHandler(favoritesButton));

  document.addEventListener('keydown', closeModalHandler);
}

function closeModal() {
  const modal = document.querySelector('.modal');

  const favoritesButton = document.querySelector('.favorites-btn');
  favoritesButton.removeEventListener('click', favoriteClickEventHandler(favoritesButton));
  if (modal) {
    modal.remove();
    document.removeEventListener('keydown', closeModalHandler);
  } else {
    showIziToast('Modal element is missing.', 'Error ❌');
  }
}

const closeModalHandler = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
}

const favoriteClickEventHandler = (favoritesButton) => async () => {
  const exerciseId = favoritesButton.getAttribute('data-id');

  const favoritesContainer = document.getElementById('favorites');
  const { exercise, isFavorite } = await getExerciseById(exerciseId);

  if (isFavorite) {
    const removeFavoriteCallback = favoritesContainer
      ? renderFavorites
      : undefined;
    removeFromFavorites(exercise._id, removeFavoriteCallback);
  } else {
    addToFavorites(exercise);
  }
  favoritesButton.innerHTML = !isFavorite ? renderFavoriteCloseButton() : renderFavoriteOpenButton();
};

const closeModalEventHandler = (closeModalButton) => {
  closeModalButton.addEventListener('click', closeModal);
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    const modal = document.querySelector('.modal');
    const modalBlock = modal?.querySelector('.modal__block');

    if (
      modal &&
      modalBlock &&
      !modalBlock.contains(event.target)
    ) {
      closeModal();
    }

    const closeModalButton = document.querySelector('.modal-close');

    if (closeModalButton) {
      closeModalEventHandler(closeModalButton);
    }
  });
});