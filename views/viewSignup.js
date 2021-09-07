import {
  createUser,
  sendEmail,
  addDataUserCorreo,
} from './firebaseFunctions.js';

export default () => {
  const divElement = document.createElement('div');
  divElement.innerHTML = `
    <section id="modal" class="containerRegister">
      <a class="closeModal"href="#/">x</a>
      <h2 class="headerModal">Registro de Usuario </h2>
      <form id="container-modal" class="registrationForm">
        <input type="text" id="usuario" class="inputRegister" placeholder="Nombre de usuario" autocomplete="off">
        <p id="errorNameSignUp" class="errorRegister">Por favor ingrese su nombre</p>
        <input type="email" id="e-mail" class="inputRegister" placeholder="Email" autocomplete="off">
        <p id="errorEmailSignUp" class="errorRegister">Ingrese un correo electrónico</p>
        <input type="password" id="contraseña" class="inputRegister" placeholder="Contraseña" autocomplete="off">
        <p id="errorPassSignUp" class="errorRegister">Debe contener más de 6 caracteres</p>
        <input type="password" id="confirmarContraseña" class="inputRegister" placeholder="Confirmar contraseña" autocomplete="off">
        <p id="errorPassConfSignUp" class="errorRegister">Las contraseñas no coinciden</p>
        <button type="submit" id="btnEnviar" class="buttonSendData">Enviar</button>
      </form>
    </section> `;

  const containerModal = divElement.querySelector('#container-modal');

  // Función que se va a ejecutar cuando se envíe el formulario
  containerModal.addEventListener('submit', (e) => {
    e.preventDefault();
    // Constantes para llamar a valores del dom
    const name = divElement.querySelector('#usuario').value;
    const email = divElement.querySelector('#e-mail').value;
    const password = divElement.querySelector('#contraseña').value;
    const passconfirm = divElement.querySelector('#confirmarContraseña').value;
    // Constantes para activar o desactivar los string de errores
    const errorNameSignUp = divElement.querySelector('#errorNameSignUp');
    const errorEmailSignUp = divElement.querySelector('#errorEmailSignUp');
    const errorPassSignUp = divElement.querySelector('#errorPassSignUp');
    const errorPassConfSignUp = divElement.querySelector('#errorPassConfSignUp');
    // Verificación de inputs vacíos
    if (name === '') {
      errorNameSignUp.style.visibility = 'visible';
    } else {
      errorNameSignUp.style.visibility = 'hidden';
    }
    if (email === '') {
      errorEmailSignUp.style.visibility = 'visible';
    } else {
      errorEmailSignUp.style.visibility = 'hidden';
    }
    if (password === '') {
      errorPassSignUp.style.visibility = 'visible';
    } else {
      errorPassSignUp.style.visibility = 'hidden';
    }
    if (passconfirm === '') {
      errorPassConfSignUp.style.visibility = 'visible';
    } else {
      errorPassConfSignUp.style.visibility = 'hidden';
    }
    // Verificación de contraseñas iguales
    if (passconfirm !== password) {
      errorPassSignUp.textContent = 'Las contraseñas no coinciden';
      errorPassConfSignUp.textContent = 'Las contraseñas no coinciden';
      errorPassSignUp.style.visibility = 'visible';
      errorPassConfSignUp.style.visibility = 'visible';
    } else if (name !== '' && password !== '' && passconfirm !== '' && passconfirm === password) {
      errorPassSignUp.style.visibility = 'hidden';
      errorPassConfSignUp.style.visibility = 'hidden';
      createUser(email, password)
        .then((userCredential) => {
          containerModal.reset();
          console.log('Registro exitoso:', firebase.auth().currentUser.uid, userCredential.user.uid, name, email, password);
          // -----* Agregar documento de datos del usuario a la coleccion "USERS"
          addDataUserCorreo(name, email, userCredential.user)
            .then((docRef) => {
              console.log('ID de Documento de la Colección Users: ', docRef.id);
            })
            .catch((error) => {
              console.error('Error al añadir el documento: ', error);
            });
          // ----- * Enviar mensaje de verificación firebase
          sendEmail()
            .then(() => {
              // eslint-disable-next-line no-alert
              alert('Se ha enviado un correo de verificación');
              window.location.hash = '#/';
            }).catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // Verificación de campos de registro
          if (errorCode === 'auth/invalid-email') {
            errorEmailSignUp.style.visibility = 'visible';
          } else if (errorCode === 'auth/email-already-in-use') {
            errorEmailSignUp.textContent = 'El correo ya ha sido registrado';
            errorEmailSignUp.style.visibility = 'visible';
          } else if (errorCode === 'auth/weak-password') {
            errorPassSignUp.style.visibility = 'visible';
          } else if (errorCode === '') {
            errorEmailSignUp.style.visibility = 'hidden';
          }
        });
    }
  });
  return divElement;
};
