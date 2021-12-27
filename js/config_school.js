import {
    db
} from './main.js';
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
            (snap.exists()) ? school_exists(): school_not_present();
        }, {
            onlyOnce: true
        });
    }
})

function school_exists(){
    alert ("Your school data is identified. Please proceed to login screen.")
    window.location.assign("index.html")
}

function school_not_present(){
    alert("Your school data is NOT present in the System. Making you the ADMIN so that you can setup your school's basic information.")
    window.location.assign("./admin.html")
}