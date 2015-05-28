'use strict';

//Setting up route
angular.module('partidos').config(['$stateProvider',
	function($stateProvider) {
		// Partidos state routing
		$stateProvider.
		state('listPartidos', {
			url: '/partidos',
			templateUrl: 'modules/partidos/views/list-partidos.client.view.html'
		}).
		state('createPartido', {
			url: '/partidos/create',
			templateUrl: 'modules/partidos/views/create-partido.client.view.html'
		}).
		state('viewPartido', {
			url: '/partidos/:partidoId',
			templateUrl: 'modules/partidos/views/view-partido.client.view.html'
		}).
		state('editPartido', {
			url: '/partidos/:partidoId/edit',
			templateUrl: 'modules/partidos/views/edit-partido.client.view.html'
		});
	}
]);