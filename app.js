var app = angular.module('gitapi', []);
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.cache = true;
}]);
app.controller('MainCtrl', function($scope,$http) {
    $scope.issues=[];
    $scope.open_issues=0;
    var count=0;
    $scope.user_in_url="";
    $scope.yesterday=0;
    $scope.pastweek=0;
    $scope.pastmonth=0;
    $scope.message_pipe=[];
    $scope.display_messag=false;
    $scope.submit=function(){
        count=0;
        $scope.issues=[];
        $scope.yesterday=0;
        $scope.pastweek=0;
        $scope.pastmonth=0;
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
        var url='https://api.github.com/repos/'+uname_repo+'/issues?page='+count+'&per_page=100';
        $scope.message_pipe.push('Fetching data from :'+url);
        $scope.display_messag=true;
        $http.get(url,{params:{state:'open'}}).
        then(function(res){
            $scope.display_messag=false;
            if(res.data.length){
                $scope.issues=$scope.issues.concat(res.data);
                get_update($scope.user_in_url);
                console.log(res.data);
            }
            else{
                $scope.issues.forEach(function(issue){
                    var yesterday=moment().subtract(1,'day').startOf('day');
                    var pastweek=moment().subtract(1,'day').startOf('week');
                    var pastmonth=moment().subtract(1,'day').startOf('month');
                   if(moment(issue.created_at).isAfter(yesterday)){
                       $scope.yesterday++;
                   }
                    else if(moment(issue.created_at).isAfter(pastweek)){
                        $scope.pastweek++;
                    }
                    else if(moment(issue.created_at).isAfter(pastmonth)){
                        $scope.pastmonth++;
                    }
                });
                $scope.message_pipe.push('Compleated fetching data');
            }
        },function(err){
            $scope.message_pipe.push('Error fetching data');
            console.log(err);
        });
    }
});