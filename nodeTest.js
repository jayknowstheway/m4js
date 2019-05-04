
const maxAPI = require('max-api');
const fs = require('fs'),
    path = require('path'),    
      filePath = path.join(__dirname, 'writeToJson.json'),
      fileFile = ('writeToJson.json');


fs.open('writeToJson.json', 'r', (err, fd) => {
  if (err) throw err;
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});



// Read File

fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);
    } else {
        console.log(err);
    }
});

//



var obj = {
   table: []
};

// Add some data to it like
obj.table.push({id: 1, square:2});

//Convert it from an object to string with stringify
var json = JSON.stringify(obj);
console.log(json);

fs.writeFile ("writeToJson.json", json, function(err) {
    if (err) throw err;
    console.log('complete');
    }
);


//use fs to write the file to disk
//fs.writeFile('writeToJson.json', json, 'utf8');

/*
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
