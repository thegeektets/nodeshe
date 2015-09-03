
function RegistrationCtrl ($scope, $http, $location, auth , $route){
 $scope.bdclass="login-content";

  $scope.user = {};

  $scope.registerinvite = function(){

      $scope.user.invitekey = "signed";


       $http.post('/registerinvite/'+ $route.current.params.invitekey,   $scope.user).error(function(error){
           $scope.error = error;
   
       })
      
       $location.path('/start');
  

  };


};
