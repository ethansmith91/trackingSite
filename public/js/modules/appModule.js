var appModule = angular.module('appModule', ['ngRoute', 'clockModule', 'coreModule']);

appModule.config(['$routeProvider',
	function($routeProvider){
	$routeProvider
	.when('/timers/new',
	{
		controller: 'newClockController',
		templateUrl: 'js/modules/partials/newTimers.html'
	})
	.when('/timers/show',
	{
		controller: 'clockViewController',
		templateUrl: 'js/modules/partials/viewAllTimer.html' 
	})
	.when('/timers/:localId',
	{
		controller: 'clockController',
		templateUrl: 'js/modules/partials/viewTimer.html' // TODO
	})
	.when('/about',
	{
		controller: 'aboutController',
		templateUrl: 'js/modules/partials/about.html'
	})
	.otherwise({
		redirectTo: '/about'
	});
}]);

appModule.controller('aboutController', function($scope){
	
})