// paramGetSet
autowatch = 1;
inlets = 1;
outlets = 1;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var params = null;
var paramsCount = null;
var paramsTotal = 64;
var currentClip = null;
var numOfParams = null;
var paramStr = "";
var clipName = "";
// INIT FUNCTIONS ------------------------------------------------------------------------//
function bang() {
	log("--------BANG----------");
}

function onTrackChange() {
	log("--------GET SET INIT----------");
	getNumParams();
	getClipName();
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
/*
// Set Dial
function setDial (dial, val) {
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
*/

// Get Num Parameters
function getNumParams () {
	    if (params == null) {
		paramsCount = new LiveAPI ();
        params = new Array (paramsTotal);
        for (var i = 0; i < paramsTotal; i++)
            params[i] = new LiveAPI ();
    }
    paramsCount.path = ['live_set', 'view', 'selected_track', 'devices', '0'];
	numOfParams = paramsCount.getcount ('parameters');
	log("GET NUM PARAMS:",numOfParams);	
	// Call getParamValues
	getParamValues();
}

// Get Param Values
function getParamValues() {
	var chosenParam = 0;
	var paramPath = new LiveAPI('live_set view selected_track devices 0 parameters ' + chosenParam);
	paramStr = "";
	var paramValue = null;
	for (chosenParam=0; chosenParam<numOfParams; chosenParam++){
		paramPath = new LiveAPI('live_set view selected_track devices 0 parameters ' + chosenParam);
		// log("Param", chosenParam, "Value", paramPath.get('value'));
		paramValue = paramPath.get('value');
		paramStr += paramValue + " ";
	}
		log("ParamValues(paramStr):", paramStr);
}

// Set Param Values from Clip Name
function setParamValues() {
	log("CLIP NAME IN FUNCTION", clipName);
	// first, Get Param Values!
	// getParamValues();
	var chosenParam = 0;
	var paramPath = new LiveAPI('live_set view selected_track devices 0 parameters ' + chosenParam);
	//	var arrayOfParamValues = [];
	// javascript to remove space and extra comma and make Array!
	var arrayOfParamValues = clipName.toString().split(" ");
	log("array of ClipName:", arrayOfParamValues);
	if (arrayOfParamValues.length > 0 && arrayOfParamValues[arrayOfParamValues.length - 1].length == 0) {
  		arrayOfParamValues.pop();
	}
	log("ARRAY", arrayOfParamValues);
	for (var i = 0; i < arrayOfParamValues.length; i++) {
		paramPath = new LiveAPI('live_set view selected_track devices 0 parameters ' + i);
		paramValue = paramPath.set('value', arrayOfParamValues[(i+1)]);
		//log("ParameterNo:", i, "ParameterValue", arrayOfParamValues[i]);
	}
/*	for (var i = 0; i <= numOfParams; i++) {
    arrayOfParamValues.push(i);
}


	for (chosenParam=0; chosenParam<numOfParams; chosenParam++){
		paramPath = new LiveAPI('live_set view selected_track devices 0 parameters ' + chosenParam);
		// log("Param", chosenParam, "Value", paramPath.get('value'));
		//javascript for each value delimited
		paramValue = paramPath.set('value');
		paramStr += paramValue + " ";
	}
		log("ParamValues: ", paramStr);
		*/
}

// Get Dial
function getParameter (paramNum) {
    if (params == null) {
		paramsCount = new LiveAPI ();
        params = new Array (paramsTotal);
        for (var i = 0; i < paramsTotal; i++)
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

// Get Clip Name
function getClipName (currentClip) {
	var liveSet = new LiveAPI (dummyCallback, 'live_set view selected_track clip_slots ' + currentClip + ' clip')
	clipName = liveSet.get('name');
	log("GET CLIP NAME - clipname:", clipName);
}

// Set Clip Name
function setClipName (currentClip) {
	//get Param Values first!!
	getNumParams();
	log("CurrentClip:",currentClip);
	var liveSet = new LiveAPI (dummyCallback, 'live_set view selected_track clip_slots ' + currentClip + ' clip')
	clipName = liveSet.set('name', paramStr);
	log("Clip Name:",clipName,"Clip Name changed to:",paramStr);
}

// DUMMY CALLBACK ------------------------------------------------------------------------//
function dummyCallback(){}

// NOTES --------------------------------------------------------------------------------//
// END OF DOC ---------------------------------------------------------------------------//