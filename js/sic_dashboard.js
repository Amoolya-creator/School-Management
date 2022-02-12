import {
    db,
    changePassword
} from "./main.js";
import {
    ref,
    set,
    onValue,
    push,
    update
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
$("#school").html(school_name + ", " + school_city)


var TD = Date().slice(0,3) //Today's Day

var Manpower, ME
var Path = '/' + school_name + school_city + '/Manpower'
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        Manpower = snap.val()
        ME = window.localStorage.getItem("ME")
        var tt = '<option selected value="Principal">Principal</option>'
        for (var keys in Manpower) {
            if (keys == ME) continue
            if (keys.slice(0, 10) == "Supervisor" || keys.slice(0, 7) == "Section") tt += '<option value="' + Manpower[keys].UserID + '">' + keys + '</option>'
        }
        $("#send_to").html(tt)
        $("#Post").html(ME)
        $("#Name").html(Manpower[ME].Name)
        $("#UserID").html(Manpower[ME].UserID)
        Manpower_under_me_fx();
        DeleteOldWorks();
        start_post_listener();
        start_outbox_listner();
    }
})

////////// Manpower under ME //////
var Manpower_under_me = []

var Postboxes =new Object

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
        var text_color = (Manpower[e].Status == "Available") ? "text-success" : "text-danger"
        tt += '<td class="bg-white ' + text_color + '">' + Manpower[e].Status + '</td></tr>'
    })
    $("#My_Teachers").html(tt)

    ///////  Manpower options Available for work Assignment///////

    ///// Read data for Teacher if Available
    onValue(ref(db, '/' + school_name + school_city + '/postbox'), (snap) => {
        if (snap.exists()) {
            Postboxes = snap.val()
        }
        Fill_TimeTable()
    })
}

///// Fill values in TimeTable //////
function Fill_TimeTable() {
    var tt=""
   
    Manpower_under_me.forEach((e) => {
        if (Manpower[e].Status == "Available") {
            var PB = new Object
            if (Postboxes[e] == undefined) {
                var Days =["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                Days.forEach( (Day)=>{for (var c = 1; c < 9; c++) PB[Day+ "-P" + c] = ""})
            } else
            {
                PB = Postboxes[e]
            }
            ///// Making input boxes for each teacher ///////
            tt += '<tr><td>' + Manpower[e].Name + '</td>\
            <td><input class="in" size=12 readonly value="' + Manpower[e].UserID + '"></td>\
            <td>' + Manpower[e].Post + '</td>'
            for (var c = 1; c < 9; c++) {
                var xx= (PB[TD+'-P'+c]==undefined) ? "":PB[TD+'-P'+c]
                tt += '<td><input class="in" value="'+xx+'" maxlength=3 size=3></td>'
            }
            tt += '</tr>'
        }
    })
    $("#timetable").html(tt)
}

//////////// Post Work   //////
$("#send_tt_btn").on('click', () => {
    var Inputs = $(".in");
    var nInputs = (Inputs.length) / 9
    for (var c = 0; c < nInputs; c++) {
        var Post_Path = '/' + school_name + school_city + '/postbox/' + Inputs[9 * c].value
        var Data = new Object
        for (var v=1; v<9 ; v++){
            Data[TD+"-P"+v]=Inputs[9*c+v].value
        }
        update(ref(db, Post_Path), Data)
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
                var hide = (data.From.slice(0, 5) == "staff" || data.From.slice(0, 7) == "teacher") ? "style='display:none;'" : "";
                tt += '<tr>\
            <td>' + data.From + '</td>\
            <td>' + data.Action + " " + data.Object + '</td>\
            <td>' + data.Place + '</td>'
                var text_color = (data.Priority == "Urgent" || data.Priority == "Immediate") ? "text-danger fw-bold" : (data.Priority == "Priority") ? "text-warning fw-bold" : ""
                tt += '<td class="' + text_color + '">' + data.Priority + '</td>\
            <td>' + data.Time.slice(15, 24) + '</td>\
            <td><input class="ack" type="radio" name="' + c + '" link="' + data.Link + '" ' + hide + '></td>\
            <td><input class="comp" type="radio" name="' + c + '" link="' + data.Link + '" ' + hide + '></td>\
            <tr>'
                $("#Requests").html(tt)
            }
            ///// feedback
            $(".ack").click(function () {
                update(ref(db, $(this).attr('link')), {
                    Status: "Acknowledged"
                })
            })
            $(".comp").click(function () {
                update(ref(db, $(this).attr('link')), {
                    Status: "Completed"
                })
            })
        }
    })
}

/////// Change Password ///////
$("#set_btn").on('click', () => {
    var newPwd = $("#newPwd").val()
    changePassword(newPwd, ME)
})

//////////// Post Work (Raise Request)  //////
$("#send_btn").on('click', () => {
    var T = Date()
    var Post = {
        From: ME,
        To: $("#send_to").val(),
        Action: $("#action").val(),
        Object: $("#object").val(),
        Place: $("#place").val(),
        Priority: $("#priority").val(),
        Time: T,
        Status: "Pending"
    }

    var Outbox_Path = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    var Outbox_Key = push(ref(db, Outbox_Path)).key
    Post["Link"] = Outbox_Path + '/' + Outbox_Key;
    var Postbox_Path = '/' + school_name + school_city + '/postbox/' + $("#send_to").val()
    var Postbox_Key = push(ref(db, Postbox_Path)).key

    set(ref(db, Postbox_Path + '/' + Postbox_Key), Post).then(() => {
        Post["Link"] = Postbox_Path + '/' + Postbox_Key;
        //save copy of work-sent
        set(ref(db, Outbox_Path + '/' + Outbox_Key), Post)
        alert("Raised Request");
    })

})
///////// Start Outbox Listener ///////
function start_outbox_listner() {
    var outboxPath = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    onValue(ref(db, outboxPath), (snap) => {
        if (snap.exists()) {
            var SentMessages = snap.val()
            var tt = ''
            for (var msg in SentMessages) {
                var data = SentMessages[msg]
                tt += '<tr><td>' + data.Action + " " + data.Object + '</td>'
                tt += '<td>' + data.To + '</td>'
                tt += '<td>' + data.Place + '</td>'
                tt += '<td>' + data.Time.slice(15, 24) + '</td>'
                var text_color = (data.Priority == "Urgent" || data.Priority == "Immediate") ? "text-danger fw-bold" : (data.Priority == "Priority") ? "text-warning fw-bold" : ""
                tt += '<td class="' + text_color + '">' + data.Priority + '</td>'
                var text_color = (data.Status == "Completed") ? "text-success" : (data.Status == "Pending") ? "text-danger" : ""
                tt += '<td class="bg-white ' + text_color + '">' + data.Status + '</td></tr>'
            }
            $("#Work_Assigned").html(tt)
        }
    })
}

/////// Deleting Old Completed Works ////////
function DeleteOldWorks() {
    var D = Date().slice(4, 15)
    var Path1 = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    onValue(ref(db, Path1), (snap) => {
        if (snap.exists()) {
            var Works = snap.val()
            for (var Work in Works) {
                var OB = Works[Work]
                if (OB.Status == "Completed" && OB.Time.slice(4, 15) != D) {
                    set(ref(db, OB.Link), {})
                    set(ref(db, Path1 + '/' + Work), {})
                }
            }
        }
    }, {
        onlyOnce: true
    })

    var Path2 = '/' + school_name + school_city + '/postbox/' + Manpower[ME].UserID
    onValue(ref(db, Path2), (snap) => {
        if (snap.exists()) {
            var Works = snap.val()
            for (var Work in Works) {
                var OB = Works[Work]
                if ((OB.From.slice(0, 5) == "staff" || OB.From.slice(0, 7) == "teacher") && OB.Time.slice(4, 15) != D) {
                    set(ref(db, Path2 + '/' + Work), {})
                }
            }
        }
    }, {
        onlyOnce: true
    })
}