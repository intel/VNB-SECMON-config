var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditSflowCollectorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.sflowcollector_id = ScopeService.getVal();
    $scope.loadData = function() {
        //fetch and populate data for sflowcollector in edit form
        $http.get("/v1.0/secmon/collector/" + $scope.sflowcollector_id + "/")
            .then(function(response) {
                    $scope.available_sflowcollectors = response.data;
                    $scope.sflowcollector_id = $scope.available_sflowcollectors.id
                    $scope.sflowcollector_name = $scope.available_sflowcollectors.name
                    $scope.ip_address = $scope.available_sflowcollectors.ip_address
                    $scope.udp_port = $scope.available_sflowcollectors.udp_port

                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Collector get failed.";
                    $log.debug('Response status for SFlow Collector:')
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
        $scope.status_msg = "Updating SFlow Collector " + $scope.sflowcollector_name;

        var data = {
            name: $scope.sflowcollector_name,
            ip_address: $scope.ip_address,
            udp_port: $scope.udp_port,
            col_type: 'sflow'
        };

        $log.debug('Updated SFlow Collector data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/collector/" + $scope.sflowcollector_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Collector " + $scope.sflowcollector_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Updating SFlow Collector failed.";
            });
    };

    //function to DELETE sflowcollector
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing SFlow Collector " + $scope.sflowcollector_name;

        var data = {};

        $log.debug('Id of SFlow Collector to delete:')
        $log.debug($scope.sflowcollector_id)
        $http.delete("/v1.0/secmon/collector/" + $scope.sflowcollector_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Collector " + $scope.sflowcollector_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing SFlow Collector failed.";
            });
    };
});
