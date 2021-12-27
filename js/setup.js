import {
    db,
    hashCode,
    signup
} from "./main.js";
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var school_name = window.localStorage.getItem("school_name")
var school_city = window.localStorage.getItem("school_city")

document.getElementById('save').addEventListener('click', () => {
createAdmin();
createPrincipal();
createVicePrincipal();
createSectionIncharges(); 
});

$("#next").on('click',()=> {
    window.localStorage.setItem("MainSetup",true)
    window.location = "./facilities.html"
})

function createAdmin() {     

    var SetUp_Data = {
      //  'School Admin Email': $('#Admin_Email').val(),
      //  'School Admin Password': hashCode($('#Admin_Password').val()),
        'School Name': school_name,
        'School Address': $('#school_address').val(),
        'School City': school_city,
        'School Logo': ""
    }
    set(ref(db,'/'+school_name+school_city),SetUp_Data)
}

function createPrincipal() {   

    var Principal = {
       
        Post: "Principal",
        Name: $('#principal_name').val(),
        Email: $('#principal_email').val(),
        Password: hashCode($('#principal_name').val()),
        UserID: "Principal",
        Supervises: "Vice Principal, All Section Incharges"
    }
   signup($('#principal_email').val(),hashCode($('#principal_name').val()),"Principal",Principal)
}

function createVicePrincipal() {

    var Vice_Principal = {
       
        Post: "Vice Principal",
        Name: $('#vice_principal_name').val(),
        Email: $('#vice_principal_email').val(),
        Password: hashCode($('#vice_principal_name').val()),
        UserID: "Vice Principal",
        Supervises: "All Supervisors"
    }
    signup($('#vice_principal_email').val(),hashCode($('#vice_principal_name').val()),"Vice Principal",Vice_Principal)
}

function createSectionIncharges() {
    var x = 0;
    SectionList.forEach(ele => {
        var e = ele.substr(0, 4);
      
        if ($('#' + e + '_name').val() != '') { //if Section name ="" then skip writing data
            var Section_Incharge = {
               
                Post: "Section Incharge",
                Name: $('#' + e + '_name').val(),
                Email: $('#' + e + '_email').val(),
                Password: hashCode($('#' + e + '_name').val()),
                UserID: "SIC-" + x++,
                Supervises: "Teachers",
                Sections_in_class: $('#' + e + '_sections').val(),
                No_of_students_per_class: $('#' + e + '_students').val(),
            }
            signup($('#' + e + '_email').val(),hashCode($('#' + e + '_name').val()),"Section-"+ele, Section_Incharge);
        }
    });

}