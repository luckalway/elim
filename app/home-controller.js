app.controller('homeCtrl', function($scope, $routeParams) {
	$scope.curtainItems = window.curtainItems;
	$scope.slideShows = window.slideShows;

	$scope.slideShow = function(){
		$("#slide-show").owlCarousel({
			navigation : true, // Show next and prev buttons
			slideSpeed : 300,
			paginationSpeed : 400,
			singleItem : true

		// "singleItem:true" is a shortcut for:
		// items : 1,
		// itemsDesktop : false,
		// itemsDesktopSmall : false,
		// itemsTablet: false,
		// itemsMobile : false

		});
	};
});