export default () => {
  document.querySelector('nav').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
  const divElement = document.createElement('div');
  divElement.setAttribute('id', 'containerInicio');
  divElement.innerHTML = `
    <div id="barraMenu">
      <img src="img/logo-blanco.png" alt="Logo Social Health Blanco">
      <h3>Health Social</h3>
      <img id="btnSalir" src="img/cerrar-sesion.png" alt="Botón cerrar sesión">
    </div>
    <div id="infoUsuario">
      <figure>
        <img id="userPhoto" src="img/foto-ejemplo.jpg" alt="Foto del usuario">
      </figure>
      <div>
        <h4 id="userName">Name User</h4>
        <p id="userDescription">Description User</p>
      </div>
    </div>
    <div id="escribirPost">
      <textarea id="textToPost" placeholder="¿Qué quieres compartir?"></textarea>
      <div>
        <img id="uploadImageButton" src="img/agregar-img.png" alt="Botón para cargar imagen">
        <input id="imageToPost" type="file" accept="image/jpeg" style="display:none">
        <button type="submit" id="shareButton">Compartir</button>
      </div>
    </div>
    <div id="sectionPosts">
      <table>
        <tr>
          <th id="userPost">Publicado por Mariana López</th>
        </tr>
        <tr>
          <td id="textPost">The user-select property specifies whether the text of an element can be selected.
              In web browsers, if you double-click on some text it will be selected/highlighted. 
              This property can be used to prevent this
          </td>
        </tr>
        <tr>
          <td id="picturePost" style="display: none;"></td>
        </tr>
        <tr>
          <td>
            <img id="logoLike" src="img/megusta.png" alt="Botón me gusta">
            <img id="logoComent" src="img/comentario.png" alt="Botón comentar">
          </td>
        </tr>
      </table>
    </div>`;

  // Obtener el perfil de un usuario (CON DATOS DE GOOGLE)
  const user = firebase.auth().currentUser;
  const userPhoto = divElement.querySelector('#userPhoto');
  const userName = divElement.querySelector('#userName');
  const userDescription = divElement.querySelector('#userDescription');
  if (user !== null) {
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    userPhoto.src = `${photoURL}`;
    userName.textContent = `${displayName}`;
    userDescription.textContent = `${email}`;
    // No hay datos de usuario (Ingreso con correo)
    if (displayName === null) {
      userPhoto.src = 'img/profile-default.png';
      userDescription.textContent = 'Descripción';
    }
  }

  // Obtener los datos de un usuario (CON DATOS DE REGISTRO CORREO)
  firebase.firestore().collection('users').get()
    .then((querySnapshot) => { // TODO: Mostrar 'User' en ingreso con correo al publicar
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => name de registro: ${doc.data().nameRegister} ID: ${doc.data().idUserActive}`);
        console.log(`Id del usuario: ${user.uid}`);
        if (user.uid === `${doc.data().idUserActive}`) { // quitar backdigs ``
          userName.textContent = doc.data().nameRegister;
          userDescription.textContent = doc.data().emailRegister;
        } else {
          console.log('Ese dato no existe en este documento');
        }
      });
    });

  // Abre input file al seleccionar el botón Subir Imagen
  const uploadImageButton = divElement.querySelector('#uploadImageButton');
  const imageToPost = divElement.querySelector('#imageToPost');
  const picturePost = divElement.querySelector('#picturePost');
  uploadImageButton.addEventListener('click', () => {
    imageToPost.click();
    imageToPost.addEventListener('change', (e) => {
      const targetFile = e.target.files[0];
      console.log(targetFile);
      // Create a storage reference from our storage service
      const storageRef = firebase.storage().ref(`post_image/${targetFile.name}`);
      storageRef.put(targetFile)
        .then((snapshot) => {
          console.log('Se subió un blob o un file!', snapshot);
          picturePost.textContent = `${targetFile.name}`;
          picturePost.style.display = 'block';
        });
    });
  });

  // Función para publicar post
  const shareButton = divElement.querySelector('#shareButton');
  shareButton.addEventListener('click', () => {
    const textToPost = divElement.querySelector('#textToPost');
    const userPost = divElement.querySelector('#userPost');
    const textPost = divElement.querySelector('#textPost');
    if (textToPost.value !== '') {
      firebase.firestore().collection('posts').add({
        userWhoPublishes: `Publicado por ${user.displayName}`,
        publishedText: textToPost.value,
      })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
          // Obtener los datos de la colección
          firebase.firestore().collection('posts').get(docRef.id)
            .then((querySnapshot) => { // TODO: Mostrar 'User' en ingreso con correo al publicar
              querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
                if (doc.id === `${docRef.id}`) {
                  userPost.textContent = doc.data().userWhoPublishes;
                  textPost.textContent = doc.data().publishedText;
                } else if (user.displayName === null) {
                  // Obtiene el nombre de registro del usuario en sesión
                  firebase.firestore().collection('users').get()
                    .then((querySnapshotUno) => {
                      querySnapshotUno.forEach((document) => {
                        if (user.uid === `${document.data().idUserActive}`) {
                          userPost.textContent = `Publicado por ${document.data().nameRegister}`;
                        } else {
                          console.log('No hay aquí, pasa al sgte documento');
                        }
                      });
                    });
                } else {
                  console.log('No existe referencia al documento');
                }
              });
            });
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }
    textToPost.value = '';
  });

  // Funcion para cerrar sesión
  const btnSalir = divElement.querySelector('#btnSalir');
  btnSalir.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => {
        // Sign-out successful.
        window.location.hash = '#/';
        console.log('Se ha cerrado sesión');
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  });

  return divElement;
};
