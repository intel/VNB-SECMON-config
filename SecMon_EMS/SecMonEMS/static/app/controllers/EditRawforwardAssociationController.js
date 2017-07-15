var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditRawforwardAssociationController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.rawforwardassociation_id = ScopeService.getVal();
    $scope.directions = [
        { id: "INGRESS", value: "INGRESS" },
        { id: "EGRESS", value: "EGRESS" },
        { id: "BOTH", value: "BOTH" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in rawforwardassociation edit form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                    $scope.scopes.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    //fetch and populate netflowcollector field in rawforwardassociation edit form
                    $http.get("/v1.0/secmon/collector/rawforward/")
                        .then(function(response) {
                                $scope.collectors = response.data;
                                $scope.collectors.sort(function(a, b) {
                                    return a.name > b.name;
                                });
                                //fetch and populate policy field in rawforwardassociation edit form
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
                                            $scope.status_msg = "Policy get failed.";
                                            $log.debug('response status for Policy:')
                                            $log.debug(response.status)

                                        }) // end of fetching policy
                                    return $http.get("/v1.0/secmon/collectorset/rawforward/");
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "RawForward Collector get failed.";
                                $log.debug('response status for RawForward Collector:')
                                $log.debug(response.status)

                            }) // end of fetching Rawforward Collector
                        .then(function(response) {
                            $scope.collector_set = response.data;
                            $scope.collectors.push.apply($scope.collectors, $scope.collector_set);
                        })
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope get failed.";
                    $log.debug('response status for Scope:')
                    $log.debug(response.status)

                }) // end of fetching scope
            //fetch and populate data for rawforwardassociation in edit form
        $http.get("/v1.0/secmon/rawforwardassociation/" + $scope.rawforwardassociation_id + "/")
            .then(function(response) {
                    $scope.available_rawforwardassociations = response.data;
                    $scope.rawforwardassociation_id = $scope.available_rawforwardassociations.id
                    $scope.originator_vm_id = $scope.available_rawforwardassociations.originator_vm_id
                    $scope.scopeid = $scope.available_rawforwardassociations.scope_id
                    $scope.policyid = $scope.available_rawforwardassociations.policy_id
                    var rawforwardcollector_list = $scope.available_rawforwardassociations.collector_id.split(":")
                    $scope.rawforwardcollector_id = rawforwardcollector_list[1]
                    if ($scope.available_rawforwardassociations.direction == "INGRESS") {
                        $scope.direction = { id: "INGRESS", value: "INGRESS" };
                    } else if ($scope.available_rawforwardassociations.direction == "EGRESS") {
                        $scope.direction = { id: "EGRESS", value: "EGRESS" };
                    } else if ($scope.available_rawforwardassociations.direction == "BOTH") {
                        $scope.direction = { id: "BOTH", value: "BOTH" };
                    }
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward Association get failed.";
                    $log.debug('response status for RawForward Association:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        var rawforwardAssociationName = $scope.scope_id.name + ":" + $scope.collector_id.name;
        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;

        // $scope.status_msg = "Adding rawforwardassociation " + $scope.rawforwardassociation_id;
        $scope.status_msg = "Adding RawForward Association " + rawforwardAssociationName;
        collector_data = 'Collector:' + $scope.collector_id.id

        var data = {
            scope_id: $scope.scope_id.id,
            collector_id: collector_data,
            direction: $scope.direction.id,
            policy_id: $scope.policy_id.id
        };
        $log.debug('Updated RawForward Association data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/rawforwardassociation/" + $scope.rawforwardassociation_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward Association " + rawforwardAssociationName + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "RawForward Association updation failed.";
            });
    };

    //function to DELETE rawforwardassociation
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        var rawforwardAssociationName = $scope.scope_id.name + ":" + $scope.collector_id.name;
        $scope.status_msg = "Removing RawForward Association " + rawforwardAssociationName;

        var data = {};

        $log.debug('Id of RawForward Association to delete:')
        $log.debug($scope.rawforwardassociation_id)
        $http.delete("/v1.0/secmon/rawforwardassociation/" + $scope.rawforwardassociation_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward Association " + rawforwardAssociationName + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing RawForward Association failed.";
            });
    };
});
