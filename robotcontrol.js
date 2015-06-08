ThunderConnector = require('thunder-connector');

var keypress = require('keypress')
  , tty = require('tty');

var irobot = require('irobot');

var robot = new irobot.Robot('/dev/ttyUSB0',{baudrate: 115200});
robot.on('ready', function () {
  console.log('READY');
});
// make `process.stdin` begin emitting "keypress" events

ThunderConnector.connect();

function center(){
  setTimeout(function(){ThunderConnector.command('right');},0);
  setTimeout(function(){ThunderConnector.command('down');},6500);
  setTimeout(function(){ThunderConnector.command('left');},8000);
  setTimeout(function(){ThunderConnector.command('up');},11050);
  setTimeout(function(){ThunderConnector.command('stop');},11850);
}

function upDegrees(degrees){
  stopTime = Math.floor(degrees * 22.3);
  setTimeout(function(){ThunderConnector.command('up');},0);
  setTimeout(function(){ThunderConnector.command('stop');},stopTime);
}

function downDegrees(degrees){
  stopTime = Math.floor(degrees * 22.3);
  setTimeout(function(){ThunderConnector.command('down');},0);
  setTimeout(function(){ThunderConnector.command('stop');},stopTime);
}

function turnRightDegrees(degrees){
  stopTime = Math.floor(degrees * 22.3)
  setTimeout(function(){ThunderConnector.command('right');},0);
  setTimeout(function(){ThunderConnector.command('stop');},stopTime);
}

function turnLeftDegrees(degrees){
  stopTime = Math.floor(degrees * 22.3)
  setTimeout(function(){ThunderConnector.command('left');},0);
  setTimeout(function(){ThunderConnector.command('stop');},stopTime);
}

function fire(){
  setTimeout(function(){ThunderConnector.command('fire');},0);
}

var auto = '';

keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);


  if (key.name == 'b'){
    console.log("user controlled");
    auto = false;
  }

  if (key.name == 'r'){
    console.log("auto controlled");
    auto = true;
  }

  if (auto == false){
    if (key.name == 'w'){
      console.log("forward");
      data = {left: 20, right: 20};
      robot.drive(data);
    } else if (key.name == 's'){
      console.log("backward");
      data = {left: -20, right: -20};
      robot.drive(data);
    } else if (key.name == 'd'){
      console.log("right");
      data = {left: 5, right: 30};
      robot.drive(data);
    } else if (key.name == 'a'){
      console.log("left");
      data = {left: 30, right: 5};
      robot.drive(data);
    } else if (key.name == 'space'){
      console.log("stop");
      data = {left: 0, right: 0};
      robot.drive(data);
    } else if (key.name == 'up'){
      console.log("aim up");
      upDegrees(10);
    } else if (key.name == 'down'){
      console.log("aim down");
      downDegrees(10);
    } else if (key.name == 'right'){
      console.log("aim right");
      turnRightDegrees(10);
    } else if (key.name == 'left'){
      console.log("aim left");
      turnLeftDegrees(10);
    } else if (key.name == 'return'){
      console.log("fire");
      fire();
    }
  } else if (auto == true){
    console.log("in auto");
    //center();
    data = {left: 20, right: 20};
    robot.drive(data);
    robot.on('cliff', function (e) { 
      console.log('CLIFF', e);
      var direction = Math.floor(Math.random()*2);
      console.log(direction);
      if (direction == 0){
        data = {left: 5, right: 30};
        robot.drive(data);
      } else if (direction == 1){
        data = {left: 30, right: 5};
        robot.drive(data);
      }
    });
    robot.on('bump', function (e) { 
      console.log('BUMP', e);
      data = {left: -35, right: -35};
      robot.drive(data);
      console.log("past data");
      fire();
    });
  }


  if (key && key.ctrl && key.name == 'c') {
    console.log('control c');
    process.exit(0);
   // process.stdin.pause();
  }
});

if (typeof process.stdin.setRawMode == 'function') {
  process.stdin.setRawMode(true);
} else {
  tty.setRawMode(true);
}
process.stdin.resume();
