// nodeTest2.js

const maxApi = require('max-api');
const fs = require('fs'),
    path = require('path'),
    fileFile = ('replicator.json'),
    filePath = path.join(__dirname, fileFile);

var newObj = new Object;
var dynamicParamName = "DEVICE";
var paramObject;

/*
function getDeviceName (inletObject) {
    dynamicParamName = inletObject;
    console.log(dynamicParamName);
}
*/


maxApi.addHandler('getDeviceName', (inletObject) => {
    dynamicParamName = inletObject;
    console.log(dynamicParamName);
});


// Write Param Data
maxApi.addHandler('writeData', (inletObject) => {
    paramObject = JSON.parse(inletObject); // parse inletObject
//    newObj[dynamicParamName] = paramObject; //append inletObject
    newObj = paramObject;
    console.log(paramObject);
        if (paramObject) {
        fs.writeFile("replicator.json", JSON.stringify(newObj), function(err) {
            if (err) throw err;
        });
    }
});
