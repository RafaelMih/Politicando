'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Partido = mongoose.model('Partido'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, partido;

/**
 * Partido routes tests
 */
describe('Partido CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Partido
		user.save(function() {
			partido = {
				name: 'Partido Name'
			};

			done();
		});
	});

	it('should be able to save Partido instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partido
				agent.post('/partidos')
					.send(partido)
					.expect(200)
					.end(function(partidoSaveErr, partidoSaveRes) {
						// Handle Partido save error
						if (partidoSaveErr) done(partidoSaveErr);

						// Get a list of Partidos
						agent.get('/partidos')
							.end(function(partidosGetErr, partidosGetRes) {
								// Handle Partido save error
								if (partidosGetErr) done(partidosGetErr);

								// Get Partidos list
								var partidos = partidosGetRes.body;

								// Set assertions
								(partidos[0].user._id).should.equal(userId);
								(partidos[0].name).should.match('Partido Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Partido instance if not logged in', function(done) {
		agent.post('/partidos')
			.send(partido)
			.expect(401)
			.end(function(partidoSaveErr, partidoSaveRes) {
				// Call the assertion callback
				done(partidoSaveErr);
			});
	});

	it('should not be able to save Partido instance if no name is provided', function(done) {
		// Invalidate name field
		partido.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partido
				agent.post('/partidos')
					.send(partido)
					.expect(400)
					.end(function(partidoSaveErr, partidoSaveRes) {
						// Set message assertion
						(partidoSaveRes.body.message).should.match('Please fill Partido name');
						
						// Handle Partido save error
						done(partidoSaveErr);
					});
			});
	});

	it('should be able to update Partido instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partido
				agent.post('/partidos')
					.send(partido)
					.expect(200)
					.end(function(partidoSaveErr, partidoSaveRes) {
						// Handle Partido save error
						if (partidoSaveErr) done(partidoSaveErr);

						// Update Partido name
						partido.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Partido
						agent.put('/partidos/' + partidoSaveRes.body._id)
							.send(partido)
							.expect(200)
							.end(function(partidoUpdateErr, partidoUpdateRes) {
								// Handle Partido update error
								if (partidoUpdateErr) done(partidoUpdateErr);

								// Set assertions
								(partidoUpdateRes.body._id).should.equal(partidoSaveRes.body._id);
								(partidoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Partidos if not signed in', function(done) {
		// Create new Partido model instance
		var partidoObj = new Partido(partido);

		// Save the Partido
		partidoObj.save(function() {
			// Request Partidos
			request(app).get('/partidos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Partido if not signed in', function(done) {
		// Create new Partido model instance
		var partidoObj = new Partido(partido);

		// Save the Partido
		partidoObj.save(function() {
			request(app).get('/partidos/' + partidoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', partido.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Partido instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partido
				agent.post('/partidos')
					.send(partido)
					.expect(200)
					.end(function(partidoSaveErr, partidoSaveRes) {
						// Handle Partido save error
						if (partidoSaveErr) done(partidoSaveErr);

						// Delete existing Partido
						agent.delete('/partidos/' + partidoSaveRes.body._id)
							.send(partido)
							.expect(200)
							.end(function(partidoDeleteErr, partidoDeleteRes) {
								// Handle Partido error error
								if (partidoDeleteErr) done(partidoDeleteErr);

								// Set assertions
								(partidoDeleteRes.body._id).should.equal(partidoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Partido instance if not signed in', function(done) {
		// Set Partido user 
		partido.user = user;

		// Create new Partido model instance
		var partidoObj = new Partido(partido);

		// Save the Partido
		partidoObj.save(function() {
			// Try deleting Partido
			request(app).delete('/partidos/' + partidoObj._id)
			.expect(401)
			.end(function(partidoDeleteErr, partidoDeleteRes) {
				// Set message assertion
				(partidoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Partido error error
				done(partidoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Partido.remove().exec();
		done();
	});
});