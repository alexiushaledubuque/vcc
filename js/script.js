// Initial setup of the player
const iframe = document.querySelector('iframe');
const player = new Vimeo.Player(iframe);

player.on('play', function() {
    console.log('played the video!');
});

player.getVideoTitle().then(function(title) {
    console.log('title:', title);
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
	let display = document.getElementById('msg-output');
	display.innerHTML = "Cue Points: [<br>&nbsp;";

	for (let i = 0; i < data.length; i++) {
		let newLine = '&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;"time": ' + data[i].time + ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"data": ' + data[i].data.customKey + ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"id": ' + data[i].id + "<br>&nbsp;&nbsp;}";
		i !== data.length - 1 ? display.innerHTML += newLine + ',<br>' : display.innerHTML += newLine + '<br>';
	}
	display.innerHTML += ']';
}