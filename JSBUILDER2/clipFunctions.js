// Clip Functions
// DESCRIPTION: Clip behavior such as fire clip, clear clip notes, reacts to clip changes.
// INLET: Track Number, Current Clip
// AVAILABLE FUNCTIONS: getPlayingClip, getHasClipCount, getTrackCount
//                      fireClipDial, fireClipButtons, fireClip, stopClip
//                      getClipLength, setClipLength, getClipName
autowatch = 1;
inlets = 2;
outlets = 1;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;

var track = null;
var trackNumber = 0;
var trackChangeInit = 0;
var hasClipCount = null;
var playingClipIndex = 0;
var currentClip = Number(playingClipIndex);
var storeClipDial = null;
var clipLength = 16;
var clipName = null;

var clipMidiNotes = null;
// INIT FUNCTION -------------------------------------------------------------------------//
// onTrack Change - inlets: trackNumber, currentClip
function onTrackChange(trackNoInlet) {
    if (inlet == 0) {
        trackChangeInit = 0;
        trackNumber = trackNoInlet;
        track = new LiveAPI("live_set tracks " + trackNoInlet);
    } else if (inlet == 1) {
        currentClip = trackNoInlet;
    }
    log('clipFunctions- trackNumber', trackNumber, 'currentClip', currentClip);
    // init actions
    // getHasClipCount();
    onClipChange();
}

function onClipChange() {
    //	log("--------CLIP CHANGE----------");
    //	getPlayingClip();
    getClipLength();
    getClipName();
}

// GET FUNCTIONS ----------------------------------------------------------------------//
// Get Clip Count
function getHasClipCount() {
    hasClipCount = 0;
    var clipSlotCount = track.getcount("clip_slots");
    var clipSlot = new LiveAPI();
    // GET HAS CLIP
    for (var j = 0; j < clipSlotCount; j++) {
        var clip_slot_path = track.path.replace(/['"]+/g, '') + " clip_slots " + j; //'
        clipSlot.path = clip_slot_path;
        var hasClip = parseInt(clipSlot.get("has_clip"));
        if (hasClip == 1) {
            var clip_path = clip_slot_path + " clip";
            var clip = new LiveAPI(null, clip_path);
            hasClipCount = hasClipCount + 1;
        }
    }
    //	outlet(2, hasClipCount);
    log("clipF - ClipCount", hasClipCount, "- Last:", clip_path);
}

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//
// Fire Clip Dial
function fireClipDial(clipDial) {
    var clipDialScaled = Math.round((clipDial / 127) * hasClipCount) - 1;
    log("Clip Fire KnobValue", clipDialScaled);
    if (clipDialScaled < 0) {
        clipDialScaled = 0;
    }
    if (storeClipDial == clipDialScaled) {
        return;
    } else {
        log("Clip Fire KnobValue", clipDialScaled);
        storeClipDial = clipDialScaled;
        var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + clipDialScaled);
        liveSet.call("fire");
    }
}

/*
// Fire Clip Buttons (with hasClipCount)
function fireClipButtons(clipButton) {
    if (trackChangeInit == 0) {
        log('XXXXXXXtrackChangeInit', trackChangeInit);
        currentClip = Number(playingClipIndex);
        trackChangeInit = 1;
    }
    // BUTTONS
    if (clipButton == 1) {
        currentClip = currentClip + 1;
    } else if (clipButton == -1) {
        currentClip = currentClip - 1;
    }
    // CLIP LIMITS
    if (currentClip > (hasClipCount - 1)) {
        currentClip = 0;
        log("CURRENT>HASCLIP--", "Current Clip:", currentClip, "Has Clip:", hasClipCount);
    } else if (currentClip < 0) {
        currentClip = (hasClipCount - 1);
    }
    log("CurrentClip", currentClip);
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    liveSet.call("fire");
}
*/

// Fire Clip Buttons - first 20 tracks
function fireClipButtons(clipButton) {
    var hasClipManualNumber = 20;
    if (trackChangeInit == 0) {
        log('XXXXXXXtrackChangeInit', trackChangeInit);
        //currentClip = Number(playingClipIndex);
        if (currentClip == -2) {
            currentClip = -1;
        }
        trackChangeInit = 1;
    }
    // BUTTONS
    if (clipButton == 1) {
        currentClip = currentClip + 1;
    } else if (clipButton == -1) {
        currentClip = currentClip - 1;
    }
    // CLIP LIMITS
    if (currentClip > (hasClipManualNumber - 1)) {
        currentClip = 0;
        log("CURRENT>HASCLIP--", "Current Clip:", currentClip, "Clip Manual Number:", hasClipManualNumber);
    } else if (currentClip < 0) {
        currentClip = (hasClipManualNumber - 1);
    }
    log("CurrentClip", currentClip);
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    liveSet.call("fire");
}

// Fire clip
function fireClip() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    log("clip fired!", trackNumber, currentClip);
    liveSet.call("fire");
}

// Stop clip
function stopClip() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    log("clip stopped!", trackNumber, currentClip);
    liveSet.call("stop");
}


///////////////////////////////////////////////// CLIP MIDI LENGTH //////////////////////////
// Get Clip Length
function getClipLength() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    clipLength = liveSet.get("loop_end");
    clipLength = parseFloat(clipLength);
    log("Clip Length:", clipLength);
}

// Set Clip Length
function setClipLength(clipButton) {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    if (clipButton == 1) {
        if (clipLength < 1) {
            liveSet.set("loop_end", 1);
        }
        liveSet.set("loop_end", (clipLength) * 2);
    } else if (clipButton == -1) {
        liveSet.set("loop_end", (clipLength) / 2);
    }
    getClipLength();
    //	log("Clip Length:", clipLength);
}


var midiZoneArray = [0, 1, 2, 3, 4];
var clipZoneButtonMod = 0;


function setClipZone(clipZoneButton) {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    if (clipZoneButton < clipZoneButtonMod) {
        clipZoneButtonMod = clipZoneButton;
        liveSet.set("loop_start", (clipZoneButtonMod * 16));
        liveSet.set("loop_end", (clipZoneButtonMod * 16 + 16));
        liveSet.set("looping", 0);
        liveSet.set("loop_start", (clipZoneButtonMod * 16));
        liveSet.set("loop_end", (clipZoneButtonMod * 16 + 16));
        liveSet.set("looping", 1);
    } else {
        clipZoneButtonMod = clipZoneButton;
        liveSet.set("loop_end", (clipZoneButtonMod * 16 + 16));
        liveSet.set("loop_start", (clipZoneButtonMod * 16));
        liveSet.set("looping", 0);
        liveSet.set("loop_end", (clipZoneButtonMod * 16 + 16));
        liveSet.set("loop_start", (clipZoneButtonMod * 16));
        liveSet.set("looping", 1);
    }

}



///////////////////////////////////////////////// CLIP NAME //////////////////////////

// Get Clip Name
function getClipName() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    //liveSet.property = "loop_end";
    clipName = liveSet.get("name");
    log("Clip Name:", clipName);
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
}
log("__________________________________________________");



// CALLBACK ------------------------------------------------------------------------//
function callback() {}

// NOTES --------------------------------------------------------------------------------//
// END OF DOC ---------------------------------------------------------------------------//
