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
        alert("Request Sent to The Section Incharge");


    })
})

///////////// Start Post Listener//////////

function start_post_listener() {
    var myPath = '/' + school_name + school_city + '/postbox/' + staffID
    onValue(ref(db, myPath), (snap) => {
        if (snap.exists()) {
            var tt ='<tr>'
            var data = snap.val()
            tt +=   '<td>' + data.P1 + '</td>\
            <td>' + data.P2 + '</td>\
            <td>' + data.P3 + '</td>\
            <td>' + data.P4 + '</td>\
            <td>' + data.P5 + '</td>\
            <td>' + data.P6 + '</td>\
            <td>' + data.P7 + '</td>\
            <td>' + data.P8 + '</td>\
            <tr>'
          $("#Requests").html(tt)
            
        }
    })
}


