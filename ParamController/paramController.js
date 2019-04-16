// paramController
autowatch = 1;
inlets = 1;
outlets = 1;

// GLOBAL VARIABLES ----------------------------------------------------------------------//
var logEnabled = 0;

var params = null;
var paramsCount = null;
var isReady = false;

var trackNumber = null;

var selectedDevice = 0;

// INIT FUNCTIONS ------------------------------------------------------------------------//
function onTrackChange (trackNoInlet) {
    trackNumber = trackNoInlet;
}

function selectDeviceNumber (selectedDeviceNumber) {
    selectedDevice = selectedDeviceNumber;
}

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//

// Get Num Parameters
function getNumParams() {
    //    if (params == null) {
    paramsCount = new LiveAPI();
    //        params = new Array(paramsTotal);
    //        for (var i = 0; i < paramsTotal; i++)
    //            params[i] = new LiveAPI();
    //    }
    paramsCount.path = ['live_set', 'track', trackNumber, 'devices', selectedDevice];
    numOfParams = paramsCount.getcount('parameters');
    log("Device Parameters:", numOfParams);
    // Call getParamValues
    //getParamValues();
}

function setDial(dial, val) {
    var param = getParameter(dial);
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

function getParameter(paramNum) {
    if (params == null) {
        paramsCount = new LiveAPI();
        params = new Array(8);
        for (var i = 0; i < 8; i++)
            params[i] = new LiveAPI();
    }
    // Check if parameter is available
    paramsCount.path = ['live_set', 'view', 'selected_track', 'devices', '0'];
    var size = paramsCount.getcount('parameters');
    if (paramNum >= size)
        return null;
    var p = params[paramNum - 1];
    p.path = ['live_set', 'view', 'selected_track', 'devices', '0', 'parameters', paramNum];
    return p;
}

/*function printProperties (o)
{
    for (x in o)
        post ('\n' + x + ": " + o[x]);
	}*/


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
console = {log: log};
log("__________________________________________________");

// CALLBACK -----------------------------------------------------------------------------//
function callback() {}

// NOTES --------------------------------------------------------------------------------//
// END OF DOC ---------------------------------------------------------------------------//
