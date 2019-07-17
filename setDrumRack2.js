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
    //if (midiNote > 119) {
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
            drumRack = 40;
            break;
        case 125:
            drumRack = 41;
            break;
        case 126:
            drumRack = 42;
            break;
        case 127:
            drumRack = 43;
            break;
            // Next 8
        case 48:
            drumRack = 48;
            log('48 was logged');
            break;
        case 49:
            drumRack = 49;
            break;
        case 50:
            drumRack = 50;
            break;
        case 51:
            drumRack = 51;
            break;
        case 52:
            drumRack = 52;
            break;
        case 53:
            drumRack = 53;
            break;
        case 54:
            drumRack = 54;
            break;
        case 55:
            drumRack = 55;
            break;
        case 56:
            drumRack = 56;
            break;
        case 57:
            drumRack = 57;
            break;
        case 58:
            drumRack = 58;
            break;
    }
    // }
    log('Selected drumRack, midiNote', midiNote, 'drumRack', drumRack);
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
            drumRack = 40;
            break;
        case (dial < 49):
            bankNo = 5;
            drumRack = 41;
            break;
        case (dial < 57):
            bankNo = 6;
            drumRack = 42;
            break;
        case (dial < 65):
            bankNo = 7;
            drumRack = 43;
            break;
            // NEXT 8
        case (dial < 73):
            bankNo = 8;
            drumRack = 44;
            break;
        case (dial < 81):
            bankNo = 9;
            drumRack = 45;
            break;
        case (dial < 89):
            bankNo = 10;
            drumRack = 46;
            break;
        case (dial < 97):
            bankNo = 11;
            drumRack = 47;
            break;
        case (dial < 105):
            bankNo = 12;
            drumRack = 48;
            break;
        case (dial < 113):
            bankNo = 13;
            drumRack = 49;
            break;
        case (dial < 121):
            bankNo = 14;
            drumRack = 50;
            break;
        case (dial < 129):
            bankNo = 15;
            drumRack = 51;
            break;
        case (dial < 137):
            bankNo = 16;
            drumRack = 52;
            break;
        case (dial < 145):
            bankNo = 17;
            drumRack = 53;
            break;
        case (dial < 153):
            bankNo = 18;
            drumRack = 54;
            break;
            // LAST 3

    }
    liveSet = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' drum_pads ' + drumRack + ' chains ' + drumChain + ' devices ' + drumDevice + ' parameters ' + Number(dial - 8 * bankNo));
if(Object.keys(liveSet).length != 0){
    liveSet.set('value', val);
    log('dial and val', drumRack, liveSet.get('name'), Number(dial - 8 * (bankNo)), val);
}
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
