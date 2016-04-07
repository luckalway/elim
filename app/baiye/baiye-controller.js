app.controller('baiyeListCtrl', function($scope) {
	$scope.baiyes = window.baiyes;
	console.log($scope.baiyes);
});

app.controller('baiyeDetailCtrl', function($scope, $routeParams) {
	console.log(window.baiyes);
	for (var i = 0; i < window.baiyes.length; i++) {
		if ($routeParams.id == window.baiyes[i].id) {
			$scope.baiyeItem = window.baiyes[i];
			break;
		}
	}
});
