var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditRawforwardCollectorSetController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.rawforwardcollectorset_id = ScopeService.getVal();

    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];


    $scope.loadData = function() {
        $http.get("/v1.0/secmon/collector/rawforward/")
            .then(function(response) {
                    $scope.rawforwardcollectors = response.data;
                    console.log($scope);

                    $http.get("/v1.0/secmon/collectorset/" + $scope.rawforwardcollectorset_id + "/")
                        .then(function(response) {
                                $scope.available_rawforwardcollectorsets = response.data;
                                $scope.collectorIdsArray = JSON.parse($scope.available_rawforwardcollectorsets.collector_ids.replace(/'/gi, "\""));
                                $scope.rawforwardcollectorset_id = $scope.available_rawforwardcollectorsets.id
                                $scope.rawforwardcollectorset_name = $scope.available_rawforwardcollectorsets.name

                                for (var rcIndex = 0; rcIndex < $scope.rawforwardcollectors.length; ++rcIndex) {
                                    $scope.rawforwardcollectors[rcIndex].weight = 0;
                                    for (var nciIndex = 0; nciIndex < $scope.collectorIdsArray.length; ++nciIndex) {
                                        if ($scope.rawforwardcollectors[rcIndex].id === $scope.collectorIdsArray[nciIndex].id) {
                                            $scope.rawforwardcollectors[rcIndex].weight = $scope.collectorIdsArray[nciIndex].weight;
                                        }
                                    } // end of collectorIdsArray
                                } // end of netflowcollectors loop

                                $scope.rawforwardcollectors.sort(function(a, b) {
                                    return a.name > b.name;
                                });
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "RawForward CollectorSet GET failed";
                                $log.debug('Response status for RawForward CollectorSet:')
                                $log.debug(response.status)
                            }); // end of fetching collector set
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward Collector GET failed.";
                    $log.debug('Response status for RawForward Collector:')
                    $log.debug(response.status)

                }); // end of fetching collector
    };

    $scope.loadData();

    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding RawForward CollectorSet " + $scope.rawforwardcollectorset_name;
        var collector_dict = {};
        var collector_list = [];
        for (index = 0; index < $scope.collector_ids.length; ++index) {
            var collector_selected = $scope.collector_ids[index].id
            //var weight_collector = "weight_collector" + index
            if ($scope.lb_algo.id == "2") {
                collector_dict = {
                    'id': collector_selected,
                    'weight': $scope[collector_selected]
                }
            }else {
                collector_dict = {
                    'id': collector_selected,
                    'weight': "0"
                }
            }
            collector_list.push(collector_dict)
        }
        var totalCollectorsWeight = 0;
        for (var cIndex = 0; cIndex < collector_list.length; ++cIndex) {
            totalCollectorsWeight += collector_list[cIndex].weight;
        }
        if (totalCollectorsWeight > 100) {
            $scope.show_prog_bar = false;
            $scope.show_err_icon = true;
            $scope.show_success_icon = false;
            $scope.status_msg = "RawForward CollectorSet updation failed. Total Weight of Collectors is greater than 100";
            return;
        }

        var data = {
            name: $scope.rawforwardcollectorset_name,
            collector_ids: collector_list,
            lb_algo: $scope.lb_algo.id,
            col_type: 'rawforward'
        };

        $log.debug('Updated RawForward CollectorSet data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/collectorset/" + $scope.rawforwardcollectorset_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward CollectorSet " + $scope.rawforwardcollectorset_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "RawForward CollectorSet updation failed.";
            });
    };

    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing RawForward CollectorSet " + $scope.rawforwardcollectorset_name;

        var data = {};

        $log.debug('Id of RawForward CollectorSet to delete:')
        $log.debug($scope.rawforwardcollectorset_id)
        $http.delete("/v1.0/secmon/collectorset/" + $scope.rawforwardcollectorset_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward CollectorSet " + $scope.rawforwardcollectorset_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing RawForward CollectorSet failed.";
            });
    };
});
