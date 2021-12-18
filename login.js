import {
    db,hashCode
} from "./main.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")

var WhoAmI = ""
$("#password").on('change', ()=> {
    var entered_name = $("#user").val()
    var entered_password = $("#password").val()

    //Get snapshot of manpower
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var Path = '/' + school_name + school_city + '/Manpower'

    onValue(ref(db, Path), (snap) => {
        if (snap.exists()) {
            var Manpower = snap.val();
            for (var Individual in Manpower) {
                var data = Manpower[Individual];
                if ((entered_name == data.Name || entered_name == data.UserID || entered_name == data.Email) &&
                    (entered_password == data.Password))
                    WhoAmI = Individual;
            };
        }
    }, {
        onlyOnce: true
    })
})

$("#login").on('click', ()=>{
    if (WhoAmI == "") {
        alert("No such User Registered")
        $("#user").val("")
        $("#password").val("")
    } else {
        window.localStorage.setItem("WhoAmI", hashCode(WhoAmI))
        window.location = "./dashboard.html"
    }
})