import { showIziToast } from './services/iziToast.js';

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem('favorites')) || [];
};

export function addToFavorites(exercise) {
  if (!exercise._id) {
    showIziToast('Exercise ID is missing.', 'Error ❌');
    return;
  }

  const favorites = getFavorites();

  if (favorites.find((item) => item._id === exercise._id)) {
    showIziToast('This exercise is already in your favorites.', 'Error ❌');
  } else {
    favorites.push(exercise);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showIziToast('Exercise added to favorites!', 'Success ✅');
  }
}

export function removeFromFavorites(exerciseId, callback) {
  if (!exerciseId) {
    showIziToast('Exercise ID is missing.', 'Error ❌');
    return;
  }

  const favorites = getFavorites();

  if (!favorites.find((item) => item._id === exerciseId)) {
    showIziToast('This exercise is not in your favorites.', 'Error ❌');
  } else {
    const filteredFavorites = favorites.filter((item) => item._id !== exerciseId);
    localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
    showIziToast('Exercise removed from favorites!', 'Success ✅');

    if (callback) {
      callback();
    }
  }
}