'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Politico = mongoose.model('Politico'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, politico;

/**
 * Politico routes tests
 */
describe('Politico CRUD tests', function() {
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

		// Save a user to the test db and create new Politico
		user.save(function() {
			politico = {
				name: 'Politico Name'
			};

			done();
		});
	});

	it('should be able to save Politico instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politico
				agent.post('/politicos')
					.send(politico)
					.expect(200)
					.end(function(politicoSaveErr, politicoSaveRes) {
						// Handle Politico save error
						if (politicoSaveErr) done(politicoSaveErr);

						// Get a list of Politicos
						agent.get('/politicos')
							.end(function(politicosGetErr, politicosGetRes) {
								// Handle Politico save error
								if (politicosGetErr) done(politicosGetErr);

								// Get Politicos list
								var politicos = politicosGetRes.body;

								// Set assertions
								(politicos[0].user._id).should.equal(userId);
								(politicos[0].name).should.match('Politico Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Politico instance if not logged in', function(done) {
		agent.post('/politicos')
			.send(politico)
			.expect(401)
			.end(function(politicoSaveErr, politicoSaveRes) {
				// Call the assertion callback
				done(politicoSaveErr);
			});
	});

	it('should not be able to save Politico instance if no name is provided', function(done) {
		// Invalidate name field
		politico.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politico
				agent.post('/politicos')
					.send(politico)
					.expect(400)
					.end(function(politicoSaveErr, politicoSaveRes) {
						// Set message assertion
						(politicoSaveRes.body.message).should.match('Please fill Politico name');
						
						// Handle Politico save error
						done(politicoSaveErr);
					});
			});
	});

	it('should be able to update Politico instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politico
				agent.post('/politicos')
					.send(politico)
					.expect(200)
					.end(function(politicoSaveErr, politicoSaveRes) {
						// Handle Politico save error
						if (politicoSaveErr) done(politicoSaveErr);

						// Update Politico name
						politico.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Politico
						agent.put('/politicos/' + politicoSaveRes.body._id)
							.send(politico)
							.expect(200)
							.end(function(politicoUpdateErr, politicoUpdateRes) {
								// Handle Politico update error
								if (politicoUpdateErr) done(politicoUpdateErr);

								// Set assertions
								(politicoUpdateRes.body._id).should.equal(politicoSaveRes.body._id);
								(politicoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Politicos if not signed in', function(done) {
		// Create new Politico model instance
		var politicoObj = new Politico(politico);

		// Save the Politico
		politicoObj.save(function() {
			// Request Politicos
			request(app).get('/politicos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Politico if not signed in', function(done) {
		// Create new Politico model instance
		var politicoObj = new Politico(politico);

		// Save the Politico
		politicoObj.save(function() {
			request(app).get('/politicos/' + politicoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', politico.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Politico instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politico
				agent.post('/politicos')
					.send(politico)
					.expect(200)
					.end(function(politicoSaveErr, politicoSaveRes) {
						// Handle Politico save error
						if (politicoSaveErr) done(politicoSaveErr);

						// Delete existing Politico
						agent.delete('/politicos/' + politicoSaveRes.body._id)
							.send(politico)
							.expect(200)
							.end(function(politicoDeleteErr, politicoDeleteRes) {
								// Handle Politico error error
								if (politicoDeleteErr) done(politicoDeleteErr);

								// Set assertions
								(politicoDeleteRes.body._id).should.equal(politicoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Politico instance if not signed in', function(done) {
		// Set Politico user 
		politico.user = user;

		// Create new Politico model instance
		var politicoObj = new Politico(politico);

		// Save the Politico
		politicoObj.save(function() {
			// Try deleting Politico
			request(app).delete('/politicos/' + politicoObj._id)
			.expect(401)
			.end(function(politicoDeleteErr, politicoDeleteRes) {
				// Set message assertion
				(politicoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Politico error error
				done(politicoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Politico.remove().exec();
		done();
	});
});