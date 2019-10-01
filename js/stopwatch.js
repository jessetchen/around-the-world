function Stopwatch(elem) {
    var time = 0;
    var interval;
    var offset;
    var tableSize = 1;
    var table = document.getElementById("history");

    function update() {
        if (this.isOn) {
            time += delta();
        }
        var formattedTime = timeFormatter(time);
        elem.textContent = formattedTime;
    }
    function delta() {
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    }
    function timeFormatter(timeInMilliseconds) {
        var time = new Date(timeInMilliseconds);
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();
        var milliseconds = time.getMilliseconds().toString();

        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }

        if (seconds.length < 2) {
            seconds = '0' + seconds;
        }

        while (milliseconds.length < 3) {
            milliseconds = '0' + milliseconds;
        }

        return minutes + ' : ' + seconds + ' . ' + milliseconds;
    }

    this.isOn = false;
    this.start = function() {
        if (!this.isOn) {
            interval = setInterval(update.bind(this), 10);
            offset = Date.now();
            this.isOn = true;

            var formattedTime = timeFormatter(time);

            navigator.geolocation.getCurrentPosition(function(position) {
                var new_row = formattedTime + " " +  position.coords.latitude + " " +  position.coords.longitude;

                //var table = document.getElementById("history");
                var row = table.insertRow(tableSize);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = new_row;
                tableSize++;
              });

            
        }
    };
    this.stop = function() {
        if (this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;

            var formattedTime = timeFormatter(time);

            navigator.geolocation.getCurrentPosition(function(position) {
                var end_time = formattedTime + " " +  position.coords.latitude + " " +  position.coords.longitude;

                var table = document.getElementById("history");
                var row = table.rows[tableSize-1];
                var cell2 = row.insertCell(1);
                cell2.innerHTML = end_time;
              });
        }
    };
    this.reset = function() {
        if (!this.isOn) {
            time = 0;
            update();
            
            while (tableSize > 1) {
                table.deleteRow(tableSize-1);
                tableSize -= 1;
                console.log(tableSize);
            }
        }
        
    };
};

var watch = new Stopwatch();