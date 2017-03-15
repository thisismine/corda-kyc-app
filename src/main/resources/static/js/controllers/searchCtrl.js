var app = angular.module('bcloyalty');
 
app.controller('searchCtrl',function($http, $scope,  $state, $location, sessionService){
 
    var item = $state.params.item;
    //alert(sessionService.get('bankName'));
  var user = $state.params.userDetails;
 
   /* $scope.items = [];
    $scope.items.push(item);*/
 
    
    $scope.updateDetail ={};
    if($state.params.search){
        $scope.search = $state.params.search;
       
    }
  
    $scope.update = function() {
    	 $scope.updateDetail.userID = $scope.searchUserId;
        $scope.updateData = !$scope.updateData;
       
        
    };
 
   
   $scope.updateDetail.bankName = sessionService.get('bankName');
    $scope.updateDetail.kycUpdateDate = new Date();
   
  /*$scope.callUpdate = function(){
         var itemDetail=[];
         itemDetail[0]=$scope.userID;
         itemDetail[1]=$scope.userName;
         itemDetail[2]=$scope.bankName;
         itemDetail[3]=$scope.kycUpdateDate;
         itemDetail[4]= getBase64(newFile);
         update(itemDetail);
  }*/
 
  
    //function update(itemDetail){
    $scope.callUpdate = function(updateDetail){
        const apiBaseURL = 'http://localhost:8080/api/UpdateKycDoc';
        $http.put(apiBaseURL,updateDetail).then(function(response){
              console.log('brought back', response.data);
              window.alert(response.data);
               
               });
       
    }
   
    $scope.search = function(searchUserId){
        const apiBaseURL = 'http://localhost:8080/api/SearchKycDoc';
     
        $http.put(apiBaseURL,searchUserId).then(function(response){
              console.log('brought back', response.data);
              window.alert(response.data);
               
               });
        };
       
        $scope.check=function(){
 
            // To get the file
              var newFile= $(":file")[0].files[0]
              
 
        // To check whether a file is selected or not and the file is pdf
                  if(newFile &&(newFile.type=='application/pdf')){
                          console.log(newFile)
                          alert("Successful");
                          getBase64(newFile);
                        }else{
                           alert("Select a pdf file");
                            return false;
                        }
 
          };
 
          function getBase64(file) {
                
 
             var reader = new FileReader();
             reader.readAsDataURL(file);
 
             reader.onload = function () {
               base64file=reader.result;
 
             };
             reader.onerror = function (error) {
             
             };
          }
       
         window.downloadPDF = function downloadPDF() {
 
             var dlnk = document.getElementById('dwnldLnk');
             dlnk.href = base64file;
 
             dlnk.click();
 
 
           
         };
});
 


/*angular.module('bcloyalty').controller('searchCtrl',function($http, $scope,  $state){

    var item = $state.params.item;

    $scope.items = [
        { 'Counterparty':'A',
                'user_id': '101',
                'name':'Ajay',
                'bank_id':'1',
                'registration_date':'2016-12-11',
                'expiry_date':'2016-12-11',
                'KycDoc':'pdf1'},
        { 'Counterparty':'B',
                'user_id': '202',
                'name':'Vishal',
                'bank_id':'2',
                'registration_date':'2016-12-12',
                'expiry_date':'2016-12-12',
                'KycDoc':'pdf2'},
        { 'Counterparty':'C',
                'user_id': '303',
                'name':'Veta',
                'bank_id':'3',
                'registration_date':'2016-12-10',
                'expiry_date':'2016-12-10',
                'KycDoc':'pdf3'},
        { 'Counterparty':'D',
                'user_id':'404',
                'name':'Saloni',
                'bank_id':'4',
                'registration_date':'2016-12-09',
                'expiry_date':'2016-12-09',
                'KycDoc':'pdf4'}
                ];
    $scope.items.push(item);

    if($state.params.search){
        $scope.search = $state.params.search;
    }
});

*/