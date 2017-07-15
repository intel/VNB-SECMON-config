var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditSflowAssociationController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.sflowassociation_id = ScopeService.getVal();
    $scope.directions = [
        { id: "INGRESS", value: "INGRESS" },
        { id: "EGRESS", value: "EGRESS" },
        { id: "BOTH", value: "BOTH" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in sflowassociation edit form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                    $scope.scopes.sort(function(a, b) {
                        return a.name > b.name;
                    });

                    //fetch and populate netflowcollector field in sflowassociation edit form
                    $http.get("/v1.0/secmon/collector/sflow/")
                        .then(function(response) {
                                $scope.collectors = response.data;
                                $scope.collectors.sort(function(a, b) {
                                    return a.name > b.name;
                                });

                                //fetch and populate policy field in sflowassociation edit form
                                $http.get("/v1.0/secmon/policy/")
                                    .then(function(response) {
                                            $scope.policys = response.data;
                                            $scope.policys.sort(function(a, b) {
                                                return a.name > b.name;
                                            });

                                        },
                                        function(response) {
                                            $scope.show_prog_bar = false;
                                            $scope.show_err_icon = true;
                                            $scope.show_success_icon = false;
                                            $scope.status_msg = "Policy GET failed.";
                                            $log.debug('Response status for Policy:')
                                            $log.debug(response.status)

                                        })
                                return $http.get("/v1.0/secmon/collectorset/sflow/");
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "SFlow Collector GET failed.";
                                $log.debug('Response status for SFlow Collector:')
                                $log.debug(response.status)

                            })
                        .then(function(response) {
                            $scope.collector_set = response.data;
                            $scope.collectors.push.apply($scope.collectors, $scope.collector_set);
                        })
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)

                })
            //fetch and populate data for sflowassociation in edit form
        $http.get("/v1.0/secmon/sflowassociation/" + $scope.sflowassociation_id + "/")
            .then(function(response) {
                    $scope.available_sflowassociations = response.data;
                    $scope.sflowassociation_id = $scope.available_sflowassociations.id
                    $scope.originator_vm_id = $scope.available_sflowassociations.originator_vm_id
                    $scope.scopeid = $scope.available_sflowassociations.scope_id
                    $scope.policyid = $scope.available_sflowassociations.policy_id
                    var sflowcollector_list = $scope.available_sflowassociations.collector_id.split(":")
                    $scope.sflowcollector_id = sflowcollector_list[1]
                    if ($scope.available_sflowassociations.direction == "INGRESS") {
                        $scope.direction = { id: "INGRESS", value: "INGRESS" };
                    } else if ($scope.available_sflowassociations.direction == "EGRESS") {
                        $scope.direction = { id: "EGRESS", value: "EGRESS" };
                    } else if ($scope.available_sflowassociations.direction == "BOTH") {
                        $scope.direction = { id: "BOTH", value: "BOTH" };
                    }
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Association get failed.";
                    $log.debug('Response status for SFlow Association:')
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
        var sflowAssociationName = $scope.scope_id.name + ":" + $scope.collector_id.name
        $scope.status_msg = "Updating SFlow Association " + sflowAssociationName;
        collector_data = 'Collector:' + $scope.collector_id.id

        var data = {
            scope_id: $scope.scope_id.id,
            collector_id: collector_data,
            direction: $scope.direction.id,
            policy_id: $scope.policy_id.id
        };
        $log.debug('Updated SFlow Association data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/sflowassociation/" + $scope.sflowassociation_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Association " + sflowAssociationName + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow Association updation failed";
            });
    };

    //function to DELETE sflowassociation
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        var sflowAssociationName = $scope.scope_id.name + ":" + $scope.collector_id.name
        $scope.status_msg = "Removing SFlow Association " + sflowAssociationName;

        var data = {};

        $log.debug('Id of Sflow Association to delete:')
        $log.debug($scope.sflowassociation_id)
        $http.delete("/v1.0/secmon/sflowassociation/" + $scope.sflowassociation_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Association " + sflowAssociationName + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing SFlow Association failed.";
            });
    };
});
