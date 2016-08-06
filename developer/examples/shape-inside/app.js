var rangeUpdate = function(name, value) {
    document.getElementById("main").style.overflow = "hidden";
    document.getElementById("_" + name).innerText = value;
    var screenInfo = jRound.screen;
    switch (name) {
        case "deviceRadius":
            screenInfo.radius[0] = screenInfo.width * parseInt(value) / 100;
            screenInfo.radius[1] = screenInfo.height * parseInt(value) / 100;
            document.getElementById("cont").style.borderRadius = value + "%";
            break;
        case "screenWidth":
            screenInfo.width = parseInt(value);
            screenInfo.radius[0] = screenInfo.width * parseInt(document.getElementById("deviceRadius").value) / 100;
            screenInfo.radius[1] = screenInfo.height * parseInt(document.getElementById("deviceRadius").value) / 100;
            document.getElementById("cont").style.width = value + "px";
            break;
        case "screenHeight":
            screenInfo.height = parseInt(value);
            screenInfo.radius[0] = screenInfo.width * parseInt(document.getElementById("deviceRadius").value) / 100;
            screenInfo.radius[1] = screenInfo.height * parseInt(document.getElementById("deviceRadius").value) / 100;
            document.getElementById("cont").style.height = value + "px";
            break;
        case "boxWidth":
            document.getElementById("main").style.width = parseInt(value);
            break;
        case "boxHeight":
            document.getElementById("main").style.height = parseInt(value);
            break;
        case "boxTop":
            document.getElementById("main").style.top = parseInt(value);
            break;
        case "boxLeft":
            document.getElementById("main").style.left = parseInt(value);
            break;
    }
    // update a polygon points to determine shape-outside elements' shape
    jRound.initShape();
}

window.onload = function() {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", function() {
            rangeUpdate(this.id, this.value);
        });
    }
}