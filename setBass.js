//
// paramGetSet
autowatch = 1;
inlets = 2;
outlets = 2;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;


var trackNumber = null;
var selectedDevice = 0;
var paramNum = 1;



var maxKnobValue = 127;

function slider(knob) {
    /*
    var arrayPosition = knob/(maxKnobValue)*(arrayPoints.length-1); // sets the array range
    var rangeDivision = maxKnobValue/arrayPoints.length;
    var arrayMin = Math.floor(arrayPosition);
    var arrayMax = Math.ceil(arrayPosition);
    var newArray = arrayPoints.slice(arrayMin, arrayMax+1);
*/
    var arrayPoints = [
        [0, 100, 20],
        [127, 20, 70],
        [1, 25, 63]
    ];
    var currentPosition = [];
    var input;
    var idx;
    var frac;
    var output;

    var combined = [];
    var arrayIndex = [];
    for (var i = 0; i < arrayPoints.length; i++) {
        for (var j = 0; j < arrayPoints[i].length; j++) {
            if (!combined[j]) {
                combined[j] = new Array;
            }
            combined[j].push(arrayPoints[i][j]);
        }
    }
    // new arrays are created for each index
    for (i = 0; i < combined.length; i++) {
        var bigValues = combined[i];
        input = knob / maxKnobValue;
        idx = Math.floor(input * (bigValues.length - 1));
        frac = (input - (idx) / (bigValues.length - 1)) * (bigValues.length - 1);
        if (frac == 0) {
            /* no need to calculate */
            output = bigValues[idx];
        } else {
            output = bigValues[idx] + (bigValues[idx + 1] - bigValues[idx]) * frac;
        };
        currentPosition = output;
//        log('currentPosition', i, combined[i], output);
	var secondDevice = new LiveAPI('live_set view selected_track devices 1 parameters ' + (i+1));
	secondDevice.set('value', output);
	
    }
    outlet(1, currentPosition);
}


// init functions
// changes track number
function setDrumTrackNo(midiNote) {
    if (midiNote > 119) {
        switch (midiNote) {
            case 120:
                selectedDevice = 1;
                break;
            case 121:
                selectedDevice = 1;
                break;
            case 122:
                selectedDevice = 2;
                break;
            case 123:
                selectedDevice = 3;
                break;
            case 124:
                selectedDevice = 4;
                break;
            case 125:
                selectedDevice = 5;
                break;
            case 126:
                selectedDevice = 6;
                break;
            case 127:
                selectedDevice = 7;
                break;
        }
        log('Selected Track', trackNumber);

        if (trackNoInlet != trackNumber) {
            trackNumber = trackNoInlet;
            if (trackNumber == null) {
                track = new LiveAPI("live_set view selected_track");
                var selectedTrack = track.path;
                trackNumber = Number(track.unquotedpath.split(' ')[2]);
            }
            log('trackNumber', trackNumber);
            for (i = 0; i < 10; i++) {
                getParameterValue(i);
            }
        }
    }
}


function getParameterValue(paramNum) {
    var p = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + paramNum);
    log('Parameter', paramNum, p.get('name'), p.get('value'));
}



function setDrum(dial, val) {
    switch (true) {
        case (dial < 9):
            selectedDevice = 1;
            log('dial less than 9', selectedDevice);
            break;
        case (dial < 17):
            selectedDevice = 1;
            log('dial less than 17', selectedDevice);
            break;
        case (dial < 25):
            selectedDevice = 2;
            break;
        case (dial < 33):
            selectedDevice = 3;
            break;
        case (dial < 41):
            selectedDevice = 4;
            break;
        case (dial < 49):
            selectedDevice = 5;
            break;
        case (dial < 57):
            selectedDevice = 6;
            break;
        case (dial < 65):
            selectedDevice = 7;
            break;
    }
    liveSet = new LiveAPI(callback, 'live_set view selected_track devices ' + selectedDevice + ' parameters ' + Number(dial));
    liveSet.set('value', val);
    log('dial and val', trackNumber, liveSet.get('name'), Number(dial), val);
}

// LOGGING -------------------------------------------------------------------------------//
function log() {
    if (logEnabled == 1) {
        for (var i = 0, len = arguments.length; i < len; i++) {
            var message = arguments[i];
            if (message && message.toString) {
                var s = message.toString();
                if (s.indexOf("[object ") >= 0) {
                    s = JSON.stringify(message);
                }
                post(s);
            } else if (message === null) {
                post("<null>");
            } else {
                post(message);
            }
        }
        post("\n");
    }
}
console = {
    log: log
};
log("__________________________________________________");


// DUMMY CALLBACK ------------------------------------------------------------------------//
function callback() {}

// NOTES --------------------------------------------------------------------------------//
// END OF DOC ---------------------------------------------------------------------------//
