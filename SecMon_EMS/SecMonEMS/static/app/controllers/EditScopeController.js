var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditScopeController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.id = ScopeService.getVal();
    $scope.loadData = function() {
        //fetch and populate scope data in edit form
        $http.get("/v1.0/secmon/scope/" + $scope.id + "/")
            .then(function(response) {
                    $scope.available_scopes = response.data;
                    $scope.scope_id = $scope.available_scopes.id
                    $scope.scope_name = $scope.available_scopes.name
                    $scope.netflowstatus = $scope.available_scopes.netflowstatus
                    $scope.rawforwardstatus = $scope.available_scopes.rawforwardstatus
                    $scope.sflowstatus = $scope.available_scopes.sflowstatus
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)

                });
            /*
        // now load all the netflow configs and netflow monitors which are dependent on
        // scopes so if any scope is deleted we should also delete netflow monitors
        // Note: we might do this server side it needs discussion
        $http.get("/v1.0/secmon/netflowconfig/")
            .then(function(response) {
                $scope.availableNetFlowConfigs = response.data;
            });

        $http.get("/v1.0/secmon/netflowmonitor/")
            .then(function(response) {
                $scope.availableNetFlowMonitors = response.data;
            });

        $http.get("/v1.0/secmon/sflowconfig/")
            .then(function(response) {
                $scope.availableSflowConfigs = response.data;
            });
*/
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding Scope " + $scope.scope_name;

        var data = {
            name: $scope.scope_name,
            netflowstatus: $scope.netflowstatus,
            rawforwardstatus: $scope.rawforwardstatus,
            sflowstatus: $scope.sflowstatus
        };
        $log.debug('Updated Scope data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/scope/" + $scope.scope_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Scope " + $scope.scope_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Scope updation failed.";
            });
    };

    //function to DELETE scope
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing scope " + $scope.scope_name;

        var data = {};
        $log.debug('Id of Scope to delete:')
        $log.debug($scope.id)
        $http.delete("/v1.0/secmon/scope/" + $scope.id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Scope " + $scope.scope_name + " is removed successfully";

                $http.get("/v1.0/secmon/netflowconfig/scope_id/" + $scope.id + "/").then(
                    function(response) {
                        $http.delete("/v1.0/secmon/netflowconfig/" + response.data[0].id + "/").then(
                            function(response) {})
                    })
                $http.get("/v1.0/secmon/netflowmonitor/scope_id/" + $scope.id + "/").then(
                    function(response) {
                        $http.delete("/v1.0/secmon/netflowmonitor/" + response.data[0].id + "/").then(
                            function(response) {})
                    })
                $http.get("/v1.0/secmon/sflowconfig/scope_id/" + $scope.id + "/").then(
                    function(response) {
                        $http.delete("/v1.0/secmon/sflowconfig/" + response.data[0].id + "/").then(
                            function(response) {})
                    })

                /*
                                // deleting netflow monitor and netflow config which are dependent on this scope
                                for (var nmIndex = 0; nmIndex < $scope.availableNetFlowMonitors.length; ++nmIndex) {
                                    if ($scope.availableNetFlowMonitors[nmIndex].scope_id === $scope.id) {
                                        $http.delete("/v1.0/secmon/netflowmonitor/" + $scope.availableNetFlowMonitors[nmIndex].id + "/")
                                            .then(function(response) {});
                                        break;
                                    }
                                }

                                for (var ncIndex = 0; ncIndex < $scope.availableNetFlowConfigs.length; ++ncIndex) {
                                    if ($scope.availableNetFlowConfigs[ncIndex].scope_id === $scope.id) {
                                        $http.delete("/v1.0/secmon/netflowconfig/" + $scope.availableNetFlowConfigs[ncIndex].id + "/")
                                            .then(function(response) {});
                                        break;
                                    }
                                }

                                for (var scIndex = 0; scIndex < $scope.availableSflowConfigs.length; ++scIndex) {
                                    if ($scope.availableSflowConfigs[scIndex].scope_id === $scope.id) {
                                        $http.delete("/v1.0/secmon/sflowconfig/" + $scope.availableSflowConfigs[scIndex].id + "/")
                                            .then(function(response) {
                                                console.log("DELETED successfully");
                                            });
                                        break;
                                    }
                                }
                */
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing scope from a " + $scope.resource1 + " failed. Please contact the administrator.";
            });
    };
});
