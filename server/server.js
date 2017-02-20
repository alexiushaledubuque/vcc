/**
	*	Required Middleware	
	*/

var express = require('express');
var path = require('path');

/**
	*	Express Server
	*/
// console.log('STARTING BACKEND ===>');

var app = express();
module.exports = app;

/**
	*	Database Server - Adding Persistence
	*/
// console.log('STARTING THE DBS SERVER - CREATING THE TABLES');

var db = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: 'db/video-storage.db'
	},
	useNullAsDefault: true
});

/**
	*	Database Schema - 2 tables - Videos & VideoCues
	*/

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
			console.log('Created VideoCues table');
		});		
	};	
});


/**
	*	Define a static path to locate my static files to serve
	*/
var staticPath = path.join(__dirname, '../');

/**
	*	Serve my static files
	*/
app.use(express.static(staticPath));

/***	HTTP Requests & Routes	***/

/**
 * GET
 */

// console.log('right before app.get');
 app.get('/js', function(req, res){
 	db.select('*').from('Videos').then(function(data){
 		console.log("GET REQUEST ON BACKEND");
 		res.send(data);
 		console.log("server data: ", data);
 	});
 });
// console.log('right after app.get'); - debugging server

/**
 * POST
 */

// console.log('right before app.post1'); - debugging server
app.post('/js', function(req, res){
	 db.insert({ videoID: req.body.video-id, title: req.body.title }).into('Videos')
	 .catch(function(err, row){
	 		console.error('error cause: ', err.cause);
	 }).then(function() {
	 		return db.select('*')
	 			.from('Videos')
	 			.where('videoID', req.body.video-id);
	 }).then(function(rows) {
	 		console.log(rows[0]);
	 })
	 .catch(function(error) {
	 		console.error(error);
	 });
});
// console.log('right after app.post1'); - debugging server

// console.log('right before app.post2');
app.post('/js', function(req, res){
 	 db.insert({ cueID: req.body.cue-id, cuePT: req.body.cue-pt, cueMSG: req.body.cue-msg, videoID: req.body.video-id }).into('VideoCues')
 	 .catch(function(err,row) {
 	 		console.error('error cause: ', err.cause);
 	 }).then(function() {
 	 		return db.select('*')
 	 			.from('VideoCues')
 	 			.where('videoID', req.body.video-id);
 	 }).then(function(rows) {
 	 		console.log(rows[0]);
 	 })
 	 .catch(function(error) {
 	 		console.error(error);
 	 });
});
// console.log('right before app.post2'); - debugging server

 /**
 * DELETE & GET - remove data from both Video & VideoCues tables
 */
// console.log('right before app.delete');
// app.delete('/js', function(req, res){
//  	 db.insert({ cueID: req.body.cue-id, cuePT: req.body.cue-pt, cueMSG: req.body.cue-msg, videoID: req.body.video-id }).into('VideoCues')
//  	 .asCallback(function(err, row){
//  	 		if (err){
//  	 			console.error('error cause: ', err.cause);
//  	 		} else {
//  	 			console.log(row);
//  	 		}
//  	 		console.log("Row inserted into VideoCues table");
//  	 		res.sendStatus(201);
//  	 });
// });
// console.log('right before app.post2');

/**
	*	Localhost port for server activity
	*/
var port = process.env.PORT || 3000;

 /**
 * Start the server
 */
app.listen(port, function() {
  console.log('listening on port: ', port);
});