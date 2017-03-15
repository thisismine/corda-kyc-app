angular.module('bcloyalty').controller('kycmainCtrl', function($scope,  $state, $http, $location) {
    
	//var x = location.port;
	//var ip = location.host;
    
    var user = $state.params.userDetails;
	
    $scope.itemDetail ={};
    $scope.items = [];
    $scope.itemDetail.bankName = user.bankName;
    
    
   
    $scope.addRow = function(itemDetail){
        const apiBaseURL = 'http://localhost:8080/api/CreateKycDoc';
        $http.put(apiBaseURL,itemDetail).then(function(response){
        	console.log('brought back', response.data);
        	window.alert(response.data);
        	 
        	 });
        };
        
        
   });






/* $scope.items=[];
    const nodePort = $location.port();
    const apiBaseURL = 'http://localhost:10003/api/example/';
    $http.get(apiBaseURL + "me").then(function(response){ $scope.thisNode = response.data.me});
    $http.get('http://localhost:10003/api/example/abc').then(function(response){$scope.items=response.data});
*/




