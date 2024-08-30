import { showIziToast } from './iziToast';

import { fetchApi } from './api-service';

const form = document.getElementById('subscribe-form');

form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const email = e.target.elements.email.value;

  try {
    await fetchApi.addSubscription({ email });
    showIziToast("Congrats! You've been subscribed!", '#53e276');
  } catch (err) {
    showIziToast('Subscription already exists', '#FF876C');
  } finally {
    e.target.reset();
  }
}
