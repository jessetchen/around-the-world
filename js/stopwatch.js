function Stopwatch(elem) {
    var time = 0;
    var interval;
    var offset;
    var tableSize = 1;
    var table = document.getElementById("history");
    var startTime;
    var currLat = 'Undefined';
    var currLon = 'Undefined';

    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        if(!localStorage.getItem('latitude')) {
            populateStorage(currLat, currLon);
          } else {
            currLat = window.localStorage.getItem('latitude');
            currLon = window.localStorage.getItem('longitude');
          }
        console.log('yes');
      }
      else {
        // Too bad, no localStorage for us
        console.log('local storage unavailable');
      }
      
    

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
    //function neatly formats Date time given in miliseconds to fit stopwatch
    function timeFormatter(timeInMilliseconds) {
        var time = new Date(timeInMilliseconds);
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();
        var milliseconds = time.getMilliseconds().toString();

        //these if statements add a 0 to the front of the sections if needed
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

    //initially set isOn to false
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
                    window.localStorage.setItem('latitude', position.coords.latitude);
                    window.localStorage.setItem('longitude', position.coords.longitude);
                  });
                  
                console.log('location available');
            } else {
                
                currLat = window.localStorage.getItem('latitude');
                currLon = window.localStorage.getItem('longitude');
                updateTableStart(currLat, currLon, formattedTime, timezone, tableSize)
                tableSize++;
                console.log('location currently unavailable');
                console.log(currLat);
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
                    window.localStorage.setItem('latitude', position.coords.latitude);
                    window.localStorage.setItem('longitude', position.coords.longitude);
                  });
            } else {
                currLat = window.localStorage.getItem('latitude');
                currLon = window.localStorage.getItem('longitude');
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

function populateStorage(lat, lon) {
    window.localStorage.setItem('latitude', lat);
    window.localStorage.setItem('longitude', lon);
    setPosition();
  } 

function setPosition() {
    currLat = window.localStorage.getItem('latitude');
    currLat = window.localStorage.getItem('longitude');
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}