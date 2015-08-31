
function ListCtrl($scope,$rootScope,$http,auth) {


$scope.users =[];
$scope.isLoggedIn = auth.isLoggedIn();
$scope.currentUser = auth.currentUser();
$scope.logOut = auth.logOut();
$scope.bdclass = "";
$scope.borrowed = {};

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


}
