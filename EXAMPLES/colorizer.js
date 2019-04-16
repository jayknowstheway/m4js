outlets=1;

var colorizerEnabled = false;

function cb(args) {
	if (!colorizerEnabled) return;
	
	if (args[0] == "playing_slot_index") {
		var state = parseInt(args[1]);
		
		if (state >= 0) {
			var slots = this.get("clip_slots");
			var trackColor = this.get("color");
			var id = this.path.replace(/['"]+/g, '') + " clip_slots " + state + " clip"; //'
			outlet(0,trackColor, id);
		}
	}
}

function setClipsToTrackColor(track) {
		var trackColor = track.get("color");
		
		var clipSlotCount = track.getcount("clip_slots");
		var clipSlot = new LiveAPI();
		for (var j=0 ; j<clipSlotCount ; j++) {
			var clip_slot_path = track.path.replace(/['"]+/g, '')+" clip_slots "+j; //'
			//var clipSlot = new LiveAPI(null, clip_slot_path);
			clipSlot.path = clip_slot_path;
			var hasClip = parseInt(clipSlot.get("has_clip"));
			
			if (hasClip==1) {
				var clip_path = clip_slot_path + " clip";
				var clip = new LiveAPI(null, clip_path);
				clip.set("color", trackColor);
			}
		}
}

function setAllClipsToTrackColors() {
	var live_set_path = "live_set";
	var live_set = new LiveAPI(null, live_set_path);
	var trackCount= live_set.getcount("tracks");
	
	for (var i=0 ; i<trackCount ; i++) {
		var track_path = live_set_path+" tracks "+i;
		var track = new LiveAPI(null, track_path);
		setClipsToTrackColor(track);
	}
}

function setcolors() {
	if (colorizerEnabled) {
		setAllClipsToTrackColors();
	}
}

function bang() {
	var live_set_path = "live_set";
	var live_set = new LiveAPI(null, live_set_path);
	var trackCount= live_set.getcount("tracks");
	
	for (var i=0 ; i<trackCount ; i++) {
		var track_path = live_set_path+" tracks "+i;
		var track = new LiveAPI(cb, track_path);
		track.property = "playing_slot_index";
	}
}

function msg_int(i) {
	if (i==0) colorizerEnabled = false;
	else if (i==1) colorizerEnabled = true;
}