'use strict';

//Politicos service used to communicate Politicos REST endpoints
angular.module('politicos').factory('Politicos', ['$resource',
	function($resource) {
		return $resource('politicos/:politicoId', { politicoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);