app.controller('itemListCtrl', function($scope, $routeParams) {
	$scope.page = $routeParams.page||1;
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

	var beginIndex = ($scope.page - 1) * 16;
	var endIndex = $scope.page * 16;
	$scope.filterCurtainItems = window.curtainItems.slice(beginIndex, endIndex);
	var pageCount = parseInt(window.curtainItems.length/16+1);
	pageCount = parseInt(pageCount) < pageCount ? parseInt(pageCount) + 1: pageCount;
	$scope.pages = [];
	$scope.pageCount = pageCount;
	for(var i=1;i<=pageCount;i++){
		$scope.pages.push(i);
	}

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
		return false;
	}
})