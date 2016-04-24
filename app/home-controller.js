app.controller('homeCtrl', function($scope, $routeParams) {
	$scope.curtainItems = [];
	for (var i = 0; i < 16; i++) {
		$scope.curtainItems.push(window.curtainItems[i]);
	}	
	$scope.slideShows = window.slideShows;
});