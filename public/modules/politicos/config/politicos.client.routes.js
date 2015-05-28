'use strict';

//Setting up route
angular.module('politicos').config(['$stateProvider',
	function($stateProvider) {
		// Politicos state routing
		$stateProvider.
		state('listPoliticos', {
			url: '/politicos',
			templateUrl: 'modules/politicos/views/list-politicos.client.view.html'
		}).
		state('createPolitico', {
			url: '/politicos/create',
			templateUrl: 'modules/politicos/views/create-politico.client.view.html'
		}).
		state('viewPolitico', {
			url: '/politicos/:politicoId',
			templateUrl: 'modules/politicos/views/view-politico.client.view.html'
		}).
		state('editPolitico', {
			url: '/politicos/:politicoId/edit',
			templateUrl: 'modules/politicos/views/edit-politico.client.view.html'
		});
	}
]);