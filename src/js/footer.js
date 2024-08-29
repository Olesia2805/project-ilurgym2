import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formData = { email: '' };
const formEl = document.querySelector('.subscribe-form');

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

formEl.addEventListener('submit', event => {
  event.preventDefault();
  if (formData['email']) {
    iziToast.success({
      color: '#f4f4f4',
      title: 'Congratulations!',
      message: 'You have subscribed ✅',
      position: 'bottomRight',
      timeout: 5000,
    });
    localStorage.removeItem('subscribe-form-email');
    event.target.reset();
    formData.email = '';
  }
});
