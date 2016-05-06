var app = angular.module('elimApp', [ 'ngRoute' ]);

app.config(function($routeProvider) {
	$routeProvider.when('/buyi', {
		templateUrl : 'app/buyi/buyi-list.html'
	}).when('/buyi/detail', {
		templateUrl : 'app/buyi/buyi-detail.html'
	}).when('/baiye', {
		templateUrl : 'app/baiye/baiye-list.html'
	}).when('/peijian', {
		templateUrl : 'app/peijian/peijian-list.html'
	}).when('/peijian/detail', {
		templateUrl : 'app/peijian/peijian-detail.html'
	}).when('/baiye', {
		templateUrl : 'app/baiye/baiye-list.html'
	}).when('/baiye/detail', {
		templateUrl : 'app/baiye/baiye-detail.html'
	}).when('/', {
		templateUrl : 'app/home.html'
	}).when('/aboutus', {
		templateUrl : 'app/about-us/about-us.html'
	}).when('/case-detail', {
		templateUrl : 'app/case/detail.html'
	}).when('/case', {
		templateUrl : 'app/case/case.html'
	}).otherwise({
		redirectTo : '/'
	})
});

Array.prototype.remove = function(from, to) {
	  var rest = this.slice((to || from) + 1 || this.length);
	  this.length = from < 0 ? this.length + from : from;
	  return this.push.apply(this, rest);
	};
