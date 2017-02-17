// Initial setup of the player
const iframe = document.querySelector('iframe');
const player = new Vimeo.Player(iframe);
let display = document.getElementById('msg-output');

// Player Events
player.on('play', function() {
    console.log('played the video!');
});

player.getVideoTitle().then(function(title) {
    console.log('title:', title);
});

player.on('cuepoint', function(data) {
    // data is an object containing properties specific to that event
    console.log(JSON.stringify(data));
    var overlay = document.getElementById('cue-msg');
    overlay.innerHTML += data.data.customKey + "<br>";

		player.on('timeupdate', function(timestamp) {
  		// data is an object containing properties specific to that event
  		console.log('Time Update - timestamp: ', timestamp.seconds);
  		console.log('Cue Time plus 5: ', data.time + 5);
  		if (timestamp.seconds > data.time + 5){
  			document.getElementById('cue-msg').innerHTML = ''; 
  		}
		});
});

const addingCuePoints = () => {
	const num = document.getElementById('add-cuepoint').value;
	const msg = document.getElementById('add-cuepoint-msg').value;
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
document.getElementById('add-cuepoint').focus();
document.getElementById('add-cuepoint-msg').value = '';	
};

const gettingCuePoints = () => {
	player.getCuePoints().then(function(cuePoints) {
    // cuePoints = an array of cue point objects
    listCuePoints(cuePoints);
	}).catch(function(error) {
    switch (error.name) {
        case 'UnsupportedError':
            // cue points are not supported with the current player or browser
            break;

        default:
            // some other error occurred
            break;
    }
	});
};

const listCuePoints = (data) => {
    // create each list item for each cue point

    // for (let i = 0; i < data.length; i++) {
    //     let listItem = '<li>' + data[i].data.customKey + data[i].time + '</li>';
    //     display.innerHTML = listItem;
    // }

	display.innerHTML = "Cue Points: [<br>&nbsp;";

	for (let i = 0; i < data.length; i++) {
		let newLine = '&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;"time": ' + data[i].time + ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"data": ' + data[i].data.customKey + ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"id": ' + data[i].id + "<br>&nbsp;&nbsp;}";
		i !== data.length - 1 ? display.innerHTML += newLine + ',<br>' : display.innerHTML += newLine + '<br>';
	}
	display.innerHTML += ']';
}