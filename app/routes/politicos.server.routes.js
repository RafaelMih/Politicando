'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var politicos = require('../../app/controllers/politicos.server.controller');

	// Politicos Routes
	app.route('/politicos')
		.get(politicos.list)
		.post(users.requiresLogin, politicos.create);

	app.route('/politicos/:politicoId')
		.get(politicos.read)
		.put(users.requiresLogin, politicos.hasAuthorization, politicos.update)
		.delete(users.requiresLogin, politicos.hasAuthorization, politicos.delete);

	// Finish by binding the Politico middleware
	app.param('politicoId', politicos.politicoByID);
};
