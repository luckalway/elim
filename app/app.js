var app = angular.module('elimApp', [ 'ngRoute' ]);

app.config(function($routeProvider) {
	$routeProvider.when('/list/:id', {
		templateUrl : 'app/item-list/item-list.html'
	}).when('/item', {
		templateUrl : 'app/item-detail/item-detail.html'
	}).otherwise({
		redirectTo : '/list/a'
	})
});