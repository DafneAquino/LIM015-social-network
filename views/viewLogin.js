import {
  ingresarConEmail,
  ingresarConGoogle,
  addDataUser,
} from './firebaseFunctions.js';

export default () => {
  document.querySelector('nav').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
  const divElement = document.createElement('div');
  divElement.setAttribute('class', 'containerLogin');
  divElement.innerHTML = `
    <section class="containerLoginPage">
      <div id="logoPrincipal" class="containerMainLogo">
        <figure><img src="img/logo-azul.png"></figure>
        <h2 class="logoFooter">Social Health</h2>
      </div>
      <div id="dataLogIn" class="firstSubcontainerLogin"> 
        <p class="welcomePhrase">¡Bienvenid@ a Social Health!</p>
        <form id="signIn" class="loginForm" method='POST'>
          <input type="email" id="emailLogIn" class="inputLogin" placeholder="Email" minlength="5" required>
          <p id="errorEmailLogIn" class="errorLogin">Cuenta no encontrada o incorrecta</p>
          <input type="password" id="contraseñaLogIn" class="inputLogin" placeholder="Contraseña" minlength="5" required>
          <p id="errorPassLogIn" class="errorLogin">Contraseña de logueo incorrecta</p>
          <button id="btnEntrar" class="loginButton">Ingresar</button>
        </form>
      </div>
      <div id="subcontainerLogIn" class="secondSubcontainerLogIn">
        <p class="enterWith">O bien ingresa con:</p>
        <div id="logosRegister" class="registerWith">
          <img id="fb" class="logoSN" src="img/Facebook.png">
          <img id="google" class="logoSN" src="img/Google.png">
        </div>
        <p class="enterWith">¿No tienes una cuenta?<a id="btnRegistrar" class="registerButton" href="#/registro"> Regístrate</a></p>
      </div>
    </div>`;

  const btnIngresar = divElement.querySelector('#btnEntrar');
  btnIngresar.addEventListener('click', (e) => {
    e.preventDefault();
    const email = divElement.querySelector('#emailLogIn').value;
    const pass = divElement.querySelector('#contraseñaLogIn').value;
    const errorEmailLogIn = divElement.querySelector('#errorEmailLogIn');
    const errorPassLogIn = divElement.querySelector('#errorPassLogIn');

    // Verificación de inputs vacíos
    if (email === '') {
      errorEmailLogIn.textContent = 'Este campo es obligatorio';
      errorEmailLogIn.style.visibility = 'visible';
    } else {
      errorEmailLogIn.style.visibility = 'hidden';
    }
    if (pass === '') {
      errorPassLogIn.textContent = 'Este campo es obligatorio';
      errorPassLogIn.style.visibility = 'visible';
    } else {
      errorPassLogIn.style.visibility = 'hidden';
    }

    // Ingresar con email y contraseña
    ingresarConEmail(email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log('user:', user, 'user.emailVerified:', user.emailVerified);
        if (user.emailVerified === false) {
          window.location.hash = '#/';
          errorEmailLogIn.textContent = 'Esta cuenta aún no está verificada';
          errorEmailLogIn.style.visibility = 'visible';
        } else {
          window.location.hash = '#/inicio';
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        // console.log(errorCode, error.message);
        // Verificación de errores de campo
        if (errorCode === 'auth/user-not-found') {
          errorEmailLogIn.textContent = 'Cuenta no encontrada';
          errorEmailLogIn.style.visibility = 'visible';
        } else if (email !== '' && errorCode === 'auth/invalid-email') {
          errorEmailLogIn.textContent = 'Formato incorrecto';
          errorEmailLogIn.style.visibility = 'visible';
        } else if (email !== '') {
          errorEmailLogIn.style.visibility = 'hidden';
        }
        if (pass !== '' && errorCode === 'auth/wrong-password') {
          errorPassLogIn.textContent = 'Contraseña de logueo incorrecta';
          errorPassLogIn.style.visibility = 'visible';
        } else if (pass !== '') {
          errorPassLogIn.style.visibility = 'hidden';
        }
      });
  });
  const btnGoogle = divElement.querySelector('#google');
  btnGoogle.addEventListener('click', () => {
    ingresarConGoogle()
      .then((result) => {
        // const credential = result.credential;
        // const token = credential.accessToken;
        // const user = result.user;
        // console.log('El token del usuario es:', token, 'Credencial: ', credential);
        console.log('El ID del usuario es:', result.user.uid);
        addDataUser(result.user) // TODO: Review existing collections
          .then((docRef) => {
            console.log('ID de Documento de la Colección Users: ', docRef.id);
          })
          .catch((error) => {
            console.error('Error al añadir el documento: ', error);
          });
        window.location.hash = '#/inicio';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error!=> ', errorCode, errorMessage);
      });
  });
  return divElement;
};
