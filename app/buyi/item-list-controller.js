app.controller('itemListCtrl', function($scope) {
	$scope.categoryObj = window.categoryObj;
	var maxSize = 0;
	for (attrName in $scope.categoryObj) {
		maxSize = maxSize > $scope.categoryObj[attrName].length ? maxSize
				: $scope.categoryObj[attrName].length;
	}

	for (attrName in $scope.categoryObj) {
		if ($scope.categoryObj[attrName].length == maxSize) {
			continue;
		}

		for (var i = $scope.categoryObj[attrName].length - 1; i < maxSize - 1; i++) {
			$scope.categoryObj[attrName].push({
				name : " "
			});
		}
	}

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