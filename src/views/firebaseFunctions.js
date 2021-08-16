
export function createUser(email, pass) {
  const auth = firebase.auth();
  return auth.createUserWithEmailAndPassword(email, pass);
}
export function sendEmail() {
  const auth = firebase.auth();
  return auth.currentUser.sendEmailVerification();
}

export function signInEmail(email, pass) {
  const auth = firebase.auth();
  return auth.signInWithEmailAndPassword(email, pass);
}

export function signInGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}
