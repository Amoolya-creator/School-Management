import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCX8EtfVmHcwBhVVrRwLxPh0t4C7tEUpjc",
    authDomain: "school-management-88cad.firebaseapp.com",
    databaseURL: "https://school-management-88cad-default-rtdb.firebaseio.com",
    projectId: "school-management-88cad",
    storageBucket: "school-management-88cad.appspot.com",
    messagingSenderId: "283715787240",
    appId: "1:283715787240:web:9b6e33eedd70c64f302c5d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase(app);

//hashCode function
function hashCode (s){return s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0)}

export {db,hashCode}