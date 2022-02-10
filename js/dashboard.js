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

var Manpower, ME
var Path = '/' + school_name + school_city + '/Manpower'
onValue(ref(db, Path), (snap) => {
    if (snap.exists()) {
        Manpower = snap.val()
        ME = window.localStorage.getItem("ME")
        if (ME == "Principal") $("#rr").hide();
        var tt = ''

        if (ME == "Vice Principal") {
            tt = '<option selected value="Principal">Principal</option>'
        } else {
            for (var keys in Manpower) {
                if (ME == keys) continue
                if (keys.slice(0, 10) == "Supervisor" || keys.slice(0, 7) == "Section" || keys == "Principal" || keys == "Vice Principal") {
                    tt += '<option value="' + Manpower[keys].UserID + '">' + keys + '</option>'
                }
            }
        }
        $("#send_RR_to").html(tt)
        $("#Post").html(ME)
        $("#Name").html(Manpower[ME].Name)
        $("#UserID").html(Manpower[ME].UserID)
        Manpower_under_me_fx();
        DeleteOldWorks();
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
        if (ME == "Vice Principal" && (Individual == "Principal" || Manpower[Individual].Post == "Section Incharge")) continue;
        if (ME.slice(0, 10) == "Supervisor" && Manpower[Individual].Boss != ME) continue;
        Manpower_under_me.push(Individual);
    }
    ///////  Manpower Status ///////
    var tt = ""
    Manpower_under_me.forEach((e) => {
        tt += '<tr><td>' + Manpower[e].Post + '</td>'
        tt += '<td>' + Manpower[e].UserID + '</td>'
        tt += '<td>' + Manpower[e].Name + '</td>'
        var text_color = (Manpower[e].Status == "Available") ? "text-success" : "text-danger"
        tt += '<td class="bg-white ' + text_color + '">' + Manpower[e].Status + '</td></tr>'
    })
    $("#My_Staff").html(tt)

    ///////  Manpower options Available for work Assignment///////
    var tt = ""
    Manpower_under_me.forEach((e) => {
        if (Manpower[e].Status == "Available") tt += '<option value="' + Manpower[e].UserID + '">' + e + '</option>'
    })
    $("#send_to").html(tt)
}

//////////// Post Work   //////
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
        Post["Link"]= Postbox_Path + '/'+ Postbox_Key;
         //save copy of work-sent
        set(ref(db, Outbox_Path + '/' + Outbox_Key), Post)
        alert("Work Sent to Staff");
    })

})
//////////// Post Work (Raise Request)  //////
$("#send_RR_btn").on('click', () => {
    var T = Date()
    var Post = {
        From: ME,
        To: $("#send_RR_to").val(),
        Action: $("#action_RR").val(),
        Object: $("#object_RR").val(),
        Place: $("#place_RR").val(),
        Priority: $("#priority_RR").val(),
        Time: T,
        Status: "Pending"
    }

    var Outbox_Path = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    var Outbox_Key = push(ref(db, Outbox_Path)).key
    Post["Link"] = Outbox_Path + '/' + Outbox_Key;
    var Postbox_Path = '/' + school_name + school_city + '/postbox/' + $("#send_RR_to").val()
    var Postbox_Key = push(ref(db, Postbox_Path)).key

    set(ref(db, Postbox_Path + '/' + Postbox_Key), Post).then(() => {        
        Post["Link"]= Postbox_Path + '/'+ Postbox_Key;
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
                tt += '<td>' + data.Priority + '</td>'
                var text_color = (data.Status == "Completed") ? "text-success" : (data.Status == "Pending") ? "text-danger" : ""
                tt += '<td class="bg-white ' + text_color + '">' + data.Status + '</td></tr>'

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
            var c = 0
            var Requests = snap.val()
            for (var Request in Requests) {
                var data = Requests[Request]
                c++
                var hide= (data.From.slice(0,5)=="staff" || data.From.slice(0,7)=="teacher")?"style='display:none;'":"";
                tt += '<tr>\
            <td>' + data.From + '</td>\
            <td>' + data.Action + " " + data.Object + '</td>\
            <td>' + data.Place + '</td>\
            <td>' + data.Priority + '</td>\
            <td>' + data.Time.slice(15, 24) + '</td>\
            <td> <input class="ack" name="' + c + '" link="' + data.Link + '" type="radio" '+hide+'></td>\
            <td> <input class="comp" name="' + c + '" link="' + data.Link + '" type="radio" '+hide+'></td>\
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

/////// Deleting Old Completed Works ////////
function DeleteOldWorks() {
    var D = Date().slice(4, 15)
    var Path1 = '/' + school_name + school_city + '/outbox/' + Manpower[ME].UserID
    onValue(ref(db, Path1 ), (snap) => {
        if (snap.exists()) {
            var Works = snap.val()
            for (var Work in Works) {
                var OB = Works[Work]
                if (OB.Status == "Completed" && OB.Time.slice(4, 15) != D) {
                    set(ref(db, OB.Link), {})
                    set(ref(db, Path1 + '/'+ Work),{})
                }
            }
        }
    }, {
        onlyOnce: true
    })

    var Path2 = '/' + school_name + school_city + '/postbox/' + Manpower[ME].UserID
    onValue(ref(db, Path2 ), (snap) => {
        if (snap.exists()) {
            var Works = snap.val()
            for (var Work in Works) {
                var OB = Works[Work]
                if ((OB.From.slice(0,5) == "staff" || OB.From.slice(0,7) == "teacher") && OB.Time.slice(4, 15) != D) {
                    set(ref(db, Path2 + '/'+ Work),{})
                }
            }
        }
    }, {
        onlyOnce: true
    })
}