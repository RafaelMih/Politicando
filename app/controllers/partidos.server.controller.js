'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Partido = mongoose.model('Partido'),
	_ = require('lodash');

/**
 * Create a Partido
 */
exports.create = function(req, res) {
	var partido = new Partido(req.body);
	partido.user = req.user;

	partido.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partido);
		}
	});
};

/**
 * Show the current Partido
 */
exports.read = function(req, res) {
	res.jsonp(req.partido);
};

/**
 * Update a Partido
 */
exports.update = function(req, res) {
	var partido = req.partido ;

	partido = _.extend(partido , req.body);

	partido.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partido);
		}
	});
};

/**
 * Delete an Partido
 */
exports.delete = function(req, res) {
	var partido = req.partido ;

	partido.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partido);
		}
	});
};

/**
 * List of Partidos
 */
exports.list = function(req, res) { 
	Partido.find().sort('-created').populate('user', 'displayName').exec(function(err, partidos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partidos);
		}
	});
};

/**
 * Partido middleware
 */
exports.partidoByID = function(req, res, next, id) { 
	Partido.findById(id).populate('user', 'displayName').exec(function(err, partido) {
		if (err) return next(err);
		if (! partido) return next(new Error('Failed to load Partido ' + id));
		req.partido = partido ;
		next();
	});
};

/**
 * Partido authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.partido.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
