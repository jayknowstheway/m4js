function getParameter(paramNum) {
// Get Parameter value so Dial can affect it-
    if (params == null) {
        paramCount = new LiveAPI();
        params = new Array(paramsTotal);
        for (var i = 0; i < paramsTotal; i++)
            params[i] = new LiveAPI();
    }
    // Check if parameter is available
    paramCount.path = ['live_set', 'view', 'selected_track', 'devices', '0'];
    var size = paramCount.getcount('parameters');
    if (paramNum >= size)
        return null;
    var p = params[paramNum - 1];
    p.path = ['live_set', 'view', 'selected_track', 'devices', '0', 'parameters', paramNum];
    return p;
}

function setDial(dial, val) {
    if (trackChangeInit == 0) {
        bank = 0;
        trackChangeInit = 1;
        log('bank reset to 0');
    } else {
        getSelectedBank();
        dial = dial + bank;
    }
}
