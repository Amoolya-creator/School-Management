hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

// make page template according to auth user

var name =$("#user").val()
var pwd =$("#password").val()

//Get snapshot of manpower



