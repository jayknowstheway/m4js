//
// paramGetSet
autowatch = 1;
inlets = 1;
outlets = 1;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 0;

var track = null;
var trackNumber = 0;
var trackPath = null;
var trackId = null;
var trackChangeInit = 0;

var devicePath = null;
var selectedDevice = 0;
var device = new LiveAPI("live_set tracks " + trackNumber + " devices " + selectedDevice);

var param = null;
var chosenParam = null;
var paramObject = [];

var params = null;
var paramCount = null;
var paramsTotal = 64;

var currentClip = null;
var playingSlotIndexOld = null;

var numOfParams = null;
var paramStr = "";
var clipName = "";
var arrayOfParamValues = "";
var arrayOfParamValuesLength = arrayOfParamValues.length;

var bank = 0;

// INIT FUNCTIONS ------------------------------------------------------------------------//
function onTrackChange(trackNoInlet) {
	trackChangeInit = 0;
    log("\n\n\n\n--------deviceFunctions: onTrackChange - Inlet=trackNoInlet", trackNoInlet);
    // trackNumber from trackFunctions
    trackNumber = trackNoInlet;
    if (trackNumber == "bang") {
	/*
        track = new LiveAPI("live_set view selected_track");
        var selectedTrack = track.path;
        trackNumber = Number(track.unquotedpath.split(' ')[2]);
*/
trackNumber = 0;
    }
    log('-deviceFunctions: onTrackChange - trackNumber', trackNumber);
    // Track info
    track = new LiveAPI("live_set tracks " + trackNumber);
    trackId = Number(track.id);
    trackPath = track.path;
    // selectedDevice
    device = new LiveAPI("live_set tracks " + trackNumber + " devices " + selectedDevice);
    devicePath = device.path;
    log("-deviceFunctions: onTrackChange - trackPath:", trackPath, "trackId:", trackId, "devicePath", devicePath);
    // Actions
    getPlayingSlot();
}

function onClipFire (firedSlotIndex) {
	if (firedSlotIndex != -1 && firedSlotIndex != null){
    currentClip = firedSlotIndex;
    log("-deviceFunctions: onClipFire, Inlet = firedSlotIndex", firedSlotIndex, "currentClip-", currentClip);
    // Actions, only if it's a different clip
        getClipName();
} else {
//	log('-deviceFunctions: onClipFire, Inlet = firedSlotIndex - FIRED SLOT (CURRENT CLIP) IS LESS THAN -1', currentClip);
}
}

function onClipChange(playingSlotIndex) {
    // playingSlotIndex from clipFunctions
//getClipName();
    if (playingSlotIndexOld != playingSlotIndex && clipName.constructor.toString().indexOf("Array") != -1) {
        //getNumParams();
currentClip = playingSlotIndex;
	// create if statement for params not present
	setParamValues();
log('-deviceFunctions: onClipChange - Inlet = playingSlotIndex', playingSlotIndex);
        playingSlotIndexOld = playingSlotIndex;
}
}

function onParamChange(chosenParam) {
    log("-deviceFunctions: onParamChange- param", param);
    param = new LiveAPI("live_set tracks " + trackNumber + " devices " + selectedDevice + " parameters " + chosenParam);
}

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//
// getPlaingSlot
function getPlayingSlot() {
	var track = new LiveAPI("live_set tracks " + trackNumber);
    playingSlotIndex = track.get('playing_slot_index');
    	log("-deviceFunctions - playingSlotIndex", playingSlotIndex);
	if (trackChangeInit == 0) {
		trackChangeInit = 1;
	currentClip = playingSlotIndex;
	}
    log('-deviceFunctions: getPlayingSlot - currentClip',currentClip);
getClipName();
}

// Get Clip Name
function getClipName() {
var liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + ' clip');
log("-deviceFunctions: getClipName - liveSet.path:", liveSet.path);
if (liveSet.path != "") {      
 clipName = liveSet.get('name');
log('-deviceFunctions: getClipName - clipName:', clipName);
    arrayOfParamValues = clipName.toString().split(" ");
log('-deviceFunctions: getClipName - arrayOfParamValues:', arrayOfParamValues, 'arrayOfParamValues.length:', arrayOfParamValues.length);
//    log("GET CLIP NAME - clipname:", clipName);
}
}

// GET PARAM VALUES ---------------------------------//
// Get Num Parameters
function getNumParams() {
    numOfParams = device.getcount('parameters');
    log("-deviceFunctions: getNumParams - numOfParams:", numOfParams);
    getParamValues();
}

// Get Param Values
// store in paramObject (Array)
// MAY INCLUDE JSON
function getParamValues() {
    var chosenParam = 0;
    var paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + chosenParam);
    //paramStr = "";
    var paramValue = null;
    for (chosenParam = 0; chosenParam < numOfParams; chosenParam++) {
        paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + chosenParam);
        paramValue = paramPath.get('value');
        //paramStr += paramValue + " ";
        paramObject[chosenParam] = paramValue;
    }
    log("-deviceFunctions: getParamValues - paramObject:", paramObject);  
    //log("ParamValues(paramStr):", paramStr);
}

// SET PARAMS ---------------------------------//
// Set Param Values based on Clip Name
function setParamValues() {
    //    if (currentClip <! 0){
     //getParamValues();
    var chosenParam = 0;
    var paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + chosenParam);
arrayOfParamValuesLength = arrayOfParamValues.length;
    // if (arrayOfParamValues.length > 0 && arrayOfParamValues[arrayOfParamValues.length - 1].length == 0) {arrayOfParamValues.pop();}
    log("-deviceFunctions: setParamValues - arrayOfParamValues", arrayOfParamValues, 'arrayOfParamValuesLength', arrayOfParamValuesLength );
    for (var i = 0; i<arrayOfParamValuesLength; i++) {
        log('i:', i, 'arrayOfParamValues', arrayOfParamValues[i]);
        if (arrayOfParamValues[i] != null && arrayOfParamValues[i] != "" && clipName != null) {
            paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + i);
            //paramValue =
            paramPath.set('value', arrayOfParamValues[i]);
            log("PARAM CHANGE", "ParameterNo:", i, "ParameterValue", arrayOfParamValues[i]);
            } else {
	log('setParamValues -- SOMETHING IS EQUAL TO NULL');
	log('setParamValues -- arrayOfParamValues[i]', arrayOfParamValues[i], 'arrayOfParamValues', arrayOfParamValues, 'clipName', clipName); 
	}
    }
}
//  else {log('Clip is less than 0, aka playingClipIndex -1');}
//}

// Get Dial
function getParameter(paramNum) {
    if (params == null) {
        paramCount = new LiveAPI();
        params = new Array(paramsTotal);
        for (var i = 0; i < paramsTotal; i++)
            params[i] = new LiveAPI();
    }
    // Check if parameter is available
    paramCount.path = ['live_set', 'view', 'selected_track', 'devices', '0'];
    var size = paramCount.getcount('parameters');
    if (paramNum >= size)
        return null;
    var p = params[paramNum - 1];
    p.path = ['live_set', 'view', 'selected_track', 'devices', '0', 'parameters', paramNum];
    return p;
}

// Set Dial
function setDial(dial, val) {
	if (trackChangeInit == 0){
		bank = 0;
		trackChangeInit = 1;
		log('bank reset to 0');
} else {
	getSelectedBank();
	dial = dial+bank;
	}

    var param = getParameter(dial);
log('setDial - Parameter #' + dial, 'bank', bank/8);
    if (param == null) {
        log('\nNo Parameter #' + dial);
        return;
    }
    // Scale from 0-127 to min-max range
    var min = parseFloat(param.get('min'));
    var max = parseFloat(param.get('max'));
    var scaled = min + ((max - min) / 127.0 * val);
    param.set('value', scaled);
}

function getSelectedBank(midiNote) {
	trackChangeInit = 1;
	if (midiNote > 119) {
		switch (midiNote) {
			case 120 : bank = 0; break;
			case 121 : bank = 1; break;
			case 122 : bank = 2; break;
			case 123 : bank = 3; break;
			case 124 : bank = 4; break;
			case 125 : bank = 5; break;
			case 126 : bank = 6; break;
			case 127 : bank = 7; break;
			case 128 : bank = 8; break;
			}
			bank = bank*8;
			log('Selected Bank', bank/8);
	}
}
// SET CLIP NAME ---------------------------------//
// Set Clip Name
function setClipName() {
    //get Param Values first!!
    getNumParams();
    log("-deviceFunctions: setClipName - check currentClip:", currentClip);
    var liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + ' clip');
    clipName = liveSet.set('name', paramObject);
    log("-deviceFunctions: setClipName - clipName:", clipName, "Clip Name changed to paramObject:", paramObject);
}

// NOTES --------------------------------------------------------------------------------//
// JSON SCRATCH --------------------------------------------------------------------------//
//
/*
function text(sometext) {
    var f;
    f = new File("text.json", "readwrite", "JSON");
    if (f.isopen) {
        f.position = f.eof;
        f.writeline(sometext);
        f.close();
    }
}


        //===================================================================================
        var paramJson = {
            chosenParam: paramValue
        };
        log('getParamValues Json', paramJson);
        text(paramJson)();
        // ==================================================================================

//
var x = document.images;
for (var i=0;i<x.length;i++)
{
  var theName = x[i].name;
  theStatus[theName] = 'normal';
}

*/

//PARAM JSON TEST
var value = null;

function paramJson() {
    getNumParams();
    var synthParams = {
        param: [value]
    };
    for (param = 0; param < numOfParams; param++) {
        var paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + param);
        value = paramPath.get('value');
        synthParams.param.push(value);
        log(synthParams);
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
function dummyCallback() {}

// END OF DOC ---------------------------------------------------------------------------//
