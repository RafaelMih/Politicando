'use strict';

//Partidos service used to communicate Partidos REST endpoints
angular.module('partidos').factory('Partidos', ['$resource',
	function($resource) {
		return $resource('partidos/:partidoId', { partidoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);