//
// paramGetSet
autowatch = 1;
inlets = 2;
outlets = 1;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;

var trackNumber = 0;
var selectedDevice = 1;
var drumRack = 0;
var bankNo = 0;
var drumChain = 0;
var drumDevice = 0;
var paramNum = 1;

// init functions
// changes drumRack number
function setDrumTrackNo(midiNote) {
    if (midiNote > 119) {
        switch (midiNote) {
            case 120:
                drumRack = 36;
                break;
            case 121:
                drumRack = 37;
                break;
            case 122:
                drumRack = 38;
                break;
            case 123:
                drumRack = 39;
                break;
            case 124:
                drumRack = 42;
                break;
            case 125:
                drumRack = 44;
                break;
            case 126:
                drumRack = 46;
                break;
            case 127:
                drumRack = 51;
                break;
        }
        log('Selected drumRack', drumRack);
    }
}


function getParameterValue(paramNum) {
    var p = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' drum_pads ' + drumRack + ' chains ' + drumChain + ' devices ' + drumDevice + ' parameters ' + paramNum);
    log('Parameter', paramNum, p.get('name'), p.get('value'));
}

function setDrum(dial, val) {
    switch (true) {
    case (dial < 9):
	bankNo = 0;
        drumRack = 36;
	log('dial less than 9', drumRack);
            break;
    case (dial < 17):
	bankNo = 1;
        drumRack = 37;
		log('dial less than 17', drumRack);
            break;
    case (dial < 25):
	bankNo = 2;
            drumRack = 38;
            break;
    case (dial < 33):
	bankNo = 3;
            drumRack = 39;
            break;
    case (dial < 41):
	bankNo = 4;
            drumRack = 42;
            break;
    case (dial < 49):
	bankNo = 5;
            drumRack = 44;
            break;
    case (dial < 57):
	bankNo = 6;
            drumRack = 46;
            break;
    case (dial < 65):
	bankNo = 7;
            drumRack = 51;
            break;
    }
        liveSet = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' drum_pads ' + drumRack + ' chains ' + drumChain + ' devices ' + drumDevice + ' parameters ' + Number(dial-8*bankNo));
        liveSet.set('value', val);
        log('dial and val', drumRack, liveSet.get('name'), Number(dial-8*(bankNo)), val);
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

