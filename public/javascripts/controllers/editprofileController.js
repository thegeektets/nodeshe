
function EditProfileCtrl($scope,$rootScope,$http,auth,route) {


$scope.users =[];
$scope.isLoggedIn = auth.isLoggedIn();
$scope.currentUser = auth.currentUser();$scope.logOut = function(){

  console.log('getting there');

  auth.logOut();

  $location.path('/start');



}
$scope.bdclass = "";
$scope.borrowed = {};
$scope.user = {};
$scope.update = {};

auth.userType().then(function(data) {
$scope.userType = data['0']['usertype'];

});  
  

  
 
   
 $http.get('/profiles/'+$route.current.params.userId).success(function(data){

 $scope.userProfile = data;
            
 });


$scope.updatesummary = function(){


   $http.put('/updatesummary/'+$scope.userProfile['0']['_id'] ,$scope.user ).error(function(error){
      $scope.error = error;
      }).success(function(success){
        $scope.success = true;

      });


}


$scope.updatebasic = function(){


   $http.put('/updatebasic/'+$scope.userProfile['0']['_id'] ,$scope.user ).error(function(error){
      $scope.error = error;
      }).success(function(success){
        $scope.success = true;

      });


}

$scope.updatecontact = function(){


   $http.put('/updatecontact/'+$scope.userProfile['0']['_id'] ,$scope.user ).error(function(error){
      $scope.error = error;
      }).success(function(success){
        $scope.success = true;

      });


}

}
