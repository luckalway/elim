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
			// scope.categories = categories;
		}
	};
});


app.directive('repeatDone', function() {
	return {
		link : function(scope, element, attrs) {
			if (scope.$last) { // 这个判断意味着最后一个 OK
				scope.$eval(attrs.repeatDone) // 执行绑定的表达式
			}
		}
	}
})
