import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAU1AjN3L_2znAZ3JBWrTwDHbdXpgnrzM",
  authDomain: "login-147ca.firebaseapp.com",
  projectId: "login-147ca",
  storageBucket: "login-147ca.appspot.com",
  messagingSenderId: "590154014328",
  appId: "1:590154014328:web:4b5f00dba3cc314b7d578d",
  measurementId: "G-9EMQHZY0GV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics, setPersistence, browserLocalPersistence, browserSessionPersistence };
