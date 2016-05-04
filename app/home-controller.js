app.controller('homeCtrl', function($scope, $routeParams) {
	if (window.saleShows.length > 4) {
		$scope.customerCases = window.saleShows.slice(0, 4);
	} else {
		$scope.customerCases = window.saleShows;
	}

}).directive("advantageSection", function() {
	return {
		restrict : "AEC",
		link : function(scope, element, attrs) {
			element.find("li").mouseenter(function() {
				$(this).find(".bgOne").animate({
					bottom : "0%"
				});
			});

			element.find("li").mouseleave(function() {
				$(this).find(".bgOne").animate({
					bottom : "-100%"
				});
			});
		}
	}
});