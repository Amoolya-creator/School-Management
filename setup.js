import {
    db,hashCode
} from "./main.js";
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";


document.getElementById('save').addEventListener('click', () => {
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var reff = ref(db, '/' + school_name + school_city);

    var SetUp_Data = {
        'Admin Username': $('#Admin_Username').val(),
        'Admin Password': $('#Admin_Password').val(),
        'Hint Question': $('#Hint_Question').val(),
        'Hint Answer': $('#Hint_Answer').val(),
        'School Name': school_name,
        'School Address': $('#school_address').val(),
        'School City': school_city,
        'School Logo': ""
    }

    set(reff, SetUp_Data).then(console.log("Data Saved"));

    var x = 0;
    SectionList.forEach(ele => {
        var e = ele.substr(0, 4);
        var Section_ref = ref(db, '/' + school_name + school_city + '/Manpower/Section-' + ele);
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
            set(Section_ref, Section_Incharge);
        }
    });

    var Principal = {
        Post: "Principal",
        Name: $('#principal_name').val(),
        Email: $('#principal_email').val(),
        Password: hashCode($('#principal_name').val()),
        UserID: "Principal",
        Supervises: "Vice Principal, All Section Incharges"
    }

    var Vice_Principal = {
        Post: "Vice Principal",
        Name: $('#vice_principal_name').val(),
        Email: $('#vice_principal_email').val(),
        Password: hashCode($('#vice_principal_name').val()),
        UserID: "Vice Principal",
        Supervises: "All Supervisors"
    }

    var Manpower_Principal_ref = ref(db, '/' + school_name + school_city + '/Manpower/Principal')
    var Manpower_Vice_Principal_ref = ref(db, '/' + school_name + school_city + '/Manpower/Vice Principal')

    set(Manpower_Principal_ref, Principal).then(console.log("Data Saved"));
    set(Manpower_Vice_Principal_ref, Vice_Principal).then(next);
});

function next() {
    window.location = "./facilities.html"
}