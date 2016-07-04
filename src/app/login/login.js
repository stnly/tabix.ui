(function(angular, smi2) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name smi2.controller:login
	 * @description Контроллер авторизации пользователей
	 */
	angular.module(smi2.app.name)
		.controller(smi2.app.controllers.login, [
			'$scope',
			'$state',
			'$filter',
			'localStorageService',
			smi2.app.services.api,
			function($scope, $state, $filter, localStorageService, api) {

				var ALL_BASES_KEY = 'basesConfig';

				// Переменные, доступные во view
				$scope.vars = {
					bases: localStorageService.get(ALL_BASES_KEY) || [],
					db: {},
					error: false
				};

				/**
				 * Вход с сохранением параметров подключения
				 */
				$scope.login = function () {

					$scope.vars.error = false;

					// сохранение в LS
					if ($scope.vars.db.id) {
						for (var i = 0; i < $scope.vars.bases.length; i++) {
							if ($scope.vars.bases[i].id == $scope.vars.db.id) {
								$scope.vars.bases[i] = $scope.vars.db;
								break;
							}
						}
					} else {
						$scope.vars.db.id = (new Date()).getTime();
						$scope.vars.bases.push($scope.vars.db);
					}
					localStorageService.set(ALL_BASES_KEY, $scope.vars.bases);
					api.setDb($scope.vars.db);
					api.query('SELECT \'login success\'').then(function () {
						$state.go(smi2.app.states.dashboard);
					}, function () {
						$scope.vars.error = true;
					});
				};

				/**
				 * Удаление элемента из списка
				 */
				$scope.remove = function () {
					for (var i = 0; i < $scope.vars.bases.length; i++) {
						if ($scope.vars.bases[i].id == $scope.vars.db.id) {
							$scope.vars.bases.splice(i, 1);
							break;
						}
					}
					localStorageService.set(ALL_BASES_KEY, $scope.vars.bases);
					$scope.vars.db = {};
				};

			}
		]);
})(angular, smi2);