inlets = 1;
outlets = 2;

var arrangerTrackNumber;
var metroCount;
var arrPlayingSlotOld;

var arrangeIteration;
var trackNumber;
var clipNumber;


var arrClipName;
var arrPlayingSlot;
var beginningMetro;
var endingMetro;
var loopEnabled = 0;

var measurePosition;

function midiIn(midi) {
    //    post('\nmidiIn message:', midi);

}

function onArrangeFire(bang) {
    // ERROR!!!!!!!!!!!!!! TRACK NUMBER NOT DEFINED>> FUCK THIS SHIT
    arrangerTrackNumber = null;
    if(arrangerTrackNumber == null){
	var api = new LiveAPI ('this_device');
var parts = api.unquotedpath.split (' ');
var arrangerTrackNumber = Number (parts[2]);
	post('trackNumber = ', arrangerTrackNumber);
    }
    
    post('onArrangeFire has been run.');
    // GETS CLIP NAME, FIRES ARRANGE FUNCTION
    // get playing_slot_index of arrangerTrackNumber (set as global var)
    var liveSet = new LiveAPI('live_set tracks ' + arrangerTrackNumber);
    arrPlayingSlot = liveSet.get('playing_slot_index');

    // ON NEW CLIP>> get name of clip
    //  if (arrPlayingSlotOld * 1 != arrPlayingSlot * 1) {
    //    arrPlayingSlotOld = arrPlayingSlot;
    var liveSet2 = new LiveAPI('live_set tracks ' + arrangerTrackNumber + ' clip_slots ' + arrPlayingSlot + ' clip');
    var arrangementClipName = liveSet2.get('name');
    var arrClipName = arrangementClipName.toString().split(" ");
    //post('\narrClipName = ', arrClipName, 'arrClipName[0]', arrClipName[0], typeof JSON.parse(arrClipName[0]));
    // run arrange function
    arrangeHouser(arrClipName);
    //    }
}


function arrangeHouser(num) {
    post('arrangementHouser number is', num);
    // HOUSES THE ARRANGEMENTS, RUNS ARRANGEMENT FUNCTION
    if (num == 1) {
        arrClipName =
            "0,0,0 0,0,8 0,0,16 0,0,24 0,9,26 0,9,27";
    }
    if (num == 50) {
        arrClipName = '0,29,0 1,29,0 3,29,0';
    }

    var arrNumbers = arrClipName.toString().split(" ");
    //post('\narrClipName = ', arrClipName, 'arrClipName[0]', arrClipName[0], typeof JSON.parse(arrClipName[0]));

    // run the arrange
    arrangeFunction(arrNumbers);
}


function arrangeFunction(arrangeIteration) {
    post('arrangeIterator, arrangeIteration', arrangeIteration, 'arrangeIteration.length', arrangeIteration.length);
    for (i = 0; i < arrangeIteration.length; i++) {
        var arrArray = arrangeIteration[i].toString().split(",");
        trackNumber = arrArray[0] * 1;
        clipNumber = arrArray[1] * 1;
        measurePosition = arrArray[2] * 1;
        post('\n arrArray[0]', arrArray[0], 'arrArray[1]', arrArray[1], 'arrArray[2]', arrArray[2], 'measurePosition', measurePosition);

        //if (arrangeIteration[i][2] == (metroCount)) {
        //post('\n trackNumber', trackNumber, 'clipNumber', clipNumber);
        var liveSet = new LiveAPI('live_set tracks ' + trackNumber + ' clip_slots ' + clipNumber + ' clip');
        if (liveSet) {
            liveSet.call('fire');
        }
        var liveSet2 = new LiveAPI('live_set tracks ' + trackNumber);
        if (liveSet2) {
            liveSet2.call('duplicate_clip_to_arrangement', "id " + liveSet.id, measurePosition * 1.0);
        }
    }
}



// END OF DOC ---------------------------------------------------------------------------//
