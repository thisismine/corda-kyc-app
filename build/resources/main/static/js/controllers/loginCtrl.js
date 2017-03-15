/*angular.module('bcloyalty').controller('loginCtrl',function($scope, $rootScope, $state, loginService){

	$rootScope.login = function( ){
		$state.go('index');
		/*
		$scope.error = "";
		$scope.loginDetails = {
			  "enrollId": $scope.userId,
			  "enrollSecret": $scope.password
			  };
		loginService.getUserDetails($scope.loginDetails).then(function(result){
			if(result.Failure){
				$scope.error = result;
				return false;
			}
			else if (result.success){
				$state.go('index');
				}
						
		}, function(error){
			$scope.error = error;
		});
	};

});*/

'use strict';

angular.module('bcloyalty').controller('loginCtrl', function ($scope,loginService,userDataService) {
	$scope.userId = "";
	//alert("userid = "+$scope.userId);
	$scope.login=function(){
		//alert("userid = "+$scope.userId);
		var userDetails = {};
		userDetails.userId = $scope.userId;
		userDetails.password = $scope.password;
		userDetails.bankName = "HDFC";
		userDetails.port = "8080";
		userDetails.ip = "127.0.0.1";
		loginService.login(userDetails,$scope); //call login service
	};
});
