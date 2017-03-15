'use strict';
var bcloyalty = angular.module('bcloyalty',['ui.router',  'ngAnimate', 'ui.bootstrap',  'ui.tab.scroll']);

bcloyalty.config(function($stateProvider, $urlRouterProvider,  $httpProvider){
	
$urlRouterProvider.otherwise("/login");	

$stateProvider
	    .state('login', {
	        url: "/login",
	        templateUrl: "/html/login.html",
	        controller:'loginCtrl'
	    }).state('index', {
	        url: "/index",
	        templateUrl: "index.html",
	        controller : ['$state',function($state){
	            $state.go('kycmain');
            }],
	    }).state('search', {
			url: "/search",
			params: {
                'userDetails': {}
              },
            templateUrl: "/html/search.html",
			controller : "searchCtrl",
			
	    }).state('kycmain', {
            url: "/kycmain",
            params: {
                'userDetails': {}
              },
            templateUrl: "/html/kycmain.html",
            controller : "kycmainCtrl",
           
        })
            .state('logout', {
        	  url: "/logout",
        	  template: '',
        	  controller: "headerCtrl"
        });

});



bcloyalty.run(function($rootScope, $location, loginService){
	var routespermission=['/kycmain'];  //route that require login
	$rootScope.$on('$routeChangeStart', function(){
		if( routespermission.indexOf($location.path()) !=-1)
		{
			var connected=loginService.islogged();
			connected.then(function(msg){
				if(!msg.data) $location.path('/login');
			});
		}
	});
});


bcloyalty.factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config);

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
});

bcloyalty.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
	$httpProvider.interceptors.push(function ($q, $location, $injector) {
	    return {
		'responseError': function (rejection) {
			if(rejection.status == 401){
				if(rejection.data.Failure == "Token expired, Please login again."){
					$injector.get('$state').go('login',{tokenExpMsg:rejection.data.Failure});
				}else{
					return $q.reject(rejection);
				}
				
			}else if(rejection.status == 500){
				
				$location.path('/genericError');
			}
			
			
		}
	    };
	}); 
});

bcloyalty.directive("loader", function ($rootScope, $timeout) {
	return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });
        return $scope.$on("loader_hide", function () {
            return element.hide();
        });
    };
});

