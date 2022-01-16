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
        var tt='<option selected value="Principal">Principal</option>'
        for (var keys in Manpower) {
            if (keys==ME) continue
            if (keys.slice(0, 10) == "Supervisor" || keys.slice(0,7)=="Section") tt += '<option value="' + Manpower[keys].UserID + '">' + keys + '</option>'
        } 
        $("#send_to").html(tt)
        $("#Post").html(ME)
        $("#Name").html(Manpower[ME].Name)
        $("#UserID").html(Manpower[ME].UserID)
        Manpower_under_me_fx();
        start_post_listener();
        start_outbox_listner();
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
        var text_color= (Manpower[e].Status=="Available")? "text-success":"text-danger"
        tt += '<td class="bg-white '+text_color+'">' + Manpower[e].Status + '</td></tr>'
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
$("#send_tt_btn").on('click', () => {
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
            var c = 0
            var Requests = snap.val()
            for (var Request in Requests) {
                var data = Requests[Request]
                c++
                tt += '<tr>\
            <td id ="sn_'+ c + '" link="' + data.Link + '">' + data.From + '</td>\
            <td>' + data.Action + " " + data.Object + '</td>\
            <td>' + data.Place + '</td>\
            <td>' + data.Priority + '</td>\
            <td>' + data.Time.slice(15, 24) + '</td>\
            <td> <input id="ack_'+ c + '" type="checkbox">\
            <td> <input id="comp_'+ c + '" type="checkbox">\
            <tr>'
                $("#Requests").html(tt)
            }
            ///// feedback
            for (var cc = 1; cc <= c; cc++) {
                $("#ack_" + c).on('click', () => {
                    if ($("#ack_"+c).is(':checked')) {
                        var v = $("#sn_" + c).text()
                        var Path = $("#sn_" + c).attr('link')
                        update(ref(db, Path), { Status: "Acknowledged" })
                    }
                    else $("#ack_"+c).prop('checked',true)
                })
                $("#comp_" + c).on('click', () => {
                    if($("#comp_"+c).is(':checked')){
                    var v = $("#sn_" + c).text()
                    var Path = $("#sn_" + c).attr('link')
                    update(ref(db, Path), { Status: "Completed" })
                    }
                })
            }
        }
    })
}

/////// Change Password ///////
$("#set_btn").on('click', () => {
    var newPwd = $("#newPwd").val()
    changePassword(newPwd,ME)
})

//////////// Post Work (Raise Request)  //////
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
                var text_color= (data.Status=="Completed")? "text-success":(data.Status=="Pending")?"text-danger":""
                tt += '<td class="bg-white '+text_color+'">' + data.Status + '</td></tr>'
            }
            $("#Work_Assigned").html(tt)
        }
    })
}