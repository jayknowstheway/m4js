/**
 * Loads the setup file and initializes the setup object.
 */
function loadSetup() {
    /*
     * Look for a setup file in the same folder as the patch.
     */
    var folder = new Folder(stripFileName(patcher.filepath));
    var endings = SETUP_FILE_ENDINGS;
    var setupFile = new File();
    for ( ;!folder.end; folder.next() ) {
        for  (i in endings) {
            /*
             * Match files in folders with the given name and endings.
             */
            var name = SETUP_FILE_NAME + "." + endings[i];
            if (folder.filename == name) {
                var fullName = folder.pathname + DIRECTORY_SEPARATOR + name;
                /*
                 * Found, open  file.
                 */
                setupFile = new File(fullName);
                loadedSetupFile = name;
//                setupFile.byteorder = SETUP_BYTEORDER;
                setupFile.linebreak = SETUP_LINEBREAK_STYLE;
            }
        }
    }
    if (!setupFile.isopen) {
        throw "Could not read setupFile file.";
    }
    /*
     * Init a string buffer for the contents of the file.
     */
    var setupBuf = "";
    /*
     * Read file in chunks.
     */
    while (setupFile.position < setupFile.eof) {
        var setupBuf = setupBuf + setupFile.readline(256) + LINE_BREAK;
    }
    /*
     * Prepare code for parsing.
     */
    setupBuf = (removeComments(setupBuf));
    setupBuf = (compressWhiteSpace(setupBuf));
    /*
     * Run in standard JSON parser.
     */
    setup = JSON.parse(setupBuf, null);
}
/**
 * Removes JavaScript comments from a string.
 */
function removeComments(s) {
  var lines, i, t;
  /*
   * Remove '//' comments from each line.
   */
  lines = s.split("n");
  t = "";
  for (i = 0; i < lines.length; i++)
    t += lines[i].replace(/([^x2f]*)x2fx2f.*$/, "$1");
  /*
   * Replace newline characters with spaces.
   */
  t = t.replace(/(.*)n(.*)/g, "$1 $2");
  /*
   * Remove C-style comments.
   */
  lines = t.split("*/");
  t = "";
  for (i = 0; i < lines.length; i++)
    t += lines[i].replace(/(.*)x2fx2a(.*)$/g, "$1 ");
  return t;
}
/**
 * Removes whitespace from a string.
 */
function compressWhiteSpace(s) {
  /*
   * Condense white space.
   */
  s = s.replace(/s+/g, " ");
  s = s.replace(/^s(.*)/, "$1");
  s = s.replace(/(.*)s$/, "$1");
  /*
   * Remove uneccessary white space around operators, braces and parentices.
   */
  s = s.replace(/s([x21x25x26x28x29x2ax2bx2cx2dx2fx3ax3bx3cx3dx3ex3fx5bx5dx5cx7bx7cx7dx7e])/g, "$1");
  s = s.replace(/([x21x25x26x28x29x2ax2bx2cx2dx2fx3ax3bx3cx3dx3ex3fx5bx5dx5cx7bx7cx7dx7e])s/g, "$1");
  return s;
}
/*
 * JSON parser
 * From http://json.org/json2.js
 */
/*
 * Note: mind js semicolon insertion. Do NOT edit line breaks.
 */
if(!this.JSON){JSON={};}
(function(){function f(n){return n
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z';};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[u0000u00adu0600-u0604u070fu17b4u17b5u200c-u200fu2028-u202fu2060-u206fufeffufff0-uffff]/g,escapable=/[\"x00-x1fx7f-x9fu00adu0600-u0604u070fu17b4u17b5u200c-u200fu2028-u202fu2060-u206fufeffufff0-uffff]/g,gap,indent,meta={'b':'\b','t':'\t','n':'\n','f':'\f','r':'\r','"':'\"','\':'\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i
v=partial.length===0?'[]':gap?'[n'+gap+
partial.join(',n'+gap)+'n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i
v=partial.length===0?'{}':gap?'{n'+gap+partial.join(',n'+gap)+'n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[],:{}s]*$/.test(text.replace(/\(?:["\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\nr]*"|true|false|null|-?d+(?:.d*)?(?:[eE][+-]?d+)?/g,']').replace(/(?:^|:|,)(?:s*[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());
/*
 * End parser
 */
