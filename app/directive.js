app.directive('footer', function() {
	return {
		restrict : 'ECA',
		templateUrl : 'app/template/footer.html'
	};
});

app.directive('topNav', function() {
	return {
		restrict : 'ECA',
		templateUrl : 'app/template/top-nav.html',
		scope : true,
		link : function(scope, element, attr, ctrl) {
			scope.categories = categories;
		}
	};
});

app.directive('productItem', function() {
	return {
		restrict : 'ECA',
		templateUrl : 'app/template/product-item.html',
		scope : {
			title : '@',
			id : '@',
			image : '@'
		},
		link : function(scope, element, attr, ctrl) {
			scope.link = '#/item?id=' + scope.id;
		}
	};
});

app.directive('productPreview', function() {
	return {
		restrict : 'EC',
		templateUrl : 'app/template/product-preview.html?=1',
		link : function(scope, element, attr, ctrl) {
		}
	};
});

app.directive('relatedProducts', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/template/related-products.html?=1',
		link : function(scope, element, attr, ctrl) {
		}
	};
});

app.directive('productImages', function() {
	return {
		restrict : 'EC',
		templateUrl : 'app/template/product-images.html?=1',
		link : function(scope, element, attr, ctrl) {
		}
	};
});


