'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Politico = mongoose.model('Politico'),
	_ = require('lodash');

/**
 * Create a Politico
 */
exports.create = function(req, res) {
	var politico = new Politico(req.body);
	politico.user = req.user;

	politico.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(politico);
		}
	});
};

/**
 * Show the current Politico
 */
exports.read = function(req, res) {
	res.jsonp(req.politico);
};

/**
 * Update a Politico
 */
exports.update = function(req, res) {
	var politico = req.politico ;

	politico = _.extend(politico , req.body);

	politico.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(politico);
		}
	});
};

/**
 * Delete an Politico
 */
exports.delete = function(req, res) {
	var politico = req.politico ;

	politico.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(politico);
		}
	});
};

/**
 * List of Politicos
 */
exports.list = function(req, res) { 
	Politico.find().sort('-created').populate('user', 'displayName').exec(function(err, politicos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(politicos);
		}
	});
};

/**
 * Politico middleware
 */
exports.politicoByID = function(req, res, next, id) { 
	Politico.findById(id).populate('user', 'displayName').exec(function(err, politico) {
		if (err) return next(err);
		if (! politico) return next(new Error('Failed to load Politico ' + id));
		req.politico = politico ;
		next();
	});
};

/**
 * Politico authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.politico.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
