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

document.addEventListener('DOMContentLoaded',  async () => {
  // Ініціалізація першого завантаження категорій
  const { categories, page, totalPages } = await fetchCategories(FILTER.MUSCLES);
  renderCategories(categories);
  renderPagination(TYPE.CATEGORY, page, totalPages, FILTER.MUSCLES);

  initFilterButtons();
  initSearchForm();
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

const initSearchForm = () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const keyword = searchInput.value.trim();
    const activeFilterButton = document.querySelector('.filter-btn.active');

    if (!activeFilterButton) {
      console.error('No active filter button found.');
      return;
    }

    const selectedFilter = activeFilterButton.getAttribute('data-filter');

    // Викликаємо функцію для завантаження вправ за ключовим словом
    // fetchExercisesByKeyword(selectedFilter, keyword);
  });
}

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

const fetchExercises = async (filter, category, page = 1) => {
  const limit = window.innerWidth < MOBILE_SCREEN_WIDTH ? 8 : 10;

  try {
    const response = await axiosInstance.get(`/exercises`, {
      params: {
        page,
        limit,
        ...(filter === FILTER.MUSCLES && { muscles: category }),
        ...(filter === FILTER.BODY_PARTS && { bodypart: category }),
        ...(filter === FILTER.EQUIPMENT && { equipment: category }),
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
  exerciseContainer.innerHTML = '';

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
      renderExercises(exercises);
      renderPagination(TYPE.EXERCISE, page, totalPages, category.filter);
    });

    fragment.appendChild(categoryCard);
  });
  exerciseContainer.appendChild(fragment);
};

const renderExercises = (exercises) => {
  const exerciseContainer = document.querySelector('.exercises-grid');
  exerciseContainer.innerHTML = '';

  if (exercises.length === 0) {
    exerciseContainer.innerHTML = '<p>No exercises found.</p>';
    return;
  }

  const cards = exercises.map(({ bodyPart, burnedCalories, target, name, rating }) => `
    <div class="exercise-card">
      <div class="exercise-card-header">
        <div class="label">WORKOUT</div>
        <div class="rating">
          <span>
            ${rating}
          </span>
          <svg class="icon-star">
            <use href="./img/icons/icons.svg#icon-star"></use>
          </svg>
        </div>
        <button class="start-btn">
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
};

const renderPagination = (
  type,
  page,
  totalPages,
  filter,
) => {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) return; // Якщо тільки одна сторінка, не потрібно рендерити пагінацію

  const fragment = document.createDocumentFragment();

  console.log('totalPages', totalPages);

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
}
