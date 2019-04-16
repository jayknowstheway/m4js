autowatch = 1;

/*
 * Show/Hide menubar and fire event "menubar"
 */
function hidemenubar(onOff) {
	var evtData = "";
	if(onOff == 1) {
		this.max.hidemenubar();
		evtData = "hidden";
	
	} else {
		this.max.showmenubar();
			evtData = "visible";
	}
	// Fire the event "menubar" and attach the eventsData "hidden" or "visible" to it
	jm.event.fire(
		{
			eventName : "menubar",
			eventData : evtData
		}
	);
}

/*
 * Get a list of all registered events
 */
function getEvenNames() {
	outlet(0, "eventnames", jm.event.getEventNames());
};