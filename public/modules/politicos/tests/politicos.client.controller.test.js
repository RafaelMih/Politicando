'use strict';

(function() {
	// Politicos Controller Spec
	describe('Politicos Controller Tests', function() {
		// Initialize global variables
		var PoliticosController,
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

			// Initialize the Politicos controller.
			PoliticosController = $controller('PoliticosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Politico object fetched from XHR', inject(function(Politicos) {
			// Create sample Politico using the Politicos service
			var samplePolitico = new Politicos({
				name: 'New Politico'
			});

			// Create a sample Politicos array that includes the new Politico
			var samplePoliticos = [samplePolitico];

			// Set GET response
			$httpBackend.expectGET('politicos').respond(samplePoliticos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.politicos).toEqualData(samplePoliticos);
		}));

		it('$scope.findOne() should create an array with one Politico object fetched from XHR using a politicoId URL parameter', inject(function(Politicos) {
			// Define a sample Politico object
			var samplePolitico = new Politicos({
				name: 'New Politico'
			});

			// Set the URL parameter
			$stateParams.politicoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/politicos\/([0-9a-fA-F]{24})$/).respond(samplePolitico);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.politico).toEqualData(samplePolitico);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Politicos) {
			// Create a sample Politico object
			var samplePoliticoPostData = new Politicos({
				name: 'New Politico'
			});

			// Create a sample Politico response
			var samplePoliticoResponse = new Politicos({
				_id: '525cf20451979dea2c000001',
				name: 'New Politico'
			});

			// Fixture mock form input values
			scope.name = 'New Politico';

			// Set POST response
			$httpBackend.expectPOST('politicos', samplePoliticoPostData).respond(samplePoliticoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Politico was created
			expect($location.path()).toBe('/politicos/' + samplePoliticoResponse._id);
		}));

		it('$scope.update() should update a valid Politico', inject(function(Politicos) {
			// Define a sample Politico put data
			var samplePoliticoPutData = new Politicos({
				_id: '525cf20451979dea2c000001',
				name: 'New Politico'
			});

			// Mock Politico in scope
			scope.politico = samplePoliticoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/politicos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/politicos/' + samplePoliticoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid politicoId and remove the Politico from the scope', inject(function(Politicos) {
			// Create new Politico object
			var samplePolitico = new Politicos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Politicos array and include the Politico
			scope.politicos = [samplePolitico];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/politicos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePolitico);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.politicos.length).toBe(0);
		}));
	});
}());