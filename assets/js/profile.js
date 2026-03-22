// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaQhCh3NMAZ9evrxGzx_ifbX_xJngifxU",
  authDomain: "classplay-login.firebaseapp.com",
  projectId: "classplay-login",
  storageBucket: "classplay-login.firebasestorage.app",
  messagingSenderId: "648989613074",
  appId: "1:648989613074:web:e7116398b6a0383fe48ccb",
  measurementId: "G-Q9QHMH0FX5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Show login form
function displayLogin() {
  const loginForm = document.getElementById("login");
  const registerForm = document.getElementById("register");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}

// Show register form
function displayRegister() {
  const loginForm = document.getElementById("login");
  const registerForm = document.getElementById("register");
  loginForm.style.display = "none";
  registerForm.style.display = "block";
}

// Show a toast message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 6000);
}

// Register a new user
async function registerUser() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const pseudoEmail = `${username}@yourapp.com`;

  const usernameRef = doc(db, "usernames", username);
  const docSnap = await getDoc(usernameRef);

  if (docSnap.exists()) {
    showToast("stop trying to steal someone's username >:(");
    return;
  }

  createUserWithEmailAndPassword(auth, pseudoEmail, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Save username to Firestore
      await setDoc(usernameRef, { uid: user.uid });
      await setDoc(doc(db, "users", user.uid), { username: username, createdAt: serverTimestamp() });

      showToast("successful login :D");
      showLogout();
    })
    .catch((error) => {
      showToast("not successful login :( " + error.message);
    });
}

// Login user
function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const pseudoEmail = `${username}@yourapp.com`;

  signInWithEmailAndPassword(auth, pseudoEmail, password)
    .then((userCredential) => {
      showToast("Login successful!");
      showLogout();
    })
    .catch((error) => {
      showToast("not successful login :( " + error.message);
    });
}

// Logout user
function logoutUser() {
  signOut(auth)
    .then(() => {
      showToast("logged out :)");
      displayLogin();
    })
    .catch((error) => {
      showToast("not successful logout :( " + error.message);
    });
}

// Show logout view
function showLogout() {
  document.getElementById("register").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "block";
}

// Track authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    showLogout();
  } else {
    displayLogin();
  }
});
