// Set Functions FUNCTIONS: stop, play, sessionRecord, getTrackCount
autowatch = 1;
inlets = 1;
outlets = 3;
// GLOBAL VARIABLES ----------------------------------------------------------------------//
var postEnabled = 1;

var currentBPM;
var sessionRecordStatus = 0;
var currentGroove;

var track = new LiveAPI(callback, "live_set view selected_track");
var trackNumber;
var selectedTrack = track;
var trackChangeInit = 0;

var clip = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
var hasClipCount;
// THIS NUMBER DEFINES THE TOTAL CLIP BUTTON RANGE
var hasClipManualNumber = 100;
var playingClipIndex;
var currentClip = Number(playingClipIndex);
var playingSlotIndexOld = null;

var storeClipDial;
var clipLength = 16;
var clipName = "";

var clipMidiNotes = null;

var selectedDevice = 0;
var device = new LiveAPI("live_set tracks " + trackNumber + " devices " + selectedDevice);
// THIS IS THE NUM OF MAX DEVICES TO RANDOMIZE
var maxDevices = 19;

var param;
var chosenParam;
var paramObject = [];
var paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + chosenParam);

var params;
var paramCount;
var paramsTotal = 128;
var numOfParams;
var paramStr = "";
var arrayOfParamValues = "";
var arrayOfParamValuesLength = arrayOfParamValues.length;

// DRUM VARS //
// Note: The drum section includes 19 drums. Banks are chosen based on the sysex message for each key. The drum rack number is defined for the Drum Rack amxd, and the associated 16perDrumRack.js file.
var drumRack = 0;
var bankNo = 0;
var drumChain = 0;
var drumDevice = 0;

var vSoloTrackToggle = 0;

var bank = 0;
var bankParam = 0;

var readTempInit = 0;

var message = [0, 0];
var sysex_i = 0;
var type;
var pitchb;
var midi0;


// INLET FUNCTIONS -----------------------------------------------------------------------//

//SYS ////////////////////////////////// SYS //
// This section takes in midi and sysex messages and formats them. Sysex and Midi messages are then redirected to their processing functions.


function sysBang() {
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
            //post('msg_int case 240 \n');
            break;
        case 247:
            outlet(1, message);
            //post('msg_int case 247 message: ', message, '\n');
            // REDIRECT MIDI
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
                    sysBang();
                }
                //note on
                if ((message[0] >> 4) == 9) {
                    type = "NOTE_ON";
                    sysBang();
                }
                // poly after touch
                if ((message[0] >> 4) == 10) {
                    type = "PA";
                    sysBang();
                }
                // Control change
                if ((message[0] >> 4) == 11) {
                    type = "CC";
                    sysBang();
                }
                // pitch bend
                if ((message[0] >> 4) == 14) {
                    type = "PB";
                    pitchb = (message[2] << 7) + message[1];
                    message = [message[0], pitchb];
                    sysBang();
                }
            }
            if (sysex_i > 1) {
                if ((message[0] >> 4) == 12) {
                    type = "PC";
                    sysBang();
                }
                if ((message[0] >> 4) == 13) {
                    type = "AT";
                    sysBang();
                }
            }
            break;
    }
}

// REDIRECT MIDI //////////////////////////////////////////////////////////////////////////
// Sysex messages are received and assigned to functions.

function redirectMidi(v) {
    post('redirectMidi, input = ', v);

    ////////// SYS 00 -- LETTERS ////////////
    // LETTER Q
    if (v == "0,0") {
        var api = new LiveAPI('live_set');
        api.call('start_playing');
    }
    // LETTER W
    if (v == "0,1") {}
    // LETTER E
    if (v == "0,2") {}
    // LETTER R
    if (v == "0,3") {}
    // LETTER T
    if (v == "0,4") {}
    // LETTER Y
    if (v == "0,5") {}
    // LETTER U
    if (v == "0,6") {}
    // LETTER I
    if (v == "0,7") {}
    // LETTER O
    if (v == "0,8") {}
    // LETTER P
    if (v == "0,9") {}
    // LETTER A
    if (v == "0,10") {}
    // LETTER S
    if (v == "0,11") {}
    // LETTER D
    if (v == "0,12") {}
    // LETTER F
    if (v == "0,13") {}
    // LETTER G
    if (v == "0,14") {}
    // LETTER H
    if (v == "0,15") {}
    // LETTER J
    if (v == "0,16") {}
    // LETTER K
    if (v == "0,17") {}
    // LETTER L
    if (v == "0,18") {}
    // LETTER Z
    if (v == "0,19") {}
    // LETTER X
    if (v == "0,20") {}
    // LETTER C
    if (v == "0,21") {}
    // LETTER V
    if (v == "0,22") {}
    // LETTER B
    if (v == "0,23") {}
    // LETTER N
    if (v == "0,24") {}
    // LETTER M
    if (v == "0,25") {}


    ////////// SYS 01 -- coc  ctrl opt comm LETTERS ////////////    
    // LETTER Q
    if (v == "1,0") {}
    // LETTER W
    if (v == "1,1") {}
    // LETTER E
    if (v == "1,2") {}
    // LETTER R
    if (v == "1,3") {}
    // LETTER T
    if (v == "1,4") {}
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
    if (v == "1,19") {}
    // LETTER X
    if (v == "1,20") {}
    // LETTER C
    if (v == "1,21") {}
    // LETTER V
    if (v == "1,22") {}
    // LETTER B
    if (v == "1,23") {}
    // LETTER N
    if (v == "1,24") {}
    // LETTER M
    if (v == "1,25") {}

    ////////// SYS 00 -- c NUMBERS ////////////
    // c 0
    if (v == "0,0") {
        setClipNameToParamValues(); /*save macros button*/
    }
    // c 1
    if (v == "0,1") {
        chosenParam = 1;
    }
    // c 2
    if (v == "0,2") {
        chosenParam = 2;
    }
    // c 3
    if (v == "0,3") {
        chosenParam = 3;
    }
    // c 4
    if (v == "0,4") {
        chosenParam = 4;
    }
    // c 5
    if (v == "0,5") {
        chosenParam = 5;
    }
    // c 6
    if (v == "0,6") {
        chosenParam = 6;
    }
    // c 7
    if (v == "0,7") {
        chosenParam = 7;
    }
    // c 8
    if (v == "0,8") {
        chosenParam = 8;
    }
    // c 9
    if (v == "0,9") {
        dialChange("defaultNum");
    }

    // c ; // SET CLIP LENGTH /2 -- ctrl ;
    if (v == "0,10") {
        setClipLength(-1);
    }
    // c ' // SET CLIP LENGTH x2 -- ctrl '
    if (v == "0,10") {
        setClipLength(1);
    }

    ////////// SYS 02 -- sco LETTERS ////////////
    // LETTER Q
    if (v == "2,0") {}
    // LETTER W
    if (v == "2,1") {}
    // LETTER E
    if (v == "2,2") {}
    // LETTER R
    if (v == "2,3") {}
    // LETTER T
    if (v == "2,4") {}
    // LETTER Y
    if (v == "2,5") {}
    // LETTER U
    if (v == "2,6") {}
    // LETTER I
    if (v == "2,7") {}
    // LETTER O
    if (v == "2,8") {}
    // LETTER P
    if (v == "2,9") {}
    // LETTER A
    if (v == "2,10") {}
    // LETTER S
    if (v == "2,11") {}
    // LETTER D
    if (v == "2,12") {}
    // LETTER F
    if (v == "2,13") {}
    // LETTER G
    if (v == "2,14") {}
    // LETTER H
    if (v == "2,15") {}
    // LETTER J
    if (v == "2,16") {}
    // LETTER K
    if (v == "2,17") {}
    // LETTER L
    if (v == "2,18") {}
    // LETTER Z
    if (v == "2,19") {}
    // LETTER X
    if (v == "2,20") {}
    // LETTER C
    if (v == "2,21") {}
    // LETTER V
    if (v == "2,22") {}
    // LETTER B
    if (v == "2,23") {}
    // LETTER N
    if (v == "2,24") {}
    // LETTER M
    if (v == "2,25") {}

    ////////// SYS 03 -- LETTERS ////////////
    // LETTER Q
    if (v == "3,0") {
        bank = 0;
        drumRack = 36;

    }
    // LETTER W
    if (v == "3,1") {
        bank = 1;
        drumRack = 37;
    }
    // LETTER E
    if (v == "3,2") {
        bank = 2;
    }
    // LETTER R
    if (v == "3,3") {
        bank = 3;
    }
    // LETTER T
    if (v == "3,4") {
        bank = 8;
    }
    // LETTER Y
    if (v == "3,5") {
        bank = 9;
    }
    // LETTER U
    if (v == "3,6") {
        bank = 10;
    }
    // LETTER I
    if (v == "3,7") {
        bank = 11;
    }
    // LETTER O
    if (v == "3,8") {
        bank = 12;
    }
    // LETTER P
    if (v == "3,9") {
        bank = 13;
    }
    // LETTER A
    if (v == "3,10") {
        bank = 4;
    }
    // LETTER S
    if (v == "3,11") {
        bank = 5;
    }
    // LETTER D
    if (v == "3,12") {
        bank = 6;
    }
    // LETTER F
    if (v == "3,13") {
        bank = 7;
    }
    // LETTER G
    if (v == "3,14") {
        bank = 14;
    }
    // LETTER H
    if (v == "3,15") {
        bank = 15;
    }
    // LETTER J
    if (v == "3,16") {
        bank = 16;
    }
    // LETTER K
    if (v == "3,17") {
        bank = 17;
    }
    // LETTER L
    if (v == "3,18") {
        bank = 18;
    }
    // LETTER Z
    if (v == "3,19") {
        bank = 19;
    }
    // LETTER X
    if (v == "3,20") {
        bank = 20;
    }
    // LETTER C
    if (v == "3,21") {
        //bank = 0;
	randomizeSingleBank();
    }
    // LETTER V
    if (v == "3,22") {
        bank = 0;
    }
    // LETTER B
    if (v == "3,23") {
        bank = 0;
    }
    // LETTER N
    if (v == "3,24") {
        bank = 0;
    }
    // LETTER M
    if (v == "3,25") {
        bank = 0;
    }

    ////////// SYS 02 -- scoc LETTERS ////////////
    // LETTER Q
    if (v == "7,0") {
	// TEST //
	liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots 0 clip');
	liveSet.call('fire');
    }
    // LETTER W
    if (v == "7,1") {
    	// TEST //
	liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots 1 clip');
	liveSet.call('fire');}
    // LETTER E
    if (v == "7,2") {}
    // LETTER R
    if (v == "7,3") {}
    // LETTER T
    if (v == "7,4") {}
    // LETTER Y
    if (v == "7,5") {}
    // LETTER U
    if (v == "7,6") {}
    // LETTER I
    if (v == "7,7") {}
    // LETTER O // SWING
    if (v == "7,8") {
        liveSet = new LiveAPI('live_set');
        currentGroove = (liveSet.get('swing_amount')) * 127;
        post('\ncurrentGroove', currentGroove);
        currentGroove = ((currentGroove * 1) + 10);
        if (currentGroove > 120) {
            currentGroove = 110;
        }
        liveSet.set('swing_amount', parseFloat(currentGroove / 127));
        post((liveSet.get('swing_amount')));
        //
        liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + ' clip');
        if (liveSet) {
            post(liveSet.path);
            liveSet.call('quantize', 5, 1.0);
        }

    }
    // LETTER P
    if (v == "7,9") {swingAmount(0.0);}
    // LETTER A
    if (v == "7,10") {}
    // LETTER S
    if (v == "7,11") {}
    // LETTER D
    if (v == "7,12") {}
    // LETTER F
    if (v == "7,13") {}
    // LETTER G
    if (v == "7,14") {}
    // LETTER H
    if (v == "7,15") {}
    // LETTER J
    if (v == "7,16") {}
    // LETTER K
    if (v == "7,17") {}
    // LETTER L // SWING
    if (v == "7,18") {
        liveSet = new LiveAPI('live_set');
        currentGroove = (liveSet.get('swing_amount')) * 127;
        post('\ncurrentGroove', currentGroove);
        currentGroove = (currentGroove * 1 - 10);
        if (currentGroove < 0) {
            currentGroove = 0.0;
        }
        liveSet.set('swing_amount', parseFloat(currentGroove / 127));
        post((liveSet.get('swing_amount')));
        //
        liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + ' clip');
        if (liveSet) {
            liveSet.call('quantize', 5, 1.0);
        }
    }
    // LETTER Z
    if (v == "7,19") {}
    // LETTER X
    if (v == "7,20") {}
    // LETTER C
    if (v == "7,21") {}
    // LETTER V
    if (v == "7,22") {}
    // LETTER B
    if (v == "7,23") {}
    // LETTER N
    if (v == "7,24") {}
    // LETTER M
    if (v == "7,25") {}

    ////////// SYS 04 -- GLOBALS ////////////
    // CHAR [
    if (v == "4,0") {
        post('\nDIALDOWN');
        dialChange(0);
    }
    // CHAR ]
    if (v == "4,1") {
        post('\nDIALUP');
        dialChange(1);
    }
    // CHAR , STOP
    if (v == "4,2") {
        var liveSet = new LiveAPI("live_set");
        liveSet.call("stop_playing");
        post('stop');
    }
    // CHAR . PLAY
    if (v == "4,3") {
        var liveSet = new LiveAPI("live_set");
        liveSet.call("start_playing");
        post('play');
    }
    // CHAR ` SREC
    if (v == "4,4") {
        var liveSet = new LiveAPI("live_set");
        if (sessionRecordStatus == 0) {
            liveSet.set('session_record', 1);
            sessionRecordStatus = 1;
        } else {
            liveSet.set('session_record', 0);
            sessionRecordStatus = 0;
        }
    }

    ////////// SYS 05 -- s LETTERS ////////////
    // LETTER Q
    if (v == "5,0") {
        dialChange(1, 1);
    }
    // LETTER W
    if (v == "5,1") {
        dialChange(1, 2);
    }
    // LETTER E
    if (v == "5,2") {
        dialChange(1, 3);
    }
    // LETTER R
    if (v == "5,3") {
        dialChange(1, 4);
    }
    // LETTER T
    if (v == "5,4") {
        dialChange(1, 5);
    }
    // LETTER Y
    if (v == "5,5") {
        dialChange(1, 6);
    }
    // LETTER U
    if (v == "5,6") {
        dialChange(1, 7);
    }
    // LETTER I
    if (v == "5,7") {
        dialChange(1, 8);
    }
    // LETTER O
    if (v == "5,8") {}
    // LETTER P
    if (v == "5,9") {}
    // LETTER A
    if (v == "5,10") {
        dialChange(0, 1);
    }
    // LETTER S
    if (v == "5,11") {
        dialChange(0, 2);
    }
    // LETTER D
    if (v == "5,12") {
        dialChange(0, 3);
    }
    // LETTER F
    if (v == "5,13") {
        dialChange(0, 4);
    }
    // LETTER G
    if (v == "5,14") {
        dialChange(0, 5);
    }
    // LETTER H
    if (v == "5,15") {
        dialChange(0, 6);
    }
    // LETTER J
    if (v == "5,16") {
        dialChange(0, 7);
    }
    // LETTER K
    if (v == "5,17") {
        dialChange(0, 8);
    }
    // LETTER L
    if (v == "5,18") {}
    // LETTER Z
    if (v == "5,19") {}
    // LETTER X
    if (v == "5,20") {}
    // LETTER C
    if (v == "5,21") {}
    // LETTER V
    if (v == "5,22") {}
    // LETTER B
    if (v == "5,23") {}
    // LETTER N
    if (v == "5,24") {}
    // LETTER M
    if (v == "5,25") {}

    ////////// SYS 06 -- sco NUMBERS ////////////
    // NUMBER TILDE // NO QUANTIZATION
    if (v == "6,0") {
        var liveSet = new LiveAPI("live_set");
        liveSet.set("midi_recording_quantization", 0);
        post('setFunctions - Record Quantization: No Quantization');

    }
    // NUMBER 1  // RECORD QUANT 1 - QUARTER-NOTE
    if (v == "6,1") {
        var liveSet = new LiveAPI("live_set");
        liveSet.set("midi_recording_quantization", 1);
        post('setFunctions - Record Quantization: Quarter-Note Quantization');
    }
    // NUMBER 2   // RECORD QUANT 2 - EIGHTH-NOTE
    if (v == "6,2") {
        var liveSet = new LiveAPI("live_set");
        liveSet.set("midi_recording_quantization", 2);
        post('setFunctions - Record Quantization: Eight-Note Quantization');
    }
    // NUMBER 3   // RECORD QUANT 3 - EIGHTH-NOTE TRIPLET
    if (v == "6,3") {
        var liveSet = new LiveAPI("live_set");
        liveSet.set("midi_recording_quantization", 3);
        post('setFunctions - Record Quantization: Eight-Note TRIPLET Quantization');
    }
    // NUMBER 4   // RECORD QUANT 4 - SIXTEENTH-NOTE
    if (v == "6,4") {
        var liveSet = new LiveAPI("live_set");
        liveSet.set("midi_recording_quantization", 5);
        post('setFunctions - Record Quantization: Sixteenth-Note Quantization');
    }
    // NUMBER 5   // RECORD QUANT 5 - THIRTY-SECOND-NOTE
    if (v == "6,5") {
        liveSet = new LiveAPI("live_set");
        liveSet.set("midi_recording_quantization", 8);
        post('setFunctions - Record Quantization: Thirty-Second Note Quantization');
    }
    // NUMBER 6
    if (v == "6,6") {}
    // NUMBER 7
    if (v == "6,7") {}
    // NUMBER 8
    if (v == "6,8") {}
    // NUMBER 9
    if (v == "6,9") {}

    ////////// SYS 08 -- scoc NUMBERS ////////////
    // c 0
    if (v == "8,0") {}
    // c 1
    if (v == "8,1") {}
    // c 2
    if (v == "8,2") {}
    // c 3
    if (v == "8,3") {}
    // c 4
    if (v == "8,4") {}
    // c 5
    if (v == "8,5") {}
    // c 6
    if (v == "8,6") {}
    // c 7
    if (v == "8,7") {}
    // c 8
    if (v == "8,8") {}
    // c 9
    if (v == "8,9") {
        // JUST QUANTIZE CLIP SWING
        liveSet = new LiveAPI('live_set');
        currentGroove = (liveSet.get('swing_amount')) * 127;
        post('\ncurrentGroove', currentGroove);
        currentGroove = ((currentGroove * 1));
        if (currentGroove > 120) {
            currentGroove = 110;
        }
        liveSet.set('swing_amount', parseFloat(currentGroove / 127));
        post((liveSet.get('swing_amount')));
        //
        liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + ' clip');
        if (liveSet) {
            post(liveSet.path);
            liveSet.call('quantize', 5, 1.0);
        }

    }

    ////////// SYS 09 -- sc LETTERS ////////////
    // LETTER Q
    if (v == "9,0") {
        dialChange2(1, 1);
    }
    // LETTER W
    if (v == "9,1") {
        dialChange2(1, 2);
    }
    // LETTER E
    if (v == "9,2") {
        dialChange2(1, 3);
    }
    // LETTER R
    if (v == "9,3") {
        dialChange2(1, 4);
    }
    // LETTER T
    if (v == "9,4") {
        dialChange2(1, 5);
    }
    // LETTER Y
    if (v == "9,5") {
        dialChange2(1, 6);
    }
    // LETTER U
    if (v == "9,6") {
        dialChange2(1, 7);
    }
    // LETTER I
    if (v == "9,7") {
        dialChange2(1, 8);
    }
    // LETTER O
    if (v == "9,8") {}
    // LETTER P
    if (v == "9,9") {}
    // LETTER A
    if (v == "9,10") {
        dialChange2(0, 1);
    }
    // LETTER S
    if (v == "9,11") {
        //dialChange2(0, 2);
	var vSoloTrack = new LiveAPI('live_set tracks 10');
	if (vSoloTrackToggle == 0){
            vSoloTrack.set('solo', 1);
	    vSoloTrackToggle = 1;
	} else {
	    vSoloTrackToggle = 0;
            vSoloTrack.set('solo', 0);
	}
    }
    // LETTER D
    if (v == "9,12") {
        dialChange2(0, 3);
    }
    // LETTER F
    if (v == "9,13") {
        dialChange2(0, 4);
    }
    // LETTER G
    if (v == "9,14") {
        dialChange2(0, 5);
    }
    // LETTER H
    if (v == "9,15") {
        dialChange2(0, 6);
    }
    // LETTER J
    if (v == "9,16") {
        dialChange2(0, 7);
    }
    // LETTER K
    if (v == "9,17") {
        dialChange2(0, 8);
    }
    // LETTER L
    if (v == "9,18") {}
    // LETTER Z
    if (v == "9,19") {

        // Set Arrangement Loop Start/End
        //liveSet = new LiveAPI('live_set');
        //liveSet.set('loop_start', 4*22.0);
        //liveSet.set('loop_length', 4);
        //liveSet.set('loop', 1);
        //liveSet.set('back_to_arranger', 1);
        //liveSet.call('set_or_delete_cue');
        //	var cuePoints = new LiveAPI('live_set cue_points 0');
        //cuePoints.call('jump');
        //liveSet.call('scrub_by', 20.0);
        //SOLO DRUM CHAIN
        liveSet = new LiveAPI('live_set');
        drumChain = 0;
        drumDevice = 0;
        var drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads ' + drumRack + ' chains 0 devices 0 chains 0');
        drumOne.set('solo', 1);
        var drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads ' + drumRack + ' chains 0 devices 0 chains 1');
        drumOne.set('solo', 0);
    }
    // LETTER X
    if (v == "9,20") {
        //SOLO DRUM CHAIN
        liveSet = new LiveAPI('live_set');
        drumChain = 0;
        drumDevice = 0;
        var drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads ' + drumRack + ' chains 0 devices 0 chains 1');
        drumOne.set('solo', 1);
        var drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads ' + drumRack + ' chains 0 devices 0 chains 0');
        drumOne.set('solo', 0);

        // LOGGING ONTO CLIP NAME
        var vClip = new LiveAPI('live_set tracks 1 clip_slots 0 clip');
        vClip.set('name', drumChain);

        ////////


    }
    // LETTER C
    if (v == "9,21") {
        liveSet = new LiveAPI('live_set');
        drumChain = 0;
        drumDevice = 0;
        var drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads ' + drumRack + ' chains 0 devices 0 chains 0');
        //		var drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads 36 chains 0 devices 0 chains 1');
        drumOne.set('solo', 0);
        drumOne = new LiveAPI('live_set tracks 0 devices 1 drum_pads ' + drumRack + ' chains 0 devices 0 chains 1');
        drumOne.set('solo', 0);

    }
    // LETTER V
    if (v == "9,22") {}
    // LETTER B
    if (v == "9,23") {}
    // LETTER N
    if (v == "9,24") {}
    // LETTER M
    if (v == "9,25") {}


    /////// FINAL COMMANDS ////////
    post('\nsysex in, bank', bank);
    // END OF MIDI FUNCTION
}
// END OF SYS /////////////////////////////////

// MIDI IN
function midiIn(input) {
    post('setFunctions, midiIn: input = ', input);
    var b = input.split(' ').map(function(item) {
        return parseInt(item, 10);
    });
    if (b[1] != 0) { // sends  Midi note when velocity != 0
        switch (b[0]) {
            case 1:
                break;
            case 2:
                break;
            case 11:
                break;
            case 12: // BPM -- ctrl -
                var liveSet = new LiveAPI("live_set");
                currentBPM = Math.round(liveSet.get("tempo"));
                liveSet.set('tempo', currentBPM - 1);
                post(currentBPM);
                break;
            case 13: // BPM -- ctrl +
                var liveSet = new LiveAPI("live_set");
                currentBPM = Math.round(liveSet.get("tempo"));
                liveSet.set('tempo', currentBPM + 1);
                post(currentBPM);
                break;
            case 14: // BPM -- ctrl shift -
                var liveSet = new LiveAPI("live_set");
                currentBPM = Math.round(liveSet.get("tempo"));
                liveSet.set('tempo', currentBPM - 10);
                post(currentBPM);
                break;
            case 15: // BPM -- ctrl shift +
                var liveSet = new LiveAPI("live_set");
                currentBPM = Math.round(liveSet.get("tempo"));
                liveSet.set('tempo', currentBPM + 10);
                post(currentBPM);
                break;
            case 22: // RANDOMIZE Single Bank - c
               // randomizeSingleBank();
                break;
            case 23: // RANDOMIZE PARAMS - v
                randomizeParams();
                break;
            case 24: //
                break;
            case 25: //
                break;
            case 26: //
                break;
            case 27: //
                break;
            case 28: //
                break;
            case 29: //
                break;
            case 30: //
                break;
            case 31: //
                break;
            case 32: //
                break;
            case 33: //
                break;
            case 34: //
                break;
            case 35: //
                break;
            case 36: //
                break;
            case 37: //
                break;
            case 38: //
                break;
            case 39: //
                break;
            case 40: //
                break;
            case 41: //
                break;
            case 42: //
                break;
            case 43: //
                break;
            case 44: //
                break;
            case 45: //
                break;
            case 46: //
                break;
            case 47: //
                break;
            case 48: //
                break;
            case 49: //
                break;
            case 50: //
                break;
            case 51: //
                break;
            case 52: //
                break;
            case 53: //
                break;
            case 54: //
                break;
            case 55: //
                break;
            case 56: //
                break;
            case 57: //
                break;
            case 58: //
                break;
            case 59: //
                break;
            case 60: //
                break;
            case 80:
                break;
            case 81:
                break;
            case 83: // READ PREVIOUS PARAMS -- ctrl ,
                crud(2);
                break;
            case 84: // READ NEXT PARAMS -- ctrl .
                crud(1);
                break;
            case 85: // READ TEMP -- shift ctrl option ,
                readTemp();
                break;
            case 90:
                break;
            case 91:
                break;
            case 92:
                break;
            case 93:
                break;
            case 94:
                break;
            case 95:
                break;
            case 98: // WRITE TEMP -- shift ctrl option comm '
                writeTemp();
                break;
            case 100: // PREVIOUS CLIP -- ;
                fireClipButtons(-1);
                break;
            case 101: // NEXT CLIP -- '
                fireClipButtons(1);
                break;
            case 102:
                break;
            case 108: // DELETE PARAMS -- shift ctrl option ;
                crud(4);
                break;
            case 109:
                break;
            case 110:
                break;
            case 111: // FIRE CLIP - ctrl a
                fireClip();
                break;
            case 112: // SOLO - ctrl s
                solo();
                break;
            case 113: // STOP CLIP - ctrl d
                stopClip();
                break;
            case 114: // CLEAR MIDI NOTES - ctrl f
                clearMidiNotes();
                break;
            case 121: // WRITE PARAMS - shift ctrl option c 
                crud(3);
                break;
        }
    } else if (b[1] == 0) { // sends note when velocity == 0
        //outlet(1, Number(b[0]), 0);
    }
    //post('midi:', b);
    outlet(1, b);
}

function dialChange(upDown, staticParam) {
    var chosenParamTemp;
    var paramValue;
    // code to accept two arguments
    if (arguments[1]) {
        chosenParamTemp = staticParam;
    } else {
        chosenParamTemp = chosenParam;
    }
    //    
    switch (upDown) {
        case 0:
            paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
            paramValue = Number(paramPath.get('value')) - 1;
            if (paramValue < 0 && (chosenParamTemp == 1 || chosenParamTemp == 5)) {
                paramValue = 127;
            }
            paramPath.set('value', paramValue);
            post('dialChange DOWN, paramValue', paramValue);
            break;
        case 1:
            paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
            paramValue = Number(paramPath.get('value')) + 1;
            if (paramValue > 127 && (chosenParamTemp == 1 || chosenParamTemp == 5)) {
                paramValue = 0;
            }
            paramPath.set('value', paramValue);
            break;
        case "defaultNum":
            switch (chosenParamTemp) {
                case 1:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 0);
                    break;
                case 2:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 3:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 0);
                    break;
                case 4:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 5:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 0);
                    break;
                case 6:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 127);
                    break;
                case 7:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 0);
                    break;
                case 8:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + (bank * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
            }

            //
            post('dialChange UP, paramValue and bank*8+chosenParam', paramValue, bank * 8 + chosenParamTemp);
    }
}

function dialChange2(upDown, staticParam) {
    var chosenParamTemp;
    var paramValue;
    // code to accept two arguments
    if (arguments[1]) {
        chosenParamTemp = staticParam;
    } else {
        chosenParamTemp = chosenParam;
    }
    //    
    switch (upDown) {
        case 0:
            paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
            paramValue = Number(paramPath.get('value')) - 1;
            //if (paramValue < 0 && (chosenParamTemp == 1 || chosenParamTemp == 5)) {
            //    paramValue = 127;
            //}
            paramPath.set('value', paramValue);
            post('dialChange DOWN, paramValue', paramValue);
            break;
        case 1:
            paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
            paramValue = Number(paramPath.get('value')) + 1;
            //if (paramValue > 127 && (chosenParamTemp == 1 || chosenParamTemp == 5)) {
            //    paramValue = 0;
            //}
            paramPath.set('value', paramValue);
            break;
        case "defaultNum":
            switch (chosenParamTemp) {
                case 1:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 2:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 3:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 4:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 5:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 6:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 7:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
                case 8:
                    paramPath = new LiveAPI('live_set view selected_track devices ' + selectedDevice + ' parameters ' + ((8 + bank) * 8 + chosenParamTemp));
                    paramPath.set('value', 64);
                    break;
            }

            //
            post('dialChange UP, paramValue and bank*8+chosenParam', paramValue, (8 + bank) * 8 + chosenParamTemp);
    }
}

// MUST REVISE WITH SYSEX! //////                                         !!!!!!!!
function getSelectedBank(midiNote) {
    trackChangeInit = 1;
    if (midiNote > 119) {
        post('getSelectedBank, midiNote', midiNote);
        switch (midiNote) {
            case 120:
                bank = 0;
                break;
            case 121:
                bank = 1;
                break;
            case 122:
                bank = 2;
                break;
            case 123:
                bank = 3;
                break;
            case 124:
                bank = 4;
                break;
            case 125:
                bank = 5;
                break;
            case 126:
                bank = 6;
                break;
            case 127:
                bank = 7;
                break;
                //case 128:
                //    bank = 8;
                //    break;
                //	}
                //  if (trackNumber == 0) {
                //      switch (midiNote) {
            case 48:
                bank = 8;
                break;
            case 50:
                bank = 9;
                break;
            case 60:
                bank = 10;
                break;
            case 61:
                bank = 11;
                break;
            case 92:
                bank = 12;
                break;
            case 93:
                bank = 13;
                break;
            case 94:
                bank = 14;
                break;
            case 95:
                bank = 15;
                break;
            case 47:
                bank = 17;
                break;
            case 49:
                bank = 18;
                break;
            case 96:
                bank = 19;
                break;
        }
        //    }
    }
    bank = bank * 8;
    post('Selected Bank', bank / 8);
}

// DIALS //////


function setDial(dial, val) {
    if (trackChangeInit == 0) {
        bank = 0;
        trackChangeInit = 1;
        post('bank reset to 0');
    } else {
        getSelectedBank();
        dial = dial + bank;
    }

    param = getParameter(dial);
    post('setDial - Parameter #' + dial, 'bank', bank / 8);
    if (param == null) {
        post('\nNo Parameter #' + dial);
        return;
    }
    // Scale from 0-127 to min-max range
    var min = parseFloat(param.get('min'));
    var max = parseFloat(param.get('max'));
    var scaled = min + ((max - min) / 127.0 * val);
    if (param) {
        param.set('value', scaled);
    }
}



// Get Dial
function getParameter(paramNum) {
    var paramsCount;
    if (params == null) {
        paramsCount = new LiveAPI();
        params = new Array(paramsTotal);
        for (var i = 0; i < paramsTotal; i++)
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


function swingAmount(dial) {
    var grooveLevel = dial / 127;
    var liveSet = new LiveAPI("live_set");
    if (liveSet) {
        liveSet.set('swing_amount', grooveLevel);
        currentGroove = liveSet.get('swing_amount');
        post('grooveAmount, currentGroove = ', currentGroove);
        liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + " clip");
        if (liveSet)
            liveSet.call('quantize', 5, 1);
    }
}

// TRACK CHANGE
// On track change, disarm, then arm and getPlayingClip
function setTrackNumber(id, trackNoInlet) {
    if (arguments.length == 2) {
        var api = new LiveAPI();
        api.id = Number(trackNoInlet);
        post('api.id', api.id);
        disarm();
        var pathParts = api.unquotedpath.split(' ');
        trackNumber = pathParts[2];
        track = new LiveAPI("live_set tracks " + trackNumber);
        device = new LiveAPI("live_set tracks " + trackNumber + " devices " + selectedDevice);
        arm(); // ARM
        trackChangeInit = 0;
        getPlayingClip(); // GET PLAYING CLIP
    }
    // Outlet trackNumber
    post('-------setFunctions trackNumber', trackNumber);
}

// CLIP CHANGE
function onClipFire(firedSlotIndex) {
    if (firedSlotIndex != -1 && firedSlotIndex != null) {
        currentClip = firedSlotIndex;
        // Actions
        getClipName();
    }
}


// sets Param Values based on clip name
function onClipChange(playingSlotIndex) {
    post('setFunctions, onClipChange: playingSlotIndex = ', playingSlotIndex, playingSlotIndexOld, clipName.constructor.toString().indexOf("Array"));
    if (playingSlotIndexOld != playingSlotIndex) {
        currentClip = playingSlotIndex;
        getPlayingClip(); // GETS PLAYING CLIP INFO
        setParamValues(); // SETS PARAM VALUES
        playingSlotIndexOld = playingSlotIndex;
        readTempInit = 0;
    }
}


// INIT FUNCTION -------------------------------------------------------------------------//

// init function: must run upon any high-level request
function init() {
    if (!trackNumber) {
        getSelectedTrack();
    }
}

function getSelectedTrack() {
    var api = new LiveAPI();
    api.path = 'live_set view selected_track';
    // trackNumber = api.get('track');
    var pathParts = api.unquotedpath.split(' ');
    trackNumber = pathParts[2];
    post('setFunctions, getSelectedTrack: trackNumber = ', trackNumber);
}

// Get Playing Clip
// gets the playing clip index, name, clip length, and redefines currentClip, also stores arrayOfParamValues based on clip name
function getPlayingClip() {
    if (track) {
        playingClipIndex = track.get('playing_slot_index');
        post("setFunctions, getPlayingClip: playingClipIndex = ", playingClipIndex);
    }
    if (trackChangeInit == 0) {
        trackChangeInit = 1;
        currentClip = playingClipIndex;
    }
    clip = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    if (clip) {
        clipName = clip.get("name");
        post('getPlayingClip, clipName: ', clipName);
        clipLength = clip.get("loop_end");
        clipLength = parseFloat(clipLength);
        arrayOfParamValues = clipName.toString().split(" ");
        post('setFunctions, getPlayingClip: arrayOfParamValues:', arrayOfParamValues, 'arrayOfParamValues.length:', arrayOfParamValues.length);
        post('playing_slot_index', currentClip);
        //   outlet(1, currentClip);
    }
}

// GLOBAL FUNCTIONS ----------------------------------------------------------------------//

// Mute
function mute() {
    if (track)
        track.set('mute', 1);
}

// Solo
function solo() {
    if (track) {
        if (track.get('solo') == 0) {
            track.set('solo', 1);
        } else {
            track.set('solo', 0);
            post("Soloed Track:", track);
        }
    }
}

// Arm
function arm() {
    if (!track)
        return;
    if (track.get('can_be_armed'))
        track.set('arm', 1);
    post('setFunctions Track Armed!', trackNumber);
}

// Disarm
function disarm() {
    if (!track) {
        return;
    } else if (track.get('can_be_armed')) {
        track.set('arm', 0);
        post('setFunctions Track Disarmed!', trackNumber);
    }
}

// Volume
function setVolume(volume) {
    var vol = new LiveAPI(callback, 'live_set view selected_track mixer_device volume');
    if (!vol)
        return;
    if (vol.get('is_enabled'))
        vol.set('value', volume);
}

// Sends
function setSend(dial, val) {
    var param = new LiveAPI(callback, 'live_set view selected_track mixer_device sends ' + dial);
    if (!param)
        return;
    param.set('value', val);
}

// CLIP FUNCTIONS ------------------------------------------------------------------------//

// Fire Clip Dial
// potentially deprecated
function fireClipDial(clipDial) {
    var clipDialScaled = Math.round((clipDial / 127) * hasClipCount) - 1;
    post("Clip Fire KnobValue", clipDialScaled);
    if (clipDialScaled < 0) {
        clipDialScaled = 0;
    }
    if (storeClipDial == clipDialScaled) {
        return;
    } else {
        post("Clip Fire KnobValue", clipDialScaled);
        storeClipDial = clipDialScaled;
        var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + clipDialScaled);
        liveSet.call("fire");
    }
}

// Fire Clip Buttons - first 20 tracks
function fireClipButtons(clipButton) {
    if (trackChangeInit == 0) {
        post('XXXXXXXtrackChangeInit', trackChangeInit);
        //currentClip = Number(playingClipIndex);
        if (currentClip == -2) {
            currentClip = -1;
        }
        trackChangeInit = 1;
    }
    // BUTTONS
    if (clipButton == 1) {
        currentClip = currentClip + 1;
    } else if (clipButton == -1) {
        currentClip = currentClip - 1;
    }
    // CLIP LIMITS
    if (currentClip > (hasClipManualNumber - 1)) {
        currentClip = 0;
        post("CURRENT>HASCLIP--", "Current Clip:", currentClip, "Clip Manual Number:", hasClipManualNumber);
    } else if (currentClip < 0) {
        currentClip = (hasClipManualNumber - 1);
    }
    post("CurrentClip", currentClip);
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    clip = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    liveSet.call("fire");
}

// Fire clip
function fireClip() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    post("clip fired!", trackNumber, currentClip);
    liveSet.call("fire");
}

// Stop clip
function stopClip() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip);
    post("clip stopped!", trackNumber, currentClip);
    liveSet.call("stop");
}

// Set Clip Length
function setClipLength(clipButton) {
    getClipLength();
    if (clipButton == 1) {
        if (clipLength < 1) {
            clip.set("loop_end", 1);
        }
        clip.set("loop_end", (clipLength) * 2);
    } else if (clipButton == -1) {
        clip.set("loop_end", (clipLength) / 2);
    }
    getClipLength();
    //	post("Clip Length:", clipLength);
}

function clearMidiNotes() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    liveSet.call("select_all_notes");
    clipMidiNotes = liveSet.call("get_selected_notes");
    post("Clip Midi Notes:", clipMidiNotes);
    liveSet.call("replace_selected_notes");
    liveSet.call("notes", 0);
    liveSet.call("done");
}


// DEVICE FUNCTIONS -----------------------------------------------------------------------//

function setClipNameToParamValues() {
    numOfParams = device.getcount('parameters');
    // Get Param Values
    var chosenParam = 0;
    var paramValue = null;
    for (chosenParam = 0; chosenParam < numOfParams; chosenParam++) {
        paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + chosenParam);
        paramValue = paramPath.get('value');
        paramObject[chosenParam] = paramValue;
    }
    // Set Clip Name
    var liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + currentClip + ' clip');
    clipName = liveSet.set('name', paramObject);
}


function setParamValues() {
    // Set Param Values based on Clip Name
    var chosenParam = 0;
    arrayOfParamValuesLength = arrayOfParamValues.length;
    post("setFunctions: setParamValues - arrayOfParamValues", arrayOfParamValues, 'arrayOfParamValuesLength', arrayOfParamValuesLength);
    for (var i = 0; i < arrayOfParamValuesLength; i++) {
        //post('i:', i, 'arrayOfParamValues', arrayOfParamValues[i]);
        if (arrayOfParamValues[i] && arrayOfParamValues[i] != "" && clipName) {
            paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + i);
            paramPath.set('value', arrayOfParamValues[i]);
            //post("PARAM CHANGE", "ParameterNo:", i, "ParameterValue", arrayOfParamValues[i]);
        } else {
            post('setParamValues -- SOMETHING IS EQUAL TO NULL');
            post('setParamValues -- arrayOfParamValues[i]', arrayOfParamValues[i], 'arrayOfParamValues', arrayOfParamValues, 'clipName', clipName);
        }
    }
}

function randomizeParams() {
    // randomizes first and 5th param of every device, up to maxDevices
    for (var j = 0; j < maxDevices; j++) {
        // first param
        paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + Number((j * 8) + 1));
        var randomVal = (Math.floor((Math.random() * 127) + 0));
        if (paramPath) {
            paramPath.set('value', randomVal);
        }
        // fifth param
        var paramPath2 = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + Number((j * 8) + 5));
        var randomVal2 = (Math.floor((Math.random() * 127) + 0));
        if (paramPath2) {
            paramPath2.set('value', randomVal2);
        }
    }
}

function randomizeSingleBank() {
    //    for (var j = 0; j < 8; j++) {
    paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + Number((bank * 8) + 1));
    var randomVal = (Math.floor((Math.random() * 127) + 0));
    if (paramPath) {
        paramPath.set('value', randomVal);
    }
    // Randomize param 5
    paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + Number((bank * 8) + 5));
    randomVal = (Math.floor((Math.random() * 127) + 0));
    if (paramPath) {
        paramPath.set('value', randomVal);
    }
    post('randomizeSingleBank, bank*8', bank);
    //        post((j * 8) + 1, Math.floor(Math.random() * 127) + 0);
    //    }
}

// GET INFO FUNCTIONS --------------------------------------------------------------------//
function getClipName() {
    clip = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    if (clip) {
        clipName = clip.get("name");
    }
}

// Get Clip Count
function getHasClipCount() {
    hasClipCount = 0;
    // ALL Track Clip Slots	
    var clipSlotCount = track.getcount("clip_slots");
    var clipSlot = new LiveAPI();
    // GET NUMBER OF CLIPS THAT EXIST
    for (var j = 0; j < clipSlotCount; j++) {
        var clip_slot_path = track.path.replace(/['"]+/g, '') + " clip_slots " + j;
        clipSlot.path = clip_slot_path;
        var hasClip = parseInt(clipSlot.get("has_clip"));
        if (hasClip == 1) {
            var clip_path = clip_slot_path + " clip";
            var clip = new LiveAPI(null, clip_path);
            hasClipCount = hasClipCount + 1;
        }
    }
    outlet(2, hasClipCount);
    post("trackF - ClipCount", hasClipCount, "- Last:", clip_path);
}

// Get Clip Length
function getClipLength() {
    var liveSet = new LiveAPI(callback, "live_set tracks " + trackNumber + " clip_slots " + currentClip + " clip");
    clipLength = liveSet.get("loop_end");
    clipLength = parseFloat(clipLength);
    post("Clip Length:", clipLength);
}

// JSON CODE -----------------------------------------------------------------------------//
var memstr;
var mem = new Object();
var UI = new Object();
var tempWord = "TEMP";
var p = "/Users/jwalker/Music/AUDIO/ABLETON/ABLETON USER LIBRARY/PATCHES/M4L PATCHES/CUSTOM/JS/params.json";

function clear() {
    UI = new Object();
    post("\ncleared");
    //read();
}

// JSON GET FUNCTIONS /////

function getParamValues2() {
    // creates arrayOfParamValues in object with multiple arrays
    var paramChunkArray = new Array();
    var chosenParam = 0;
    var paramValue = null;
    numOfParams = device.getcount('parameters');
    // create param values object, ex: length = 65
    for (chosenParam = 0; chosenParam < numOfParams; chosenParam++) {
        paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + chosenParam);
        paramValue = paramPath.get('value');
        paramObject[chosenParam] = paramValue;
    }
    post("-deviceFunctions: getParamValues2 - paramObject:", paramObject.length, typeof(paramObject), paramObject);
    // split param object into chunks of 8, ignoring first number
    // note: this will create write function [[ [1],[2],[3] ]]
    arrayOfParamValues = (chunk(paramObject, 8));
    // create arrays for each group of 8, and remove string
    for (var i = 0; i < arrayOfParamValues.length; i++) {
        paramObject[i] = '[' + arrayOfParamValues[i] + ']';
        post('paramObject', i, paramObject[i]);
        // In this code, JSON.parse makes them arrays and not strings.
        paramChunkArray.push(JSON.parse(paramObject[i]));
    }
    //    post('paramChunkObject',paramChunkArray);
    arrayOfParamValues = paramChunkArray;
    post("arrayOfParamValues length", arrayOfParamValues.length, 'arrayOfParamValues', arrayOfParamValues);
}

// JSON SET FUNCTIONS

function setParamValues2() {
    // Set Param Values based on JSON
    var chosenParam = 0;
    arrayOfParamValuesLength = arrayOfParamValues.length;
    var n = arrayOfParamValuesLength;
    while (n--) {
        var n2 = arrayOfParamValues[n].length;
        //        if (arrayOfParamValues[i] && arrayOfParamValues[i] != "" && clipName != null) {
        while (n2--) {
            paramPath = new LiveAPI('live_set tracks ' + trackNumber + ' devices ' + selectedDevice + ' parameters ' + (n2 + 1 + n * 8));
            if (paramPath) {
                paramPath.set('value', arrayOfParamValues[n][n2]);
                post("PARAM CHANGE", "ParameterNo:", n, "ParameterValue", arrayOfParamValues[n]);
            }
        }
    } //else {
    //            post('setParamValues -- SOMETHING IS EQUAL TO NULL');
    //            post('setParamValues -- arrayOfParamValues[i]', arrayOfParamValues[i], 'arrayOfParamValues', arrayOfParamValues, 'clipName', clipName);
}


// JSON READ /////

function read(objKey) {
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
    //    UI = eval("(" + memstr + ")"); //much less secure, but could work
}

function readTemp() {
    // read();
    if ((UI[trackNumber][currentClip]) == undefined) {
        writeParams();
    }
    // post('readTemp: UI["0"]["TEMP"][0][0]', UI["0"]["TEMP"][0][2]);
    if (readTempInit != 1) {
        arrayOfParamValues = (UI['TEMP-' + trackNumber]["GENERIC"]);
        post("\nJSON Read", 'arrayOfParamValues', arrayOfParamValues);
        setParamValues2();
        readTempInit = 1;
    } else {
        //   getClipName();
        //	arrayOfParamValues = UI["0"][currentClip];
        arrayOfParamValues = UI[trackNumber][currentClip];
        post('\nreadTemp ELSE', arrayOfParamValues);
        setParamValues2();
        readTempInit = 0;
    }
}

// JSON WRITE /////

function writeParamValues() {
    //clear();
    read("PARAMS");
    anything(trackNumber, currentClip, arrayOfParamValues);
    var jase = JSON.stringify(UI);
    post('UI from writeParamValues', UI);
    post('jase from writeParamValues TEST', jase);
    outlet(0, jase);
}


function writeTemp() {
    // clear();
    read("PARAMS");
    anything('TEMP-' + trackNumber, 'GENERIC', arrayOfParamValues);
    var jase = JSON.stringify(UI);
    post('UI from writeTemp', UI);
    outlet(0, jase);
}

function pushToArray() {
    // push additional anything array
    var a = arrayfromargs(arguments);
    var id = a[0];
    var property = a[1];
    var data = a[2];
    //var data = a.slice(2);
    // the .slice method creates a new unnecessary array.
    post("\nanything", id, ",", property, ",", data);
    if (UI == null) {
        UI = new Object();
    }
    if (UI[id] == null) {
        post('anything: UI[id] was null ---------------');
        UI[id] = new Object();
    }

    UI[id][property][UI[id][property].length] = data;
}

// JSON RELATED //

function anything() {
    // fill UI with UI[0][1][2]:
    var a = arrayfromargs(arguments);
    var id = a[0];
    var property = a[1];
    //var data = a[2];
    var data = a.slice(2);
    post("\nanything", id, ",", property, ",", data);
    if (UI == null) {
        UI = new Object();
    }
    if (UI[id] == null) {
        post('anything: UI[id] was null ---------------');
        UI[id] = new Object();
    }
    if (UI[id][property]) {
        data = a[2];
        UI[id][property][0] = data;
    } else {
        UI[id][property] = data;
    }

    post('-deviceFunctions: anything - data', data);
}

function anything2() {
    // fill UI with UI[0][1][2][3]:
    var a = arrayfromargs(arguments);
    var id = a[0];
    var property = a[1];
    var subProperty = a[2];
    var data = a[3];
    post("\nanything2", id, ",", property, ",", subProperty, ",", data);
    if (UI[id] == null) {
        UI[id] = new Object();
    }
    UI[id][property][subProperty] = data;
}

function chunk(arr, len) {
    // creates arrays in groups of 8
    var chunks = [],
        i = 1,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

function crud(crud) {
    read("PARAMS");
    switch (crud) {
        case 0: //"Create"
            post('switchParamsArray CREATE!');
            if (!UI[trackNumber][currentClip]) {
                writeParams();
            } else {
                getParamValues2();
                pushToArray(trackNumber, currentClip, arrayOfParamValues);
            }
            break;
        case 1: // "ReadNext"
            post('switchParamsArray READNEXT!');
            if (!UI[trackNumber][currentClip]) {
                writeParams();
            } else {
                (UI[trackNumber][currentClip]).push(UI[trackNumber][currentClip].shift());
                arrayOfParamValues = UI[trackNumber][currentClip][0];
                arrayOfParamValues = UI[trackNumber][currentClip][0];
                setParamValues2();
            }
            break;
        case 2: // "ReadPrevious"
            post('switchParamsArray READPREVIOUS!');
            if (!UI[trackNumber][currentClip]) {
                writeParams();
            } else {
                (UI[trackNumber][currentClip]).unshift(UI[trackNumber][currentClip].pop());
                arrayOfParamValues = UI[trackNumber][currentClip][0];
                setParamValues2();
            }
            break;
        case 3: // "WRITE PARAMS / Update"
            post('switchParamsArray UPDATE!');
            getParamValues2();
            writeParamValues();
            break;
        case 4: // "Delete"
            post('switchParamsArray DELETE!');
            if (UI[trackNumber][currentClip]) {
                UI[trackNumber][currentClip].splice(0, 1);
                arrayOfParamValues = UI[trackNumber][currentClip];
                setParamValues2();
            }
            break;

    }
    //write function
    var jase = JSON.stringify(UI);
    post('UI from writeParamValues', UI);
    outlet(0, jase);
    //post('UI[trackNumber][currentClip].length', (UI[trackNumber][currentClip].length));
}


// CALLBACK ------------------------------------------------------------------------//
function callback(args) {
    //   post("setFunctions, callback: args ", args, "\n");
}

// NOTES --------------------------------------------------------------------------------//

// JSON PARSER ---------------------------------------------------------------------------//
//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.
//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.
//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.
//          For example, this would serialize Dates as ISO strings.
//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };
//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.
//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.
//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.
//          JSON.stringify(undefined) returns undefined.
//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.
//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.
//          Example:
//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'
//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'
//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.
//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.
//          Example:
//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.
//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });
//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );
//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.
/*jslint
    eval, for, this
*/
/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/
// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function() {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10) ?
            "0" + n :
            n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function() {

            return isFinite(this.valueOf()) ?
                (
                    this.getUTCFullYear() +
                    "-" +
                    f(this.getUTCMonth() + 1) +
                    "-" +
                    f(this.getUTCDate()) +
                    "T" +
                    f(this.getUTCHours()) +
                    ":" +
                    f(this.getUTCMinutes()) +
                    ":" +
                    f(this.getUTCSeconds()) +
                    "Z"
                ) :
                null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ?
            "\"" + string.replace(rx_escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ?
                    c :
                    "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\"" :
            "\"" + string + "\"";
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i; // The loop counter.
        var k; // The member key.
        var v; // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (
            value &&
            typeof value === "object" &&
            typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case "string":
                return quote(value);

            case "number":

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return (isFinite(value)) ?
                    String(value) :
                    "null";

            case "boolean":
            case "null":

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is "object", we might be dealing with an object or an array or
                // null.

            case "object":

                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.

                if (!value) {
                    return "null";
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ?
                        "[]" :
                        gap ?
                        (
                            "[\n" +
                            gap +
                            partial.join(",\n" + gap) +
                            "\n" +
                            mind +
                            "]"
                        ) :
                        "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap) ?
                                    ": " :
                                    ":"
                                ) + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap) ?
                                    ": " :
                                    ":"
                                ) + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ?
                    "{}" :
                    gap ?
                    "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" :
                    "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = { // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                    typeof replacer !== "object" ||
                    typeof replacer.length !== "number"
                )) {
                throw new Error("JSON.stringify");
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", {
                "": value
            });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function(a) {
                    return (
                        "\\u" +
                        ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                    .replace(rx_two, "@")
                    .replace(rx_three, "]")
                    .replace(rx_four, "")
                )
            ) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function") ?
                    walk({
                        "": j
                    }, "") :
                    j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());


// END OF DOC ---------------------------------------------------------------------------//
