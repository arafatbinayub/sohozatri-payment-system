const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwsehHUQEVbLUtRdw3dGkP_2Pt5u_Al5UdWnEr4GrSEnlQ36QtCSaxJ-NF23fSVFjP_Qw/exec";

function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "login",
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("admin","true");
            location.href="dashboard.html";
        } else {
            document.getElementById("msg").innerHTML="❌ Invalid Username or Password";
        }
    })
    .catch(err=>{
        alert(err);
        console.log(err);
    });

}
