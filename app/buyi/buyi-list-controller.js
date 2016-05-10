app.controller('itemListCtrl', function($scope, $routeParams, PagerService) {
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
	
	$scope.filterCurtainItems = window.curtainItems;
	var vm = this;
	vm.pager = {};
    vm.setPage = setPage;
	var setPage = function(page){
		alert(page);
		if (page < 1 || page > vm.pager.totalPages) {
            return;
        }
        // get pager object from service
        vm.pager = PagerService.GetPager($scope.filterCurtainItems.length, page);
 
        // get current page of items
        $scope.itemsInCurrentPage = $scope.filterCurtainItems.slice(vm.pager.startIndex, vm.pager.endIndex);
	}

	$scope.$watch('filterCurtainItems', function(newValue, oldValue){
		setPage(1);
	});
	
	
	$scope.query = {};
	$scope.filterItems = function(name, value, label, valueDisplay) {
		if(!(name == 'price' || name == 'craft' || name == 'style')){
			return;
		}
		$scope.query[name] = {
			label: label,
			value : value,
			display : valueDisplay
		};
		
		var filterCurtainItems = []
		for (var i = 0; i < window.curtainItems.length; i++) {
			var item = window.curtainItems[i];
			var match = true;
			for (var name in $scope.query) {
				if (name == 'price') {
					var lowerPrice = parseInt($scope.query[name].value.split('-')[0]);
					var upperPrice = parseInt($scope.query[name].value.split('-')[1]);

					var matchLowerPrice = isNaN(lowerPrice) || item.price >= lowerPrice;
					var matchUpperPrice = isNaN(upperPrice) || item.price < upperPrice;
					if (!matchLowerPrice || !matchUpperPrice) {
						match = false;
					}
				} else if (name == 'craft') {
					if ($scope.query[name].value.indexOf(item.craft) == -1) {
						match = false;
					}
				} else if (name == 'style') {
					if (item.style != $scope.query[name].value) {
						match = false;
					}
				}
			}
			if(match){
				filterCurtainItems.push(item);
			}
		}
		$scope.filterCurtainItems = filterCurtainItems;
	}	
})