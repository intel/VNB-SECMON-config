var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditNetflowCollectorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.netflowcollector_id = ScopeService.getVal();

    $scope.loadData = function() {
        //fetch and populate data for netflowcollector in edit form
        $http.get("/v1.0/secmon/collector/" + $scope.netflowcollector_id + "/")
            .then(function(response) {
                    $scope.available_netflowcollectors = response.data;
                    $scope.netflowcollector_id = $scope.available_netflowcollectors.id
                    $scope.netflowcollector_name = $scope.available_netflowcollectors.name
                    $scope.ip_address = $scope.available_netflowcollectors.ip_address
                    $scope.udp_port = $scope.available_netflowcollectors.udp_port
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Collector get failed.";
                    $log.debug('Response status for NetFlow Collector:')
                    $log.debug(response.status)
                })
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding NetFlow Collector " + $scope.netflowcollector_name;

        var data = {
            name: $scope.netflowcollector_name,
            ip_address: $scope.ip_address,
            udp_port: $scope.udp_port,
            col_type: 'netflow'
        };

        $log.debug('Updated NetFlow Collector data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/collector/" + $scope.netflowcollector_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Collector " + $scope.netflowcollector_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Collector updation failed.";
            });
    };

    //function to DELETE netflowcollector
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing NetFlow Collector " + $scope.netflowcollector_name;

        var data = {};

        $log.debug('id of NetFlow Collector to delete:')
        $log.debug($scope.netflowcollector_id)
        $http.delete("/v1.0/secmon/collector/" + $scope.netflowcollector_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Collector " + $scope.netflowcollector_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing NetFlow Collector failed.";
            });
    };
});
