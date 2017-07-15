var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditSflowConfigController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.sflowconfig_id = ScopeService.getVal();
    $scope.loadData = function() {
        //fetch and populate scope field in sflowconfig edit form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;

                    //fetch and populate data for sflowconfig in edit form
                    $http.get("/v1.0/secmon/sflowconfig/" + $scope.sflowconfig_id + "/")
                        .then(function(response) {
                                $scope.available_sflowconfigs = response.data;
                                $scope.sflowconfig_id = $scope.available_sflowconfigs.id
                                $scope.scope_id = $scope.available_sflowconfigs.scope_id
                                $scope.agent_ip = $scope.available_sflowconfigs.agent_ip
                                $scope.agent_subid = $scope.available_sflowconfigs.agent_subid
                                $scope.sampling_rate = $scope.available_sflowconfigs.sampling_rate
                                $scope.truncate_to_size = $scope.available_sflowconfigs.truncate_to_size

                                for (var sIndex = 0; sIndex < $scope.scopes.length; ++sIndex) {
                                    if ($scope.scopes[sIndex].id === $scope.scope_id) {
                                        $scope.scope_name = $scope.scopes[sIndex].name;
                                    }
                                }

                                console.log($scope);
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "SFlow Config GET failed.";
                                $log.debug('Response status for SFlow Config:')
                                $log.debug(response.status)
                            });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed.";
                    $log.debug('Response status for Scope:')
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
        $scope.status_msg = "Updating SFlow Config for Scope " + $scope.scope_name;

        var data = {
            scope_id: $scope.scope_id,
            agent_ip: $scope.agent_ip,
            agent_subid: $scope.agent_subid,
            sampling_rate: $scope.sampling_rate,
            truncate_to_size: $scope.truncate_to_size
        };
        $log.debug('Updated SFlow Config data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/sflowconfig/" + $scope.sflowconfig_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Config for Scope " + $scope.scope_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow Config updation failed.";
            });
    };

    //function to DELETE sflowconfig
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing SFlow Config for Scope " + $scope.scope_name;

        var data = {};

        $log.debug('Id of SFlow Config to delete:')
        $log.debug($scope.sflowconfig_id)
        $http.delete("/v1.0/secmon/sflowconfig/" + $scope.sflowconfig_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Config for Scope " + $scope.scope_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing SFlow Config failed.";
            });
    };
});
