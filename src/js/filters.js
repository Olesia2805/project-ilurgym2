document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const categoryContainer = document.querySelector('.category-container');
    const exerciseContainer = document.querySelector('.exercise-container');
    const favoritesContainer = document.querySelector('.favorites-container');

    // Перевірка, чи це сторінка FAVORITES
    if (favoritesContainer) {
        displayFavoriteExercises();
    } else {
        console.log('This is not the FAVORITES page, skipping favorite exercises display.');
    }

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
            categoryContainer.style.display = 'flex';
            exerciseContainer.innerHTML = ''; // Очищаємо вправи
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

    // Обробка кліків на картки вправ на сторінці FAVORITES
    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', function (event) {
            const exerciseCard = event.target.closest('.exercise-card');
            if (exerciseCard) {
                const exerciseId = exerciseCard.getAttribute('data-id');
                openExerciseModal(exerciseId, true); // Передаємо параметр true для сторінки FAVORITES
            }
        });
    }

    // Додаємо обробник події для кнопки "Add to favorites" після того, як модальне вікно відкриється та заповниться даними
    document.addEventListener('click', function (event) {
        const modalBlock = document.querySelector('.modal__block');
        if (event.target.closest('.modal__btns .add-to-favorites-btn')) {
            const exerciseId = modalBlock.getAttribute('data-id');
            addToFavorites(exerciseId);
        } else if (event.target.closest('.modal__btns .remove-from-favorites-btn')) {
            const exerciseId = modalBlock.getAttribute('data-id');
            removeFromFavorites(exerciseId);
        }
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
    if (!categoryContainer) {
        console.error('Category container not found!');
        return; // Завершуємо виконання функції, якщо контейнер не знайдено
    }

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

    console.log('Received exercises:', exercises); // Лог всіх вправ, щоб перевірити структуру

    const cards = exercises.map(exercise => {
        console.log('Exercise object:', exercise); // Лог кожного об'єкта вправи

        const { _id, bodyPart, burnedCalories, target, name, rating } = exercise;

        if (!_id) {
            console.error('Exercise ID is missing for:', exercise);
        }

        return `
          <div class="exercise-card" data-id="${_id}">
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
        `;
    }).join(' ');

    exerciseContainer.insertAdjacentHTML('afterbegin', cards);

    // Додаємо обробник подій для кожної картки вправи
    document.querySelectorAll('.exercise-card').forEach(card => {
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
}

function openExerciseModal(exerciseId, isFavoritesPage) {
    console.log(`Fetching details for exercise ID: ${exerciseId}`);
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
            console.error('Error fetching exercise details:', error);
        });
}

function fillExerciseModal(exercise) {
    const modalTitle = document.querySelector('.modal-title');
    const modalImage = document.querySelector('.modal-image');
    const modalTarget = document.querySelector('.modal-target');
    const modalBodyPart = document.querySelector('.modal-bodyPart');
    const modalEquipment = document.querySelector('.modal-equipment');
    const modalCalories = document.querySelector('.modal-calories');
    const modalDescription = document.querySelector('.modal__description');
    const modalBlock = document.querySelector('.modal__block');

    // Зберігаємо ID вправи в атрибуті data-id модального вікна
    modalBlock.setAttribute('data-id', exercise._id);

    // Заповнення даних модального вікна
    modalTitle.textContent = exercise.name || 'No name available';
    modalImage.src = exercise.gifUrl || '';
    modalImage.alt = exercise.name || 'Exercise image';
    modalTarget.textContent = exercise.target || 'No target available';
    modalBodyPart.textContent = exercise.bodyPart || 'No body part available';
    modalEquipment.textContent = exercise.equipment || 'No equipment available';
    modalCalories.textContent = `Burned calories: ${exercise.burnedCalories || 'N/A'}`;
    modalDescription.textContent = exercise.description || 'No description available';

    // Оновлюємо кнопки в модальному вікні
    const modalButtons = document.querySelector('.modal__btns');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.includes(exercise._id);

    modalButtons.innerHTML = `
        <button class="favorites-btn">${isFavorite ? 'Remove from favorites' : 'Add to favorites'}</button>
        <button class="rating-btn">Give a rating</button>
    `;

    const favoritesButton = document.querySelector('.favorites-btn');
    favoritesButton.addEventListener('click', function () {
        if (isFavorite) {
            removeFromFavorites(exercise._id);
        } else {
            addToFavorites(exercise._id);
        }
        closeModal(); // Закриваємо модальне вікно після додавання/видалення
    });
}

function addToFavorites(exerciseId) {
    if (!exerciseId) {
        alert('Exercise ID is missing.');
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(exerciseId)) {
        alert('This exercise is already in your favorites.');
    } else {
        favorites.push(exerciseId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Exercise added to favorites!');
    }
}

function removeFromFavorites(exerciseId) {
    if (!exerciseId) {
        alert('Exercise ID is missing.');
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.includes(exerciseId)) {
        alert('This exercise is not in your favorites.');
    } else {
        favorites = favorites.filter(id => id !== exerciseId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Exercise removed from favorites!');
        // Оновлюємо список на сторінці FAVORITES
        displayFavoriteExercises();
    }
}

function showModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.add('is-visible');
        console.log('Modal is now visible.'); // Лог для перевірки
    } else {
        console.error('Modal element is missing.');
    }
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('is-visible');
        console.log('Modal is now hidden.'); // Лог для перевірки
    } else {
        console.error('Modal element is missing.');
    }
}

// Додаємо обробник події для закриття модального вікна
const closeModalButton = document.querySelector('.modal-close');
if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
} else {
    console.error('Modal close button is missing.');
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

function displayFavoriteExercises() {
    const favoritesContainer = document.querySelector('.favorites-container');
    if (!favoritesContainer) {
        console.error('Favorites container not found!');
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Очищуємо масив від некоректних значень (наприклад, об'єктів)
    favorites = favorites.filter(id => typeof id === 'string');

    if (favorites.length === 0) {
        displayNoFavoritesMessage(favoritesContainer);
        return;
    }

    // Виконуємо запит для кожного ID
    const fetchPromises = favorites.map(id =>
        fetch(`https://your-energy.b.goit.study/api/exercises/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching exercise:', error);
                return null;
            })
    );

    // Виконуємо всі запити
    Promise.all(fetchPromises)
        .then(exercises => {
            exercises = exercises.filter(exercise => exercise !== null); // Видаляємо null об'єкти у випадку помилок
            if (exercises.length === 0) {
                displayNoFavoritesMessage(favoritesContainer);
            } else {
                renderExercises(exercises, favoritesContainer);
            }
        });
}

function displayNoFavoritesMessage(container) {
    container.innerHTML = '<p>No favorite exercises found.</p>';
}

function renderExercises(exercises, container) {
    container.innerHTML = ''; // Очищаємо контейнер перед рендерингом

    exercises.forEach(exercise => {
        const exerciseCard = document.createElement('div');
        exerciseCard.classList.add('exercise-card');
        exerciseCard.setAttribute('data-id', exercise._id); // Додаємо ID до картки
        exerciseCard.innerHTML = `
            <div class="exercise-card-header">
                <div class="label">WORKOUT</div>
                <div class="rating-wrapper">
                    <div class="rating">
                        ${exercise.rating || 'N/A'}
                        <svg class="icon-star">
                            <use href="./img/icons/icons.svg#icon-star"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="title-wrapper">
                <div class="icon-run-exercises">
                    <svg class="icon-run">
                        <use href="./img/icons/icons.svg#icon-run"></use>
                    </svg>
                </div>
                <div class="title">${exercise.name}</div>
            </div>
            <div class="details">
                <div class="details-calories">
                    Burned calories: <span class="details-calories-info">${exercise.burnedCalories || 'N/A'}</span>
                </div>
                <div class="details-body-part">
                    Body part: <span class="details-body-part-info">${exercise.bodyPart || 'N/A'}</span>
                </div>
                <div class="details-target">
                    Target:<span class="details-target-info">${exercise.target || 'N/A'}</span>
                </div>
            </div>
        `;
        container.appendChild(exerciseCard);
    });
}
