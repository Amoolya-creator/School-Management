import {
    db,
ME
} from "./main.js";
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var c = 0
// Materials 
var Materials = {"undefined":0}

function addRow(e,f) {
    c++;
    var tt = '<label id="sNo" class="col-1 form-label">' + c + '</label>\
             <input id="InfrastructureName'+ c + '" class="col form-control" placeholder="Material" value='+e+'>\
             <input id ="InfrastructureQty'+ c + '" class="col form-control" type="number" placeholder="Quantity" value='+f+'>'
    var New_block = document.createElement('div');
    New_block.classList.add("row", "form-group");
    New_block.innerHTML = tt;
    $("#tab1").append(New_block)
};

function availableRows(){
    for (var key in Materials) {
           addRow(key, Materials[key])     
    };
}

availableRows();

function saveData(){
    var nItems = $("input").length
    alert(nItems)

    SaveMaterial={}

    for (var c =1;c<=nItems;c++){
        SaveMaterial[input[c]]=input[c+1]
    }
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var Path = ref(db, '/' + school_name + school_city + '/Facility/' + input[0]);
    set(Path,SaveMaterial).then(alert ("Data Saved"))   
}

export {availableRows, addRow, saveData}