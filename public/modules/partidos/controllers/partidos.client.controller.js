'use strict';

// Partidos controller
angular.module('partidos').controller('PartidosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Partidos',
	function($scope, $stateParams, $location, Authentication, Partidos) {
		$scope.authentication = Authentication;

		// Create new Partido
		$scope.create = function() {
			// Create new Partido object
			var partido = new Partidos ({
				name: this.name
			});

			// Redirect after save
			partido.$save(function(response) {
				$location.path('partidos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Partido
		$scope.remove = function(partido) {
			if ( partido ) { 
				partido.$remove();

				for (var i in $scope.partidos) {
					if ($scope.partidos [i] === partido) {
						$scope.partidos.splice(i, 1);
					}
				}
			} else {
				$scope.partido.$remove(function() {
					$location.path('partidos');
				});
			}
		};

		// Update existing Partido
		$scope.update = function() {
			var partido = $scope.partido;

			partido.$update(function() {
				$location.path('partidos/' + partido._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Partidos
		$scope.find = function() {
			$scope.partidos = Partidos.query();
		};

		// Find existing Partido
		$scope.findOne = function() {
			$scope.partido = Partidos.get({ 
				partidoId: $stateParams.partidoId
			});
		};
	}
]);