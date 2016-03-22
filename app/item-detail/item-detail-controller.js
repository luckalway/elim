app.controller('itemDetailCtrl', function($scope, $routeParams) {
	$scope.itemId = $routeParams.id;
	for (var i = 0; i < window.curtainItems.length; i++) {
		var item = window.curtainItems[i];
		if (item.id == $scope.itemId) {
			$scope.item = item;
			break;
		}
	}

	$scope.initPreviewImages = function() {
		$(".preview-single img").each(function(i, e) {
			if (i != 0) {
				$(e).hide();
			}
		})

		$(".thumbnails img").each(function(i, e) {
			$(e).addClass('unfocus');

			$(e).mouseover(function() {
				$(e).removeClass('unfocus');
				$(e).addClass('focus');

				$(".preview-single img").each(function(i2, e) {
					if (i2 == i) {
						$(e).show();
					} else {
						$(e).hide();
					}
				})

			});

			$(e).mouseout(function() {
				$(e).removeClass('focus');
				$(e).addClass('unfocus');
			});
		});
	}
})