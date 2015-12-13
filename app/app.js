var app = angular.module('elimApp', [ 'ngRoute' ]);

app.config(function($routeProvider) {
	$routeProvider.when('/product-list', {
		templateUrl : 'app/item-list/product-list.html'
	}).when('/item', {
		templateUrl : 'app/item-detail/item-detail.html'
	}).when('/index', {
		templateUrl : 'app/home.html'
	}).when('/aboutus', {
		templateUrl : 'app/about-us/about-us.html'
	}).when('/case', {
		templateUrl : 'app/case/case.html'
	}).otherwise({
		redirectTo : '/index'
	})
});