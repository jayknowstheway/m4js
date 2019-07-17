const maxApi = require('max-api');
const fs = require('fs'),
    path = require('path'),
    fileFile = ('writeToJson.json'),
    filePath = path.join(__dirname, fileFile);

var newObj = new Object;
var styleValue = 5;
var dynamicParamName = "PARAMS";
var paramObject;

// Write Param Data
maxApi.addHandler('writeParamData', (inletObject) => {
    paramObject = JSON.parse(inletObject); // parse inletObject
    newObj.style = styleValue; // create test object
    newObj[dynamicParamName] = paramObject; //append inletObject
        if (paramObject) {
        fs.writeFile("params.json", JSON.stringify(newObj), function(err) {
            if (err) throw err;
        });
    }
});


// Write MIDI Data
maxApi.addHandler('writeMidiData', (inletObject) => {
    paramObject = JSON.parse(inletObject); // parse inletObject
    newObj[dynamicParamName] = paramObject; //append inletObject
        if (paramObject) {
        fs.writeFile("midi.json", JSON.stringify(newObj), function(err) {
            if (err) throw err;
        });
    }
});

function write() {
    if (paramObject) {
        fs.writeFile("writeToJson.json", JSON.stringify(newObj), function(err) {
            if (err) throw err;
        });
    }
}

// FUNCTION TO GET INLET PARAM OBJECT
maxApi.addHandler('writeData', (x) => {
    console.log(newObj);
    fs.writeFile("writeToJson.json", JSON.stringify(newObj), function(err) {
        if (err) throw err;
        console.log('complete');
    });
});


/* USERFUL RESOURCES // --------------------------------

API - Node API
https://nodejs.org/api/fs.html

API - Max - The File Object
https://docs.cycling74.com/max7/vignettes/jsfileobject

VIDEO - Node for Max Getting Started
https://www.youtube.com/watch?v=QuIcEHJSwz8

VIDEO - Saving Data to JSON File with Node.js
https://www.youtube.com/watch?v=6iZiqQZBQJY

STACK OVERFLOW - Best Practices for Node error handling
https://stackoverflow.com/questions/7310521/node-js-best-practice-exception-handling#7313005

/* ----------------------------------------------------

/* -------------- SCRATCH FUNCTIONS ------------------------//
//use fs to write the file to disk
// https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
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
// https://stackoverflow.com/questions/50514554/push-is-not-a-function-node-js
	var obj = []; // define as an array
    obj = JSON.parse(data).BONUS; //now it an object
	obj.push(vBonus); //add some data
    var json = JSON.stringify(obj); //convert it back to json
    fs.writeFile(filePath, json, function(err) {
        if (err) throw err;
        console.log('complete');
    }); // write it back 

// Edit: As a cool tip, you can rewrite
//var notestring  = fs.readFileSync('notes-data.json');
//notes = JSON.parse(notestring);
//As
//var notesData = require('notes-data.json'); 
//The require method will parse the json for you.
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
                // OR //
    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) throw err;
    });


*/

// Outlet --
//maxApi.outlet(0, "hi");
