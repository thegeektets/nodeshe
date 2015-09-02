

function InvCtrl($scope, $location,$rootScope,$http,auth) {


$scope.isLoggedIn = auth.isLoggedIn();
$scope.currentUser = auth.currentUser();
$scope.currentId = auth.currentId();
$scope.currentTeam = auth.currentTeam();

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

        $scope.user.link = $location.host() +'/shed'+'#/registernew/'+$scope.user.invitekey;


        $http.post('/newinvite', $scope.user).error(function(error){
          $scope.error = error;
        }).success(function(success){

            $scope.success =  true;


        });

        }

}