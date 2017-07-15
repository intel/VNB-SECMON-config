var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditNetflowAssociationController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.netflowassociation_id = ScopeService.getVal();
    $scope.directions = [
        { id: "INGRESS", value: "INGRESS" },
        { id: "EGRESS", value: "EGRESS" },
        { id: "BOTH", value: "BOTH" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in netflowassociation edit form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                    $scope.scopes.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    //fetch and populate policy field in netflowassociation edit form
                    return $http.get("/v1.0/secmon/policy/")
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope get failed.";
                    $log.debug('response status for Scope:')
                    $log.debug(response.status)
                })
            .then(function(response) {
                    $scope.policys = response.data;
                    $scope.policys.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    //fetch and populate netflowcollector field in netflowassociation edit form
                    return $http.get("/v1.0/secmon/collector/netflow/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Policy get failed.";
                    $log.debug('response status for Policy:')
                    $log.debug(response.status)

                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.collectors = response.data;
                    $scope.collectors.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    return $http.get("/v1.0/secmon/collectorset/netflow/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Collector get failed.";
                    $log.debug('response status for NetFlow Collector:')
                    $log.debug(response.status)
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.collector_set = response.data;
                    $scope.collectors.push.apply($scope.collectors, $scope.collector_set);
                    //fetch and populate data for netflowassociation in edit form
                    return $http.get("/v1.0/secmon/netflowassociation/" + $scope.netflowassociation_id + "/")
                }, 
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow CollectorSet get failed.";
                    $log.debug('response status for NetFlow CollectorSet:')
                    $log.debug(response.status)
                    //fetch and populate data for netflowassociation in edit form
                    return $http.get("/v1.0/secmon/netflowassociation/" + $scope.netflowassociation_id + "/")
                })
            .then(function(response) {
                    $scope.available_netflowassociations = response.data;
                    $scope.netflowassociation_id = $scope.available_netflowassociations.id
                    $scope.originator_vm_id = $scope.available_netflowassociations.originator_vm_id
                    $scope.scopeid = $scope.available_netflowassociations.scope_id
                    $scope.policyid = $scope.available_netflowassociations.policy_id
                    $scope.netflowcollector_list = $scope.available_netflowassociations.collector_id.split(":")
                    // $scope.netflowcollector_id = $scope.available_netflowassociations.collector_id;
                    $scope.netflowcollector_id = $scope.netflowcollector_list[1]
                    if ($scope.available_netflowassociations.direction == "INGRESS") {
                        $scope.direction = { id: "INGRESS", value: "INGRESS" };
                    } else if ($scope.available_netflowassociations.direction == "EGRESS") {
                        $scope.direction = { id: "EGRESS", value: "EGRESS" };
                    } else if ($scope.available_netflowassociations.direction == "BOTH") {
                        $scope.direction = { id: "BOTH", value: "BOTH" };
                    }
                    console.log($scope);
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Association get failed.";
                    $log.debug('response status for NetFlow Association:')
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
        console.log($scope);
        var netflowAssociationName = $scope.scope_id.name + ":" + $scope.collector_id.name;
        $scope.status_msg = "Adding netFlow Association " + netflowAssociationName;
        collector_data = 'Collector:' + $scope.collector_id.id;

        var data = {
            scope_id: $scope.scope_id.id,
            originator_vm_id: $scope.originator_vm_id,
            collector_id: collector_data,
            direction: $scope.direction.id,
            policy_id: $scope.policy_id.id
        };

        $log.debug('updated NetFlow Association data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/netflowassociation/" + $scope.netflowassociation_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Association " + netflowAssociationName + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Association updation failed.";
            });
    };

    //function to DELETE netflowassociation
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        var netflowAssociationName = $scope.scope_id.name + ":" + $scope.collector_id.name;
        $scope.status_msg = "Removing NetFlow Association " + netflowAssociationName;

        var data = {};

        $log.debug('id of NetFlow Association to delete:')
        $log.debug($scope.netflowassociation_id)
        $http.delete("/v1.0/secmon/netflowassociation/" + $scope.netflowassociation_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Association " + netflowAssociationName + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing NetFlow Association failed.";
            });
    };
});
