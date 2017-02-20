# VCC

## Setup - installations

1. npm install 
2. npm install -S body-parser
3. npm install bookshelf -S 
4. npm install --save express
5. npm install --save http-server
6. npm install @vimeo/player --save
7. npm install sqlite3 --save
8. npm install knex --save
9. brew install node (verify if already installed - "node -v")

### Clone this repo

1. Download your own version of this app.

### Start the server

1. Open the terminal or get a command prompt
2. Change directory to the server directory of the project. '/Vimeo/server'
3. 'nodemon server.js' (runs the node daemon & hot reloads on file updates)
4. Open the browser and type 'localhost:3000'

## Challenge requirements

1. Use the Vimeo embedded player
2. Add interface for user to add Cues at certain timestamps.
3. Should also list the Cues that have been added and allow them to be deleted.
4. While playing the video surface the Cues at the correct times and hide after a duration.
5. A Cue only needs to contain a string.
6. The messages should be displayed as an overlay on the player itself.
7. Use only vanilla JavaScript and write your own CSS
8. You may use preprocessors and/or bundlers if you wish

### Accomplishments - Features

Web app
1. Embed a Vimeo video 	  							  		 - success
2. Interface to add a cue point and cue message - success
3. Remove a cue points 						 						 - success
4. Display list of cue points									 - success
5. Overlay cue points on player								 - success
6. Cue points appear at set timestamps					 - success

### Bonus Features

1. Additional buttons
		- Clear the cue display 										 - success
		- Dynamically change colors of elements			 - success
			- Titles,
			- Button text
		- Reset the default colors 									 - success

### In-progress Features

1. Use some persistent storage.
	 
	 #### Status

	 a. SQLite3 database created - file name /server/db/video-storage.db
	 b. Created 2 tables - Videos, VideoCues
	 c. Route defined

### Tech Stack
	Front End
	1. Vanilla Javascript
	2. HTML5
	3. CSS3
	4. Moment.js (date formatting)

	Back End
	5. Node.js (server)
	6. Express.js (server)
	7. Knexjs (schema builder)
	8. SQLite3 (database)

Developer: 

[Alexius Hale-Dubuque](https://www.linkedin.com/in/alexiushaledubuque) | [Github](https://github.com/alexiushaledubuque)| [Portfolio](www.alexiushaledubuque.io)