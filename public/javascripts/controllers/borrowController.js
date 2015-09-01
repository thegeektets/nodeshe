
function BrwCtrl($scope, $location,$rootScope,$http,auth) {

$scope.users =[];
$scope.isLoggedIn = auth.isLoggedIn();
$scope.currentUser = auth.currentUser();
$scope.logOut = function(){

  console.log('getting there');

  auth.logOut();

  $location.path('/start');

}
$scope.bdclass = "";
$scope.borrowed = {};

auth.userType().then(function(data) {
$scope.userType = data['0']['usertype'];

});  
  
    $http.get('/borrowedlist').success(function(data){

       $scope.books = data;
       


      });



  
}