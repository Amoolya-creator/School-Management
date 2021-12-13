import {
    db
} from "./main.js";
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

var Facilities = ["Library",
    "AV equip",
    "Smart Class",
    "Computer Lab ",
    "Chemistry Lab ",
    "Bio Lab",
    "Swimming Pool",
    "Basket Ball Court",
    "Badminton Court",
    "Open Field",
    "Dramatics stage",
    "Conference hall",
    "Medical Clinic",
    "Store"
];

var n = 0;
var tt = '';

Facilities.forEach(ele => {
    tt += '<div class="form-group">\
                    <label class="form-check">\
                    <input class="form-check-input" data-bs-toggle="collapse" \
                    data-bs-target="#Pos' + n + '" type="checkbox" id="checkbox_' + n + '">' + ele + '\
                    </label>\
                <div class="row collapse" id="Pos' + n + '">\
                    <input class="col offset-4 form-control" type="text" placeholder="Incharge Name" id="name_' + n + '" name="name_' + n + '">\
                    <input class="col form-control" type="text" placeholder="Incharge Email" id="email_' + n + '" name="email_' + n + '">\
                </div>';
    n++;
});
$("#DF").html(tt);

document.getElementById("new_facility_name").addEventListener('change', () => {
    var n = Facilities.length;
    var New_Facility = $("#new_facility_name").val()
    Facilities.push(New_Facility)
    var tt = `<label class="form-check">\
    <input class="form-check-input" data-bs-toggle="collapse" \
    data-bs-target="#Pos${n}" type="checkbox" id="checkbox_${n}">${New_Facility}\
    </label>\
    <div class="row collapse" id="Pos${n}">\
    <input class="col offset-4 form-control" type="text" placeholder="Supervisor Name" id="name_${n}" name="name_${n}">\
    <input class="col form-control" type="email" placeholder="Supervisor Email" id="email_${n}" name="email_${n}">`;
    var New_block = document.createElement('div');
    New_block.classList.add("form-group");
    New_block.innerHTML = tt;
    $("#DF").append(New_block)
    $("#" + n + "_checkbox").click()
    $("#add_button").click()
    $("#new_facility_name").val("")
});

document.getElementById("save_facilities").addEventListener('click', () => {
    var FD = document.myFacilities

    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var row = 0;
    
    Facilities.forEach(e => {
        //Setting reference path in database
        var Path =`/${school_name}${school_city}/Facilities/${e}`;

        //Getting data from Form fields
        var _name = FD[row * 3 + 1].value
        var _email = FD[row * 3 + 2].value
        var Data ={}
        //Not writing data where empty name value
        if (_name != '') {
            Data = {
                'Incharge Name': _name,
                'Incharge Email': _email
            }
            alert(Path +","+  JSON.stringify(Data))
           // set(ref(db,Path), Data).then(console.log('Data Saved'))
        }
        row++
    })

    next();
})

function next(){window.location="./manpower.html";}