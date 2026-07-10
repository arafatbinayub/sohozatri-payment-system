function login(){

const username=document.getElementById("username").value.trim();
const password=document.getElementById("password").value.trim();
const msg=document.getElementById("msg");

if(username==="sohozatri" && password==="sohozatri26"){

msg.style.color="green";
msg.innerHTML="Login Successful...";

setTimeout(function(){

window.location.href="dashboard.html";

},1000);

}else{

msg.style.color="red";
msg.innerHTML="Wrong Username or Password";

}

}
