import { showIziToast } from './services/iziToast.js';

async function fetchQuote() {
  try {
    const response = await fetch('https://your-energy.b.goit.study/api/quote');
    const data = await response.json();
    return data;
  } catch (error) {
    showIziToast('Error fetching the quote:', 'Error ❌');
    return null;
  }
}

function saveQuoteToLocalStorage(quote) {
  const currentDate = new Date().toISOString().split('T')[0];
  localStorage.setItem(
    'dailyQuote',
    JSON.stringify({ quote, date: currentDate })
  );
}

function getSavedQuote() {
  const savedQuote = localStorage.getItem('dailyQuote');
  return savedQuote ? JSON.parse(savedQuote) : null;
}

async function getDailyQuote() {
  const savedQuote = getSavedQuote();
  const currentDate = new Date().toISOString().split('T')[0];

  if (savedQuote && savedQuote.date === currentDate) {
    return savedQuote.quote;
  } else {
    const newQuote = await fetchQuote();
    if (newQuote) {
      saveQuoteToLocalStorage(newQuote);
      return newQuote;
    } else {
      return savedQuote ? savedQuote.quote : null;
    }
  }
}

async function displayQuote() {
  const dailyQuote = await getDailyQuote();
  if (dailyQuote) {
    const quoteText = dailyQuote.quote;
    const quoteAuthor = dailyQuote.author;
    document.querySelector('.quote').textContent = quoteText;
    document.querySelector('.quote-author').textContent = quoteAuthor;
  }
}

displayQuote();
