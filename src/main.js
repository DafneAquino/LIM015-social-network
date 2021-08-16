// Este es el punto de entrada de tu aplicacion
import { changeView } from './lib/index.js';

const init = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;
      console.log('ID del usuario activo: ', uid);
      changeView(window.location.hash);
    } else {
      // User is signed out
      // ...
    }
  });
  window.addEventListener('hashchange', () => changeView(window.location.hash));
};
window.addEventListener('load', init);
