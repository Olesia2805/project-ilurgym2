import axios from 'axios';
import { showIziToast } from './services/iziToast.js';
const fetchData = async (category, page) => {
  const screenWidth = window.innerWidth;
  const limit = screenWidth < 768 ? 9 : 12;
  try {
    const response = await axios.get(
      'https://your-energy.b.goit.study/api/filters',
      {
        params: {
          filter: category,
          page: page,
          limit: limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    showIziToast(`Error fetching data: ${error}`, 'Error ❌');
    return null;
  }
};

const fetchExercises = async page => {
  const screenWidth = window.innerWidth;
  const limit = screenWidth < 768 ? 8 : 10;

  try {
    const response = await axios.get(
      'https://your-energy.b.goit.study/api/exercises',
      {
        params: {
          page: page,
          limit: limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    showIziToast(`Error fetching exercises data: ${error}`, 'Error ❌');
    return null;
  }
};

// Функція для рендеру отриманих елементів
const renderItems = items => {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = ''; // Очищуємо попередній контент

  if (!items || items.length === 0) {
    contentDiv.innerText = 'No items available to display.';
    return;
  }

  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';

    const imgElement = document.createElement('img');
    imgElement.src = item.imgURL;
    imgElement.alt = item.name;

    const textElement = document.createElement('p');
    textElement.innerText = item.name;

    itemElement.appendChild(imgElement);
    itemElement.appendChild(textElement);

    contentDiv.appendChild(itemElement);
  });
};

// Функція для рендеру елементів управління пагінацією
const renderPagination = (currentPage, totalPages, onPageChange) => {
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = ''; // Очищуємо попередню пагінацію

  if (totalPages <= 1) return; // Якщо тільки одна сторінка, не потрібно рендерити пагінацію

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.className = i === currentPage ? 'active' : '';
    pageButton.onclick = () => onPageChange(i);
    paginationDiv.appendChild(pageButton);
  }
};

// Функція для обробки зміни сторінки
const onPageChange = async (category, page, isExercises) => {
  const data = isExercises
    ? await fetchExercises(page)
    : await fetchData(category, page);

  if (data && data.results) {
    renderItems(data.results); // Використовуємо 'results' для рендерингу елементів
    renderPagination(page, data.totalPages || 1, newPage =>
      onPageChange(category, newPage, isExercises)
    );
  } else {
    renderItems([]); // Якщо немає даних, відображаємо повідомлення
  }
};

// // Початковий рендер
// const initialize = async () => {
//   const category = 'Muscles'; // Або будь-яка інша категорія
//   const initialPage = 1;

//   // Приклад: Рендер фільтрованих даних
//   await onPageChange(category, initialPage, false);

//   // Приклад: Рендер даних про вправи
//   // await onPageChange(null, initialPage, true); // Розкоментуйте, щоб рендерити вправи
// };
