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
            if (data.exercises && Array.isArray(data.exercises)) {
                displayExercises(data.exercises);
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

    exercises.forEach(exercise => {
        const exerciseCard = document.createElement('div');
        exerciseCard.classList.add('exercise-card');
        exerciseCard.innerHTML = `
            <img src="${exercise.imgURL}" alt="${exercise.name}" />
            <h3>${exercise.name}</h3>
            <p>${exercise.bodypart}</p>
        `;
        exerciseContainer.appendChild(exerciseCard);
    });
}




