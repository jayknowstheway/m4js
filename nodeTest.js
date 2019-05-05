const maxApi = require('max-api');
const fs = require('fs'),
    path = require('path'),
    fileFile = ('writeToJson.json'),
    filePath = path.join(__dirname, fileFile);

var newObj = new Object;
var styleValue = 5;

// FUNCTION TO GET INLET PARAM OBJECT
maxApi.addHandler('appendParamData', (inletObject) => {

    console.log('addHandler inlet', inletObject);
    var paramObject = JSON.parse(inletObject);
    newObj.style = styleValue;
    newObj.PARAMS = paramObject;
    console.log('inlet', newObj);


    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {}
    });
    /*
	var obj = []; // define as an array
    obj = JSON.parse(data).BONUS; //now it an object
	obj.push(vBonus); //add some data
    var json = JSON.stringify(obj); //convert it back to json
    fs.writeFile(filePath, json, function(err) {
        if (err) throw err;
        console.log('complete');
    }); // write it back 
*/
    fs.writeFile("writeToJson.json", JSON.stringify(newObj), function(err) {
        if (err) throw err;
        console.log('complete');
    });
});

// FUNCTION TO GET INLET PARAM OBJECT
maxApi.addHandler('writeData', (x) => {

    console.log(newObj);
    fs.writeFile("writeToJson.json", JSON.stringify(newObj), function(err) {
        if (err) throw err;
        console.log('complete');
    });
});


// Read Write example ----------
// Read file
fs.readFile(filePath, {
    encoding: 'utf-8'
}, (err, data) => {
    if (!err) {
        console.log('readFile:', data);
    } else {
        console.log(err);
    }

    /*
        // WRITE FILE
        // create empty object
        var newData = {
            'DRUMS2': [
                [47, 48],
                [49, 50]
            ]
        };
        var obj = {
            paramData: []
        };

        // Add some data to it like
        //for (i = 0; i<5; i++)

        obj.paramData.push(
            JSON.stringify(newObj)
            //	JSON.stringify(newData)
            //	{ id: i, square: 2 }
        );
        //}

        obj.first = {
            "id": 0,
            "price": 123
        };
        //Convert it from an object to string with stringify
        var json = JSON.stringify(obj);
        console.log(json);

        fs.writeFile("writeToJson.json", json, function(err) {
            if (err) throw err;
            console.log('complete');
        });
    */
});



/*
//use fs to write the file to disk
//fs.writeFile('writeToJson.json', json, 'utf8');

//if you want to append it read the json file and convert it back to an object
fs.readFile(filePath, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    obj.table.push({id: 2, square:3}); //add some data
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile(filePath, json, 'utf8'); // write it back 
}});
*/


/*
// Open File --
fs.open(fileFile, 'r', (err, fd) => {
    if (err) throw err;
    //console.log('fs.open');

    // Read File --
    fs.readFile(filePath, {
        encoding: 'utf-8'
    }, (err, data) => {
        if (!err) {

            // Parse data
            var json = JSON.parse(data);

            // Get specific data
            console.log((json[0][1]), typeof(json[0][1]));

            // Append File --
            //	var anchors =[{"hi" : 1}];
            //	json.push(anchors);
            //	json.push('search result: ' + "SOMETHING");
            //	console.log('appendFile data: ' + data.push(anchors));
            //	    fs.writeFile(fileFile, JSON.stringify(json));

        } else {
            console.log(err);
        }

        fs.writeFile(fileFile, "HI");
        // Close File --
        fs.close(fd, (err) => {
            if (err) throw err;
            console.log('fs.close');
        });
    });
});

*/


/*
// REPOSITORY OF FUNCTIONS // -------------------------------------------------------//
// Read File ---------
fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);
    } else {
        console.log(err);
    }
});

*/

// Outlet --
//maxApi.outlet(0, "hi");
