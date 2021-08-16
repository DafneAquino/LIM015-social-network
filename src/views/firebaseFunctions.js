// ---- Comando de usuario actual autenticado
export const user = firebase.auth().currentUser;

/* ----------------------REGISTRO .-------------------------- */
// --- Para crear nuevo usuario con correo y contraseña
export function createUser(email, pass) {
  const auth = firebase.auth();
  return auth.createUserWithEmailAndPassword(email, pass);
}
// Envío de correo al buzon para verificar el email
export function sendEmail() {
  const auth = firebase.auth();
  return auth.currentUser.sendEmailVerification();
}

/* ---------------------  LOGIN  ------------------- */
// --- Para ingresar con correo y contraseña
export function signInEmail(email, pass) {
  const auth = firebase.auth();
  return auth.signInWithEmailAndPassword(email, pass);
}

// --- Para ingresar con Gmail
export function signInGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

/* ------------------ CLOUD FIRESTORE  --------------------- */
// Obtiene datos de la coleccion user
export function collectionUser() {
  const db = firebase.firestore();
  return db.collection('users').get();
}
