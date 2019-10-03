function Stopwatch(elem) {
    var time = 0;
    var interval;
    var offset;
    var tableSize = 1;
    var table = document.getElementById("history");
    var startTime;
    var currLat = 'Undefined';
    var currLon = 'Undefined';
    

    //function that updates the timer text
    function update() {
        if (this.isOn) {
            time += delta();
        }
        var formattedTime = timeFormatter(time);
        elem.textContent = formattedTime;
    }
    //function that returns that amount of time elapsed
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
            startTime = time;
            
            var d = new Date();
            var timezone = d.getTimezoneOffset();

            if (navigator.onLine) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    updateTableStart(position.coords.latitude, position.coords.longitude, formattedTime, timezone, tableSize)
                    tableSize++;
                  });
                console.log('yes');
            } else {
                updateTableStart(currLat, currLon, formattedTime, timezone, tableSize)
                tableSize++;
                console.log('no');
            }
            
              
            //populateStorage();

            
        }
    };
    this.stop = function() {
        if (this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;

            var formattedTime = timeFormatter(time);
            var elapsed_in_sec = (time - startTime) / 1000;

            var d = new Date();
            var timezone = d.getTimezoneOffset();

            if (navigator.onLine) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    updateTableEnd(position.coords.latitude, position.coords.longitude, formattedTime, elapsed_in_sec, timezone, tableSize);
                  }, showError);
            } else {
                updateTableEnd(currLat, currLon, formattedTime, elapsed_in_sec, timezone, tableSize);
            }

            
            //populateStorage();
        }
    };
    this.reset = function() {
        if (!this.isOn) {
            time = 0;
            update();
            
            while (tableSize > 1) {
                table.deleteRow(tableSize-1);
                tableSize -= 1;
            }
            //populateStorage();
        }
        
    };
};

function populateStorage() {
    window.localStorage.setItem('history', JSON.stringify(document.getElementById('history').value));
  }

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateLocation);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
function updateLocation(position) {
    currLat = position.coords.latitude;
    currLon = position.coords.longitude;
}

function updateTableStart(lat, lon, formattedTime, timezone, tableSize) {
    var new_row = "Time: " + formattedTime + " / Lat: " +  lat + " / Lon: " +  lon + " / Timezone: " + timezone;

    //var table = document.getElementById("history");
    var row = table.insertRow(tableSize);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = new_row;
    //tableSize++;
}

function updateTableEnd(lat, lon, formattedTime, elapsed_in_sec,timezone, tableSize) {
    var end_res = " Time: " + formattedTime + " / Lat: " +  lat + " / Lon: " +  lon + " / Time Elapsed: " + elapsed_in_sec + " sec" + " / Timezone: " + timezone;

    var table = document.getElementById("history");
    var row = table.rows[tableSize-1];
    var cell2 = row.insertCell(1);
    cell2.innerHTML = end_res;
}