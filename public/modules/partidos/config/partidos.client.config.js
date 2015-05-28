'use strict';

// Configuring the Articles module
angular.module('partidos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Partidos', 'partidos', 'dropdown', '/partidos(/create)?');
		Menus.addSubMenuItem('topbar', 'partidos', 'Lista de Partidos', 'partidos');
		Menus.addSubMenuItem('topbar', 'partidos', 'Cadastrar Partido', 'partidos/create');
	}
]);