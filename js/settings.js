import {
    db,
    hashCode
} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
$("#school").html(school_name + ", " + school_city)
var WhoAmI = window.localStorage.getItem("WhoAmI")
//window.localStorage.removeItem("WhoAmI");

var Manpower, ME, ME_Node, x;
var Path = '/' + school_name + school_city + '/Manpower'
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        Manpower = snap.val();
        x = Object.keys(Manpower).length
        getME()
    };
})

function getME() {
    for (var Individual in Manpower) {
        var data = Manpower[Individual];
        if (WhoAmI == hashCode(data.UserID)) {
            ME_Node = Individual;
            ME = data
        }
    }
}

setTimeout(() => {
    if (ME == "") {
        alert("Error: Wrong Credentials.Please login again")
        window.location = './login.html'
    } else {
        $("#Post").html(ME.Post)
        $("#Name").html(ME.Name)
        $("#UserID").html(ME.UserID)
        Manpower_under_me_fx()
        Display()
    }
}, 5000);

////////// Manpower under ME //////
var Manpower_under_me = []

function Manpower_under_me_fx() {
    Manpower_under_me = []
    for (var Individual in Manpower) {
        if (ME_Node == Individual) continue;

        if ((ME_Node == "Vice Principal") && (Individual == "Principal")) continue;
        // if ((ME.name == "Supervisor") && (Individual.substr(0, 5) != "Staff")) continue;
        // if ((ME.name == "Section") && (Individual.substr(0, 6) != "Teacher")) continue;

        Manpower_under_me.push(Individual);

    }
    Manpower_under_me.push("Principal")
    Display();
}

function Display() {
    var tt = ""
    for (var e of Manpower_under_me) {
        var data = Manpower[e]
        tt += '<div class="row form-group"><label class="col form-label">' + data.Post + '</label>\
        <label class="col form-label">' + data.Name + '</label>\
        <label class="col form-label">' + data.UserID + '</label></div>'
    };
    $("#MYMANPOWER").html(tt)
}

$("#add_new_manpower").on('click', () => {

    var Path = '/' + school_name + school_city + '/Manpower/Staff-' + (++x)
    var data = {
        Post: $("#post").val(),
        Name: $("#name").val(),
        UserID: 'Staff-' + x,
        Status:"Available"
    }

    set(ref(db, Path), data).then(() => {
        alert("Data Saved")
        //clear input form
        $("#post").val("")
        $("#name").val("")
        $("#add_manpower").click();

    })
})