//
// paramGetSet
autowatch = 1;
inlets = 2;
outlets = 1;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;


var trackNumber = null;
var selectedDevice = 0;
var paramNum = 1;

// init functions
// changes track number
function setDrumTrackNo(midiNote) {
    if (midiNote > 119) {
        switch (midiNote) {
            case 120:
                trackNumber = 1;
                break;
            case 121:
                trackNumber = 2;
                break;
            case 122:
                trackNumber = 3;
                break;
            case 123:
                trackNumber = 4;
                break;
            case 124:
                trackNumber = 5;
                break;
            case 125:
                trackNumber = 6;
                break;
            case 126:
                trackNumber = 7;
                break;
            case 127:
                trackNumber = 8;
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
    var p = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + paramNum);
    log('Parameter', paramNum, p.get('name'), p.get('value'));
}



function setDrum(dial, val) {
    switch (true) {
        case (dial < 9):
        trackNumber = 1;
	log('dial less than 9', trackNumber);
            break;
        case (dial < 17):
        trackNumber = 2;
		log('dial less than 17', trackNumber);
            break;
        case (dial < 25):
            trackNumber = 3;
            break;
        case (dial < 33):
            trackNumber = 4;
            break;
        case (dial < 41):
            trackNumber = 5;
            break;
        case (dial < 49):
            trackNumber = 6;
            break;
        case (dial < 57):
            trackNumber = 7;
            break;
        case (dial < 65):
            trackNumber = 8;
            break;
    }
        liveSet = new LiveAPI(callback, 'live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + Number(dial-8*(trackNumber-1)));
        liveSet.set('value', val);
        log('dial and val', trackNumber, liveSet.get('name'), Number(dial-8*(trackNumber-1)), val);
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

