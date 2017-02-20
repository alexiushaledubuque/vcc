/**
	*	Required Middleware	
	*/

var express = require('express');
var path = require('path');

/**
	*	Express Server
	*/
console.log('STARTING BACKEND ===>');

var app = express();
module.exports = app;

/**
	*	Database Server - Adding Persistence
	*/
console.log('STARTING THE DBS SERVER - CREATING THE TABLES');

var db = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: 'db/video-storage.db'
	},
	useNullAsDefault: true
});

db.schema.hasTable('Videos').then(function(exists){
	if (!exists){
		db.schema.createTableIfNotExists('Videos', function(table){
			table.increments('uid').primary();
			table.string('video-id');
			table.string('title');
			table.timestamps();
		}).then(function(){
			console.log('Created Videos table');
		});		
	};	
});

db.schema.hasTable('VideoCues').then(function(exists){
	if (!exists){
		db.schema.createTableIfNotExists('VideoCues', function(table){
			table.increments('id').primary();
			table.string('cue-id');
			table.integer('cue-pt');
			table.string('cue-msg');
			table.string('video-id')
					 .references('uid')
					 .inTable('Videos');
		}).then(function(){
			console.log('Created videos table');
		});		
	};	
});

var port = 3000;

var staticPath = path.join(__dirname, '../');

/**
	*	Serve my static files
	*/
app.use(express.static(staticPath));



app.listen(port, function() {
  console.log('listening on port: ', port);
});