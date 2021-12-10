import {
    db
} from './main.js';
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

document.getElementById('save').addEventListener('click', () => {

    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var reff = ref(db, '/' + school_name + school_city+ '/');

    var SetUp_Data = {};
    SetUp_Data['Admin_Username'] = $('#Admin_Username').val();
    SetUp_Data['Admin_Password'] = $('#Admin_Password').val();
    SetUp_Data['Hint_Question'] = $('#Hint_Question').val();
    SetUp_Data['Hint_Answer'] = $('#Hint_Answer').val();

    SetUp_Data['School Name'] = school_name;
    SetUp_Data['School Address'] = $('#school_address').val();
    SetUp_Data['School City'] = school_city;
    SetUp_Data['School Logo'] = "";

    SetUp_Data['Principal Name'] = $('#principal_name').val();
    SetUp_Data['Principal Email'] = $('#principal_email').val();
    SetUp_Data['Vice Principal Name'] = $('#vice_principal_name').val();
    SetUp_Data['Vice Principal Email'] = $('#vice_principal_email').val();

    set(reff,{
        name:"Anu"
    })
    set(reff, {SetUp_Data}).then(console.log("Data Saved"));

    var List = ['_name', '_email', '_sections', '_students']
    var Sections = {}
    SectionList.forEach(ele => {
        var e = ele.substr(0, 4);
        List.forEach(ee => {
            Sections[e + ee] = $('#' + e + ee).val()
        })
    });

    var Section_ref = ref(db, '/' + school_name + school_city + '/Sections');

    set(Section_ref, Sections)

    window.location.assign("./facilities.html");
});