import {
    db
} from "./main.js";
import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";



document.getElementById('save').addEventListener('click', () => {
    var hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var reff = ref(db, '/' + school_name + school_city);

    var SetUp_Data = {};
    SetUp_Data['Admin_Username'] = $('#Admin_Username').val();
    SetUp_Data['Admin_Password'] = $('#Admin_Password').val();
    SetUp_Data['Hint_Question'] = $('#Hint_Question').val();
    SetUp_Data['Hint_Answer'] = $('#Hint_Answer').val();

    SetUp_Data['School Name'] = school_name;
    SetUp_Data['School Address'] = $('#school_address').val();
    SetUp_Data['School City'] = school_city;
    SetUp_Data['School Logo'] = "";

    set(reff, SetUp_Data).then(console.log("Data Saved"));

    var List = ['_name', '_email', '_sections', '_students']
    var Sections = {}
    SectionList.forEach(ele => {
        var e = ele.substr(0, 4);
        if ($('#' + e + '_name').val() != '') { //if Section name ="" then skip writing data
            List.forEach(ee => {
                Sections[e + ee] = $('#' + e + ee).val()
            })
        }
    });

    var Section_ref = ref(db, '/' + school_name + school_city + '/Sections');

    set(Section_ref, Sections).then(console.log("Data Saved"));

    var Principal = {
        Post:"Principal",
        Name: $('#principal_name').val(),
        Email: $('#principal_email').val(),
        Password:hashCode($('#principal_name').val()),
        UserID:"Principal",
        Supervises:"Vice Principal, All Section Incharges"
    }

    var Vice_Principal = {
        Post:"Vice Principal",
        Name: $('#vice_principal_name').val(),
        Email: $('#vice_principal_email').val(),
        Password:hashCode($('#vice_principal_name').val()),
        UserID:"Vice Principal",
        Supervises:"All Supervisors"
    }

    var Manpower_Principal_ref = ref(db, '/' + school_name + school_city + '/Manpower/Principal')
    var Manpower_Vice_Principal_ref = ref(db, '/' + school_name + school_city + '/Manpower/Vice Principal')

    set(Manpower_Principal_ref, Principal).then(console.log("Data Saved"));
    set(Manpower_Vice_Principal_ref, Vice_Principal).then(next);
});

function next(){window.location="./facilities.html" 
}