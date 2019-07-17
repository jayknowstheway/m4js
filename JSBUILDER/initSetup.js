// init Setup Functions
// DESCRIPTION: Loads any cpu intensive functions so functionality is quick later.
// INLETS: Loadbang
// OUTLETS: Track and Clip Count Variable 
// AVAILABLE FUNCTIONS: Track Count
autowatch = 1;
inlets = 1;
outlets=1;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var track = null;
var trackCount = null;
var trackChangeInit = 0;
var hasClipCount = null;
var playingClipIndex = null;
var currentClip = Number(playingClipIndex);
var storeClipDial = null;
var trackNumber = null;
var trackId = null;

// INIT FUNCTION -------------------------------------------------------------------------//
function bang() {
	onChange();
}

function onChange() {
	log("--------CHANGE----------");
	getTrackCount();
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
// Get Track Count
function getTrackCount() {
	var live_set_path = "live_set";
	var live_set = new LiveAPI(null, live_set_path);
	trackCount = live_set.getcount("tracks");
	log("trackCount", trackCount);
	getHasClipCount();

}

function getHasClipCount(){
	var allTracksClipNumbersObject = {};	
	for (i=0; i<trackCount; i++) {
	var track = new LiveAPI(null, "live_set tracks " + i);
	track.property = "playing_slot_index";
		hasClipCount = 0;
		//log("hasClipCount", hasClipCount);
		var clipSlotCount = track.getcount("clip_slots");
		var clipSlot = new LiveAPI();
		for (var j=0 ; j<clipSlotCount ; j++) {
			var clip_slot_path = track.path.replace(/['"]+/g, '')+" clip_slots "+j; //'
			clipSlot.path = clip_slot_path;
			var hasClip = parseInt(clipSlot.get("has_clip"));
			if (hasClip==1) {
				var clip_path = clip_slot_path + " clip";
				var clip = new LiveAPI(null, clip_path);
				hasClipCount = hasClipCount+1;	
			}
		}
//		outlet(2, hasClipCount);
//		log("ClipCount", hasClipCount, "- Last Clip:", clip_path);
		allTracksClipNumbersObject[i] = hasClipCount;
	}
	var jsonStringOutput = JSON.stringify(allTracksClipNumbersObject)
	var jsonOutput = jsonStringOutput;
	outlet(0, jsonOutput);
	log("All Tracks Clip Numbers Object", allTracksClipNumbersObject);
	log("JsonOutput:", jsonStringOutput);
}


