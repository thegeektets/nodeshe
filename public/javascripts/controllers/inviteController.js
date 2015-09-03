

function InvCtrl($scope, $location,$rootScope,$http,auth,$route) {


$scope.isLoggedIn = auth.isLoggedIn();
$scope.currentUser = auth.currentUser();
$scope.currentId = auth.currentId();

auth.currentTeam().then(function(data) {

$scope.currentTeam = data['0']['team'];

  


});  ;

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
  

       $scope.invite = function() {
        $scope.user = {};
      
        $scope.user.invitedby = $scope.currentId;
        $scope.user.email = $scope.invitation.email;
        $scope.user.invitename = $scope.currentUser;
        $scope.user.team = $scope.currentTeam;
        $scope.user.invitekey = Math.random().toString(36).substring(7);

        $scope.user.link = 'http://178.62.36.230/#/inviteregistration/'+$scope.user.invitekey;
       // $scope.user.link = 'http://localhost:3000/#/inviteregistration/'+$scope.user.invitekey;


        $http.post('/newinvite', $scope.user).error(function(error){
          $scope.error = error;
        });

        $scope.success =  true;
        $route.reload();

      
     



        }

}