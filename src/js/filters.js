// document.addEventListener('DOMContentLoaded', function () {
//     const filterButtons = document.querySelectorAll('.filter-btn');
//     // Установлюємо активний клас на першій кнопці, якщо жодна не активна
//     if (!document.querySelector('.filter-btn.active') && filterButtons.length > 0) {
//         filterButtons[0].classList.add('active');
//     }
//     const searchForm = document.getElementById('search-form');
//     const searchInput = document.getElementById('search-input');

//     // Ініціалізація першого завантаження категорій
//     fetchCategories('Muscles');

//     // Обробка кліків на кнопки фільтрів
//     filterButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             // Знімаємо активний клас з усіх кнопок
//             filterButtons.forEach(btn => btn.classList.remove('active'));

//             // Додаємо активний клас на клікнуту кнопку
//             button.classList.add('active');

//             // Отримуємо вибраний фільтр
//             const selectedFilter = button.getAttribute('data-filter');

//             // Завантажуємо категорії на основі вибраного фільтра
//             fetchCategories(selectedFilter);
//         });
//     });

//     // Обробка пошуку по ключовому слову
//     searchForm.addEventListener('submit', function (event) {
//         event.preventDefault();
//         const keyword = searchInput.value.trim();
//         const activeFilterButton = document.querySelector('.filter-btn.active');

//         if (!activeFilterButton) {
//             console.error('No active filter button found.');
//             return;
//         }

//         const selectedFilter = activeFilterButton.getAttribute('data-filter');

//         // Викликаємо функцію для завантаження вправ за ключовим словом
//         fetchExercisesByKeyword(selectedFilter, keyword);
//     });

// });

document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  // Ініціалізація першого завантаження категорій
  fetchCategories('Muscles');

  // Обробка кліків на кнопки фільтрів
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
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
      fetchCategories(selectedFilter);
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

function fetchCategories(filter) {
  fetch(`https://your-energy.b.goit.study/api/filters?filter=${filter}&page=1&limit=12`)
    .then(response => response.json())
    .then(data => {
      console.log('Received data:', data);  // Перевірка відповіді від API
      if (data.results && Array.isArray(data.results)) {
          displayCategories(data.results);
      } else {
          displayCategories([]);
      }
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
      displayCategories([]);
    });
}

function displayCategories(categories) {
    const categoryContainer = document.querySelector('.category-container');
    categoryContainer.innerHTML = '';

    if (categories.length === 0) {
        categoryContainer.innerHTML = '<p>No categories found.</p>';
        return;
    }

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.innerHTML = `
            <img src="${category.imgURL}" alt="${category.name}" />
            <h3>${category.name}</h3>
            <p>${category.filter}</p>
        `;

        categoryCard.addEventListener('click', () => {
            // Приховуємо категорії та завантажуємо вправи
            categoryContainer.style.display = 'none';
            fetchExercisesByCategory(category.name);
        });

        categoryContainer.appendChild(categoryCard);
    });
}

function fetchExercisesByCategory(category) {
    fetch(`https://your-energy.b.goit.study/api/exercises?muscles=${category}`)
        .then(response => response.json())
        .then(data => {
            console.log('data.exercises', data)
            if (data.results && Array.isArray(data.results)) {
                displayExercises(data.results);
            } else {
                displayExercises([]);
            }
        })
        .catch(error => {
            console.error('Error fetching exercises:', error);
            displayExercises([]);
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
    const exerciseContainer = document.querySelector('.exercise-container');
    exerciseContainer.innerHTML = '';

    if (exercises.length === 0) {
        exerciseContainer.innerHTML = '<p>No exercises found.</p>';
        return;
    }

    const cards = exercises.map(({ bodyPart, burnedCalories, target, name, rating }) => `
      <div class="exercise-card">
        <div class="exercise-card-header">
          <div class="label">WORKOUT</div>
          <div class="rating-wrapper">
            <div class="rating">
              ${rating}
              <svg class="icon-star">
                <use href="./img/icons/icons.svg#icon-star"></use>
              </svg>
            </div>
            <div class="start-btn-wrapper">
              <div class="start-btn">
                Start
                <svg class="icon-arrow">
                  <use href="./img/icons/icons.svg#icon-arrow-start"></use>
                </svg>
              </div>
            </div>
          </div>
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
          <div class="details-calories">
            Burned calories: <span class="details-calories-info">${burnedCalories}</span>
          </div>
          <div class="details-body-part">
            Body part: <span class="details-body-part-info">${bodyPart}</span>
          </div>
          <div class="details-target">
            Target:<span class="details-target-info">${target}</span>
          </div>
        </div>
      </div>
    `).join(' ');

    exerciseContainer.insertAdjacentHTML('afterbegin', cards);
}




