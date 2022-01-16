import {
    db
} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var c = 0
var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
var ME = window.localStorage.getItem("ME")
if (school_name == undefined || school_city == undefined || ME == undefined) {
    alert("You are not authorized to visit this page")
    window.location.assign("./index.html")
}

//check for Facilities data 
var available_facilities = []
var Facility_details;
var viewFacility

if (ME.slice(0, 10) == "Supervisor") {
    viewFacility = ME.slice(11)
    $("#facility").html("<h2>" + viewFacility + "</h4>")
    viewFacility = viewFacility.replace(' ', '_')
    getFacility()
}
else {
    onValue(ref(db, '/' + school_name + school_city + '/Facilities'), (snap) => {
        if (snap.exists()) {
            var Facilities = snap.val()
            for (var key in Facilities) { available_facilities.push(key) }
            var tt = '<div class="m-3 row form-group">\
            <div class="col-4">\
                <h4>Please select the Facility</h4>\
            </div>\
            <div class="col-3">\
                <select id="facilities" class="form-select">'

            available_facilities.forEach(element => {
                tt += '<option value="' + element + '">' + element + '</option>'
            });
            
            tt += '</select>\
            </div>\
            <div class="col-3">\
                <div class="btn btn-primary" id="get">Get Data</div>\
            </div>\
            </div >'
            $("#facility").html(tt)
            $("#get").on('click', () => {
                c = 0;
                $("#tab1").html('');
                viewFacility = $("#facilities").val().replace(' ', "_")
                getFacility()
            })
        }
    }, { onlyOnce: true })
}


/// GET DATA FROM FIREBASE /////
function getFacility() {
    var Path = '/' + school_name + school_city + '/Facility/' + viewFacility
    onValue(ref(db, Path), (snap) => {
        Facility_details = {}
        if (snap.exists()) {
            Facility_details = snap.val();
        }
        availableRows()
    }, { onlyOnce: true })
}


function add_Row(e, f) {
    c++;
    var tt = '<label class="col-1 form-label">' + c + '</label>\
             <input id="InfrastructureName'+ c + '" class="col form-control" placeholder="Material" value="' + e + '">\
             <input id ="InfrastructureQty'+ c + '" class="col form-control" type="number" placeholder="Quantity" value="' + f + '">'
    var New_block = document.createElement('div');
    New_block.classList.add("row", "form-group");
    New_block.innerHTML = tt;
    $("#tab1").append(New_block)
};

function availableRows() {
    for (var key in Facility_details) {
        add_Row(replace_dash(key), Facility_details[key])
    };
    if (Object.keys(Facility_details).length == 0) add_Row('', 1)
}

$("#addRow").on('click', () => { add_Row('', 1) })

$("#saveData").on('click', () => {
    var Inputs = $("input")
    var nItems = Inputs.length / 2  
    var Data = {}
    for (var c = 0; c < nItems; c++) {
        Data[replace_spaces(Inputs[2 * c].value)] = Inputs[2 * c + 1].value
    }   
    var Path = ref(db, '/' + school_name + school_city + '/Facility/' + viewFacility)
    set(Path, Data).then(alert("Data Saved"))
})

function replace_spaces(x){
    x.replace(' ','_')
    return x
}

function replace_dash(x){
    x.replace('_',' ')
    return x
}