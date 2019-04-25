// Set Functions
// DESCRIPTION: Global functions such as play, stop, metronome, and track selection.
// INLETS: (Max) Watch for track change bang
// OUTLETS: selectedTrackObject
// AVAILABLE FUNCTIONS: stop, play, sessionRecord, getTrackCount
autowatch = 1;
inlets = 1;
outlets = 1;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;

var trackNumber = null;
var sessionRecordStatus = 0;
var currentBPM = 0;

// INIT FUNCTION -------------------------------------------------------------------------//
// Set Track Number (trackid from Max or manual track number)
function setTrackNumber(id, trackNoInlet) {
    if (arguments.length == 2) {
        var api = new LiveAPI();
        api.id = Number(trackNoInlet);
log('api.id', api.id);
        var pathParts = api.unquotedpath.split(' ');
        trackNumber = pathParts[2];
        // log('selected track chosen!', trackNumber);
    } else if (arguments.length == 1) {
        trackNumber = id;
        //log('manual track chosen!', trackNumber);
    }
    // Outlet trackNumber
    log('-------setFunctions trackNumber', trackNumber);
    outlet(0, trackNumber);
}

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//
// Start
function play(enable) {
    var liveSet = new LiveAPI("live_set");
    liveSet.call("start_playing");
}

// Stop
function stop(enable) {
    var liveSet = new LiveAPI("live_set");
    liveSet.call("stop_playing");
}

// Session Record
function sessionRecord(enable) {
    var globalSet = new LiveAPI("live_set");
    if (sessionRecordStatus == 0) {
        globalSet.set('session_record', 1);
        sessionRecordStatus = 1;
    } else {
        globalSet.set('session_record', 0);
        sessionRecordStatus = 0;
    }
}

// Get BPM
function getBPM(BPMButton) {
    var liveSet = new LiveAPI("live_set");
    currentBPM = Math.round(liveSet.get("tempo"));
    liveSet.set('tempo', currentBPM);
    log(currentBPM);
    switch (BPMButton) {
        case 0:
            liveSet.set('tempo', currentBPM-1);
            break;
        case 1:
            liveSet.set('tempo', currentBPM+1);
            break;
        case 2:
            liveSet.set('tempo', currentBPM-10);
            break;
        case 3:
            liveSet.set('tempo', currentBPM+10);
            break;
    }
}

// GET INFO FUNCTIONS --------------------------------------------------------------------//
// Get Track Count
function getTrackCount() {
    var live_set_path = "live_set";
    var live_set = new LiveAPI(null, live_set_path);
    var trackCount = live_set.getcount("tracks");
    for (var i = 0; i < trackCount; i++) {
        var track_path = live_set_path + " tracks " + i;
        var track = new LiveAPI(track_path);
    }
    log("Get Track Count", trackCount);
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

// CALLBACK ------------------------------------------------------------------------//
function callback() {}

// NOTES --------------------------------------------------------------------------------//
// END OF DOC ---------------------------------------------------------------------------//
