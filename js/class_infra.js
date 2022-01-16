import {
    db
} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
var ME = window.localStorage.getItem("ME")
if (school_name == undefined || school_city == undefined || ME == undefined) {
    alert("You are not authorized to visit this page")
    window.location.assign("./index.html")
}
var Path = "/" + school_name + school_city + "/Manpower/" + ME

var sections_in_class, nStudents
var SectionList = [];
var Classes = {
    "Pla": [-2, -1, 0],
    "Pri": [1, 2, 3, 4, 5],
    "Mid": [6, 7, 8],
    "Sec": [9, 10],
    "Hig": [11, 12]
}

onValue(ref(db, Path), (snap) => {
    var ME_Struc = snap.val()
    sections_in_class = ME_Struc.Sections_in_class
    nStudents = ME_Struc.No_of_students_per_class
    setDefaultMaterials()
    var subs = ME.slice(8, 11)
    var ClassArr = Classes[subs]
    SectionList = []
    ClassArr.forEach(function (e) {
        for (var cc = 0; cc < sections_in_class; cc++) {
            if (e < 1) {
                if (e == -2) {
                    SectionList.push("PG-" + String.fromCharCode(cc + 65))
                } else if (e == -1) {
                    SectionList.push("Nur-" + String.fromCharCode(cc + 65))
                } else SectionList.push("KG-" + String.fromCharCode(cc + 65))
            } else {
                SectionList.push(e + String.fromCharCode(cc + 65));
            }
        }
    })
    addtabs()
}, {
    onlyOnce: true
})

function addtabs() {
    var tt = ''
    SectionList.forEach(function (ee) {
        tt += '<li class="nav-item"><button id="link_' + ee + '" class="nav-link" data-bs-toggle="tab" data-bs-target="#Class_' + ee + '">\
     ' + ee + '</button></li>'
    })
    $("#navs").html(tt)
    tt = ''
    SectionList.forEach(function (ee) {
        tt += '<div id="Class_' + ee + '" class="tab-pane fade">\
                <h6 class="text-info">Enter Name of Material followed by Quantity</h6>\
                <div id="tab_' + ee + '"></div>\
            </div>'
    })
    $("#tabs").html(tt)
}
var DefaultMaterials = {}

function setDefaultMaterials() {
    DefaultMaterials = {
        "Tables": nStudents,
        "Chairs": nStudents,
        "Teacher_Table": 1,
        "Teacher_Chair": 1,
        "Blackboard": 1,
        "AV_Equipment": 1,
        "Smart_Class": 1,
        "Chalk_Box": 2,
        "Pens": 5,
        "Pencils": nStudents,
        "Crayon_Box": nStudents,
        "Attendance_Register": 1,
        "File_Folders": 5,
        "Chart_Papers": nStudents,
        "Eraser": 1
    }
}

var Materials, c
//Read Material List
var currentClass
onValue(ref(db, '/' + school_name + school_city + '/Class'), (snap) => {
    if (snap.exists()) {
        //Check whether Class exists
        var temp = snap.val()

        SectionList.forEach(function (ee) {
            currentClass = ee
            if ((ee in temp)) {
                Materials = temp[ee]
            } else {
                Materials = DefaultMaterials
            }
            c = 0
            $("#tab_" + ee).html('')
            availableRows()
        })
    } else {
        SectionList.forEach(function (ee) {
            currentClass = ee
            Materials = DefaultMaterials
            c = 0
            $("#tab_" + ee).html('')
            availableRows()
        })
    }
    $(".nav-link:first").tab('show')
})

function addRow(e, f) {
    c++;
    var tt = '<label id="sNo" class="col-1 form-label">' + c + '</label>\
             <input id="InfrastructureName' + c + '" class="col form-control" placeholder="Material" value="' + e + '">\
             <input id ="InfrastructureQty' + c + '" class="col form-control" type="number" placeholder="Quantity" value="' + f + '">'
    var New_block = document.createElement('div');
    New_block.classList.add("row", "form-group");
    New_block.innerHTML = tt;
    $("#tab_" + currentClass).append(New_block)
};

function availableRows() {
    for (var key in Materials) {
        addRow(replace_dash(key), Materials[key])
    };
}

$("#addRow").on('click', () => {
    currentClass = $('.tab-pane.show').attr('id').slice(6)
    addRow(' ', 1)
})

$("#saveData").on('click', () => {
    currentClass = $('.tab-pane.show').attr('id').slice(6)
    var input = $("#Class_" + currentClass + " input")
    var nItems = input.length
    var SaveMaterial = {}
    var Tot = (nItems) / 2
    for (var c = 0; c < Tot; c++) {
        if (input[c * 2].value == undefined || input[c * 2].value == "") continue 
        SaveMaterial[replace_spaces(input[c * 2].value)] = input[c * 2 + 1].value
    }
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var Path = ref(db, '/' + school_name + school_city + '/Class/' + currentClass);
    set(Path, SaveMaterial).then(alert("Data for " + $('.tab-pane.show').attr('id').slice(6) + " Saved"))
})

function replace_spaces(x){
    x.replace(' ','_')
    return x
}

function replace_dash(x){
    x.replace('_',' ')
    return x
}