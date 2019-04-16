// TEST
// INLETS: init
// OUTLETS:
// AVAILABLE FUNCTIONS: init, bang
autowatch = 1;
inlets = 1;
outlets = 1;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var inletVar = [];

// INIT FUNCTION -------------------------------------------------------------------------//
function init(inletVariable) {
    inletVar = inletVariable;
    log("inletVar:", inletVar);
    outlet(0, inletVar);
}

function jsobject(inletVariable) {
    inletVar = inletVariable;
    log("inletVar:", inletVar);
    outlet(0, inletVar);
}

function bang() {}
// LOG ------------------------------------------------------------------------//
function log() {
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
log("___________________________________________________");
console = {
    log: log
}

// TEST SCRIPT ----------------------------------------------------------------//
