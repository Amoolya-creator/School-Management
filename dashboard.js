import {
    db,
    hashCode
} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
$("#school").html(school_name + ", " + school_city)
var WhoAmI = window.localStorage.getItem("WhoAmI")

var Manpower, ME
var Path = '/' + school_name + school_city + '/Manpower'
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        Manpower = snap.val()
        getME()
    }
}, {
    onlyOnce: true
})

function getME() {
    for (var key in Manpower) {      
        if (hashCode(key) == WhoAmI) ME = key
    }
    
    $("#Post").html(Manpower[ME].Post)
    $("#Name").html(Manpower[ME].Name)
    $("#UserID").html(Manpower[ME].UserID)   
}

////////// Manpower under ME //////
var Manpower_under_me = []

function Manpower_under_me_fx() {
    for (var Individual in Manpower) {
        if (ME_Node == Individual) continue;

        if ((ME_Node == "Vice Principal") && (Individual == "Principal")) continue;
        if ((ME_Node.sustr(0, 9) == "Supervisor") && (Individual.substr(0, 5) != "Staff")) continue;
        if ((ME_Node.sustr(0, 6) == "Section") && (Individual.substr(0, 6) != "Teacher")) continue;

        Manpower_under_me.push(Individual);
    }
}

//////////// Post Work   //////
$("input_send_to").on('click', () => {
    var Post_Path = '/' + school_name + school_city + '/postbox/' + $("#input_send_to").val()
    var newKey = push(child(ref(db, Post_Path))).key
    var T = new Date().toLocaleTimeString

    var Post = {
        Action: $("#action").val(),
        Object: $("#object").val(),
        Place: $("#place").val(),
        Priority: $("#priority").val(),
        'Timestamp': T
    }
    set(ref(db, Post_Path + '/' + newKey), Post).then(alert("Work Sent to The Staff"))
})

///////////// Start Post Listener//////////

function start_post_listener() {
    var myPath = '/' + school_name + school_city + '/postbox/' + Manpower[ME].UserID
    onValue(ref(db, myPath), (snap) => {
        if (snap.exists()) {
            var tt = ""
            var Requests = snap.val()
            for (var Request in Requests) {
                var data = Requests[Request]
                tt += '<tr>\
            <td>' + data.Action + '</td>\
            <td>' + data.Object + '</td>\
            <td>' + data.Place + '</td>\
            <td>' + data.Priority + '</td>\
            <td>' + data.Priority + '</td>\
            <tr>'
                $("#Requests").html(tt)
            }
        }
    })
}



/////// Listerner for Manpower Status ///////

function Active_manpower() {
    /// to be integrated with manpower
}