import { getFavorites, removeFromFavorites } from './favorites.js';
import { openExerciseModal } from './modal.js';
import { axiosInstance } from './services/api-service.js';

const FILTER = {
  MUSCLES: 'Muscles',
  BODY_PARTS: 'Body parts',
  EQUIPMENT: 'Equipment',
};

const TYPE = {
  EXERCISE: 'exercises',
  CATEGORY: 'categories',
};

const MOBILE_SCREEN_WIDTH = 768;

let currentFilter = FILTER.MUSCLES;
let currentCategory = null;

document.addEventListener('DOMContentLoaded',  async () => {
  const favoritesContainer = document.getElementById('favorites');
  if (favoritesContainer) {
    renderFavorites();
  } else {
    const { categories, page, totalPages } = await fetchCategories(FILTER.MUSCLES);
    renderCategories(categories);
    renderPagination(TYPE.CATEGORY, page, totalPages, FILTER.MUSCLES);

    initFilterButtons();
  }
});

const initFilterButtons = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      const selectedFilter = button.getAttribute('data-filter');

      const { categories, page, totalPages } = await fetchCategories(selectedFilter);
      renderCategories(categories);
      renderPagination(TYPE.CATEGORY, page, totalPages, selectedFilter);
    });
  });
};

const fetchCategories = async (filter, page = 1) => {
  const limit = window.innerWidth < MOBILE_SCREEN_WIDTH ? 9 : 12;

  try {
    const response = await axiosInstance.get(`/filters`, {
      params: {
        filter,
        page,
        limit,
      }
    });
    const data = response.data;
    if (data.results) {
      return {
        categories: data.results,
        page: Number(data.page),
        totalPages: Number(data.totalPages),
      };
    }
    return {
      categories: [],
      page: 1,
      totalPages: 1,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      categories: [],
      page: 1,
      totalPages: 1,
    };
  }
};

const fetchExercises = async (filter, category, page = 1, keyword = null) => {
  const limit = window.innerWidth < MOBILE_SCREEN_WIDTH ? 8 : 10;

  try {
    const response = await axiosInstance.get(`/exercises`, {
      params: {
        page,
        limit,
        ...(filter === FILTER.MUSCLES && { muscles: category }),
        ...(filter === FILTER.BODY_PARTS && { bodypart: category }),
        ...(filter === FILTER.EQUIPMENT && { equipment: category }),
        ...(keyword && { keyword }),
      }
    });
    const data = response.data;
    if (data.results) {
      return {
        exercises: data.results,
        page: Number(data.page),
        totalPages: Number(data.totalPages),
      };
    }
    return {
      exercises: [],
      page: 1,
      totalPages: 1,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      exercises: [],
      page: 1,
      totalPages: 1,
    };
  }
}

const renderCategories = (categories) => {
  const exerciseContainer = document.querySelector('.exercises-grid');
  if (!exerciseContainer) return;
  exerciseContainer.innerHTML = '';
  changeSearchFormVisibility(false);
  updateFilterSectionHeader(false);

  if (categories.length === 0) {
    exerciseContainer.innerHTML = '<p>No categories found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  categories.forEach((category) => {
    const categoryCard = document.createElement('div');
    categoryCard.classList.add('category-card');
    categoryCard.innerHTML = `
      <img src="${category.imgURL}" alt="${category.name}" />
      <h3>${category.name}</h3>
      <p>${category.filter}</p>
    `;

    categoryCard.addEventListener('click', async () => {
      const { exercises, page, totalPages } = await fetchExercises(category.filter, category.name);
      currentFilter = category.filter;
      currentCategory = category.name;
      renderExercises(exercises);
      renderPagination(TYPE.EXERCISE, page, totalPages, category.filter);
    });

    fragment.appendChild(categoryCard);
  });
  exerciseContainer.appendChild(fragment);
};

const getRatingMarkup = (rating) => `
  <div class="rating">
    <span>
      ${rating}
    </span>
    <svg class="icon-star">
      <use href="./img/icons/icons.svg#icon-star"></use>
    </svg>
  </div>
`;

const getTrashButtonMarkup = (id) => `
  <button class="trash-btn" data-id="${id}">
    <svg width="16px" height="16px">
      <use href="./img/icons/icons.svg#icon-trash"></use>
    </svg>
  </button>
`;

const renderExercises = (exercises, isFavorites = false) => {
  const exerciseContainer = document.querySelector('.exercises-grid');
  if (!exerciseContainer) return;
  exerciseContainer.innerHTML = '';
  changeSearchFormVisibility(true);
  updateFilterSectionHeader(true, currentCategory);


  if (exercises.length === 0) {
    exerciseContainer.innerHTML = '<p>No exercises found.</p>';
    return;
  }

  const cards = exercises.map(({ bodyPart, burnedCalories, target, name, rating, _id }) => `
    <div class="exercise-card">
      <div class="exercise-card-header">
        <div class="label">WORKOUT</div>
        ${isFavorites ? getTrashButtonMarkup(_id) : getRatingMarkup(rating)}
        <button class="start-btn" data-id="${_id}">
          Start
          <svg class="icon-arrow">
            <use href="./img/icons/icons.svg#icon-arrow-start"></use>
          </svg>
        </button>
      </div>
      <div class="title-wrapper">
        <div class="icon-run-exercises">
          <svg class="icon-run">
            <use href="./img/icons/icons.svg#icon-run"></use>
          </svg>
        </div>
        <div class="title">${name}</div>
      </div>
      <div class="details">
        <div class="details-item">
          Burned calories: <span>${burnedCalories}</span>
        </div>
        <div class="details-item">
          Body part: <span>${bodyPart}</span>
        </div>
        <div class="details-item">
          Target:<span>${target}</span>
        </div>
      </div>
    </div>
  `).join(' ');

  exerciseContainer.insertAdjacentHTML('afterbegin', cards);

  document.querySelectorAll('.exercise-card .start-btn').forEach((card) => {
    const exerciseId = card.getAttribute('data-id');
    console.log(`Exercise ID: ${exerciseId}`); // Лог ID вправи
    if (exerciseId) {
      card.addEventListener('click', () => {
        openExerciseModal(exerciseId, false); // Передаємо параметр false для інших сторінок
      });
    } else {
      console.error('Exercise ID is missing.');
    }
  });

  document.querySelectorAll('.trash-btn').forEach((card) => {
    const exerciseId = card.getAttribute('data-id');
    console.log(`Exercise ID: ${exerciseId}`);
    console.log('card', card);
    console.log('exerciseId', exerciseId);
    if (exerciseId) {
      card.addEventListener('click', () => {
        removeFromFavorites(exerciseId, renderFavorites);
      });
    } else {
      console.error('Exercise ID is missing.');
    }
  });
};

const renderPagination = (
  type,
  page,
  totalPages,
  filter,
) => {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  pagination.innerHTML = '';

  if (totalPages <= 1) return; // Якщо тільки одна сторінка, не потрібно рендерити пагінацію

  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('div');
    pageButton.innerText = i;
    pageButton.className = i === page ? 'page current' : 'page';

    pageButton.addEventListener('click', async () => {
      if (type === TYPE.CATEGORY) {
        const { categories } = await fetchCategories(filter, i);
        renderCategories(categories);
        renderPagination(type, i, totalPages, filter);
      } else {
        const { exercises } = await fetchExercises(filter, null, i);
        renderExercises(exercises);
        renderPagination(type, i, totalPages, filter);
      }
    });

    fragment.appendChild(pageButton);
  }

  pagination.appendChild(fragment);
};

export const renderFavorites = () => {
  const exerciseContainer = document.querySelector('.exercises-grid');
  const exercises = getFavorites();
  if (exercises.length > 0) {
    renderExercises(exercises, true);
  } else {
    exerciseContainer.innerHTML = '<p class="empty-favorites">It appears that you haven\'t added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.</p>';
  }
};

const changeSearchFormVisibility = (isVisible) => {
  const searchForm = document.getElementById('search-form');
  if (!searchForm) return;
  searchForm.style.display = isVisible ? 'block' : 'none';

  if (isVisible) {
    searchForm.addEventListener('submit', searchFormSubmitHandler);
  } else {
    searchForm.removeEventListener('submit', searchFormSubmitHandler);
  }
};

const searchFormSubmitHandler = async (event) => {
  event.preventDefault();
  const searchInput = document.getElementById('search-input');

  const value = searchInput.value.trim();
  searchInput.value = '';

  if (value === '') return;

  const { exercises } = await fetchExercises(currentFilter, currentCategory, 1, value);
  renderExercises(exercises);
  renderPagination(TYPE.EXERCISE, 1, 1, currentFilter);

};

const updateFilterSectionHeader = (isVisible, filter = '') => {
  const span = document.querySelector('.exercises-header-span');
  const header = document.querySelector('.exercises-subcategory');
  if (!span || !header) return;
  span.style.display = isVisible ? 'flex' : 'none';
  header.textContent = filter;
};