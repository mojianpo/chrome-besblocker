
function timer() {
    var a = new Date().getTime();
    var j = "Time: <strong>" + a + "</strong>";
    document.getElementById("blockedtimeleft").innerHTML = j
}
document.addEventListener("DOMContentLoaded", timer);
