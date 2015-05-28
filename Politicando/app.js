// set up ======================================================================
var express = require('express');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 			    // mongoose for mongodb
var configApp = require('./config/config');         // config variables

var morgan = require('morgan'); 		            // log requests to the console (express4)
var bodyParser = require('body-parser'); 	        // pull information from HTML POST (express4)
var methodOverride = require('method-override');    // simulate DELETE and PUT (express4)
var load = require('express-load');                 // load path

var port = process.env.PORT || configApp.Server.port; 				// set the port

// configuration ===============================================================
mongoose.connect(configApp.Database.url); 	// connect to mongoDB database

app.use(express.static(__dirname + configApp.Server.staticPath)); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({ extended: true })); 	        // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// controllers and routes ======================================================
load('app').then('models').then('controllers').then('routes').into(app);

// listen (start app with node app.js) =========================================
app.listen(port);
console.log("App listening on port " + port);