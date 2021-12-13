import {
    db
} from "./main.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

(function populate() {
    
    var school_name = window.localStorage.getItem("school_name")
    var school_city = window.localStorage.getItem("school_city")
    var Path ='/' + school_name + school_city+'/Manpower'

    onValue(ref(db,Path), (snap) => {
        var tt = ""
        if (snap.exists()) {
            var Manpower = snap.val()            
            for (var Individual in Manpower){
                var data =Manpower[Individual];               
                tt +=  '<div class="row form-group"><label class="col form-label">'+data.Post+'</label>\
                <label class="col form-label">'+data.Name+'</label>\                 <label class="col form-label">'+data.UserID+'</label>\
                <label class="col form-label">'+data.Password+'</label>\
                <label class="col form-label">'+data.Email+'</label>\
                <label class="col form-label">'+data.Supervises+'</label>\
                </div>'
            };
            var new_div = document.createElement('div')
            new_div.classList.add("row","form-group")
            new_div.innerHTML = tt
            $("#tab").append(new_div)
        }
    })
})();