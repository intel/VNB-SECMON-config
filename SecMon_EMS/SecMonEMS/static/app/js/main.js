/**
* Main AngularJS Web Application
*/

//var http_headers = { headers: {'X-Auth-Token': "1a704c70-9f5f-8b9b-aa1c-eaa5acab5d8a", 'Content-Type': 'application/json'}};
var http_headers = { headers: {'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json'}};


var app = angular.module('secmon', [
	//array of angular dependencies 
	'ngRoute', 'ngMaterial'
]);

//Define Routing for app
//Uri /AddNewOrder -> template add_order.html and Controller AddOrderController
//Uri /ShowOrders -> template show_orders.html and Controller AddOrderController
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
        templateUrl: '/static/views/overview_management.html',
        controller: 'OverviewManagementController'
      }).
        when('/overview_management', {
        templateUrl: '/static/views/overview_management.html',
        controller: 'OverviewManagementController'
      }).
        when('/netflow_management', {
        templateUrl: '/static/views/netflow_management.html',
        controller: 'NetflowManagementController'
      }).
        when('/rawforward_management', {
        templateUrl: '/static/views/rawforward_management.html',
        controller: 'RawforwardManagementController'
      }).
        when('/sflow_management', {
        templateUrl: '/static/views/sflow_management.html',
        controller: 'SflowManagementController'
      }).
      otherwise({ //default route. Should be the homepage of the application 
        redirectTo: '#'
      });
}]);
