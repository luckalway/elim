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

	$scope.filterCurtainItems = window.curtainItems;
	

	$scope.filterItems = function(name, value) {
		$scope.filterCurtainItems = [];
		if(name == 'price'){
			var minPrice = parseInt(value.split('-')[0]);
			var maxPrice = parseInt(value.split('-')[1]);
			
			for(var i = 0; i < window.curtainItems.length; i++){
				var item = window.curtainItems[i];
				if(!isNaN(minPrice) && item.price < minPrice){
					continue;	
				}
				if(!isNaN(maxPrice) && item.price >= maxPrice){
					continue;
				}
				$scope.filterCurtainItems.push(item);
			}
		}else if(name == 'craft'){
			for(var i = 0; i < window.curtainItems.length; i++){
				var item = window.curtainItems[i];
				if(item.craft == value){
					$scope.filterCurtainItems.push(item);
				}
			}
		}else if(name == 'style'){
			for(var i = 0; i < window.curtainItems.length; i++){
				var item = window.curtainItems[i];
				if(item.style == value){
					$scope.filterCurtainItems.push(item);
				}
			}
		}
		console.log($scope.filterCurtainItems);
		return false;
	}
})