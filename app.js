(function(){
    var app = angular.module('gitapi', []);// init angular app
    
    app.config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.cache = true;                 // config angular app for caching api req
    }]);
//    main controller that calls api and does the calculation 
    app.controller('MainCtrl', function($scope,$http) {
        $scope.issues=[]; // stores the open issues
        var count=0;      // for global count fore reqs 
        $scope.loading=true;
        $scope.user_in_url=""; // url that user inserts
        $scope.yesterday=0;     // for counting issues opened yesterday
        $scope.pastweek=0;      // for counting isuues opened a week ago 
        $scope.pastmonth=0;     // for counting issues opened a month ago 
        $scope.message_pipe=[]; // a error and status message pipe
        $scope.display_messag=false; // hide nd show message pipe
        $scope.submit=function(){   //function for submitting data 
            count=0;
            $scope.issues=[];
            $scope.yesterday=0;
            $scope.pastweek=0;
            $scope.pastmonth=0;
            console.log('Submit working');
            get_update($scope.user_in_url);
        }
        function get_uname_repo(user_in_url){ //function for getting username and repo name from user url
            var result="";
            result=user_in_url.replace('https://github.com/','');
            return result;
        }
        function get_update(url){   //function that fetch data from api and does the math
            count+=1;
            $scope.loading=true;
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
                    $scope.loading=false;
                    $scope.message_pipe.push('Compleated fetching data');
                }
            },function(err){
                $scope.message_pipe.push('Error fetching data');
                console.log(err);
            });
        }
    });
})();
