import {
    db
} from "./main.js";
import {
    ref,
    set,
    onValue,
    push
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
var staffID = window.localStorage.getItem("staffID")
if (staffID == "") {
    alert("Error. You are not authorised to visit this page.")
    window.localStorage.removeItem("staffID")
    window.location.assign('./index.html')
}

$("#school").html(school_name + ", " + school_city)


var ME

var Path = '/' + school_name + school_city + '/Manpower/' + staffID
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        ME = snap.val()

        $("#Post").html(ME.Post)
        $("#Name").html(ME.Name)
        $("#UserID").html(ME.UserID)
       
        start_post_listener();
    }
})




//////////// Post Work   //////
$("#send_btn").on('click', () => {
    var Post_Path = '/' + school_name + school_city + '/postbox/' + ME.RecruiterID

    var newKey = push(ref(db, Post_Path)).key
    var T = Date()
    var Post = {
        From: ME.UserID,
        Action: $("#action").val(),
        Object: $("#object").val(),
        Place: $("#place").val(),
        Priority: $("#priority").val(),
        Time: T
    }
    set(ref(db, Post_Path + '/' + newKey), Post).then(() => {
        alert("Request Sent to The Supervisor");


    })
})

///////////// Start Post Listener//////////

function start_post_listener() {
    var myPath = '/' + school_name + school_city + '/postbox/' + staffID
    onValue(ref(db, myPath), (snap) => {
        if (snap.exists()) {
            var tt = ""
            var c = 0
            var Requests = snap.val()
            for (var Request in Requests) {
                var data = Requests[Request]
                c++
                tt += '<tr>\
            <td>' + data.From + '</td>\
            <td>' + data.Action + " " + data.Object + '</td>\
            <td>' + data.Place + '</td>\
            <td>' + data.Priority + '</td>\
            <td>' + data.Time.slice(15, 24) + '</td>\
            <td> <input id="ack_'+ c + '" type="checkbox">\
            <td> <input id="etc_'+ c + '" size="3" maxlength="3" min="1" > min\
            <td> <input id="comp_'+ c + '" type="checkbox">\
            <tr>'
                $("#Requests").html(tt)
            }
        }
    })
}


