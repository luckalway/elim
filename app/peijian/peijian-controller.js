app.controller('peijianListCtrl', function($scope) {
	$scope.peijians = [].concat(window.guidaos).concat(window.luomagans);
});

app.controller('peijianDetailCtrl', function($scope, $routeParams) {
	var peijians = [].concat(window.guidaos).concat(window.luomagans);
	for (var i = 0; i < peijians.length; i++) {
		if ($routeParams.id == peijians[i].id) {
			$scope.peijianItem = peijians[i];
			break;
		}
	}
});
