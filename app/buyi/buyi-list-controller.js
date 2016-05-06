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

	$scope.query = {};
	$scope.filterItems = function(name, value, label, valueDisplay) {
		if(!(name == 'price' || name == 'craft' || name == 'style')){
			return;
		}
		$scope.query[name] = {
			label: label,
			value : value,
			display : valueDisplay
		};console.dir($scope.query);
		
		var filterCurtainItems = window.curtainItems;
		for(var name in $scope.query){
			if(name == 'price'){
				var minPrice = parseInt($scope.query[name].value.split('-')[0]);
				var maxPrice = parseInt($scope.query[name].value.split('-')[1]);
				
				for(var i = 0; i < filterCurtainItems.length; i++){
					var item = filterCurtainItems[i];
					if(!isNaN(minPrice) && item.price < minPrice){
						filterCurtainItems.remove(i);
					}
					if(!isNaN(maxPrice) && item.price >= maxPrice){
						filterCurtainItems.remove(i);						
					}
				}
			}else if(name == 'craft'){
				for(var i = 0; i < filterCurtainItems.length; i++){
					var item = filterCurtainItems[i];
					if(item.craft != $scope.query[name].value){
						filterCurtainItems.remove(i);
					}
				}
			}else if(name == 'style'){
				for(var i = 0; i < filterCurtainItems.length; i++){
					var item = filterCurtainItems[i];
					if(item.style != $scope.query[name].value){
						filterCurtainItems.remove(i);
					}
				}
			}
		}
		$scope.filterCurtainItems = filterCurtainItems;
		return false;
	}
})