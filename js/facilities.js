import {
    db, hashCode, signup
} from "./main.js";
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var Facilities = ["Library",
    "AV equip",
    "Smart Class",
    "Computer Lab",
    "Chemistry Lab",
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
                    <input class="col offset-4 form-control" type="text" placeholder="Supervisor Name" id="name_' + n + '" name="name_' + n + '">\
                    <input class="col form-control" type="text" placeholder="Supervisor Email" id="email_' + n + '" name="email_' + n + '">\
                </div></div>';
    n++;
});
$("#DF").html(tt);

$("#new_facility_name").on('change', () => {
    //Get size of Facilities Array
    var n = Facilities.length
    //Get new Facility value
    var New_Facility = $("#new_facility_name").val()
    //Add it in Array
    Facilities.push(New_Facility)
    //Making temp string (code for new block)
    var tt = `  <label class="form-check">\
                        <input class="form-check-input" data-bs-toggle="collapse" \
                        data-bs-target="#Pos${n}" type="checkbox" id="checkbox_${n}">${New_Facility}\
                    </label>\
                    <div class="row collapse" id="Pos${n}">\
                        <input class="col offset-4 form-control" type="text" placeholder="Supervisor Name" id="name_${n}" name="name_${n}">\
                        <input class="col form-control" type="email" placeholder="Supervisor Email" id="email_${n}" name="email_${n}">\
                        </div>`;
    // Making new div block encapsulating this code and then append the block to #DF..the parent 'div' block
    var New_block = document.createElement('div');
    New_block.classList.add("form-group");
    New_block.innerHTML = tt;
    $("#DF").append(New_block)
    //Clicking on newly created checkbox to activate it, showing input fields for new data
    $("#checkbox_" + n).click()
    //Add- button is clicked to hide this field
    $("#add_button").click()
    //Reset the input box
    $("#new_facility_name").val("")
})


$("#save_facilities_data").on('click', () => {

    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var row = 0; var x = 0;
    Facilities.forEach(e => {

        //Check for name field has some data
        if ($("#name_" + row).val() != "") {

            //Setting reference path for Facilities in database
            var Path = '/' + school_name + school_city + '/Facilities/' + e;
            set(ref(db, Path), "true")
            
            var data = {
                Post: "Supervisor",
                Name: $("#name_" + row).val(),
                UserID: "S" + x++,
                Password: hashCode($("#name_" + row).val()),
                Email: $("#email_" + row).val(),
                Supervises: e,
                Status:"Available",
                Boss:"Vice Principal",
                BossID:"Vice Principal",
                Recruiter:"Admin",
                RecruiterID:"Admin"
            }
            signup($("#email_" + row).val(),hashCode($("#name_" + row).val()),"Supervisor-"+e, data)
        }
        row++
    })
    window.localStorage.setItem("FacilitiesSetup",true)
    alert("Data Saved")   
})
