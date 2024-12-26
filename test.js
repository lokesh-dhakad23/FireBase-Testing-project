import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, 
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword, 
        onAuthStateChanged, 
        signOut } 
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
const auth = getAuth(app)


const textarea = document.getElementById("textarea");
const saveBtn = document.getElementById("save-btn");
const showData = document.getElementById("showInfo");
// const getDataBtn = document.getElementById("get-btn");



saveBtn.addEventListener("click", () => {
    let text = textarea.value
    if (text) {
        addToDB(text)
    }
    text = ""
    fetchInRealtime()
});


// getDataBtn.addEventListener("click",  async () => {
//   const querySnapshot = await getDocs(collection(db, "data"));

//   showInfo.innerHTML = ""
  
//   querySnapshot.forEach((doc) => {
//       console.log(`${doc.id} => ${doc.data().body}`)
//       showDataFunc(showData,doc.data())
//   });
// })

function fetchInRealtime() {
  onSnapshot(collection(db, "data"), (querySnapshot) => {
      showData.innerHTML = ""
      
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().body}`)
        showDataFunc(showData,doc.data())
      })
  })
}

function showDataFunc(showInfo,datatext) {
  showInfo.innerHTML += `<h1 id="showdata">${datatext.body}</h1>`
}
async function addToDB(text) {
    try {
        const docRef = await addDoc(collection(db, "data"), {
          body: text,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}
