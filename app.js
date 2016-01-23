var app = angular.module('gitapi', []);
app.controller('MainCtrl', function($scope,$http) {
  $scope.name = 'World';
  $scope.issues=[];
  $scope.open_issues=0;
  var result=[];
    var count=0;
  for(var i=1;i<5;i++){
    $http.get('https://api.github.com/repos/Shippable/support/issues?page='+i+'&per_page=100',{params:{state:'open'}})
    .then(function(response){
      console.log(response);
      if(response.data.length){
        result=result.concat(response.data);
          console.log(result);
          $scope.issues=result;
//          $scope.$apply();
      }
    },function(error){
      console.log(error);
    });
  }
});