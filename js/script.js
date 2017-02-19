// Initial setup of the player
const iframe = document.querySelector('iframe');
const player = new Vimeo.Player(iframe);
const display = document.getElementById('msg-output');
let timeouts = [];

// Set focus on adding time for cue point
document.getElementById('add-cuepoint').focus();

// Player Events
player.on('play', function() {
    console.log('played the video!');
});

player.getVideoTitle().then(function(title) {
    console.log('title:', title);
});

// Display video cue points
player.on('cuepoint', function(data) {
    // data is an object containing properties specific to that event
    document.getElementById('cue-msg').style.display = 'block';
    var overlay = document.getElementById('cue-msg');
    overlay.innerHTML = data.data.customKey + "<br>";

    // Message display functionality - each message is displayed up to 5 seconds
    // but is replaced by another message if the seconds conflict

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

    if (num <= 0 || !msg){
        alert('Must select a cue point time and/or message to proceed!');
    } else {
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
    }
	
    gettingCuePoints(); // Auto-populate the cue log and the dropdown list with each new cue
    document.getElementById('add-cuepoint').value = '';
    document.getElementById('add-cuepoint').focus();
    document.getElementById('add-cuepoint-msg').value = '';	
};

const timeConversion = (sec) => {
    return moment().startOf('day')
            .seconds(sec)
            .format('H:mm:ss');
}

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
    display.innerHTML = '';
    document.getElementById('cue-list').innerHTML = '';

	for (let i = 0; i < data.length; i++) {
        let newLine = '<div class="single-cue"><span id="msg-align">' + data[i].data.customKey + 
        '</span><span id="time-align">' +  timeConversion(data[i].time) + '</span></div>';
		
        i !== data.length - 1 ? display.innerHTML += newLine : display.innerHTML += newLine;
        
        let select = '<option value=' + data[i].id + '><br>&nbsp;' + data[i].data.customKey + 
        '&nbsp;&nbsp;</option>';
        
        document.getElementById('cue-list').innerHTML += select;
	}
}

const deletingACuePoint = () => {
    const id = document.getElementById('cue-list').value;

    if (!id) {
        alert('No cue points to delete. Must add them first!');
    } else {
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
    
}