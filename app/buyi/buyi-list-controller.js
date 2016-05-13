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

	$scope.setPage = function(page){
		if (page < 1) {
            return;
            $scope.itemsInCurrentPage = [];
        }
        // get pager object from service
        vm.pager = PagerService.GetPager($scope.filterCurtainItems.length, page, 16);
        if(page > vm.pager.totalPages){
        	$scope.itemsInCurrentPage = [];
        	return;
        }
        
        // get current page of items
        $scope.itemsInCurrentPage = $scope.filterCurtainItems.slice(vm.pager.startIndex, vm.pager.endIndex);
	}

	$scope.$watch('filterCurtainItems', function(newValue, oldValue){
		$scope.setPage(1);
	});
	
	
	$scope.addFilterItems = function(name, value, label, valueDisplay) {
		$scope.setPage(1);
		
		if(!(name == 'price' || name == 'craft' || name == 'style')){
			return;
		}
		var newQuery = $.extend({}, $scope.query || {});
		newQuery[name] = {
			label: label,
			value : value,
			display : valueDisplay
		};
		
		$scope.query = newQuery;
	}
	
	$scope.removeFilterItems = function(name){
		var newQuery = {};
		for(var property in $scope.query){
			if(property != name){
				newQuery[property] = $scope.query[property];
			}
		}
		$scope.query = newQuery;
		return false;
	}
	
	$scope.$watch('query',function(query){
		var filterCurtainItems = []
		for (var i = 0; i < window.curtainItems.length; i++) {
			var item = window.curtainItems[i];
			var match = true;
			for (var name in query) {
				if (name == 'price') {
					var lowerPrice = parseInt(query[name].value.split('-')[0]);
					var upperPrice = parseInt(query[name].value.split('-')[1]);

					var matchLowerPrice = isNaN(lowerPrice) || item.price >= lowerPrice;
					var matchUpperPrice = isNaN(upperPrice) || item.price < upperPrice;
					
					if (!matchLowerPrice || !matchUpperPrice) {
						match = false;
					}
				} else if (name == 'craft') {
					if (query[name].value.indexOf(item.craft) == -1) {
						match = false;
					}
				} else if (name == 'style') {
					if (item.style != query[name].value) {
						match = false;
					}
				}
			}
			if(match){
				filterCurtainItems.push(item);
			}
		}
		$scope.filterCurtainItems = filterCurtainItems;
	});
		
})