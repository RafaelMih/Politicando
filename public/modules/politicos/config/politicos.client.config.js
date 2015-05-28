'use strict';

// Configuring the Articles module
angular.module('politicos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Politicos', 'politicos', 'dropdown', '/politicos(/create)?');
		Menus.addSubMenuItem('topbar', 'politicos', 'Lista de Políticos', 'politicos');
		Menus.addSubMenuItem('topbar', 'politicos', 'Cadastrar Político', 'politicos/create');
	}
]);