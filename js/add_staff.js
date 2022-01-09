import {
    db
} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var c = 0;
var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
var ME = window.localStorage.getItem("ME")

var Manpower
var reff = ref(db, '/' + school_name + school_city + '/Manpower')

var nManpower;
var FirstTime = true;
onValue(reff, (snap) => {
    if (snap.exists()) {
        Manpower = snap.val()
        nManpower = Object.keys(Manpower).length
        if (FirstTime) { $("#addRow").click(); FirstTime = false; }
    }
})

function set_SelectOptionsText() {
    var tt = '<option selected value="' + Manpower[ME].UserID + '">  ME  </option>';
    for (var keys in Manpower) {
        if (ME.slice(0,10)=="Supervisor") { break;}
        if ((keys == ME) || (keys.slice(0, 7) == 'teacher') || (keys.slice(0, 5) == 'staff') || (keys.slice(0, 7) == 'Section')) continue;
        if (ME == "Principal") { tt += '<option value="' + Manpower[keys].UserID + '">' + keys + '</option>' }
        else if (ME == "Vice Principal" && keys.slice(0, 10) == "Supervisor") { tt += '<option value="' + Manpower[keys].UserID + '">' + keys + '</option>' }     
    }
    return tt;
}

$("#addRow").on('click', () => {
    c++;
    var tt = '<label class="col-1 form-label">' + c + '</label>\
             <input id="Category'+ c + '" class="col form-control" placeholder="Category">\
             <input id="Name'+ c + '" class="col form-control" placeholder="Name">\
             <input id ="UserID'+ c + '" class="col form-control" value="staff-' + (nManpower + c) + '">\
             <label class="col form-col-label text-right">Reports To</label>\
             <select id="Under'+ c + '" class="col form-select">' + set_SelectOptionsText() + '</select>'
    var New_block = document.createElement('div');
    New_block.classList.add("row", "form-group");
    New_block.innerHTML = tt;
    $("#tab1").append(New_block)
});

$("#saveData").on('click', () => {
    for (var x = 1; x <= c; x++) {
        var Path = ref(db, '/' + school_name + school_city + '/Manpower/staff-' + (nManpower + 1))
        var Data = {
            Post: $("#Category" + x).val(),
            Name: $("#Name" + x).val(),
            UserID: $("#UserID" + x).val(),
            Status: "Available",
            Recruiter: ME,
            RecruiterID: Manpower[ME].UserID,
            Boss: $("#Under" + x + " option:selected").text(),
            BossID: $("#Under" + x).val()
        }
        set(Path, Data)
    }
    alert("New Staff Data Saved")
    $("#tab1").html('')
    c = 0;
})