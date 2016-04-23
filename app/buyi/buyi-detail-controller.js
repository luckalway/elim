app.controller('itemDetailCtrl', function($scope, $routeParams) {
	$scope.itemId = $routeParams.id;
	for (var i = 0; i < window.curtainItems.length; i++) {
		var item = window.curtainItems[i];
		if (item.id == $scope.itemId) {
			$scope.colors = [];
			for (var colorId in item.galleryGroups) {
				var colorName = colorId;
				if (/.+-[\u4E00-\u9FA5]+$/.test(colorId)) {
					colorName = colorId.substring(colorId.lastIndexOf("-") + 1);
				}
				$scope.colors.push({
					id : colorId,
					name : colorName
				});
				var images = item.galleryGroups[colorId];
				for(var i=0;i<images.length;i++){
					images[i]=encodeURI(images[i]);
				}
			}
			$scope.selectedColor = $scope.colors[0].id;
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

		$scope.initGallery = function() {
			setTimeout(function() {
				$(".elim-gallery").elimGallery();
			}, 1000);
		}
	}

	closeSlider = function(){
		$(".elim-gallery-slider").remove();
		$('.elim-gallery-cover-shade').hide();
		$(".elim-gallery-close").hide();
		$(document.body).unbind('mousewheel');
	}
	
	$scope.openSlider = function() {
		var sliderContainer = $(".elim-gallery-slider");
		if (sliderContainer.size() == 0) {
			sliderContainer = $('<div class="elim-gallery-slider"></div>');
			$(document.body).append(sliderContainer);
		}
		sliderContainer.empty();
		sliderContainer.height($(window).height());
		var containerInner = $("<ul/>")
		var selectedColor = $(".elim-gallery").find(".nav li.active a").text();
		$("#" + selectedColor).find("img").each(function(i,element){
			var liElement = $("<li/>")
			var imageElement = $("<img/>");
			imageElement.attr('src',element.src.replace("_160x160.jpg",""));
			imageElement.width(sliderContainer.innerWidth());
			liElement.append(imageElement);
			containerInner.append(liElement);
		});
		sliderContainer.append(containerInner);
		sliderContainer.show();

		if ($(".elim-gallery-cover-shade").size() == 0) {
			$(document.body).append($('<div class="elim-gallery-cover-shade"></div><div class="elim-gallery-close"></div>'));
			$('.elim-gallery-cover-shade').click(function(){
				closeSlider();
			});
			$(".elim-gallery-close").click(function(){
				closeSlider();
			});
		}
		$(".elim-gallery-cover-shade").show();
		$(".elim-gallery-close").show();
		

		var perMove = $(window).height() / 2;

		var lock = false;
		var bottomNone = false;
		$(document.body).mousewheel(function(event, delta, deltaX, deltaY) {
			if (lock)
				return false;

			var animateDone = function() {
				lock = false;
			}

			var containerInner = sliderContainer.children("ul:first");
			if (delta == -1) {
				var top = containerInner.position().top;
				var availableSteps = containerInner.height()-Math.abs(top)-$(window).height();
				var moveSteps = availableSteps <= perMove?availableSteps:perMove;
				if(moveSteps <= 0)
					return false;

				lock = true;
				containerInner.animate({
					top : '-=' + moveSteps
				}, 'fast', animateDone);
			} else if (delta == 1) {
				var availableSteps = -containerInner.position().top;
				var moveSteps = availableSteps < perMove ? availableSteps : perMove;

				lock = true;
				containerInner.animate({
					top : '+=' + moveSteps
				}, defaults.animateSpeed, animateDone);
			}
			return false;
		});
	};
	
	$scope.getThumbnailImage = function(image){
		alert(image);
	}
})


app.directive('productPreview', function() {
	return {
		restrict : 'EC',
		templateUrl : 'app/buyi/template/product-preview.html?=1',
		link : function(scope, element, attr, ctrl) {
		}
	};
});

app.directive('relatedProducts', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/buyi/template/related-products.html?=1',
		link : function(scope, element, attr, ctrl) {
		}
	};
});