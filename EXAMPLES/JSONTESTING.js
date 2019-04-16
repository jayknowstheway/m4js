// JSON TESTING DOCUMENT
//https://stackoverflow.com/questions/29658961/how-to-create-a-json-object-in-javascript-for-loop
//Instead of creating the JSON in the for-loop, create a regular JavaScript object using your for-loops and use JSON.stringify(myObject) to create the JSON.

var myObject = {};

for(...) {
   myObject.property = 'newValue';
   myObject.anotherProp = [];
   for(...) {
       myObject.anotherProp.push('somethingElse');
    }
}

var json = JSON.stringify(myObject);

/////////////////////////////////////////////
// WORKING EXAMPLE //

vArray = [10,20,30,40]

var myObject = [];

for(var i = 0; i<vArray.length; i++) {
   myObject.push({i : vArray[i]});
}

JSON.stringify(myObject)
//"[{"i":10},{"i":20},{"i":30},{"i":40}]"
//////////////

var loop = [];

for(var x = 0; x < 10; x++){
 loop.push({value1: "value_a_" + x , value2: "value_b_" + x});
}

JSON.stringify({array: loop});


///////////

var result = {"array": []};


for(var i = 0; i < 2; i++){
    var valueDict = {};
    for(var j = 0; j < 2; j++){
        valueDict["value" + (j+1).toString()] = "value";
    }
    result["array"].push(valueDict);
}


// https://stackoverflow.com/questions/12290572/appending-to-json-file-in-javascript

//appending to json file in javascript
var data = JSON.parse(txt);  //parse the JSON
data.employees.push({        //add the employee
    firstName:"Mike",
    lastName:"Rut",
    time:"10:00 am",
    email:"rut@bah.com",
    phone:"800-888-8888",
    image:"images/mike.jpg"
});
txt = JSON.stringify(data);  //reserialize to JSON
//i surround that in a js file with function add(){ .. } and didnt see the values added to the employees.json file
//Yea, the code only overwrites the "txt" variable with the new JSON data. Save it to your file manually. If you are using node.js it would do this using fs.writeFile

////////////////////



// That's not JSON. It's just Javascript objects, and has nothing at all to do with JSON.
// You can use brackets to set the properties dynamically. Example:

var obj = {};
obj['name'] = value;
obj['anotherName'] = anotherValue;

//This gives exactly the same as creating the object with an object literal like this:
var obj = { name : value, anotherName : anotherValue };

// If you have already added the object to the ips collection, you use one pair of brackets to access the object in the collection, and another pair to access the propery in the object:
ips[ipId] = {};
ips[ipId]['name'] = value;
ips[ipId]['anotherName'] = anotherValue;

//You can also get a reference to the object back from the collection, and use that to access the object while it remains in the collection:
ips[ipId] = {};
var obj = ips[ipId];
obj['name'] = value;
obj['anotherName'] = anotherValue;

//You can use string variables to specify the names of the properties:

var name = 'name';
obj[name] = value;
name = 'anotherName';
obj[name] = anotherValue;

//It's value of the variable (the string) that identifies the property, so while you use obj[name] for both properties in the code above, it's the string in the variable at the moment that you access it that determines what property will be accessed.

// COMMENTS
/*
pastie.org/1264618 as I mentioned, it only allows for one name value pair... – Mike Nov 1 '10 at 18:40
Setting one property doesn't overwrite another property. The likely reason is that you are creating a new object each time which replaces the previous, so that it only has the latest property in it. – Guffa Nov 1 '10 at 18:44
yes, that is precisely what is happening. See my pastie. Do you see anyway around that? – Mike Nov 1 '10 at 18:49
@Mike: You can check if the object already exist, so that you only create one the first time: pastie.org/1264654 – Guffa Nov 1 '10 at 18:55
adding a (if(!ips[ipID]){ ips[ipID] = {};} does the trick. – Mike Nov 1 '10 at 18:57
*/

//////////////////

//You can use computed property names in object property definitions, for example:

var name1 = 'John'; 
var value1 = '42'; 
var name2 = 'Sarah'; 
var value2 = '35';

var ipID = { 
             [name1] : value1, 
             [name2] : value2 
           }

//This is equivalent to the following, where you have variables for the property names.

var ipID = { 
             John: '42', 
             Sarah: '35' 
}

////////////////////////



//I'm assuming each entry in "ips" can have multiple name value pairs - so it's nested. You can achieve this data structure as such:

var ips = {}

function addIpId(ipID, name, value) {
    if (!ips[ipID]) ip[ipID] = {};
    var entries = ip[ipID];
    // you could add a check to ensure the name-value par's not already defined here
    entries[name] = value;
}



/////////////////////////

//From what the other answers have proposed, I believe this might help:

var object = ips[ipId];
var name = "Joe";
var anothername = "Fred";
var value = "Thingy";
var anothervalue = "Fingy";
object[name] = value;
object[anothername] = anothervalue;

//However, this is not tested, just an assumption based on the constant repetition of:

object["string"] = value;
//object = {string: value}

/////////////////////////

//if my understanding of your initial JSON is correct, either of these solutions might help you loop through all ip ids & assign each one, a new object.

// initial JSON
var ips = {ipId1: {}, ipId2: {}};

// Solution1
Object.keys(ips).forEach(function(key) {
  ips[key] = {name: 'value', anotherName: 'another value'};
});

// Solution 2
Object.keys(ips).forEach(function(key) {
  Object.assign(ips[key],{name: 'value', anotherName: 'another value'});
});

//To confirm:

console.log(JSON.stringify(ips, null, 2));

//The above statement spits:

{
  "ipId1": {
    "name":"value",
    "anotherName":"another value"
  },
  "ipId2": {
    "name":"value",
    "anotherName":"another value"
  }
}

////////////////////////
// https://stackoverflow.com/questions/3898563/appending-to-json-object-using-javascript

// I'm building the JSON object using JavaScript. How would I inset the following data to the bottom of the stack:

"hello": { "label":"Hello", "url":"#hello" }

//into this variable:

var ListData = {
  "main": {
    "label":"Main",
    "url":"#main"
  },
  "project": {
    "label":"Project",
    "url":"#project"
  }
};



// You can insert it directly with an object literal:

ListData.hello = { label: "Hello", url: "#hello" }; 

// OR

var dest = {"hello": { "label":"Hello", "url":"#hello" }};


var data = _.extend(src, dest);
console.log(JSON.stringify(data));

////////////////

// Start with some JSON
var myJson = { "name":"George Washington", "rank":"General", "serial":"102" };

// Append data
myJson.encampment = "Valley Forge";    

// Delete data
delete myJson.encampment

///////////////////
//https://stackoverflow.com/questions/15009448/creating-a-json-dynamically-with-each-input-value-using-jquery

var obj = [];
var elems = $("input[class=email]");

for (i = 0; i < elems.length; i += 1) {
    var id = this.getAttribute('title');
    var email = this.value;
    tmp = {
        'title': id,
        'email': email
    };

    obj.push(tmp);
}

////////////////

 let str = '{" + yourKey + ":'+yourValue+'}';
str = JSON.parse(str);



//////////////////////
// https://stackoverflow.com/questions/18884840/adding-a-new-array-element-to-a-json-object

yourObj.theTeam.push({"teamId":"4","status":"pending"});

//When you read the JSON object from the file, is it being interpreted as JSON or a string? If its a string you need to parse the string as JSON first then you can do what the other comment and answer are suggesting.

// @CharlesWyke-Smith What type is your teamJSON variable? Is it a JSON string, ie '{"theTeam":[...]}' or an actual object literal? Hint: use console.log(typeof teamJSON)

///////////////////////



// JSON is just a notation; to make the change you want parse it so you can apply the changes to a native JavaScript Object, then stringify back to JSON

var jsonStr = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}';

var obj = JSON.parse(jsonStr);
obj['theTeam'].push({"teamId":"4","status":"pending"});
jsonStr = JSON.stringify(obj);
// "{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"},{"teamId":"4","status":"pending"}]}"

// And, If you want to add at first position then use code

var parse_obj = JSON.parse(Str_txt);
parse_obj['theTeam'].unshift({"teamId":"4","status":"pending"});
Str_txt = JSON.stringify(parse_obj);
Output //"{"theTeam":[{"teamId":"4","status":"pending"},{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}"

// And, Anyone wants to add at a certain position of an array then try below code

fruits['theTeam'].splice(2, 0, {"teamId":"4","status":"pending"});
Output //"{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"4","status":"pending"},{"teamId":"3","status":"member"}]}"

// Above code block add an element after the second element.

// Finally we JSON.stringify the obj back to json


//////////////////
// Matrix in max
// https://cycling74.com/forums/should-be-simple-how-to-get-a-matrix-into-and-out-of-javascript

inlets = 1;
outlets = 2;

var outmatrix = new JitterMatrix(4,"char",320,240);

function jit_matrix(mname) {
	var matrix = new JitterMatrix(mname);

	var planemap = new Array();
	planemap[0]=0;
	planemap[1]=3;
	planemap[2]=2;
	planemap[3]=1;
	outmatrix.planemap  = planemap;
	outmatrix.frommatrix(matrix);
	outlet(0,"jit_matrix",outmatrix.name);	
}

function bang() {

	var matrix = new JitterMatrix("noisemat");	// defined in max patch
	for(i=0; i<10; i++) {
		for(j=0; j<10; j++) {
			var val = matrix.getcell(j, i);
			matrix.setcell(j,i,"val",val[0],val[1]-100,val[2]-100,val[3]-100);
		}
	}
	outlet(1,"jit_matrix",matrix.name);	
}
