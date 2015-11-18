app.controller('itemListCtrl', function($scope, $routeParams) {
	$scope.categoryId = $routeParams.id;
	
	var groups = new Array();
	var group = null;
	for (var i = 0; i < products.length; i++) {
		if (i % 3 == 0) {
			group = new Array();
			groups.push(group);
		}
		group.push(products[i]);
	}

	$scope.productGroups = groups;
})