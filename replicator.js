// replicator.js
autowatch = 1;
inlets = 1;
outlets = 2;

var logEnabled = 1;
var nextDevice;
var numOfParams;
var paramObject = [];
var deviceName;
var arrayOfParamValues;

var memstr;
var mem = new Object();
var UI = new Object();
var UIMidi = new Object();
//var p = "/Users/jwalker/Documents/Max\ 8/Max\ for\ Live\ Devices/JS-BUILDER\ Project/code/replicator.json";
var p = "/Users/jwalker/Music/AUDIO/ABLETON/ABLETON\ USER\ LIBRARY/PATCHES/M4L\ PATCHES/CUSTOM/JS/replicator.json";

var maxKnobValue = 127;
var interpolateArray;


// GET PARAM VALUES /////////////////////////////////////////

function getParamValues() {
    nextDevice = getNextDevice();
    numOfParams = nextDevice.getcount('parameters');
    log("getParamValues - nextDevice.path", nextDevice.path, "numOfParams", numOfParams);
    deviceName = nextDevice.get('name');
    log(deviceName);
    for (i = 0; i < numOfParams; i++) {
        var nextDevicePath = removeQuotes(nextDevice.path);
        var pathArray = nextDevicePath.split(" ");
        // add param number
        pathArray.push('parameters', i);
        //rebuild the string
        var newPath = pathArray.join(" ");
        var selectedParam = new LiveAPI(newPath);
        var paramValue = selectedParam.get('value');
        paramObject[i] = paramValue;
        selectedParam.get('name');
        log(selectedParam.get('name'), paramValue);
        var paramChunkArray = [];
    }
    arrayOfParamValues = (chunk(paramObject, 10));
    // create arrays for each group of 8, and remove string
    for (var i = 0; i < arrayOfParamValues.length; i++) {
        paramObject[i] = '[' + arrayOfParamValues[i] + ']';
        log('paramObject', i, paramObject[i]);
        // In this code, JSON.parse makes them arrays and not strings.
        paramChunkArray.push(JSON.parse(paramObject[i]));
    }
    //    log('paramChunkObject',paramChunkArray);
    arrayOfParamValues = paramChunkArray;
}


function chunk(arr, len) {
    // creates arrays in groups of 10
    var chunks = [],
        i = 1,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

// SET FUNCTIONS

function setParamValues() {
    var chosenParam = 0;
    var arrayOfParamValuesLength = arrayOfParamValues.length;
    var n = arrayOfParamValuesLength;

    // Set Param Values based on JSON
    while (n--) {
        var n2 = arrayOfParamValues[n].length;
        while (n2--) {
            var nextDevicePath = removeQuotes(nextDevice.path);
            var pathArray = nextDevicePath.split(" ");
            // add param number
            pathArray.push('parameters', n);
            //rebuild the string
            var newPath = pathArray.join(" ");
            var selectedParam = new LiveAPI(newPath);
            selectedParam.set('value', arrayOfParamValues[n][n2]);
            log("PARAM CHANGE", "ParameterNo:", n, "ParameterValue", arrayOfParamValues[n]);
        }
    } //else {
    //            log('setParamValues -- SOMETHING IS EQUAL TO NULL');
    //            log('setParamValues -- arrayOfParamValues[i]', arrayOfParamValues[i], 'arrayOfParamValues', arrayOfParamValues, 'clipName', clipName);
}

// DEVICE PATH MANIPULATION ///////////////////////////////////

function getNextDevice() {
    var api = new LiveAPI();
    api.path = 'live_set view selected_track this_device';

    var nextPath = removeQuotes(api.path);
    nextPath = moveToTheRight(nextPath); // + " chain 10";

    //pipe that string back into the LiveAPI
    api = new LiveAPI(nextPath);

    //and confirm that this worked
    return api;
}

function moveToTheRight(devicePath) {
    //split into a more usable array
    var pathArray = devicePath.split(" ");

    // increment the device number
    var newNumber = Number(pathArray.slice(-1)[0]) + 1;
    pathArray.splice(-1, 1, newNumber);

    //rebuild the string
    return pathArray.join(" ");
}

function removeQuotes(str) {
    return str.split('"').join("");
}



// INTERPOLATOR ////////////////////////////////////////////////
// Note: This only works for arrays like this [0,1,2],[2,3,4]
function interpolator(knob) {
    //  read();
    //    log('arrayPoints', arrayPoints[0][1]);
    var currentPosition = [];
    var input;
    var idx;
    var frac;
    var output;

    var combined = [];
    var arrayIndex = [];
    var arrayPoints = [];

    for (var i = 0; i < interpolateArray.length; i++) {
        arrayPoints.push(interpolateArray[i]);
//	log('interpolateArray', interpolateArray, interpolateArray.length);
    }
    for (var i = 0; i < arrayPoints.length; i++) {
        for (var j = 0; j < arrayPoints[i].length; j++) {
            if (!combined[j]) {
                combined[j] = new Array;
            }
            combined[j].push(arrayPoints[i][j]);
        }
//	log('LOGGED1', combined.length);
    }
    // new arrays are created for each index
    for (var i = 0; i < (combined.length); i++) {
//		log('LOGGED2');
        var bigValues = combined[i];
        input = knob / maxKnobValue;
        idx = Math.floor(input * (bigValues.length - 1));
        frac = (input - (idx) / (bigValues.length - 1)) * (bigValues.length - 1);
        if (frac == 0) {
            /* no need to calculate */
            output = bigValues[idx];
        } else {
            output = bigValues[idx] + (bigValues[idx + 1] - bigValues[idx]) * frac;
        };
        currentPosition = (output);
        // log('currentPosition i combined[i] output', i, combined[i], output);

        //
        var nextDevicePath = removeQuotes(nextDevice.path);
        var pathArray = nextDevicePath.split(" ");
        // add param number
        pathArray.push('parameters', i + 1);
        //rebuild the string
        var newPath = pathArray.join(" ");
        var secondDevice = new LiveAPI(newPath);

        	log('interpolate =', secondDevice.get('name'));
        secondDevice.set('value', output);
        //	secondDevice.get('name');

        log('output', currentPosition);
    }
   // outlet(1, currentPosition);
}


// READ ///////////////////////////////////////////////////////////

function read() {
    memstr = "";
    data = "";
    maxchars = 8000;
    path = p;
    var f = new File(path, "read");
    f.open();
    if (f.isopen) {
        while (f.position < f.eof) {
            memstr += f.readstring(maxchars);
        }
        f.close();
    } else {
        post("Error\n");
    }
    createInterpolateArray();
}

function createInterpolateArray() {
    var objKey = deviceName;
    var UIObject = JSON.parse(memstr);
    if (objKey == null) {
        objKey = "PARAMS";
    }
    UI = UIObject[objKey];
    if (UI) {
        interpolateArray = UI[deviceName];
        //log('read trackNumber currentClip', trackNumber, currentClip);
        log('read() UI=interpolateArray', interpolateArray, 'length', interpolateArray.length);
        for (i = 0; i < interpolateArray.length; i++) {
            log('target arrays:', interpolateArray[i], 'length', interpolateArray[i].length, '\n');
        }
    }
    log('UI in read function - ', UI);
    //    UI = eval("(" + memstr + ")"); //much less secure, but could work
}

// WRITE FUNCTIONS /////////////////////////////////////////////////////

function write() {
    read();
    anything(arrayOfParamValues);
    var jase = JSON.stringify(UI);
    log('UI from write', UI);
    outlet(1, deviceName);
    outlet(0, jase);
}

function anything(a) {

    var data = a;
    if (UI == null) {
        UI = new Object();
        log('anything - new UI Object created');
    }
    if (UI[deviceName]) {
        log('anything - contents of UI[0]', UI[0]);
        data = a;
        UI[deviceName][0] = data;
    } else {
        UI[deviceName] = data;
    }

    log('anything - data/UI', data, UI);
}

function pushToArray(a) {
    // push additional anything array
    /*
    var a = arrayfromargs(arguments);
    var id = a[0];
    var property = a[1];
    var data = a[2];
    //var data = a.slice(2);
    // the .slice method creates a new unnecessary array.
    post("\nanything", id, ",", property, ",", data);
    */
    var data = a;
    if (UI == null) {
        UI = new Object();
        log('pushToArray, new UI object created');
    }
    if (UI[deviceName] == null) {
        log('anything: UI[deviceName] was null ---------------');
        UI[deviceName] = new Object();
    }

    UI[deviceName][UI[deviceName].length] = data[0]; //[id][property][UI[id][property].length] = data;
    log('pushToArray - data', data);
}

// CRUD ////////////////////////////////////////////////////////////////

function crud(crud) {
    read();
    switch (crud) {
        case 0: //"Create"
            log('crud CREATE!');
            if (!UI) {
                write();
            } else {
                getParamValues();
                pushToArray(arrayOfParamValues);
            }
            break;
        case 1: // "ReadNext"
            log('crud READNEXT!');
            if (!UI) {
                write();
            } else {
                (UI).push(UI.shift());
                arrayOfParamValues = UI[0];
                arrayOfParamValues = UI[0];
                setParamValues();
            }
            break;
        case 2: // "ReadPrevious"
            log('crud READPREVIOUS!');
            if (!UI) {
                write();
            } else {
                (UI).unshift(UI.pop());
                arrayOfParamValues = UI[0];
                setParamValues();
            }
            break;
        case 3: // "Update"
            log('crud UPDATE!');
            //            getParamValues2();
            //            anything(trackNumber, currentClip, arrayOfParamValues);
            break;
        case 4: // "Delete"
            log('switchParamsArray DELETE!');
            if (UI) {
                UI.splice(0, 1);
                arrayOfParamValues = UI;
                setParamValues();
            }
            break;

    }
    //write function
    var jase = JSON.stringify(UI);
    log('UI from writeParamValues', UI);
    outlet(0, jase);
    //log('UI[trackNumber][currentClip].length', (UI[trackNumber][currentClip].length));
}


function test() {
    log(UI);
    log(UI[deviceName][0]);

}



// LOGGING -------------------------------------------------------------------------------//

function log() {
    if (logEnabled == 1) {
        for (var i = 0, len = arguments.length; i < len; i++) {
            var message = arguments[i];
            if (message && message.toString) {
                var s = message.toString();
                if (s.indexOf("[object ") >= 0) {
                    s = JSON.stringify(message);
                }
                post(s);
            } else if (message === null) {
                post("<null>");
            } else {
                post(message);
            }
        }
        post("\n");
    }
}
console = {
    log: log
};
log("__________________________________________________");


// CALLBACKS -----------------------------------------------------------------------------//

function callback() {}

// JSON PARSER ---------------------------------------------------------------------------//
//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.
//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.
//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.
//          For example, this would serialize Dates as ISO strings.
//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };
//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.
//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.
//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.
//          JSON.stringify(undefined) returns undefined.
//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.
//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.
//          Example:
//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'
//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'
//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.
//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.
//          Example:
//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.
//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });
//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );
//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.
/*jslint
    eval, for, this
*/
/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/
// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function() {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10) ?
            "0" + n :
            n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function() {

            return isFinite(this.valueOf()) ?
                (
                    this.getUTCFullYear() +
                    "-" +
                    f(this.getUTCMonth() + 1) +
                    "-" +
                    f(this.getUTCDate()) +
                    "T" +
                    f(this.getUTCHours()) +
                    ":" +
                    f(this.getUTCMinutes()) +
                    ":" +
                    f(this.getUTCSeconds()) +
                    "Z"
                ) :
                null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ?
            "\"" + string.replace(rx_escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ?
                    c :
                    "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\"" :
            "\"" + string + "\"";
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i; // The loop counter.
        var k; // The member key.
        var v; // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (
            value &&
            typeof value === "object" &&
            typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case "string":
                return quote(value);

            case "number":

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return (isFinite(value)) ?
                    String(value) :
                    "null";

            case "boolean":
            case "null":

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is "object", we might be dealing with an object or an array or
                // null.

            case "object":

                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.

                if (!value) {
                    return "null";
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ?
                        "[]" :
                        gap ?
                        (
                            "[\n" +
                            gap +
                            partial.join(",\n" + gap) +
                            "\n" +
                            mind +
                            "]"
                        ) :
                        "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap) ?
                                    ": " :
                                    ":"
                                ) + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap) ?
                                    ": " :
                                    ":"
                                ) + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ?
                    "{}" :
                    gap ?
                    "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" :
                    "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = { // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                    typeof replacer !== "object" ||
                    typeof replacer.length !== "number"
                )) {
                throw new Error("JSON.stringify");
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", {
                "": value
            });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function(a) {
                    return (
                        "\\u" +
                        ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                    .replace(rx_two, "@")
                    .replace(rx_three, "]")
                    .replace(rx_four, "")
                )
            ) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function") ?
                    walk({
                        "": j
                    }, "") :
                    j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());
