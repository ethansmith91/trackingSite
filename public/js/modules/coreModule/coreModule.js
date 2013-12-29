var coremodule = angular.module('coreModule',['ngRoute']);
/*
coremodule.config(['$routeProvider',
	function($routeProvider){
	$routeProvider
	.when('/',
	{
		controller: 'AuthenticateController',
		templateUrl: '/partials/temp.html'
	});
}]); */

coremodule.service('AuthenticateFactory', function($rootScope, $q){
	this.isLoggedIn = function(){
		var deferred = $q.defer();
		$.get('http://localhost:3000/api/isLoggedIn', function(data){
			if(data.isLoggedIn == 'true')
			{
				deferred.resolve(true);
			}
			deferred.resolve(false);
		});
		return deferred.promise;
	};
}); 

coremodule.controller('AuthenticateController', function($scope, $http, AuthenticateFactory){
	var promise = AuthenticateFactory.isLoggedIn();
	
	promise.then(function(bool){
		$scope.isLoggedIn = bool;
	});
});
