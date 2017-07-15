var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditClassificationObjectController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.classificationobject_id = ScopeService.getVal();
    $scope.protocols = [
        { id: 1, value: "ICMP" },
        { id: 6, value: "TCP" },
        { id: 17, value: "UDP" },
        { id: 132, value: "SCTP" }
    ];

    $scope.loadData = function() {
        //fetch and populate data for classificationobject in edit form
        $http.get("/v1.0/secmon/classificationobject/" + $scope.classificationobject_id + "/").then(function(response) {
                $scope.available_classificationobjects = response.data;
                $scope.classificationobject_id = $scope.available_classificationobjects.id
                $scope.classificationobject_name = $scope.available_classificationobjects.name
                $scope.src_ip = $scope.available_classificationobjects.src_ip
                $scope.src_mac = $scope.available_classificationobjects.src_mac
                $scope.src_ip_subnet = $scope.available_classificationobjects.src_ip_subnet
                $scope.minimum_src_port = $scope.available_classificationobjects.minimum_src_port
                $scope.maximum_src_port = $scope.available_classificationobjects.maximum_src_port
                $scope.dst_ip = $scope.available_classificationobjects.dst_ip
                $scope.dst_mac = $scope.available_classificationobjects.dst_mac
                $scope.dst_ip_subnet = $scope.available_classificationobjects.dst_ip_subnet
                $scope.minimum_dst_port = $scope.available_classificationobjects.minimum_dst_port
                $scope.maximum_dst_port = $scope.available_classificationobjects.maximum_dst_port
                if ($scope.available_classificationobjects.protocol == "1") {
                    $scope.protocol_id = { id: 1, value: "ICMP" };
                } else if ($scope.available_classificationobjects.protocol == "6") {
                    $scope.protocol_id = { id: 6, value: "TCP" };
                } else if ($scope.available_classificationobjects.protocol == "17") {
                    $scope.protocol_id = { id: 17, value: "UDP" };
                } else if ($scope.available_classificationobjects.protocol == "132") {
                    $scope.protocol_id = { id: 132, value: "SCTP" };
                }
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Classification Object get failed.";
                $log.debug('Response status for Classification Object:')
                $log.debug(response.status)
            });
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding Classification Object " + $scope.classificationobject_name;

        var data = {
            id: $scope.classificationobject_id,
            name: $scope.classificationobject_name,
            src_ip: $scope.src_ip,
            src_mac: $scope.src_mac,
            src_ip_subnet: $scope.src_ip_subnet,
            minimum_src_port: $scope.minimum_src_port,
            maximum_src_port: $scope.maximum_src_port,
            dst_ip: $scope.dst_ip,
            dst_mac: $scope.dst_mac,
            dst_ip_subnet: $scope.dst_ip_subnet,
            minimum_dst_port: $scope.minimum_dst_port,
            maximum_dst_port: $scope.maximum_dst_port,
            protocol: $scope.protocol_id.id
        };

        $log.debug('Updated Classification Object data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/classificationobject/" + $scope.classificationobject_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Classification Object " + $scope.classificationobject_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Classification Object updation failed.";
            });
    }

    //function to DELETE classificationobject
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing classificationobject " + $scope.classificationobject_name;

        var data = {};

        $log.debug('Id of Classification Object to delete:')
        $log.debug($scope.classificationobject_id)
        $http.delete("/v1.0/secmon/classificationobject/" + $scope.classificationobject_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Classification Object " + $scope.classificationobject_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing classificationobject failed.";
            });
    };
});
