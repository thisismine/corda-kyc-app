/*angular.module('bcloyalty').factory('loginService',function($http, $q){
	return{
		getUserDetails: function(){
			var deffered = $q.defer();
			$http.get('/json/user.json').
			success(function(data, status, headers, config){
				deffered.resolve(data);
			}).
			error(function(data, status, headers, config){
				deffered.reject(data);
			});

			return deffered.promise;
		}
	}
});*/
'use strict';
angular.module('bcloyalty').factory('loginService', function($http,$state, $location,sessionService){
	return{
		login:function(userDetails,scope){
			//alert("data = "+userDetails.userId);
			var $promise=$http.post('',userDetails); //send data to user.php
			$promise.then(function(msg){
				//var uid=msg.data;
			    var uid = userDetails.userId;
			    var bankName = userDetails.bankName;
				if(uid){
					
					//scope.msgtxt='Correct information';
					//$cookieStore.put(uid);
					sessionService.set('uid',uid);
					sessionService.set('bankName',bankName);
					$state.go('kycmain',{'userDetails':userDetails});
					
				}	       
				else  {
					scope.msgtxt='incorrect information';
					$state.go('login');
				}				   
			});
		},
		logout:function(){
			sessionService.destroy('uid');
			//alert(sessionStorage.getItem("uid"));
			$state.go('login');
		},
		islogged:function(){
			var $checkSessionServer=$http.post('data/check_session.php');
			return $checkSessionServer;			
		}
	}

});