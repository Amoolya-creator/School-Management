import {
    db,

} from "./main.js";
import {
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var c = 0;
var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")
var Manpower
var reff= ref(db,'/'+school_name+school_city+'/Manpower')

var nManpower;
var FirstTime=true;
onValue(reff,(snap)=>{ 
    if (snap.exists()){
        Manpower = snap.val()
        nManpower = Object.keys(Manpower).length
        if  (FirstTime)  {$("#addRow").click()  ; FirstTime=false;}   
    }
})

$("#addRow").on('click', () => {
    c++;
    var tt = '<label id="sNo" class="col-1 form-label">' + c + '</label>\
             <input id="Category'+ c + '" class="col form-control" placeholder="Category">\
             <input id="Name'+ c + '" class="col form-control" placeholder="Name">\
             <input id ="UserID'+ c + '" class="col form-control" value="Staff-' + (nManpower+c) + '" >'
    var New_block = document.createElement('div');
    New_block.classList.add("row", "form-group");
    New_block.innerHTML = tt;
    $("#tab1").append(New_block)
});

$("#saveData").on('click',()=>{    
    for ( var x =1; x<=c ;x++){
    var Path = ref(db,'/'+school_name+school_city+'/Manpower/Staff-'+(nManpower+1))
        var Data ={
            Post: $("#"+"Category"+x).val(),
            Name: $("#"+"Name"+x).val(),
            UserID: $("#"+"UserID"+x).val(),
            Status:"Available"
        }
        set(Path,Data)
    }
    alert("New Staff Data Saved")
})
