var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditNetflowMonitorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.netflowmonitor_id = ScopeService.getVal();
    $scope.matchfields = [
        { id: "TOS", value: "TOS" },
        { id: "PROTOCOL", value: "PROTOCOL" },
        { id: "SOURCE-ADDRESS", value: "SOURCE-ADDRESS" },
        { id: "DESTINATION-ADDRESS", value: "DESTINATION-ADDRESS" },
        { id: "SOURCE-PORT", value: "SOURCE-PORT" },
        { id: "DESTINATION-PORT", value: "DESTINATION-PORT" },
        { id: "INPUT-INTERFACE", value: "INPUT-INTERFACE" },
        { id: "MAC-ADDRESS", value: "MAC-ADDRESS" },
        { id: "VLAN", value: "VLAN" }
    ];

    $scope.collectfields = [
        { id: "COLLECT COUNTER", value: "COLLECT COUNTER" },
        { id: "FLOW ACCESS TIMESTAMP", value: "FLOW ACCESS TIMESTAMP" },
        { id: "MAC-ADDRESS", value: "MAC-ADDRESS" },
        { id: "VLAN", value: "VLAN" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in netflowmonitor edit form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;

                    //fetch and populate data for netflowmonitor in edit form
                    $http.get("/v1.0/secmon/netflowmonitor/" + $scope.netflowmonitor_id + "/")
                        .then(function(response) {
                            var matchfields_list = []
                            $scope.available_netflowmonitors = response.data;
                            $scope.netflowmonitor_id = $scope.available_netflowmonitors.id
                            $scope.scope_id = $scope.available_netflowmonitors.scope_id

                            if ($scope.available_netflowmonitors.match_fields.indexOf("TOS") !== -1) {
                                matchfields_list.push({ id: "TOS", value: "TOS" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("PROTOCOL") !== -1) {
                                matchfields_list.push({ id: "PROTOCOL", value: "PROTOCOL" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("SOURCE-ADDRESS") !== -1) {
                                matchfields_list.push({ id: "SOURCE-ADDRESS", value: "SOURCE-ADDRESS" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("DESTINATION-ADDRESS") !== -1) {
                                matchfields_list.push({ id: "DESTINATION-ADDRESS", value: "DESTINATION-ADDRESS" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("SOURCE-PORT") !== -1) {
                                matchfields_list.push({ id: "SOURCE-PORT", value: "SOURCE-PORT" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("DESTINATION-PORT") !== -1) {
                                matchfields_list.push({ id: "DESTINATION-PORT", value: "DESTINATION-PORT" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("INPUT-INTERFACE") !== -1) {
                                matchfields_list.push({ id: "INPUT-INTERFACE", value: "INPUT-INTERFACE" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("MAC-ADDRESS") !== -1) {
                                matchfields_list.push({ id: "MAC-ADDRESS", value: "MAC-ADDRESS" })
                            }
                            if ($scope.available_netflowmonitors.match_fields.indexOf("VLAN") !== -1) {
                                matchfields_list.push({ id: "VLAN", value: "VLAN" })
                            }

                            var collectfields_list = []
                            if ($scope.available_netflowmonitors.collect_fields.indexOf("COLLECT COUNTER") !== -1) {
                                collectfields_list.push({ id: "COLLECT COUNTER", value: "COLLECT COUNTER" })
                            }
                            if ($scope.available_netflowmonitors.collect_fields.indexOf("FLOW ACCESS TIMESTAMP") !== -1) {
                                collectfields_list.push({ id: "FLOW ACCESS TIMESTAMP", value: "FLOW ACCESS TIMESTAMP" })
                            }
                            if ($scope.available_netflowmonitors.collect_fields.indexOf("MAC-ADDRESS") !== -1) {
                                collectfields_list.push({ id: "MAC-ADDRESS", value: "MAC-ADDRESS" })
                            }
                            if ($scope.available_netflowmonitors.collect_fields.indexOf("VLAN") !== -1) {
                                collectfields_list.push({ id: "VLAN", value: "VLAN" })
                            }
                            $scope.match_fields = matchfields_list;
                            $scope.collect_fields = collectfields_list;

                            for (var sIndex = 0; sIndex < $scope.scopes.length; ++sIndex) {
                                if ($scope.scopes[sIndex].id === $scope.scope_id) {
                                    $scope.scope_name = $scope.scopes[sIndex].name;
                                    break;
                                }
                            }

                        }); // end of fetching NetFlow Monitor
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope get failed.";
                    $log.debug('response status for Scope:')
                    $log.debug(response.status)
                }); // end of fetching scopes
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;

        var scopeIdToShow = $scope.available_netflowmonitors.scope_id;
        var deleteNetflowMonitorScopeName = "";
        for (var sIndex = 0; sIndex < $scope.scopes.length; ++sIndex) {
            if ($scope.scopes[sIndex].id === scopeIdToShow) {
                deleteNetflowMonitorScopeName = $scope.scopes[sIndex].name;
            }
        }

        $scope.status_msg = "Adding NetFlow Monitor for Scope " + deleteNetflowMonitorScopeName;

        var netflowmonitor_matchfields_string = ""
        var netflowmonitor_collectfields_string = ""

        for (var i = 0; i < $scope.match_fields.length; i++) {
            if (i == 0) {
                netflowmonitor_matchfields_string = $scope.match_fields[i].id
            } else {
                netflowmonitor_matchfields_string = netflowmonitor_matchfields_string + ',' + $scope.match_fields[i].id
            }
        }

        for (var i = 0; i < $scope.collect_fields.length; i++) {
            if (i == 0) {
                netflowmonitor_collectfields_string = $scope.collect_fields[i].id
            } else {
                netflowmonitor_collectfields_string = netflowmonitor_collectfields_string + ',' + $scope.collect_fields[i].id
            }
        }
        if (!netflowmonitor_matchfields_string) {
            netflowmonitor_matchfields_string = "ND";
        }
        if (!netflowmonitor_collectfields_string) {
            netflowmonitor_collectfields_string = "ND";
        }
        var data = {
            scope_id: $scope.scope_id,
            match_fields: netflowmonitor_matchfields_string,
            collect_fields: netflowmonitor_collectfields_string
        };
        $log.debug('Updated NetFlow Monitor data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/netflowmonitor/" + $scope.netflowmonitor_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;

                $scope.status_msg = "NetFlow Monitor for Scope " + deleteNetflowMonitorScopeName + " is updated successfully";

                console.log($scope);
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Monitor updation failed.";
            });
    };

    //function to DELETE netflowmonitor
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;

        var scopeIdToShow = $scope.available_netflowmonitors.scope_id;
        var deleteNetflowMonitorScopeName = "";
        for (var sIndex = 0; sIndex < $scope.scopes.length; ++sIndex) {
            if ($scope.scopes[sIndex].id === scopeIdToShow) {
                deleteNetflowMonitorScopeName = $scope.scopes[sIndex].name;
            }
        }
        $scope.status_msg = "Removing NetFlow Monitor for Scope " + deleteNetflowMonitorScopeName;

        var data = {};

        $http.delete("/v1.0/secmon/netflowmonitor/" + $scope.netflowmonitor_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Netflow Monitor for Scope " + deleteNetflowMonitorScopeName + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing NetFlow Monitor failed.";
            });
    };
});
