/* ------------------- FIREBASE PARA SOCIAL HEALTH --------------- */

// Configuración de firebase para Social Health
/* const firebaseConfig = {
  apiKey: 'AIzaSyB8IDdhrhSpd9hXvAWU79ITlAxmaJcNurA',
  authDomain: 'proyect-social-network.firebaseapp.com',
  projectId: 'proyect-social-network',
  storageBucket: 'proyect-social-network.appspot.com',
  messagingSenderId: '149252870254',
  appId: '1:149252870254:web:dbafa1821ad07d8952d67f',
  measurementId: 'G-KCW1JG85PX',
};

// Initialización de Firebase en la webapp
firebase.initializeApp(firebaseConfig);
// Comandos de firebase: autenticación, firestore y analytics
firebase.auth();
firebase.firestore();
firebase.analytics(); */

/* --------- COMANDOS PARA AUTENTICACIÓN DE FIREBASE --------  */

/* ----REGISTRO O SIGN UP ----- */
// Crear nuevo usuario
export function createUser(email, pass) {
  const auth = firebase.auth();
  return auth.createUserWithEmailAndPassword(email, pass);
}

// -------------------- LOGIN O INGRESAR -----------------------
// Iniciar sesión con correo
export function ingresarConEmail(email, pass) {
  const auth = firebase.auth();
  return auth.signInWithEmailAndPassword(email, pass);
}
// Iniciar sesión con Google
export function ingresarConGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

// Enviar correo de verificacion
export function sendEmail() {
  const auth = firebase.auth();
  return auth.currentUser.sendEmailVerification();
}

/* ---------------- COMANDOS PARA CLOUD FIRESTORE -----------------  */

// Agregando a la coleccion "users" data que el usuario ingrese al momento de registrarse con GMail
export function addDataUser(usuario) {
  const db = firebase.firestore();
  let nameRegister;
  let photoRegister;
  if (usuario.displayName !== null && usuario.photoURL !== null) {
    nameRegister = usuario.displayName;
    photoRegister = usuario.photoURL;
  } /* else {
    nameRegister = 'User';
    photoRegister = 'img/userPhoto-default.png';
  } */
  return db.collection('users').add({
    NameRegister: nameRegister,
    EmailRegister: usuario.email,
    IdUserActive: usuario.uid,
    PhotoRegister: photoRegister,
  });
}

// Agregando a la coleccion "users" data que el usuario ingrese al momento de registrarse con correo
export function addDataUserCorreo(name, email, user) {
  const db = firebase.firestore();
  return db.collection('users').add({
    NameRegister: name,
    EmailRegister: email,
    IdUserActive: user.uid,
    PhotoRegister: 'img/userPhoto-default.png',
  });
}

// Obteniendo la data de la colleccion "users"
export function getDataUser() {
  const db = firebase.firestore();
  return db.collection('users').get();
}

// Agregando a la coleccion "postss" data que el usuario publico
export function addPosts(name, postText, userPost, idUser) {
  const db = firebase.firestore();
  return db.collection('posts').add({
    userIdent: idUser,
    userPhotoPost: !userPost.displayName ? 'img/userPhoto-default.png' : userPost.photoURL,
    userWhoPublishes: name,
    publishedText: postText.value,
    publicationDate: new Date().toLocaleString('en-ES'),
    likesPost: [],
  });
}

// Obteniendo la data de la colleccion "posts"
export function getPost(id) {
  const db = firebase.firestore();
  return db.collection('posts').doc(id).get();
}

// Obteniendo la data de la colleccion "posts" en tiempo real
export function onSnapshotPosts() {
  const db = firebase.firestore();
  return db.collection('posts').orderBy('publicationDate', 'desc');
}

// Editando documentos de la coleccion posts
export function updatePosts(docId, newText) {
  const db = firebase.firestore();
  return db.collection('posts').doc(docId).update({
    publishedText: newText,
    publicationDate: new Date().toLocaleString('en-ES'),
  });
}

// Eliminando documentos de la coleccion posts
export function deletePosts(docId) {
  const db = firebase.firestore();
  return db.collection('posts').doc(docId).delete();
}

// Agregando datos al doc (data likesPost)
export function upLikes(docId, userLike) {
  const db = firebase.firestore();
  return db.collection('posts').doc(docId).update({
    likesPost: firebase.firestore.FieldValue.arrayUnion(userLike),
  });
}

// Quitando datos al doc (data likesPost)
export function downLikes(docId, userLike) {
  const db = firebase.firestore();
  return db.collection('posts').doc(docId).update({
    likesPost: firebase.firestore.FieldValue.arrayRemove(userLike),
  });
}

// Restringiendo el acceso a borrar posts
export function queryIdentity(idUsuario) {
  const db = firebase.firestore();
  return db.collection('posts').where('userIdent', '==', idUsuario).get();
}
