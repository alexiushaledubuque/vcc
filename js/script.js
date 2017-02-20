// Initial setup of the player
const iframe = document.querySelector('iframe');
const player = new Vimeo.Player(iframe);
const display = document.getElementById('msg-output');
const idOfVideo = '76979871';
let videoTitle = '';

// Array to handle message display overlay duration time
let timeouts = [];

// Set focus on adding time for cue point
document.getElementById('add-cuepoint').focus();

// Player Events
player.ready().then(function() {
    // the player is ready
    console.log('player is ready!');
});

player.on('play', function() {
    console.log('played the video!');
});

player.getVideoTitle().then(function(title) {
    console.log('title:', title);
    videoTitle = title;
});

// Display video cue points
player.on('cuepoint', function(data) {
    // data is an object containing properties specific to that event
    document.getElementById('cue-msg').style.display = 'block';
    var overlay = document.getElementById('cue-msg');
    overlay.innerHTML = data.data.customKey + "<br>";

    // For each new cue point encountered, the array is destroyed and recreated 

    timeouts.forEach(function(v){
        window.clearTimeout(v);
    });

    timeouts = [];

    // New entry is made to the array for the newest cue point

    timeouts.push(window.setTimeout(() => {
        document.getElementById('cue-msg').innerHTML = ''; 
        document.getElementById('cue-msg').style.display = 'none'
    }, 5000));
});

// Button to remove elements from Video Cues log

const clearLog = () => {
    document.getElementById('msg-output').innerHTML = '';
}

// User data is retrieved from standard input and passed to variables.
// Player method is called with the data to add the cue point to the video

const addingCuePoints = () => {
	const num = document.getElementById('add-cuepoint').value;
	const msg = document.getElementById('add-cuepoint-msg').value;

    if (num <= 0 || !msg){
        alert('Select valid cue point time and enter a message to proceed!');
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
	
    // Auto-populate the cue log and the dropdown list with each new cue
    gettingCuePoints(); 

    // Clear the inputs and reset focus for next input
    clearInputs();	
};

// Using Moment.js to convert the seconds to hour:minute:seconds format

const timeConversion = (sec) => {
    return moment().startOf('day')
            .seconds(sec)
            .format('H:mm:ss');
}

// Dynamically calculate a HTML color code & change stylesheet elements
// when the button is clicked

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    // After the color is picked, call function to set the color and change the element color
    css('.color-option', 'color', color);
}

// Special function to change the color of an html element

const css = (selector, property, value) => {
    for (var i=0; i<document.styleSheets.length;i++) {//Loop through all styles
        //Try add rule
        try { document.styleSheets[i].insertRule(selector+ ' {'+property+':'+value+'}', document.styleSheets[i].cssRules.length);
        } catch(err) {try { document.styleSheets[i].addRule(selector, property+':'+value);} catch(err) {}}//IE
    }
}

// Return the colors to their default colors on button click

const defaultColors = () => {
    css('.color-option', 'color', '#8A2BE2');
    css('.color-option', 'color', '#483D8B');
}

// Clear the inputs and reset focus for next input
const clearInputs = () => {
    document.getElementById('add-cuepoint').value = '';
    document.getElementById('add-cuepoint').focus();
    document.getElementById('add-cuepoint-msg').value = '';
};

// Player method to retrieve all the cue points setup for the video

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

// Formats the HTML added to the DOM for each cue

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

// Remove the cue point saved for the video

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
        clearInputs();
        gettingCuePoints();    
    }
}