'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var partidos = require('../../app/controllers/partidos.server.controller');

	// Partidos Routes
	app.route('/partidos')
		.get(partidos.list)
		.post(users.requiresLogin, partidos.create);

	app.route('/partidos/:partidoId')
		.get(partidos.read)
		.put(users.requiresLogin, partidos.hasAuthorization, partidos.update)
		.delete(users.requiresLogin, partidos.hasAuthorization, partidos.delete);

	// Finish by binding the Partido middleware
	app.param('partidoId', partidos.partidoByID);
};
