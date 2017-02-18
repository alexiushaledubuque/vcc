// Initial setup of the player
const iframe = document.querySelector('iframe');
const player = new Vimeo.Player(iframe);
const display = document.getElementById('msg-output');
const timeouts = [];

// Set focus on adding time for cue point
document.getElementById('add-cuepoint').focus();

// Player Events
player.on('play', function() {
    console.log('played the video!');
});

player.getVideoTitle().then(function(title) {
    // console.log('title:', title);
});

player.on('cuepoint', function(data) {
    // data is an object containing properties specific to that event
    document.getElementById('cue-msg').style.display = 'block';
    var overlay = document.getElementById('cue-msg');
    overlay.innerHTML = data.data.customKey + "<br>";

    timeouts.forEach(function(v){
        window.clearTimeout(v);
    });

    timeouts = [];

    timeouts.push(window.setTimeout(() => {
        document.getElementById('cue-msg').innerHTML = ''; 
        document.getElementById('cue-msg').style.display = 'none'
    }, 5000));

});

const clearLog = () => {
    document.getElementById('msg-output').innerHTML = '';
}

const addingCuePoints = () => {
	const num = document.getElementById('add-cuepoint').value;
	const msg = document.getElementById('add-cuepoint-msg').value;
	player.addCuePoint(num, {
        customKey: msg
	}).then(function(id) {
    // cue point was added successfully
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

    gettingCuePoints();
    document.getElementById('add-cuepoint').value = 0;
    document.getElementById('add-cuepoint').focus();
    document.getElementById('add-cuepoint-msg').value = '';	
};

const gettingCuePoints = () => {
	player.getCuePoints().then(function(cuePoints) {
    // cuePoints = an array of cue point objects
    console.log('cuePoints: ', cuePoints);
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
	display.innerHTML = "Cue Points: [<br>&nbsp;";
    document.getElementById('cue-list').innerHTML = '';

	for (let i = 0; i < data.length; i++) {
		let newLine = '<div class="single-cue">&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;"time": ' + data[i].time + ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"data": ' + data[i].data.customKey + ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"id": ' + data[i].id + "<br>&nbsp;&nbsp;}</div>";
		i !== data.length - 1 ? display.innerHTML += newLine + ',<br>' : display.innerHTML += newLine + '<br>';
        let select = '<option value=' + data[i].id + '> Msg:&nbsp;' + data[i].data.customKey + '&nbsp;&nbsp;ID: ' + data[i].id + '</option>';
        document.getElementById('cue-list').innerHTML += select;
	}
	display.innerHTML += ']';
}

const deletingACuePoint = () => {
    const id = document.getElementById('cue-list').value;
    player.removeCuePoint(id).then(function(id) {
    // cue point was removed successfully
    }).catch(function(error) {
        switch (error.name) {
            case 'UnsupportedError':
                // cue points are not supported with the current player or browser
                break;

            case 'InvalidCuePoint':
                // a cue point with the id passed wasn’t found
                break;

            default:
                // some other error occurred
                break;
        }
    });
    document.getElementById('cue-list').innerHTML = '';
    gettingCuePoints();
}