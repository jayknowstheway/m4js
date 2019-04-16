outlets = 2;
var message=[0,0];
var sysex_i = 0;
var type;
var pitchb;
var midi0;

function bang()
{
   message[0]&=0xF; 
  message[0]++;
  outlet(0,type,message);
  sysex_i = 0;
  message=[0];
}


function msg_int(v)
    {
switch(v)
{
case 240:
                sysex_i = 0;
                message=[0];
 break;
case 247:
    outlet(1,message);
     sysex_i = 0;
     message=[0];
break;
default:
    if (sysex_i>63) sysex_i=0;
     if ((v<240)&(v>127)) sysex_i=0;
    message[sysex_i++]=v;




if (sysex_i>2) 
{
// note off 
if ((message[0]>>4)==8) {type="NOTE_OFF"; bang();}
//note on
if ((message[0]>>4)==9) {type="NOTE_ON"; bang();}
// poly after touch
if ((message[0]>>4)==10)  {type="PA"; bang();}
// Control change
 if ((message[0]>>4)==11)  {type="CC"; bang();}
// pitch bend

if ((message[0]>>4)==14)  {type="PB"; 
pitchb=(message[2]<<7)+message[1];

message=[message[0],pitchb];
bang();}
}
 if (sysex_i>1)
{
if ((message[0]>>4)==12) {type="PC";bang();}
if ((message[0]>>4)==13) {type="AT";bang();}
 }
break;
        }
}


