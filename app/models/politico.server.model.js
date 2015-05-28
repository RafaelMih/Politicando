'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Politico Schema
 */
var PoliticoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Politico name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Politico', PoliticoSchema);