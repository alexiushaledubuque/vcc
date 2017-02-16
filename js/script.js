var options = {
        id: 59777392,
        width: 640,
        loop: true
    };

var player = new Vimeo.Player('made-in-ny', options);

player.setVolume(0);

player.on('play', function() {
    console.log('played the video!');
});

const num = document.getElementById('add-cuepoint').value;
const msg = document.getElementById('add-cuepoint-msg').value;

var addingCuePoints = () => {
	player.addCuePoint(num, {
    customKey: msg
	}).then(function(id) {
    // cue point was added successfully
    console.log('cue point was added successfully');
	}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // cue points are not supported with the current player or browser
            break;

        case 'RangeError':
            // the time was less than 0 or greater than the video’s duration
            break;

        default:
            // some other error occurred
            break;
    }
	});

document.getElementById('add-cuepoint').value = 0;
document.getElementById('add-cuepoint-msg').value = '';	
};



