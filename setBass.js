//
// paramGetSet
autowatch = 1;
inlets = 2;
outlets = 2;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 1;


var trackNumber = null;
track = new LiveAPI("live_set tracks 4");
trackNumber = Number(track.unquotedpath.split(' ')[2]);
var currentClip = null;
var selectedDevice = 0;
var paramNum = 1;

var rackChain = 0;
var rackDevice = 0;
var maxKnobValue = 127;
var interpolateArray;

var memstr;
var mem = new Object();
var UI = new Object();
var UIMidi = new Object();
var p = "/Users/jwalker/Documents/Max\ 8/Max\ for\ Live\ Devices/JS-BUILDER\ Project/code/params.json";


// init functions //////////////////////////////
function onClipChange(playingSlotIndex) {
    currentClip = playingSlotIndex;
    read();
}

//////////////////////////////////////////////

// INTERPOLATOR
// Note: This only works for arrays like this [0,1,2],[2,3,4]
function slider(knob) {

//    log('arrayPoints', arrayPoints[0][1]);
    var currentPosition = [];
    var input;
    var idx;
    var frac;
    var output;

    var combined = [];
    var arrayIndex = [];
    var arrayPoints = [];

    for (var i = 0; i < interpolateArray.length; i++) {
	arrayPoints.push(interpolateArray[i][1]);
    }
    for ( i = 0; i < arrayPoints.length; i++) {
        for (var j = 0; j < arrayPoints[i].length; j++) {
            if (!combined[j]) {
                combined[j] = new Array;
            }
            combined[j].push(arrayPoints[i][j]);
        }
    }
    // new arrays are created for each index
    for (i = 0; i < (combined.length); i++) {
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
        currentPosition = (output);
                log('currentPosition i combined[i] output', i, combined[i], output);
        	var secondDevice = new LiveAPI('live_set tracks 4 devices 1 chains 1 devices 0 parameters ' + (i+1));
        //	log('interpolate =', secondDevice.get('name'));
        	secondDevice.set('value', output);
        //	secondDevice.get('name');

//        log('output', currentPosition);
    }
    outlet(1, currentPosition);
}


function getParameterValue(paramNum) {
    var p = new LiveAPI('live_set tracks 4 devices ' + selectedDevice + ' parameters ' + paramNum);
    log('Parameter', paramNum, p.get('name'), p.get('value'));
}


var numChain = 0;

function setDrum(dial, val) {
    switch (true) {
        case (dial < 9):
            numChain = 0;
            rackChain = 0;
            rackDevice = 0;
            break;
        case (dial < 17):
            numChain = 1;
            rackChain = 1;
            rackDevice = 0;
            break;
        case (dial < 25):
            numChain = 2;
            rackChain = 0;
            rackDevice = 2;
            break;
        case (dial < 33):
            numChain = 3;
            rackChain = 0;
            rackDevice = 3;
            break;
        case (dial < 41):
            numChain = 4;
            rackChain = 1;
            rackDevice = 0;
            break;
        case (dial < 49):
            numChain = 5;
            rackChain = 1;
            rackDevice = 1;
            break;
        case (dial < 57):
            numChain = 6;
            rackChain = 1;
            rackDevice = 2;
            break;
        case (dial < 65):
            numChain = 7;
            rackChain = 1;
            rackDevice = 3;
            break;
    }
    liveSet = new LiveAPI('live_set tracks 4 devices 1 chains ' + rackChain + ' devices ' + rackDevice + ' parameters ' + Number((dial) - (8 * numChain)));
    liveSet.set('value', val);
    log('dial and val', liveSet.get('name'), Number(dial), val);
}

/////////////////////////////////////////////////
//JSON READ

function read() {
    var objKey = "PARAMS";
    memstr = "";
    data = "";
    maxchars = 8000;
    path = p;
    var f = new File(path, "read");
    f.open();
    if (f.isopen) {
        while (f.position < f.eof) {
            memstr += f.readstring(maxchars);
        }
        f.close();
    } else {
        post("Error\n");
    }
    var UIObject = JSON.parse(memstr);
    if (objKey == null) {
        objKey = "PARAMS";
    }
    UI = UIObject[objKey];
    interpolateArray = UI[trackNumber][currentClip];
    log('read trackNumber currentClip', trackNumber, currentClip);
    log('read, interpolateArray', interpolateArray, interpolateArray.length);
    for (i = 0; i < interpolateArray.length; i++) {
        log('target arrays:', interpolateArray[i], interpolateArray[i].length, '\n');
    }
    //    UI = eval("(" + memstr + ")"); //much less secure, but could work
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
