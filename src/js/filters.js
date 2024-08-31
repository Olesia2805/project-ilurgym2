import { axiosInstance } from './services/api-service.js';

const FILTER = {
  MUSCLES: 'Muscles',
  BODY_PARTS: 'Body parts',
  EQUIPMENT: 'Equipment',
};

document.addEventListener('DOMContentLoaded',  async () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  // Ініціалізація першого завантаження категорій
  const categories = await fetchCategories(FILTER.MUSCLES);
  renderCategories(categories);

  // Обробка кліків на кнопки фільтрів
  filterButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      // Знімаємо активний клас з усіх кнопок
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Додаємо активний клас на клікнуту кнопку
      button.classList.add('active');

      // Отримуємо вибраний фільтр
      const selectedFilter = button.getAttribute('data-filter');

      // Перевірка, чи потрібно показувати поле для пошуку
      if (selectedFilter === 'Body parts' || selectedFilter === 'Equipment') {
          searchForm.style.display = 'flex'; // Показуємо поле для пошуку
      } else {
          searchForm.style.display = 'none'; // Приховуємо поле для пошуку
      }

      // Завантажуємо категорії на основі вибраного фільтра
      const categories = await fetchCategories(selectedFilter);
      renderCategories(categories);
    });
  });

  // Обробка пошуку по ключовому слову
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
      fetchExercisesByKeyword(selectedFilter, keyword);
  });
});

const fetchCategories = async (filter, page = 1, limit = 12) => {
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
      return data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchExercises = async (filter, category) => {
  try {
    const response = await axiosInstance.get(`/exercises`, {
      params: {
        ...(filter === FILTER.MUSCLES && { muscles: category }),
        ...(filter === FILTER.BODY_PARTS && { bodypart: category }),
        ...(filter === FILTER.EQUIPMENT && { equipment: category }),
      }
    });
    const data = response.data;
    if (data.results) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

const renderCategories = (categories) => {
  const exerciseContainer = document.querySelector('.exercises-grid');
  exerciseContainer.innerHTML = '';

  if (categories.length === 0) {
    exerciseContainer.innerHTML = '<p>No categories found.</p>';
    return;
  }

  categories.forEach((category) => {
    const categoryCard = document.createElement('div');
    categoryCard.classList.add('category-card');
    categoryCard.innerHTML = `
          <img src="${category.imgURL}" alt="${category.name}" />
          <h3>${category.name}</h3>
          <p>${category.filter}</p>
      `;

    categoryCard.addEventListener('click', async () => {
      // Приховуємо категорії та завантажуємо вправи
      const exercises = await fetchExercises(category.filter, category.name);
      displayExercises(exercises);
    });

    exerciseContainer.appendChild(categoryCard);
  });
}

function fetchExercisesByKeyword(filter, keyword) {
    const url = `https://your-energy.b.goit.study/api/exercises?filter=${filter}&keyword=${keyword}&page=1&limit=12`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Received exercises data:', data);  // Перевірка відповіді від API
            if (data.results && Array.isArray(data.results)) {
                displayExercises(data.results);
            } else {
                displayExercises([]);
            }
        })
        .catch(error => {
            console.error('Error fetching exercises by keyword:', error);
            displayExercises([]);
        });
}

function displayExercises(exercises) {
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
}




