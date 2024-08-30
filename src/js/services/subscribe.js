import { showIziToast } from './iziToast';

import { fetchApi } from './api-service';

const formEl = document.querySelector('.subscribe-form');

formEl.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const email = e.target.elements.email.value;

  try {
    await fetchApi.addSubscription({ email });
    showIziToast('You have subscribed 🥳', '#f4f4f4', 'Congratulations!');
  } catch (err) {
    showIziToast('Subscription already exists 😊', '#c6cdd1');
  } finally {
    e.target.reset();
    localStorage.removeItem('subscribe-form-email');
  }
}

const formData = { email: '' };

const isEmpty = form => {
  const formFromLS = JSON.parse(localStorage.getItem('subscribe-form-email'));
  if (formFromLS !== null) {
    for (const key in formFromLS) {
      if (formFromLS.hasOwnProperty(key)) {
        form.elements[key].value = formFromLS[key];
        formData[key] = formFromLS[key];
      }
    }
  }
};

isEmpty(formEl);

formEl.addEventListener('input', event => {
  const nameField = event.target.name;
  const valueField = event.target.value.trim();

  formData[nameField] = valueField;

  localStorage.setItem('subscribe-form-email', JSON.stringify(formData));
});
