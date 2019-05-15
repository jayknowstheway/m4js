
function setDial(val){
	liveSet = new LiveAPI('live_set view selected_track devices 1 drum_pads 36 chains 0 devices 0 parameters 1');
    //liveSet2 = new LiveAPI('live_set view selected_track devices 1 drum_pads 0 parameters 1');
    liveSet.set('value', val);
    post('dial and val', liveSet.get('name'), val);
}