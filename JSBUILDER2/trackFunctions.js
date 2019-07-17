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


// QUANTIZATION ------------------------------------------------------------------------//
function recordQuant(quantAmount) {
    switch (quantAmount) {
        case 90: // RECORD QUANT -- shift ctrl option `
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 0);
    log('setFunctions - Record Quantization:', quantAmount);
            break;
        case 91: // RECORD QUANT -- shift ctrl option 1
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 1);
    log('setFunctions - Record Quantization:', quantAmount);
            break;
        case 92: // RECORD QUANT -- shift ctrl option 2
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 2);
    log('setFunctions - Record Quantization:', quantAmount);
            break;
        case 93: // RECORD QUANT -- shift ctrl option 3
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 3);
    log('setFunctions - Record Quantization:', quantAmount);
            break;
        case 94: // RECORD QUANT -- shift ctrl option 4
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 5);
    log('setFunctions - Record Quantization:', quantAmount);
            break;
        case 95: // RECORD QUANT -- shift ctrl option 5
            var liveSet = new LiveAPI("live_set");
            liveSet.set("midi_recording_quantization", 8);
    log('setFunctions - Record Quantization:', quantAmount);
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
