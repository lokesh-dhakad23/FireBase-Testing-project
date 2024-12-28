import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, 
        addDoc, 
        collection, 
        getDocs, 
        onSnapshot, 
        query, 
        where } 
        from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, 
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword, 
        onAuthStateChanged, 
        signOut,
        GoogleAuthProvider,
        signInWithPopup } 
        from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBMlC0qEs3laPw8nj1ruMixTsiO9HKBWPk",
    authDomain: "test-project-88989.firebaseapp.com",
    projectId: "test-project-88989",
    storageBucket: "test-project-88989.firebasestorage.app",
    messagingSenderId: "223720262076",
    appId: "1:223720262076:web:5a612427c8d7248180c3b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const textarea = document.getElementById("textarea");
const saveBtn = document.getElementById("save-btn");
const showData = document.getElementById("showInfo");
const deleteBtn = document.getElementById("clear-btn");
const profilePhoto = document.getElementById("profile-pic");

// FOR AUTHENTICATION //
const authForm = document.getElementById("auth-container");
const mainPage = document.getElementById("main-container");
const loginBtn = document.getElementById("login-btn");
const signUpBtn = document.getElementById("signup-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formLoginBtn = document.getElementById("form-login-btn");
const closeBtn = document.getElementById("close-btn");
const logOutBtn = document.getElementById("log-out-btn");
const signInWithGoogleBtn = document.getElementById("signup-google");
const authMessage = document.getElementById("auth-message");

// loginBtn.addEventListener("click", () => {
//   authForm.style.display = "flex";
//   mainPage.style.display = "none";
// })

// closeBtn.addEventListener("click", () => {
//   authForm.style.display = "none";
//   mainPage.style.display = "block";
// })

signInWithGoogleBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log(user)
    console.log("success sign-in with google")
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error(errorMessage)
  });
});

signUpBtn.addEventListener("click", () => {
  
  const email = emailInput.value
  const password = passwordInput.value
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });
});

formLoginBtn.addEventListener("click", () => {
  const email = emailInput.value
  const password = passwordInput.value
    signInWithEmailAndPassword(auth, email, password) 
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("success sign-in");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage)
    })
});

logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      authForm.style.display = "flex";
      mainPage.style.display = "none";
      emailInput.value = ""
      passwordInput.value = ""
      console.log("sign-out successful")

    })
    .catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage)
    });
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userProfile(user)
    console.log("success change")
    hideEl(authForm)
    showEl(mainPage)
      fetchInRealtime(user);

  } else {
      // User is signed out
      authForm.style.display = 'flex';
      mainPage.style.display = 'none';
      authMessage.textContent = 'Please sign in or create an account';
      console.log("No user is signed in.")
      fetchInRealtime(user)
      userProfile(user)
  }
});


saveBtn.addEventListener("click", () => {
    let text = textarea.value
    if (text) {
        addToDB(text)
    }
    text = ""
});


function fetchInRealtime(user) {
  const postsRef = collection(db, "data");
  const q = query(postsRef, where("uid", "==", user.uid))
  onSnapshot(q, (querySnapshot) => {
      showData.innerHTML = ""
      
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().body}`)
        showDataFunc(showData,doc.data())
      });
  });
};

function showDataFunc(showInfo,datatext) {
  showInfo.innerHTML += `<h1 id="showdata">${datatext.body}</h1>`
}
async function addToDB(text) {
    try {
        const docRef = await addDoc(collection(db, "data"), {
          body: text,
          uid: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

deleteBtn.addEventListener("click", () => userProfile(auth.currentUser));

function userProfile(user) {
  const { displayName, photoURL } = user;
    if (displayName || photoURL) {
      profilePhoto.src = photoURL;
      const userFirstName = displayName.split(" ")[0];
      authMessage.textContent = `Hello, ${userFirstName} how are you today?`;
  } else {
      authMessage.textContent = `Hey friend, how are you?`
  }
}

function hideEl(e) {
  e.style.display = "none";
}

function showEl(e) {
  e.style.display = "block";
}