var app = angular.module('gitapi', []);
app.controller('MainCtrl', function($scope,$http) {
    $scope.issues=[];
    $scope.open_issues=0;
    var count=0;
    $scope.user_in_url="";
    $scope.submit=function(){
        count=0;
        console.log('Submit working');
        get_update($scope.user_in_url);
    }
    function get_uname_repo(user_in_url){
        var result="";
        result=user_in_url.replace('https://github.com/','');
        return result;
    }
    function get_update(url){
        count+=1;
        var uname_repo=get_uname_repo(url);
        $http.get('https://api.github.com/repos/'+uname_repo+'/issues?page='+count+'&per_page=100',{params:{state:'open'}}).
        then(function(res){
            if(res.data.length){
                $scope.issues=$scope.issues.concat(res.data);
                get_update($scope.user_in_url);
                console.log(res.data);
            }
        },function(err){
            console.log(err);
        });
    }
});