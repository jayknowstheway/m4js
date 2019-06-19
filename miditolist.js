outlets = 2;
var message = [0, 0];
var sysex_i = 0;
var type;
var pitchb;
var midi0;
var logEnabled = 1;

function bang() {
    message[0] &= 0xF;
    message[0]++;
    outlet(0, type, message);
    sysex_i = 0;
    message = [0];
}


function msg_int(v) {
    switch (v) {
        case 240:
            sysex_i = 0;
            message = [0];
            break;
        case 247:
            outlet(1, message);
            log('outlet 1 message: ', message);
            // REDIRECT MIDI!!
            redirectMidi(message);
            //
            sysex_i = 0;
            message = [0];
            break;
        default:
            if (sysex_i > 63) sysex_i = 0;
            if ((v < 240) & (v > 127)) sysex_i = 0;
            message[sysex_i++] = v;

            if (sysex_i > 2) {
                // note off 
                if ((message[0] >> 4) == 8) {
                    type = "NOTE_OFF";
                    bang();
                }
                //note on
                if ((message[0] >> 4) == 9) {
                    type = "NOTE_ON";
                    bang();
                }
                // poly after touch
                if ((message[0] >> 4) == 10) {
                    type = "PA";
                    bang();
                }
                // Control change
                if ((message[0] >> 4) == 11) {
                    type = "CC";
                    bang();
                }
                // pitch bend
                if ((message[0] >> 4) == 14) {
                    type = "PB";
                    pitchb = (message[2] << 7) + message[1];
                    message = [message[0], pitchb];
                    bang();
                }
            }
            if (sysex_i > 1) {
                if ((message[0] >> 4) == 12) {
                    type = "PC";
                    bang();
                }
                if ((message[0] >> 4) == 13) {
                    type = "AT";
                    bang();
                }
            }
            break;
    }
}

// REDIRECT MIDI //////////////////////////////////////////////////////////////////////////

function redirectMidi(v) {
    log('redirectMidi, input = ', v);

    // LETTER Q
    if (v == "1,0") {
    }
    // LETTER W
    if (v == "1,1") {
    }
    // LETTER E
    if (v == "1,2") {
        var live = new LiveAPI('live_set view selected_track devices 1 parameters 2');
        log(live.get('value'));
    }
    // LETTER R
    if (v == "1,3") {
        q
        var live = new LiveAPI('live_set view selected_track devices 1 parameters 2');
        var value = live.get('value');
        var newVal = value - 10;
        live.set('value', (newVal));
        log(newVal);
    }
    // LETTER T
    if (v == "1,4") {
        var live = new LiveAPI('live_set view selected_track devices 1 parameters 2');
        var value = live.get('value');
        var newVal = Number(value) + 10;
        live.set('value', (newVal));
        log(newVal);
    }
    // LETTER Y
    if (v == "1,5") {}
    // LETTER U
    if (v == "1,6") {}
    // LETTER I
    if (v == "1,7") {}
    // LETTER O
    if (v == "1,8") {}
    // LETTER P
    if (v == "1,9") {}
    // LETTER A
    if (v == "1,10") {}
    // LETTER S
    if (v == "1,11") {}
    // LETTER D
    if (v == "1,12") {}
    // LETTER F
    if (v == "1,13") {}
    // LETTER G
    if (v == "1,14") {}
    // LETTER H
    if (v == "1,15") {}
    // LETTER J
    if (v == "1,16") {}
    // LETTER K
    if (v == "1,17") {}
    // LETTER L
    if (v == "1,18") {}
    // LETTER Z
    if (v == "1,19") {
        var live = new LiveAPI('live_set scenes 21');
        live.call('fire');
    }
    // LETTER X
    if (v == "1,20") {
        var live = new LiveAPI('live_set scenes 22');
        live.call('fire');
    }
    // LETTER C
    if (v == "1,21") {
        var live = new LiveAPI('live_set scenes 23');
        live.call('fire');
    }
    // LETTER V
    if (v == "1,22") {
        var live = new LiveAPI('live_set scenes 24');
        live.call('fire');
    }
    // LETTER B
    if (v == "1,23") {
        var live = new LiveAPI('live_set scenes 25');
        live.call('fire');
    }
    // LETTER N
    if (v == "1,24") {
        var live = new LiveAPI('live_set scenes 26');
        live.call('fire');
    }
    // LETTER M
    if (v == "1,25") {
        var live = new LiveAPI('live_set scenes 27');
        live.call('fire');
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

log('___________________________________');
