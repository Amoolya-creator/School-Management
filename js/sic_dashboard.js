import {
    db, changePassword
} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
$("#school").html(school_name + ", " + school_city)

var Manpower, ME
var Path = '/' + school_name + school_city + '/Manpower'
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        Manpower = snap.val()
        ME = window.localStorage.getItem("ME")

        $("#Post").html(ME)
        $("#Name").html(Manpower[ME].Name)
        $("#UserID").html(Manpower[ME].UserID)
        Manpower_under_me_fx();
        start_post_listener();
    }
})

////////// Manpower under ME //////
var Manpower_under_me = []

function Manpower_under_me_fx() {
    Manpower_under_me = []
    for (var Individual in Manpower) {
        if (ME == Manpower[Individual].Boss) Manpower_under_me.push(Individual);
    }

    ///////  Manpower Status ///////
    var tt = "<tr>"
    Manpower_under_me.forEach((e) => {
        tt += '<td>' + Manpower[e].Post + '</td>'
        tt += '<td>' + Manpower[e].Name + '</td>'
        tt += '<td>' + Manpower[e].UserID + '</td>'
        tt += '<td>' + Manpower[e].Status + '</td></tr>'

    })
    $("#My_Teachers").html(tt)

    ///////  Manpower options Available for work Assignment///////
    var tt = ""
    var n = 0
    Manpower_under_me.forEach((e) => {
        if (Manpower[e].Status == "Available") {

            tt += '<tr><td>' + Manpower[e].Name + '</td>\
            <td><input size=12 readonly value="' + Manpower[e].UserID + '"></td>\
            <td>' + Manpower[e].Post + '</td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td>\
            <td><input value="" maxlength=3 size=3></td></tr>'
        }
    })
    $("#timetable").html(tt)
}

//////////// Post Work   //////
$("#send_btn").on('click', () => {
    var Inputs = $("input");
    var nInputs =( Inputs.length-1) / 9 ///had to subtract 1 as input field for change password is also now present

    for (var c = 0; c < nInputs; c++) {
      
        var Post_Path = '/' + school_name + school_city + '/postbox/' + Inputs[9 * c].value
        var Data = {
            P1: Inputs[9 * c + 1].value,
            P2: Inputs[9 * c + 2].value,
            P3: Inputs[9 * c + 3].value,
            P4: Inputs[9 * c + 4].value,
            P5: Inputs[9 * c + 5].value,
            P6: Inputs[9 * c + 6].value,
            P7: Inputs[9 * c + 7].value,
            P8: Inputs[9 * c + 8].value
        }
        set(ref(db, Post_Path), Data)
    }
    alert("Data sent to All Teachers")
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
                <td>'+ data.From + '</td>\
            <td>' + data.Action + '</td>\
            <td>' + data.Object + '</td>\
            <td>' + data.Place + '</td>\
            <td>' + data.Priority + '</td>\
            <td>' + data.Time.slice(15, 21) + '</td>\
            <tr>'
                $("#Requests").html(tt)
            }
        }
    })
}

/////// Change Password ///////
$("#set_btn").on('click', () => {
    var newPwd = $("#newPwd").val()
    changePassword(newPwd)
})