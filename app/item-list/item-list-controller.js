app.controller('itemListCtrl', function($scope) {
	var groups = new Array();
	var group = null;
	for (var i = 0; i < curtainItems.length; i++) {
		if (i % 4 == 0) {
			group = new Array();
			groups.push(group);
		}
		group.push(curtainItems[i]);
	}

	$scope.productGroups = groups;
})