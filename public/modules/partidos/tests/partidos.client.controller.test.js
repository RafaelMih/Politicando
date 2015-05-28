'use strict';

(function() {
	// Partidos Controller Spec
	describe('Partidos Controller Tests', function() {
		// Initialize global variables
		var PartidosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Partidos controller.
			PartidosController = $controller('PartidosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Partido object fetched from XHR', inject(function(Partidos) {
			// Create sample Partido using the Partidos service
			var samplePartido = new Partidos({
				name: 'New Partido'
			});

			// Create a sample Partidos array that includes the new Partido
			var samplePartidos = [samplePartido];

			// Set GET response
			$httpBackend.expectGET('partidos').respond(samplePartidos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.partidos).toEqualData(samplePartidos);
		}));

		it('$scope.findOne() should create an array with one Partido object fetched from XHR using a partidoId URL parameter', inject(function(Partidos) {
			// Define a sample Partido object
			var samplePartido = new Partidos({
				name: 'New Partido'
			});

			// Set the URL parameter
			$stateParams.partidoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/partidos\/([0-9a-fA-F]{24})$/).respond(samplePartido);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.partido).toEqualData(samplePartido);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Partidos) {
			// Create a sample Partido object
			var samplePartidoPostData = new Partidos({
				name: 'New Partido'
			});

			// Create a sample Partido response
			var samplePartidoResponse = new Partidos({
				_id: '525cf20451979dea2c000001',
				name: 'New Partido'
			});

			// Fixture mock form input values
			scope.name = 'New Partido';

			// Set POST response
			$httpBackend.expectPOST('partidos', samplePartidoPostData).respond(samplePartidoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Partido was created
			expect($location.path()).toBe('/partidos/' + samplePartidoResponse._id);
		}));

		it('$scope.update() should update a valid Partido', inject(function(Partidos) {
			// Define a sample Partido put data
			var samplePartidoPutData = new Partidos({
				_id: '525cf20451979dea2c000001',
				name: 'New Partido'
			});

			// Mock Partido in scope
			scope.partido = samplePartidoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/partidos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/partidos/' + samplePartidoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid partidoId and remove the Partido from the scope', inject(function(Partidos) {
			// Create new Partido object
			var samplePartido = new Partidos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Partidos array and include the Partido
			scope.partidos = [samplePartido];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/partidos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePartido);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.partidos.length).toBe(0);
		}));
	});
}());