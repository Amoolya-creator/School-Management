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

function NotAuth(){
    alert("Error. You are not authorised to visit this page.")
    window.localStorage.removeItem("staffID")
    window.location.assign('./index.html')
}
$("#school").html(school_name + ", " + school_city)
if (staffID===undefined || staffID=="") NotAuth()
var Manpower
var Auth =false
var Path = '/' + school_name + school_city + '/Manpower'
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        Manpower = snap.val()        
        ///////// Manpower Select Option (Get All Supervisors) ///////
        var tt=''
        for (var keys in Manpower) {
            if (staffID==keys) Auth=true
            if (keys.slice(0, 10) == "Supervisor") tt += '<option value="' + Manpower[keys].UserID + '">' + keys + '</option>'
        }
        
        if (Auth==false) NotAuth() 
        tt = '<option selected value="' + Manpower[staffID].BossID + '">My Section-Incharge</option>' + tt
        $("#send_to").html(tt)
        $("#Post").html(Manpower[staffID].Post)
        $("#Name").html(Manpower[staffID].Name)
        $("#UserID").html(Manpower[staffID].UserID)
        start_post_listener();
    }
},{
    onceOnly:true
})

//////////// Post Work   //////
$("#send_btn").on('click', () => {
    var Post_Path = '/' + school_name + school_city + '/postbox/' + $("#send_to").val()
    var newKey = push(ref(db, Post_Path)).key
    var T = Date()
    var Post = {
        From: Manpower[staffID].UserID,
        Action: $("#action").val(),
        Object: $("#object").val(),
        Place: $("#place").val(),
        Priority: $("#priority").val(),
        Time: T
    }
    set(ref(db, Post_Path + '/' + newKey), Post).then(() => {
        alert("Request Sent");
    })
})

///////////// Start Post Listener//////////
function start_post_listener() {
    var myPath = '/' + school_name + school_city + '/postbox/' + staffID
    onValue(ref(db, myPath), (snap) => {
        if (snap.exists()) {
            var TD = Date().slice(0,3)
            var tt = '<tr>'
            var data = snap.val()
            for (var v =1;v<9;v++)  tt += '<td>' + data[TD+'-P'+v] + '</td>'      
            tt+='<tr>'
            $("#Requests").html(tt)
        }
    })
}