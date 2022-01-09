import {
    db, changePassword
} from "./main.js";
import {
    ref,
    set,
    onValue,
    push
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
        start_outbox_listner();
        start_post_listener();
    }
})

////////// Manpower under ME //////
var Manpower_under_me = []

function Manpower_under_me_fx() {
    Manpower_under_me = []
    for (var Individual in Manpower) {
        if (ME == Individual) continue;
        if (ME=="Vice Principal" && (Individual=="Principal" || Manpower[Individual].Post=="Section Incharge" )) continue;
        if (ME.slice(0,10)=="Supervisor" && Manpower[Individual].Boss != ME) continue;
        Manpower_under_me.push(Individual);
    }
    ///////  Manpower Status ///////
    var tt = ""
    Manpower_under_me.forEach((e) => {
        tt += '<tr><td>' + Manpower[e].Post + '</td>'
        tt += '<td>' + Manpower[e].UserID + '</td>'
        tt += '<td>' + Manpower[e].Name + '</td>'
        tt += '<td>' + Manpower[e].Status + '</td></tr>'
    })
    $("#My_Staff").html(tt)

    ///////  Manpower options Available for work Assignment///////
    var tt = ""
    Manpower_under_me.forEach((e) => {
        if (Manpower[e].Status == "Available") tt += '<option value="' + Manpower[e].UserID + '">'+e+'</option>'
    })
    $("#send_to").html(tt)
}

//////////// Post Work   //////
$("#send_btn").on('click', () => {
    var T = Date()
    var Post = {
        From: ME,
        To:$("#send_to").val(),
        Action: $("#action").val(),
        Object: $("#object").val(),
        Place: $("#place").val(),
        Priority: $("#priority").val(),
        Time: T,
        Status:"Pending"
    }

    var Outbox_Path = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    var Outbox_Key = push(ref(db, Outbox_Path)).key
    Post["Link"]=Outbox_Path+'/'+Outbox_Key;
    var Postbox_Path = '/' + school_name + school_city + '/postbox/' + $("#send_to").val()
    var Postbox_Key = push(ref(db, Postbox_Path)).key

    set(ref(db, Postbox_Path + '/' +Postbox_Key ), Post).then(() => {
        alert("Work Sent to The Staff");})

        //save copy of work-sent
    set(ref(db,Outbox_Path+'/'+Outbox_Key),Post)
    
})
///////// Start Outbox Listener ///////
function start_outbox_listner(){
    var outboxPath = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    onValue(ref(db,outboxPath),(snap)=>{
        if (snap.exists()){
            var SentMessages= snap.val()
            var tt=''
            for (var msg in SentMessages){
                var data = SentMessages[msg]
                tt += '<tr><td>'+data.Action+ " " +data.Object+'</td>'
                tt += '<td>'+data.To+'</td>'
                tt += '<td>'+data.Place+'</td>'
                tt += '<td>'+data.Time.slice(15,24)+'</td>'
                tt += '<td>'+data.Priority+'</td>'
                tt += '<td>'+data.Status+'</td></tr>'
            }
            $("#Work_Assigned").html(tt)
        }
    })
}

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
                <td>' +data.From+'</td>\
            <td>' + data.Action + '</td>\
            <td>' + data.Object + '</td>\
            <td>' + data.Place + '</td>\
            <td>' + data.Priority + '</td>\
            <td>' + data.Time.slice(15,21) + '</td>\
            <tr>'
                $("#Requests").html(tt)
            }
        }
    })
}

/////// Change Password ///////
$("#set_btn").on('click', ()=>{
    var newPwd = $("#newPwd").val()
    changePassword(newPwd)
})