'use strict';

// Politicos controller
angular.module('politicos').controller('PoliticosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Politicos',
	function($scope, $stateParams, $location, Authentication, Politicos) {
		$scope.authentication = Authentication;

		// Create new Politico
		$scope.create = function() {
			// Create new Politico object
			var politico = new Politicos ({
				name: this.name
			});

			// Redirect after save
			politico.$save(function(response) {
				$location.path('politicos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Politico
		$scope.remove = function(politico) {
			if ( politico ) { 
				politico.$remove();

				for (var i in $scope.politicos) {
					if ($scope.politicos [i] === politico) {
						$scope.politicos.splice(i, 1);
					}
				}
			} else {
				$scope.politico.$remove(function() {
					$location.path('politicos');
				});
			}
		};

		// Update existing Politico
		$scope.update = function() {
			var politico = $scope.politico;

			politico.$update(function() {
				$location.path('politicos/' + politico._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Politicos
		$scope.find = function() {
			$scope.politicos = Politicos.query();
		};

		// Find existing Politico
		$scope.findOne = function() {
			$scope.politico = Politicos.get({ 
				politicoId: $stateParams.politicoId
			});
		};
	}
]);