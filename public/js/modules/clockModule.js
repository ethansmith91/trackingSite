var clockModule = angular.module('clockModule', ['coreModule']);

clockModule.service('clockService', function($rootScope, $q){
	this.ticking = function(timeObj){
		if(timeObj.seconds<59){
			timeObj.seconds += 01;
			timeObj.mup = false;
			timeObj.hup = false;
		}
		else if(timeObj.seconds == 59){
			timeObj.seconds = 00;
			timeObj.mup = true;
		}
		if(timeObj.mup == true && timeObj.minutes < 59){
			timeObj.minutes += 01;
		}
		else if(timeObj.mup == true && timeObj.minutes == 59){
			timeObj.minutes = 00;
			timeObj.hup = true;
		}
		if(timeObj.hup == true){
			timeObj.hours += 01;
		}
		timeObj.scope.hours = timeObj.hours;
		timeObj.scope.minutes = timeObj.minutes;
		timeObj.scope.seconds = timeObj.seconds;
		$rootScope.$apply();
	};

	this.secondsToTime = function(seconds){
		var hours = Math.floor(seconds / 3600);
		var minutes = Math.floor((seconds - hours * 3600) / 60);
		var seconds = seconds - hours * 3600 - minutes * 60;
		return {
			hours : hours,
			minutes : minutes,
			seconds: seconds
		}
	};

	this.getTimer = function(localId){
		var deffered = $q.defer();
		$.get('http://localhost:3000/api/timers/' + localId, function(data){
			if(data)
			{
				deffered.resolve(data);
			}
			else
			{
				deffered.reject(data);
			}
		});
		return deffered.promise;
	};

	this.getAllTimer = function(){
		var deffered = $q.defer();
		$.get('http://localhost:3000/api/timers', function(data){
			if(data)
			{
				deffered.resolve(data);
			}
			else
			{
				deffered.reject(data);
			}
		});
		return deffered.promise;		
	}

	this.timeToSeconds = function(h, m, s){
		return h * 3600 + m * 60 + s;
	};
});

// handle /timers/:localId => for timer usage and view
clockModule.controller('clockController', function($scope, $routeParams, clockService){

	var promise = clockService.getTimer($routeParams.localId);
	var mup, hup = false;
	var isRunning = false;
	var timr;
	var isReady = true;

	promise.then(function(timer){
		timer = angular.fromJson(timer);
		var time = clockService.secondsToTime(timer[0].totalLength);
		$scope.hours = time.hours;
		$scope.minutes = time.minutes;
		$scope.seconds = time.seconds;
		$scope.timer = timer[0];
	}, function(reason){
		isReady = false;
		alert('Timer not found');
		window.location.replace('http://localhost:3000');
	});

	$scope.start = function(){
		if(isReady == true && isRunning == false)
		{
			var timerObj = 
				{
					scope: $scope,
					hours: $scope.hours,
					minutes: $scope.minutes,
					seconds: $scope.seconds,
					mup: mup,
					hup: hup
				};
			timr = setInterval(function(){
				clockService.ticking(timerObj)},
				1000);
			isRunning = true; 
		}
	};

	$scope.pause = function(){
		clearInterval(timr);
		var newTime = clockService.timeToSeconds($scope.hours, $scope.minutes, $scope.seconds);
		var currentDate = new Date();
		currentDate = currentDate.toLocaleDateString();
		// TODO: SEND INFORMATION TO SERVER
		$.post('http://localhost:3000/api/timers/updateTime',
		{
			timerId : $scope.timer.localId,
			newTime: newTime,
			currentDate: currentDate
		},
		function(data, status){
			if(status == "success")
				$scope.status = true;
			else
				$scope.status = false;
		})
		isRunning = false
	};
});

// handle creating new controller
// timers/new
// have method to submit new controller to /api/timers/create
clockModule.controller('newClockController', function($scope, $location){
	$scope.status = true;
	$scope.submit = function(){
		$.post('http://localhost:3000/api/timers/create',
		{
			name : $scope.name,
			subject: $scope.subject,
			testType: $scope.testType
		},
		function(data, status){
			if(status == "success")
			{
				$scope.status = true;
				$location.path('/timers/show').replace();
				$scope.$apply();
			}
			else
				$scope.status = false;
		})
	};

});

// handle timers/show
// display all the clock
clockModule.controller('clockViewController', function($scope, clockService){
	$scope.status = true;
	var promise = clockService.getAllTimer();
	promise.then(function(timers){
		$scope.timers = angular.fromJson(timers);
	}, function(reason){
		$scope.status = false;
	});
});