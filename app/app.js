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

Array.prototype.clone = function() {
	return this.slice(0);
}

app.factory('PagerService', function() {
	var service = {};

	service.GetPager = function GetPager(totalItems, currentPage, pageSize) {
		currentPage = currentPage || 1;

		pageSize = pageSize || 10;

		// calculate total pages
		var totalPages = Math.ceil(totalItems / pageSize);

		var startPage, endPage;
		if (totalPages <= 10) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= 6) {
				startPage = 1;
				endPage = 10;
			} else if (currentPage + 4 >= totalPages) {
				startPage = totalPages - 9;
				endPage = totalPages;
			} else {
				startPage = currentPage - 5;
				endPage = currentPage + 4;
			}
		}

		// calculate start and end item indexes
		var startIndex = (currentPage - 1) * pageSize;
		var endIndex = startIndex + pageSize;

		// create an array of pages to ng-repeat in the pager control
		var pages = [];
		for(var i=startPage;i<endPage+1;i++){
			pages.push(i);
		}

		// return object with all pager properties required by the view
		return {
			totalItems : totalItems,
			currentPage : currentPage,
			pageSize : pageSize,
			totalPages : totalPages,
			startPage : startPage,
			endPage : endPage,
			startIndex : startIndex,
			endIndex : endIndex,
			pages : pages
		};
	};

	return service;
});
