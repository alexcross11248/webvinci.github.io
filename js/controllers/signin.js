'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.user={
    	name:"admin",
    	password:"123456"
    };
    $scope.login = function() {
      $scope.authError = null;
      $state.go('app.nurse-certificate');
      
      
      // Try to login
//    $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
//    .then(function(response) {
//      if ( !response.data.user ) {
//        $scope.authError = 'Email or Password not right';
//      }else{
//        $state.go('app.dashboard-v1');
//      }
//    }, function(x) {
//      $scope.authError = 'Server Error';
//    });
    };
  }])
;