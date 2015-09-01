
function EditProfileCtrl($scope,$rootScope,$http,auth) {


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
  

  
 
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;
 
   
    if($scope.userProfile['0']['usertype'] == 'admin'){ 

    

        $http.get('/people/'+$scope.userProfile['0']['_id']).success(function(data){

           $scope.people = data;

           $scope.users= angular.extend( $scope.userProfile,$scope.people);

            

          });

    }

  else{
       $http.get('/people/'+$scope.userProfile['0']['invitedby']).success(function(data){

           $scope.people = data;

           $scope.users= angular.extend( $scope.userProfile,$scope.people);

          });
      }

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
