import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export const showIziToast = (message, title, color, time) => {
  iziToast.show({
    message,
    drag: true,
    close: false,
    timeout: time ?? 5000,
    position: 'bottomRight',
    messageColor: '#2a2a2a',
    closeOnClick: true,
    animateInside: true,
    backgroundColor: color ?? '#f4f4f4',
    title: title ?? '',
  });
};
