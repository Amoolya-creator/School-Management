import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
    getDatabase,ref,onValue,get
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

(function populate() {
    
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var Path ='/' + school_name + school_city+'/Manpower'
    onValue(ref(db,Path), (snap) => {
        var tt = ""
        if (snap.exists()) {
            var Manpower = snap.val()            
            for (var Individual in Manpower){
                var data =Manpower[Individual];               
                tt +=  '<label class="col form-label">'+data.Post+'</label>\
                <label class="col form-label">'+data.Name+'</label>\                 <label class="col form-label">'+data.UserID+'</label>\
                <label class="col form-label">'+data.Password+'</label>\
                <label class="col form-label">'+data.Email+'</label>\
                <label class="col form-label">'+data.Supervises+'</label>'
            };
            var new_div = document.createElement('div')
            new_div.classList.add("row","form-group")
            new_div.innerHTML = tt
            $("#tab").append(new_div)
        }
    })
})();