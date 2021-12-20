import {
    db
} from './main.js';
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

var Sname, Scity

document.getElementById('sanitise_data').addEventListener('click', () => {
    Sname = $("#school_name").val().toUpperCase()
    Scity = $("#school_city").val().toUpperCase()

    if (Sname == "" || Scity == "") {
        alert("Please Enter Details Correctly")
    } else {
        //Setting localStorage 
        window.localStorage.setItem("school_name", Sname)
        window.localStorage.setItem("school_city", Scity)


        //check_for_school_details
        onValue(ref(db, '/' + Sname + Scity), (snap) => {
            (snap.exists()) ? window.location.assign("index.html"): window.location.assign("./admin.html")
        }, {
            onlyOnce: true
        });
    }
})