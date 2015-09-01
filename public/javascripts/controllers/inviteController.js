

function InvCtrl($scope, $location,$rootScope,$http,auth) {


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
  
       $scope.invite = function() {
        $scope.user = {};
      
        $scope.user.invitedby = $rootScope.authService.userId();
        $scope.user.email = $scope.invitation.email;
          var mail = 0;
        $scope.invitation.user = $rootScope.authService.currentUser();
        $scope.invitation.team = $rootScope.authService.currentTeam();
        $scope.invitation.link = $location.host() +'/shed'+'#/registernew/'+$scope.user.email+'/'+$scope.user.invitedby;



        

       $http.post("mail.php", {"invitation": $scope.invitation  })
       .success(function(data, status, headers, config) {
            $scope.data = data;
            console.log('success:'+data);
            console.log($scope.invitation.link);

        Restangular.all('users').post($scope.user).then(function (user) {
        $location.path('/list');
       });
          
                 }).error(function(data, status, headers, config) {
              $scope.status = status;
              console.log('error:'+data);
          });

          console.log(mail);

       
  
             


          
       }
}