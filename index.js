
const CUBE_ID_ARRAY = [ 0, 1, 2 ];
const SUPPORT_CUBE_NUM = CUBE_ID_ARRAY.length;

// Global Variables.
const gCubes = [ undefined, undefined, undefined ];

//'0xb3', '0x01', '0xb2', '0x01'
//'0x43', '0x00', '0x3f', '0x00'

var toiomax = [438, 438];
var toiomin = [58, 60];


var xmax = 308;
var ymax = 212;
let toiox = [0];
let toioy = [0];

var slider1 = document.getElementById("slider1");
var speed1 = 0xFF;

  const SERVICE_UUID              = '10b20100-5b3b-4571-9508-cf3efcd7bbae';
  const MOVE_CHARCTERISTICS_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae';
  const SOUND_CHARCTERISTICS_UUID = '10b20104-5b3b-4571-9508-cf3efcd7bbae';
  const LIGHT_CHARCTERISTICS_UUID = '10b20103-5b3b-4571-9508-cf3efcd7bbae';
  const POSITION_CHARACTERISTICS_UUID = '10b20101-5b3b-4571-9508-cf3efcd7bbae';

  const connectNewCube = () => {
      const cube = {
          device:undefined,
          sever:undefined,
          service:undefined,
          soundChar:undefined,
          moveChar:undefined,
          lightChar:undefined,
          posChar: undefined

      };

      // Scan only toio Core Cubes
      const options = {
          filters: [
              { services: [ SERVICE_UUID ] },
          ],
      }

      navigator.bluetooth.requestDevice( options ).then( device => {
          cube.device = device;
          if( cube === gCubes[0] ){
              turnOnLightCian( cube );
              const cubeID = 1;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }else if( cube === gCubes[1] ){
              turnOnLightGreen( cube );
              spinCube( cube );
              const cubeID = 2;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }
          changeConnectCubeButtonStatus( undefined, cube, false );
          return device.gatt.connect();
      }).then( server => {
          cube.server = server;
          return server.getPrimaryService( SERVICE_UUID );
      }).then(service => {
          cube.service = service;
          return cube.service.getCharacteristic( MOVE_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.moveChar = characteristic;
          return cube.service.getCharacteristic( SOUND_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.soundChar = characteristic;
          return cube.service.getCharacteristic( LIGHT_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.lightChar = characteristic;
          return cube.service.getCharacteristic( POSITION_CHARACTERISTICS_UUID );
      }).then( characteristic => {
          cube.posChar = characteristic;
          if( cube === gCubes[0] ){
            turnOnLightCian( cube );
            spinCube( cube );
            enableMoveButtons();
          }else if( cube === gCubes[1] ){
            turnOnLightGreen( cube );
          }else{
            turnOnLightRed( cube );
          }
      });

      return cube;
  }



  // Cube Commands
  // -- Light Commands
  var myCharacteristic;
  const turnOffLight = ( cube ) => {

      const CMD_TURN_OFF = 0x01;
      const buf = new Uint8Array([ CMD_TURN_OFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );

      }

  }


  const turnOnLightGreen = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF]);

      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('green');
      }

  }

  const turnOnLightCian = ( cube ) => {

      // Cian light
    const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('cyan');

      }

  }

  const turnOnLightRed = ( cube ) => {

      // Red light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
      }

  }


  const spinCube = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x14, 0x64 ]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('spin');
      }
          onStartButtonClick();

  }

  const changeButtonStatus = ( btID, enabled ) => {
      document.getElementById( btID ).disabled = !enabled;
  }


  const changeConnectCubeButtonStatus = ( idButton, cube, enabled ) => {

      if( idButton ){
          changeButtonStatus( 'btConnectCube' + ( idButton + 1 ), enabled );
      }else{
          if( gCubes[0] === cube ){
              changeButtonStatus( 'btConnectCube1', enabled );
          }else if( gCubes[1] === cube ){
              changeButtonStatus( 'btConnectCube2', enabled );
          }else{
              changeButtonStatus( 'btConnectCube3', enabled );
          }
      }

  }

  const enableMoveButtons = () => {
    changeButtonStatus( 'btMoveFW', true );
    changeButtonStatus( 'btMoveB', true );
    changeButtonStatus( 'btMoveL', true );
    changeButtonStatus( 'btMoveR', true );
  }


  const cubeMove = ( moveID, cubeno,speed ) => {
      const cube = gCubes[cubeno];
      var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
      // forward

      console.log(speed);
      if(moveID==1){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x01, speed]);
    }else if (moveID==2){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, speed, 0x02, 0x02, speed]);
    }else if (moveID==3){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x14, 0x02, 0x01, speed]);
    }else if (moveID==4){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x02, 0x14]);
    }else if (moveID==5){
      buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x01, speed, 0x50]);
    }
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('move');
      }

  }

  const cubeStop = () =>{
      const cube = gCubes[0];
      const buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x00, 0x02, 0x01, 0x00]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          setTimeout(() => {cube.moveChar.writeValue( buf )},100);
          console.log('stop');
      }
  }

  function onStartButtonClick() {
    const buf1 = new Uint8Array([ 0x18, 0x00, 0x01, 0x01 ]);
    gCubes[0].posChar.writeValue(buf1);
    //posCharacteristic = gCubes[0].posChar.readValue();
    //console.log(posCharacteristic);
    return gCubes[0].posChar.startNotifications().then(_ => {
      console.log('> Notifications started');
      gCubes[0].posChar.addEventListener('characteristicvaluechanged',
          handleNotifications);
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function handleNotifications(event) {
  // let value = event.target.value;
  // console.log(value);

  let value = event.target.value;
//  console.log(value);
  //console.log(value.getInt16(1, true));
let a = [];
// Convert raw data bytes to hex values just for the sake of showing something.
// In the "real" world, you'd use data.getUint8, data.getUint16 or even
// TextDecoder to process raw data bytes.
for (let i = 0; i < value.byteLength; i++) {
  a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
}

console.log(a);
var xoff = 32;
xoff = toiomin[0];
var yoff = 44;
yoff = toiomin[1];

if (toiox[0] != undefined){
toiox[1] = toiox[0];
toioy[1] = toioy[0];
}

toiox[0] = value.getInt16(1, true)-xoff;
toioy[0] = value.getInt16(3, true)-yoff;

var xpos = (value.getInt16(1, true)).toString();
var ypos = (value.getInt16(3, true)).toString();
var angle = value.getInt16(5, true).toString();
//console.log("x: ", xpos, "y: ", ypos, "angle: ", angle);
document.getElementById("xpos").innerHTML = "x position: " + xpos;
document.getElementById("ypos").innerHTML = "y position: " + ypos;
document.getElementById("angle").innerHTML = "angle (degrees): " + angle;

drawToio();
//console.log('> ' + a.join(' '));

}

function drawToio(){
  if(toiox[1] != toiox[0] || toioy[1] != toioy[0]){
    console.log("toio moving");

    var ypos = (toioy[0]/toiomax[1])*250;
    var xpos = (toiox[0]/toiomax[0])*250;
    document.getElementById("toio").style.left = (xpos).toString() + "px";
    document.getElementById('toio').style.top = (ypos).toString() + "px";
    console.log("moving to: x: " + xpos + " y: " + ypos);
  }
}

function getMousePos(){
  const rect = event.target.getBoundingClientRect();
  var x = (event.clientX - rect.left)/250;
  var y = (event.clientY- rect.top)/250;
  console.log("mouse click x : " + x + " y : " + y);
  var xdiff = toiomax[0]-toiomin[0];
  var xmove = parseInt(x*xdiff);
  var ydiff = toiomax[1] - toiomin[1];
  var ymove = parseInt(y*ydiff);
  let ygo;
  let xgo;
  console.log('x move: ' + xmove + " , " + "y move: " + ymove);

  if((xmove + toiomin[0]) > 255){
    // xmove = xmove.toString();
    xgo = [(xmove+toiomin[0])-255, "0x01"];
    xgo = [xgo[0].toString(16), xgo[1]];
      if(xgo[0] == 'NaN'){
        xgo[0] = "0x00";
      }else if(xgo[0].length ==1){
      xgo[0] = "0x0" + xgo[0];
    }else if(xgo[0].length >= 2){
      xgo[0] = "0x" + xgo[0];
    }
    console.log(xgo);
  }else{
    xgo = [xmove+toiomin[0], "0x00"];
    xgo = [xgo[0].toString(16), xgo[1]];
    if(xgo[0] == 'NaN'){
      xgo[0] = "0x00";
    }else if(xgo[0].length ==1){
    xgo[0] = "0x0" + xgo[0];
  }else if(xgo[0].length >= 2){
    xgo[0] = "0x" + xgo[0];
  }
  console.log(xgo);
  }

  if((ymove + toiomin[1]) > 255){
    // xmove = xmove.toString();
    ygo = [(ymove+toiomin[1])-255, "0x01"];
    ygo = [ygo[0].toString(16), ygo[1]];
      if(ygo[0] == 'NaN'){
        ygo[0] = "0x00";
      }else if(ygo[0].length ==1){
      ygo[0] = "0x0" + ygo[0];
    }else if(ygo[0].length >= 2){
      ygo[0] = "0x" + ygo[0];
    }
    console.log(ygo);
  }else{
    ygo = [ymove+toiomin[1], "0x00"];
    ygo = [ygo[0].toString(16), ygo[1]];
    if(ygo[0] == 'NaN'){
      ygo[0] = "0x00";
    }else if(ygo[0].length ==1){
    ygo[0] = "0x0" + ygo[0];
  }else if(ygo[0].length >= 2){
    ygo[0] = "0x" + ygo[0];
  }
  console.log(ygo);
  }

//   var ymove = parseInt((290 * y) + 40);
//   console.log("x: " + xmove + " y: "+ ymove);
//   xmove = xmove.toString(16);
//   ymove = ymove.toString(16);
//   if(xmove.length ==3){
//     xmove = "0" + xmove;
//   }else if (xmove.length == 2){
//     xmove = "00" + xmove;
//   }
//
//   if(ymove.length ==3){
//     ymove = "0" + ymove;
//   }else if (ymove.length == 2){
//     ymove = "00" + ymove;
//   }
//
//   let xgo = [xmove.slice(2,4), xmove.slice(0,2)];
//   let ygo = [ymove.slice(2,4), ymove.slice(0,2)];
//   xgo[0] = "0x" + xgo[0];
//   xgo[1] = "0x" + xgo[1];
//   ygo[0] = "0x" + ygo[0];
//   ygo[1] = "0x" + ygo[1];
//   xmove = "0x" + xmove.toString(16);
//   ymove = "0x" + ymove.toString(16);
//
//
//
//   console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
//
   if (gCubes[0] != undefined){

       console.log("move cube to position");
       // console.log("x: " + xmove.toString(16) + " y: "+ ymove.toString(16));
       cube = gCubes[0];
       var buf = new ArrayBuffer(10)
       var a8 = new Uint8Array(buf);
       var buf1 = new Uint8Array([ 0x03, 0x00, 0x05, 0x00, 0x50, 0x00, 0x00]);
       var buf4 = new Uint8Array([0x03,0x00,0x05,0x00,0x50,0x00, 0x00,xgo[0], xgo[1],ygo[0],ygo[1],0x5a,0x00]);

      console.log(buf4);

        cube.moveChar.writeValue(buf4);


}
}

function lightControl(on){
  console.log(on);
  cube = gCubes[0];
if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
  if(on == true){
    const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0xFF, 0xFF]);
    cube.lightChar.writeValue( buf );
    console.log('light on');
}
else{
  const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00]);
  cube.lightChar.writeValue( buf );
  console.log('light off');
}
}
}



  const initialize = () => {

    // Event Listning for GUI buttons.
    for( let cubeId of CUBE_ID_ARRAY ){
        document.getElementById( 'btConnectCube' + ( cubeId + 1) ).addEventListener( 'click', async ev => {

            if( cubeId === 0 ){
                gCubes[0] = connectNewCube();
                console.log('cube 0 connected (cyan)');
            }else if( cubeId === 1 ){
                gCubes[1] = connectNewCube();
                console.log('cube 1 connected (green)');
            }else{
                gCubes[2] = connectNewCube();
                console.log('cube 3 connected (red)');
            }

          });
      }

      document.getElementById('getPos').addEventListener('mousedown', async ev => {
        onStartButtonClick();
      });

      document.getElementById('canvas').addEventListener('click', async ev => {
        getMousePos();
      });

      document.getElementById('canvas').addEventListener('touchstart', async ev => {
        getMousePos();
      });


  }

  // slider1.oninput = function() {
  // val = parseInt(document.getElementById("slider1").value);
  // speed1 = '0x' + val.toString(16);
  // console.log((254).toString(16))
  // console.log(val);
  // console.log(speed1);
  // }



  initialize();
