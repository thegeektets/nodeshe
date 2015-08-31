 shed.filter('sumFilter', function() {
     return function(groups) {
         var totals = 0;
         for (i=0; i<groups.length; i++) {
              if(groups[i].copies != null){
             totals = totals + parseInt(groups[i].copies); 
             }   
          };
         return totals;
     };
 });


function dashCtrl($scope, $location, Restangular,$rootScope,$http,auth) {


  $scope.isLoggedIn = auth.isLoggedIn();
  $scope.currentUser = auth.currentUser();
   
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;
    });

  
  $scope.logOut = auth.logOut();
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

      $scope.getTotalBooks = function(){

          return $scope.books.length;

      }

      $scope.getTotalCopies = function(){
          var total = 0;
          for(var i = 0; i < $scope.books.  length; i++){
              var book = $scope.books[i];
              if(book.copies != null ){
              total = (parseInt(book.copies ) + total);
            }
          }
          return total;
      }

        $scope.getTotalBorrowed = function(){
            var copies  = 0;
          for(var i = 0; i < $scope.books.  length; i++){
              var book = $scope.books[i];
              if(book.copies != null ){
              copies = (parseInt(book.copies ) + copies);
            }
          }
            var total = 0;
            for(var i = 0; i < $scope.books.length; i++){
                var book = $scope.books[i];
                if(book.transaction != null ){
                total = (parseInt(book.transaction ) + total);

              }
            }
            total =  copies - total;

            return total;
        }
      

      });

    });




}
