autowatch = 1;
inlets = 1;
outlets = 1;

var params = null;
var paramsCount = null;
var isReady = false;

/* API is ready */
function bang ()
{
	isReady = true;
}

function setDial (dial, val)
{
	if (!isReady)
		return;
    var param = getParameter (dial);
    if (param == null)
	{
        post ('\nNo Parameter #' + dial);
		return;
	}

	// Scale from 0-127 to min-max range
    var min = parseFloat (param.get ('min'));
    var max = parseFloat (param.get ('max'));
	var scaled = min + ((max - min) / 127.0 * val);
    param.set ('value', scaled);
}

function setMute (enable)
{
	if (!isReady)
		return;
    var track = new LiveAPI (dummyCallback, 'live_set view selected_track');
    if (track)
        track.set ('mute', enable);
}

function setSolo (enable)
{
	if (!isReady)
		return;
    var track = new LiveAPI (dummyCallback, 'live_set view selected_track');
    if (track)
        track.set ('solo', enable);
}

function setRecord (enable)
{
	if (!isReady)
		return;
    var track = new LiveAPI (dummyCallback, 'live_set view selected_track');
    if (!track)
        return;
    if (track.get ('can_be_armed'))
        track.set ('arm', enable);
}

function setVolume (volume)
{
	if (!isReady)
		return;
    var vol = new LiveAPI (dummyCallback, 'live_set view selected_track mixer_device volume');
    if (!vol)
        return;
    if (vol.get ('is_enabled'))
        vol.set ('value', volume);
}

function setSend (dial, val)
{
	if (!isReady)
		return;
    var param = new LiveAPI (dummyCallback, 'live_set view selected_track mixer_device sends ' + dial);
    if (!param)
        return;
    param.set ('value', val);
}

function selectAndRecordTrack (trackIndex)
{
	if (!isReady)
		return;
    var liveSet = new LiveAPI (dummyCallback, 'live_set');
    var trackCount = liveSet.getcount ('tracks')

    if (trackIndex < 1 || trackIndex > trackCount)
        return;
    trackIndex--; // Tracks are Zero based

    // Arm if possible
    var tracks = new LiveAPI (dummyCallback, '');
    for (var i = 0; i < trackCount; i++)
    {
        tracks.path = [ 'live_set', 'tracks', i];
        if (tracks.get ('can_be_armed'))
            tracks.set ('arm', i == trackIndex ? 1 : 0);
    }

    // Send out for track selection
    outlet (0, trackIndex);
}

function getParameter (paramNum)
{
    if (params == null)
    {
		paramsCount = new LiveAPI ();
        params = new Array (8);
        for (var i = 0; i < 8; i++)
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

function dummyCallback ()
{
}

/*function printProperties (o)
{
    for (x in o)
        post ('\n' + x + ": " + o[x]);
}*/
