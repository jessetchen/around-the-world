//get the html elements and store them in variables
var timer = document.getElementById('timer');
var toggle = document.getElementById('toggle');
var reset = document.getElementById('reset');
var table = document.getElementById("history");

//create a new stopwatch
var watch = new Stopwatch(timer);

window.addEventListener('load', function() {
    if(!window.localStorage.getItem('history')) {
        populateStorage();
      } else {
        setObjects();
      }
})




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

//add reset functionality button
reset.addEventListener('click', function() {
    watch.reset();
});

function setObjects() {
    var history_table = window.localStorage.getItem("history");
    //var s_watch = localStorage.getItem("timer");

    document.getElementById('history').value = history_table;
    //document.getElementById('timer').value = s_watch;
}

function populateStorage() {
    window.localStorage.setItem('history', JSON.stringify(document.getElementById('history').value));
  }
  