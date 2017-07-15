var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditNetflowConfigController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.netflowconfig_id = ScopeService.getVal();
    $scope.loadData = function() {
        //fetch and populate scope field in netflowconfig edit form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;

                    //fetch and populate data for netflowconfig in edit form
                    $http.get("/v1.0/secmon/netflowconfig/" + $scope.netflowconfig_id + "/")
                        .then(function(response) {
                                $scope.available_netflowconfigs = response.data;
                                $scope.netflowconfig_id = $scope.available_netflowconfigs.id;
                                $scope.scope_id = $scope.available_netflowconfigs.scope_id;
                                $scope.active_timeout = $scope.available_netflowconfigs.active_timeout;
                                $scope.inactive_timeout = $scope.available_netflowconfigs.inactive_timeout;
                                $scope.refresh_rate = $scope.available_netflowconfigs.refresh_rate;
                                $scope.timeout_rate = $scope.available_netflowconfigs.timeout_rate;
                                $scope.maxflows = $scope.available_netflowconfigs.maxflows;

                                var netFlowScope = $scope.scopes;

                                for (var sIndex = 0; sIndex < netFlowScope.length; ++sIndex) {
                                    // console.log(netFlowConfigs[cIndex].scope_id, " ", netFlowScope[sIndex].id);
                                    if ($scope.available_netflowconfigs.scope_id === netFlowScope[sIndex].id) {
                                        $scope.available_netflowconfigs.scope_name = netFlowScope[sIndex].name;
                                        $scope.scope_name = netFlowScope[sIndex].name;
                                    }
                                }
                                // console.log(netFlowConfigs);
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "NetFlow Config get failed.";
                                $log.debug('response status for NetFlow Config:')
                                $log.debug(response.status)

                            }); // end of fetching Netflow Config

                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope get failed.";
                    $log.debug('response status for Scope:')
                    $log.debug(response.status)

                }); // end of fetching scope
        console.log($scope);
    }; // end of loadData

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;

        $scope.status_msg = "Adding NetFlow Config for Scope " + $scope.scope_name;
        console.log($scope);

        var data = {
            scope_id: $scope.scope_id,
            active_timeout: $scope.active_timeout,
            inactive_timeout: $scope.inactive_timeout,
            refresh_rate: $scope.refresh_rate,
            timeout_rate: $scope.timeout_rate,
            maxflows: $scope.maxflows
        };

        $log.debug('updated NetFlow Config data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/netflowconfig/" + $scope.netflowconfig_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Config for Scope " + $scope.scope_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Config updation failed.";
            });
    };

    //function to DELETE netflowconfig
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        var scopeId = $scope.scope_id;
        var scopeName = "";
        for (var sIndex = 0; sIndex < $scope.scopes.length; ++sIndex) {
            if ($scope.scopes[sIndex].id === scopeId) {
                scopeName = $scope.scopes[sIndex].name;
            }
        }
        $scope.status_msg = "Removing NetFlow Config for Scope " + scopeName;

        var data = {};

        $log.debug('id of NetFlow Config to delete:')
        $log.debug($scope.netflowconfig_id)
        $http.delete("/v1.0/secmon/netflowconfig/" + $scope.netflowconfig_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Config for Scope " + scopeName + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing NetFlow Config failed.";
            });
    };
});
