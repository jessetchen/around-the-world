var timer = document.getElementById('timer');
var toggle = document.getElementById('toggle');
var reset = document.getElementById('reset');

var watch = new Stopwatch(timer);


toggle.addEventListener('click', function() {
    if (watch.isOn) {
        watch.stop();
        toggle.textContent = "Start";
    } else {
        watch.start();
        toggle.textContent = "Stop";
    }
});

reset.addEventListener('click', function() {
    watch.reset();
});
  