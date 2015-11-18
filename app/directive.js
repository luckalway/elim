app.directive('footer', function() {
	return {
		restrict : 'ECA',
		templateUrl : 'app/template/footer.html'
	};
});

app.directive('categoryNav', function() {
	return {
		restrict : 'ECA',
		templateUrl : 'app/template/category-nav.html',
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

app.directive('productShow', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/template/product-show.html',
		link : function(scope, element, attr, ctrl) {
		}
	};
});

app.directive('relatedProducts', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/template/related-products.html',
		link : function(scope, element, attr, ctrl) {
		}
	};
});
