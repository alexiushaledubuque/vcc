/**
	*	Required Middleware	
	*/

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

/**
	*	Express Server
	*/

console.log('STARTING BACKEND ===>');
var app = express();
module.exports = app;

app.use( bodyParser.json() );

/**
	*	Database Server - Adding Persistence
	*/
console.log('STARTING THE DBS SERVER - CREATING THE TABLES');

var db = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: 'video-storage.db'
	},
	useNullAsDefault: true
});

db.schema.hasTable('Videos').then(function(exists){
	if (!exists){
		db.schema.createTableIfNotExists('Videos', function(table){
			table.increments();
			table.string('id');
			table.string('title');
		}).then(function(){
			console.log('Created Videos table');
		});		
	};	
});

db.schema.hasTable('VideoCues').then(function(exists){
	if (!exists){
		db.schema.createTableIfNotExists('VideoCues', function(table){
			table.increments();
			table.string('cue-id');
			table.number('cue-pt');
			table.string('cue-msg');
			table.string('video-id')
		}).then(function(){
			console.log('Created videos table');
		});		
	};	
});

/**
	*	Serve my static files
	*/

app.use(express.static(__dirname + '/../client'));

/**
	*	HTTP Requests & Routes	
	*/

/**
 * GET
 */

 app.get('/chat', function(req, res){
 	db.select('*').from('chats').then(function(data){
 		console.log("GET REQUEST ON BACKEND");
 		res.send(data);
 	});
 });

/**
 * POST & GET
 */

 app.post('/chat', function(req, res){
 	 db.insert({ username: req.body.username, message: req.body.message }).into('chats')
 	 .asCallback(function(err, row){
 	 		if (err){
 	 			console.error('error cause: ', err.cause);
 	 		} else {
 	 			console.log(row);
 	 		}
 	 		console.log("POST REQUEST ON BACKEND");
 	 		res.sendStatus(201);
 	 });
 });


 /**
 * UPDATE & GET
 */

 /**
 * DELETE & GET
 */


var port = process.env.PORT || 3000;

app.listen(port, function(err){
	if (err){
		console.error('Bummer! ', err.cause);
	} else {
		console.log('Server is listening on port: ', port);	
	}
});










