var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditRawforwardCollectorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.rawforwardcollector_id = ScopeService.getVal();
    $scope.encapsulationprotocols = [
        { id: "UDP", value: "UDP" },
/*        { id: "SFLOW", value: "SFLOW" } */
    ];

    $scope.loadData = function() {
        //fetch and populate data for rawforwardcollector in edit form
        $http.get("/v1.0/secmon/collector/" + $scope.rawforwardcollector_id + "/")
            .then(function(response) {
                    $scope.available_rawforwardcollectors = response.data;
                    $scope.rawforwardcollector_id = $scope.available_rawforwardcollectors.id
                    $scope.rawforwardcollector_name = $scope.available_rawforwardcollectors.name
                    $scope.ip_address = $scope.available_rawforwardcollectors.ip_address
                    $scope.udp_port = $scope.available_rawforwardcollectors.udp_port
                    if ($scope.available_rawforwardcollectors.encapsulation_protocol == "UDP") {
                        $scope.encapsulation_protocol = { id: "UDP", value: "UDP" }
                    } 
                    /*
                    else if ($scope.available_rawforwardcollectors.encapsulation_protocol == "SFLOW") {
                        $scope.encapsulation_protocol = { id: "SFLOW", value: "SFLOW" }
                    }
                    */
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward Collector get failed.";
                    $log.debug('Response status for RawForward Collector:')
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
        $scope.status_msg = "Adding RawForward Collector " + $scope.rawforwardcollector_name;

        var data = {
            name: $scope.rawforwardcollector_name,
            ip_address: $scope.ip_address,
            udp_port: $scope.udp_port,
            col_type: 'rawforward',
            encapsulation_protocol: $scope.encapsulation_protocol.id
        };

        $log.debug('Updated RawForward Collector data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/collector/" + $scope.rawforwardcollector_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward Collector " + $scope.rawforwardcollector_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "RawForward Collector updation failed.";
            });
    };

    //function to DELETE rawforwardcollector
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing RawForward Collector " + $scope.rawforwardcollector_name;

        var data = {};

        $log.debug('Id of RawForward Collector to delete:')
        $log.debug($scope.rawforwardcollector_id)
        $http.delete("/v1.0/secmon/collector/" + $scope.rawforwardcollector_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward Collector " + $scope.rawforwardcollector_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing RawForward Collector failed.";
            });
    };
});
