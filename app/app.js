var app = angular.module('elimApp', [ 'ngRoute' ]);

app.config(function($routeProvider) {
	$routeProvider.when('/buyi', {
		templateUrl : 'app/buyi/product-list.html'
	}).when('/item', {
		templateUrl : 'app/item-detail/item-detail.html'
	}).when('/baiye', {
		templateUrl : 'app/baiye/baiye-list.html'
	}).when('/peijian', {
		templateUrl : 'app/peijian/peijian-list.html'
	}).when('/peijian/detail', {
		templateUrl : 'app/peijian/peijian-detail.html'
	}).when('/index', {
		templateUrl : 'app/home.html'
	}).when('/aboutus', {
		templateUrl : 'app/about-us/about-us.html'
	}).when('/case-detail', {
		templateUrl : 'app/case/detail.html'
	}).when('/case', {
		templateUrl : 'app/case/case.html'
	}).otherwise({
		redirectTo : '/index'
	})
});