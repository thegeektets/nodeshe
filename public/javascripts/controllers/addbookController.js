function AddBookCtrl ($scope, $location,$http,$rootScope,auth) {

  $scope.book = {};

  $rootScope.addmanually = 'false';
  $scope.isLoggedIn = auth.isLoggedIn();
  $scope.currentUser = auth.currentUser();
   
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;

   
});
  auth.teamId().then(function(data) {
    $scope.teamId = data;

   
});
 
  $scope.logOut = function(){

  console.log('getting there');

  auth.logOut();

  $location.path('/start');



}
  $scope.bdclass = "";
   


    $scope.manual = function(){
      console.log('switching to manual');

      $rootScope.addmanually = 'true';

    }


   var pendingTask;
 
    $scope.change = function(){
      if(pendingTask) {
        clearTimeout(pendingTask);

      }
      pendingTask = setTimeout(fetch, 800);

      

    };

function fetch() {
  $http.get("https://www.googleapis.com/books/v1/volumes?q=" + 
     $scope.search)
   .success(function(response){
    $scope.details = response;

  $scope.book.title = $scope.details.items['0'].volumeInfo.title;
  $scope.book.description = $scope.details.items['0'].volumeInfo.description;
  $scope.book.publisher = $scope.details.items['0'].volumeInfo.publisher;
  $scope.book.author = $scope.details.items['0'].volumeInfo.authors['0'];
  $scope.book.dateofpublication = $scope.details.items['0'].volumeInfo.publishedDate;
  $scope.book.pic = $scope.details.items['0'].volumeInfo.imageLinks.thumbnail;
  $scope.book.category = $scope.details.items['0'].volumeInfo.categories['0'];
  $scope.book.teamid = $scope.teamId['_id'];
  $scope.book.transaction = $scope.book.copies;



  });


}

  
    $scope.save = function () {
     
        if($scope.book.copies.length < 2){
            
        
          $scope.book.copies = "0" + $scope.book.copies;

           console.log($scope.book.copies);


        }
        $scope.book.transaction = $scope.book.copies;
        
        $http.post('/addbook', $scope.book).error(function(error){
          $scope.error = error;
        });
        
        $location.path('/listbooks');

      
    }
      $scope.select = function(){
      this.setSelectionRange(0, this.value.length);
      }  
}
