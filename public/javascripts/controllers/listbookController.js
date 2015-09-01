
function ListBookCtrl($scope, $location,$rootScope,$http,auth,$q) {

  $scope.isLoggedIn = auth.isLoggedIn();
  $scope.currentUser = auth.currentUser();
   
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;
    });

  
  $scope.logOut = function(){

  console.log('getting there');

  auth.logOut();

  $location.path('/start');



}
  $scope.bdclass = "";
   
 
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;
   
  });
  
 auth.userType().then(function(data) {
    $scope.userType = data;
  });

 auth.teamId().then(function(data) {
    
    $scope.teamId = data._id;

     $http.get('/librarybooks/'+$scope.teamId).success(function(data){

       $scope.books = data;


      });

    });


 

  

    
}
     

  

