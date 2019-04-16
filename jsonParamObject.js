// Dynamic variables
eval("var trackNum" + trackNumber + "={};");
log (eval("var clipNum" + currentClip + ";"));

//or

var trackNum = {};
var paramObject = trackNum['clipNum' + currentClip];

// init
getParamCount();

//
function createParamObject () {
trackNum.clipNum = new Array();
for (var i=0; i<paramCount; i++) {
    var param = paramCount[i];
    paramValue = selectedDevice.get('value);

    var paramValue = param.value;
    
    trackNum.clipNum.push({
	param : param.value});
}
}
