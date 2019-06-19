outlets = 2;

function test(input) {
    log('this test function was triggered', input);
    outlet(0, input);
}

// DOESN'T WORK
function ccIn(input) {
    var b = input.split(' ').map(function(item) {
        return parseInt(item, 10);
    });
    log('midi:', b);
    outlet(0, b);
}


function midiIn(input) {
    var b = input.split(' ').map(function(item) {
        return parseInt(item, 10);
    });
    if(b[1] != 0){
	/*
	switch(b[0]){
	case 36:kick(b[0]);
	    break;
	case 37: snare(b[0]);
	    break;
	}
    } else if(b[1] ==0){
	outlet(1, Number(b[0]), 0);
    
*/
}
    log('midi:', b);
    outlet(0, b[0]);
}


function kick(input){
    log('kick function triggered');
    outlet(1, [Number(input),120]);
}

function snare(input){
    log('snare function triggered');
    outlet(1, [Number(input),120]);
}
// LOGGING -------------------------------------------------------------------------------//

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
console = {
    log: log
};

// CALLBACKS -----------------------------------------------------------------------------//

function callback() {}
