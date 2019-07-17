// trackFunctionsCollection
autowatch = 1;
inlets = 1;
outlets=5;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var params = null;
var paramsCount = null;
var isReady = false;
var selectedTrackObject = new LiveAPI("live_set view selected_track");
var trackChangeInit = 0;
var hasClipCount = null;
var playingClipIndex = null;
var currentClip = Number(playingClipIndex);
var storeClipDial = null;
var trackNumber = null;
var trackId = null;

// INIT FUNCTION -------------------------------------------------------------------------//
function bang() {
	log("--------BANG----------");
//	onTrackChange();
}

function onTrackChange() {
	log("--------TRACK CHANGE----------");
	trackChangeInit = 0;
	setDisarm();
	setArm();
	getSelectedTrack();
	getPlayingClip();
	getHasClipCount();
}

// LOGGING -------------------------------------------------------------------------------//
function log() {
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
console = {log: log}
log("__________________________________________________");

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//
// Stop
function stopPlaying(enable) {
var liveObject = new LiveAPI("live_set");
liveObject.call("stop_playing");
}

// Start
function startPlaying(enable) {
var liveObject = new LiveAPI("live_set");
liveObject.call("start_playing");
}

// Mute
function setMute(enable) {
    var track = new LiveAPI (callback, 'live_set view selected_track');
    if (track)
        track.set ('mute', enable);
}

// Solo
function setSolo(enable) {
    var track = new LiveAPI (callback, 'live_set view selected_track');
    if (track)
        track.set ('solo', enable);
}

// Arm
function setArm() {
    var track = new LiveAPI (callback, 'live_set view selected_track');
    if (!track)
        return;
    if (track.get ('can_be_armed'))
        track.set ('arm', 1);
}

// Disarm
function setDisarm() {
    var track = new LiveAPI (callback, 'live_set tracks ' + trackNumber);
	log('TRACK!!!', track.path);
    if (!track)
        return;
    if (track.get ('can_be_armed'))
        track.set ('arm', 0);
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

// Set Dial
function setDial(dial, val) {
    var param = getParameter (dial);
    if (param == null) {
        post ('\nNo Parameter #' + dial);
		return;
	}

	// Scale from 0-127 to min-max range
    var min = parseFloat (param.get ('min'));
    var max = parseFloat (param.get ('max'));
	var scaled = min + ((max - min) / 127.0 * val);
    param.set ('value', scaled);
}

// Select and Record Track
function selectAndRecordTrack(trackIndex) {
    var liveSet = new LiveAPI (callback, 'live_set');
    var trackCount = liveSet.getcount ('tracks')
    if (trackIndex < 1 || trackIndex > trackCount)
        return;
    trackIndex--; // Tracks are Zero based
    // Arm if possible
    var tracks = new LiveAPI (callback, '');
    for (var i = 0; i < trackCount; i++)
    {
        tracks.path = [ 'live_set', 'tracks', i];
        if (tracks.get ('can_be_armed'))
            tracks.set ('arm', i == trackIndex ? 1 : 0);
    }
    // Send out for track selection
    outlet (0, trackIndex);
}

// Fire Clip Dial
function fireClipDial(clipDial) {
	var clipDialScaled = Math.round((clipDial/127)-1);
	if (storeClipDial == clipDialScaled) {
		return;
		} else {
	log("Clip Fire KnobValue", clipDialScaled);
	storeClipDial = clipDialScaled;
	var liveSet = new LiveAPI (callback, 'live_set view selected_track clip_slots ' + clipDialScaled)
	liveSet.call("fire");
	}
}

// Fire Clip Buttons
function fireClipButtons (clipButton) {
	if (trackChangeInit == 0) {
	currentClip = Number(playingClipIndex);
	trackChangeInit = 1;
	}
	
	if (clipButton == 1) {
		currentClip = currentClip + 1;
		// log("CURRENTCLIP==1", currentClip);	
	} else if (clipButton == -1) {
		currentClip = currentClip - 1;
		// log("CURRENTCLIP==NEG1", currentClip);
	}
	
	if (currentClip > (hasClipCount-1)) {
	currentClip = 0;
	log("CURRENT>HASCLIP--", "Current Clip:", currentClip, "Has Clip:", hasClipCount);	
	} else if (currentClip < 0) {
		currentClip = (hasClipCount-1);
		// log("CURRENT < 0", currentClip, hasClipCount);
	}	

	log("Clip Fire ButtonValue", clipButton, "CurrentClip", currentClip);
//	storeClipCount = clipCountScaled;
	var liveSet = new LiveAPI (callback, 'live_set view selected_track clip_slots ' + currentClip)
	liveSet.call("fire");
//	}
}

var Delayer=new Task(delayed);
var delayValue='';
function delayed(){
	eval(delayValue);
	delayValue='';
	}
function delayThis(a,b){
	delayValue=a;
	Delayer.schedule(b);
	}
// example:
// delayThis(fireClipSlot,2500);

// GET INFO FUNCTIONS --------------------------------------------------------------------//
// Get Track Count
function getTrackCount() {
	var live_set_path = "live_set";
	var live_set = new LiveAPI(null, live_set_path);
	var trackCount= live_set.getcount("tracks");	
	for (var i=0 ; i<trackCount ; i++) {
		var track_path = live_set_path+" tracks "+i;
		var track = new LiveAPI(track_path);
		track.property = "playing_slot_index";
	}
	log("Get Track Count", trackCount);
}

// Get Selected Track (Global)
function getSelectedTrack() {
	selectedTrackObject = new LiveAPI("live_set view selected_track");
	// GET SELECTED TRACK DETAILS
	var selectedTrack = selectedTrackObject.path;
	trackNumber = Number (selectedTrackObject.unquotedpath.split (' ')[2]);
	trackId = Number(selectedTrackObject.id);
//	log("--------Get Selected Track----------");
	log("Track",trackNumber, "Id",selectedTrackObject.id);
//	log("Track Path:", selectedTrackObject.path);
	outlet(0, trackId);
	outlet(1, trackNumber);
}

// Get Playing Clip (Global)
function getPlayingClip() {
	selectedTrackObject = new LiveAPI("live_set view selected_track");
	playingClipIndex = selectedTrackObject.get("playing_slot_index");
	log("GET PLAYING CLIP -- playingClipIndex", playingClipIndex);
	outlet(3, playingClipIndex);
//	outlet(2, selectedTrack);
}	

// Get Clip Count
function getHasClipCount() {
	hasClipCount = 0;
	// GET ALL CLIP SLOTS ON THE TRACK	
	var clipSlotCount = selectedTrackObject.getcount("clip_slots");
	var clipSlot = new LiveAPI();
	// GET NUMBER OF CLIPS THAT EXIST
	for (var j=0 ; j<clipSlotCount ; j++) {
		var clip_slot_path = selectedTrackObject.path.replace(/['"]+/g, '')+" clip_slots "+j; //'
		clipSlot.path = clip_slot_path;
		var hasClip = parseInt(clipSlot.get("has_clip"));
		if (hasClip==1) {
			var clip_path = clip_slot_path + " clip";
			var clip = new LiveAPI(null, clip_path);
			hasClipCount = hasClipCount+1;	
		}
	}
	outlet(2, hasClipCount);
	log("ClipCount", hasClipCount, "- Last Clip:", clip_path);
}

// Get Parameter
function getParameter (paramNum) {
    if (params == null) {
		paramsCount = new LiveAPI ();
        params = new Array (8);
        for (var i = 0; i < 8; i++)
            params[i] = new LiveAPI ();
    }
	// Check if parameter is available
    paramsCount.path = ['live_set', 'view', 'selected_track', 'devices', '0'];
	var size = paramsCount.getcount ('parameters');
	if (paramNum >= size)
		return null;
    var p = params[paramNum - 1];
    p.path = ['live_set', 'view', 'selected_track', 'devices', '0', 'parameters', paramNum];
    return p;
}

// CALLBACK ------------------------------------------------------------------------//
function callback(){}

// NOTES --------------------------------------------------------------------------------//
// END OF DOC ---------------------------------------------------------------------------//