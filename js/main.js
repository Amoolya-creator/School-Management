import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
    getDatabase, ref, set, onValue

} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

const auth = getAuth(app);

var ME, Manpower, user

function statechanged() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            console.log("success" + uid);
            // ...
        } else {
            // User is signed out
            // ...
        }
    });
}

function signup(email, password, Manpower_name, Data) {
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var reff = ref(db, '/' + school_name + school_city + '/Manpower/' + Manpower_name);

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            user = userCredential.user;
            alert("Account created : " + JSON.stringify(user));

            Data["uid"] = user.uid;
            set(reff, Data).then(alert(Manpower_name + " data saved"))


        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`************ error:${errorCode}:${errorMessage}`);
            alert(errorMessage);

        });
};

function signin(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            console.log(userCredential);
            user = userCredential.user;
            alert(user)
            var Path = '/' + school_name + school_city + '/Manpower'
            onValue(ref(db, Path), (snap) => {
                if (snap.exists()) {
                    Manpower = snap.val()
                    for (var key in Manpower) {
                        ME = key;
                        if (user.uid == Manpower[ME].uid) break
                    }
                    window.localStorage.setItem("ME", ME)
                    if (ME.substr(0, 8) == "Section-") window.location.replace('./sic_dashboard.html');
                    if (ME.substr(0, 8) == "Teacher-") window.location.replace('./teacher_dashboard.html');
                    if (ME.substr(0, 8) == "Supervi-") window.location.replace('./dashboard.html');
                    window.location.replace('./staff_dashboard.html')
                    // ...
                }
            }, {
                onlyOnce: true
            })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("************ error:" + errorMessage);
            // ..
        });
}


// Get a reference to the database service
const db = getDatabase(app);

//hashCode function
function hashCode(s) {
    return s.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0)
}

export {
    statechanged,
    signup,
    signin,
    hashCode,
    ME,
    db,
    Manpower,user
}