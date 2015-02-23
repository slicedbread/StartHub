
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Hello World from controller");

var refresh = function() {
	$http.get('/accountList').success(function(response){
		console.log("I got the data I requested");
		$scope.accountList = response;
		$scope.account = "";
	});
};

refresh();

$scope.addAccount = function() {
	console.log($scope.account);
	$http.post('/accountList', $scope.account).success(function(response){
		console.log(response);
		refresh();
	});
};
	
$scope.remove = function(id) {
	console.log(id);
	$http.delete('/accountList/' + id).success(function(response) {
		refresh();
	});
};

$scope.edit = function(id) {
	console.log(id);
	$http.get('/accountList/' + id).success(function(response){
		$scope.account = response;
	});
};

$scope.update = function() {
	console.log($scope.account._id);
	$http.put('/accountList/' + $scope.account._id, $scope.account).success(function(response) {
		refresh();
	});
};

$scope.deselect = function() {
	$scope.account = "";
}
	
}]);

