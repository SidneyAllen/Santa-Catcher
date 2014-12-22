/* 
Santa Catcher


*/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var cameralib = require('camera-vc0706');

var ambient = ambientlib.use(tessel.port['A']);
var camera = cameralib.use(tessel.port['B']);

ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
      ambient.getSoundLevel( function(err, sdata) {
        if (err) throw err;
        console.log("Sound Level:", sdata.toFixed(8));
    });
  }, 500); // The readings will happen every .5 seconds unless the trigger is hit


  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(0.1);

  ambient.on('sound-trigger', function(data) {
    console.log("Is that Santa Claus?: ", data);

	camera.setCompression(0.8, function(err) {
      if (err) {
        return console.log('Error setting compression', err);
      } else {

	    camera.takePicture(function(err, image) {
	      if (err) {
	        console.log('error taking image', err);
	      } else {
	        // Name the image
	        var name = 'santa-' + Math.floor(Date.now()*1000) + '.jpg';
	        // Save the image
	        console.log('Picture saving as', name, '...');
	        process.sendfile(name, image);
	        console.log('done.');
	      }
	    });
	  }
	});

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {
        ambient.setSoundTrigger(0.1);
    },10000);

  });
});

ambient.on('error', function (err) {
  console.log(err)
});