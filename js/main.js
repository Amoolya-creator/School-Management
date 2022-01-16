import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updatePassword
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    onValue,
    update
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

function signup(email, password, Manpower_name, Data) {
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var reff = ref(db, '/' + school_name + school_city + '/Manpower/' + Manpower_name);

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            user = userCredential.user;            
            Data["uid"] = user.uid;
            set(reff, Data).then(alert("Account created : " + Manpower_name))


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

            user = userCredential.user;
           
            var Path = '/' + school_name + school_city + '/Manpower'
            onValue(ref(db, Path), (snap) => {
                if (snap.exists()) {
                    Manpower = snap.val()
                    for (var key in Manpower) {
                        ME = key;
                        if (user.uid == Manpower[ME].uid) break
                    }
                    window.localStorage.setItem("ME", ME)
                    Redirect()
                }
            }, {
                onlyOnce: true
            })
        })
        .catch((error) => {

            const errorMessage = error.message;
            alert("Error: " + errorMessage);

        });
}

//Redirection to appropriate dashboard
function Redirect() {
    var webpage = ""
    if (ME.slice(0, 8) == "Section-") webpage = './sic_dashboard.html';
    else if ((ME.slice(0, 10) == "Supervisor") || (ME == "Vice Principal") || (ME == "Principal")) webpage = './dashboard.html';
    else {
        alert("You are not authorized to access this page.")
        webpage = './index.html'
    }
    window.location = webpage;
    // ...
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

function changePassword(newPassword,ME) {
    const auth = getAuth();
    const user = auth.currentUser;
    updatePassword(user, newPassword).then(() => {
        // Update successful.
        var school_name = window.localStorage.getItem("school_name")
        var school_city = window.localStorage.getItem("school_city")
        update(ref(db,'/'+school_name+school_city+'/Manpower/'+ME),{"Password": newPassword}).then(
        alert("Password Updated Successfully"))
    }).catch((error) => {
        alert("Error with Password Updation." + error.message)
    });
}

export {
    signup,
    signin,
    hashCode,
    ME,
    db,
    Manpower,
    user,
    changePassword
}