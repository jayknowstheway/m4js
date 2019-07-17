// trackFunctionsCollection
// DESCRIPTION: Affects Track behavior such as arm, get track, and reacts to track changes.
// Note: Quantization may be set based on Track selection.
// INLETS: NONE
// OUTLETS: trackNumber, CurrentClip, HasClipCount
// AVAILABLE FUNCTIONS: 
autowatch = 1;
inlets = 1;
outlets=3;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;

var track = new LiveAPI("live_set tracks 0");
var trackChangeInit = 0;
var trackNumber = null;
var trackId = null;

var hasClipCount = null;
var playingSlotIndex = null;
var currentClip = Number(playingSlotIndex);

var storeClipDial = null;

// INIT FUNCTION -------------------------------------------------------------------------//
function init() {
    // set default Quant
    recordQuant(4);
        track.set ('solo', 0);
log('init function');
}

init();

// On Track Change
function onTrackChange(trackNoInlet) {
    disarm();
    trackNumber = trackNoInlet;
    track = new LiveAPI("live_set tracks " + trackNumber);
    arm();
    trackChangeInit = 0;
    getPlayingSlot();
    //getHasClipCount();
    outlet(0, trackNumber);
}

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//
// Mute
function mute() {
    if (track)
        track.set ('mute', 1);
}

// Solo
function solo() {
    if (track) {
	if (track.get('solo') == 0){
		 track.set ('solo', 1);
		} else {
        track.set ('solo', 0);
	log("Soloed Track:", track);
	}
	}
}

// Arm
function arm() {
    if (!track)
        return;
    if (track.get ('can_be_armed'))
        track.set ('arm', 1);
    log('trackFunctions Track Armed!', trackNumber);
}

// Disarm
function disarm() {
    if (!track)
        return;
    if (track.get ('can_be_armed'))
        track.set ('arm', 0);
    log('trackFunctions Track Disarmed!', trackNumber);
}

// Volume
function setVolume(volume) {
    var vol = new LiveAPI (callback, 'live_set view selected_track mixer_device volume');
    if (!vol)
        return;
    if (vol.get ('is_enabled'))
        vol.set ('value', volume);
}

// Sends
function setSend(dial, val) {
    var param = new LiveAPI (callback, 'live_set view selected_track mixer_device sends ' + dial);
    if (!param)
        return;
    param.set ('value', val);
}

// GET INFO FUNCTIONS --------------------------------------------------------------------//	
// Get Playing Clip
function getPlayingSlot() {
    playingSlotIndex = track.get('playing_slot_index');
    	log("trackFunctions - Playing Clip", playingSlotIndex);
	if (trackChangeInit == 0) {
		trackChangeInit = 1;
	currentClip = playingSlotIndex;
	}
    log('playing_slot_index',currentClip);
    outlet(1, currentClip);
}

// Get Clip Count
function getHasClipCount() {
	hasClipCount = 0;
	// ALL Track Clip Slots	
	var clipSlotCount = track.getcount("clip_slots");
	var clipSlot = new LiveAPI();
	// GET NUMBER OF CLIPS THAT EXIST
	for (var j=0 ; j<clipSlotCount ; j++) {
		var clip_slot_path = track.path.replace(/['"]+/g, '') + " clip_slots "+j; //'
		//var clip_slot_path = new LiveAPI('live_set tracks ' + trackNumber + " clip_slots " + j);
		clipSlot.path = clip_slot_path;
		var hasClip = parseInt(clipSlot.get("has_clip"));
		if (hasClip==1) {
			var clip_path = clip_slot_path + " clip";
			var clip = new LiveAPI(null, clip_path);
			hasClipCount = hasClipCount+1;	
		}
	}
	outlet(2, hasClipCount);
	log("trackF - ClipCount", hasClipCount, "- Last:", clip_path);
}


// QUANTIZATION ------------------------------------------------------------------------//
function recordQuant(quantAmount) {
    switch (quantAmount) {
        case 0:
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 0);
            break;
        case 1:
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 1);
            break;
        case 2:
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 2);
            break;
        case 3:
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 3);
            break;
        case 4:
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 5);
            break;
        case 5:
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 8);
            break;
    }
    log('Track Functions - Record Quantization:', quantAmount);
}


// NOTES --------------------------------------------------------------------------------//

// LOGGING -------------------------------------------------------------------------------//
function log() {
	if (logEnabled == 1) {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}
}
console = {log: log}
log("__________________________________________________");

// CALLBACK -----------------------------------------------------------------------------//
function callback(){}

// END OF DOC ---------------------------------------------------------------------------//
