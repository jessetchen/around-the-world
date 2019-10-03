//get the html elements and store them in variables
var timer = document.getElementById('timer');
var toggle = document.getElementById('toggle');
var reset = document.getElementById('reset');
var table = document.getElementById("history");

//create a new stopwatch
var watch = new Stopwatch(timer);


//add functionality to toggle button
//if the watch is on, stop the watch, otherwise start it
toggle.addEventListener('click', function() {
    if (watch.isOn) {
        watch.stop();
        toggle.textContent = "Start";
    } else {
        watch.start();
        toggle.textContent = "Stop";
    }
});

//call watch.reset() when the reset button is clickec
reset.addEventListener('click', function() {
    watch.reset();
});