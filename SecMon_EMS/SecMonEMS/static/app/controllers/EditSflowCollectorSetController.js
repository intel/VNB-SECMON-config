var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditSflowCollectorSetController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.sflowcollectorset_id = ScopeService.getVal();

    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];


    $scope.loadData = function() {
        $http.get("/v1.0/secmon/collector/sflow/")
            .then(function(response) {
                    $scope.sflowcollectors = response.data;

                    $http.get("/v1.0/secmon/collectorset/" + $scope.sflowcollectorset_id + "/")
                        .then(function(response) {
                                $scope.available_sflowcollectorsets = response.data;
                                $scope.sflowcollectorset_id = $scope.available_sflowcollectorsets.id
                                $scope.sflowcollectorset_name = $scope.available_sflowcollectorsets.name

                                var collectorsInsideSet = JSON.parse($scope.available_sflowcollectorsets.collector_ids.replace(/'/gi, "\""));
                                for (var csIndex = 0; csIndex < collectorsInsideSet.length; ++csIndex) {
                                    for (var cIndex = 0; cIndex < $scope.sflowcollectors.length; ++cIndex) {
                                        if (collectorsInsideSet[csIndex].id === $scope.sflowcollectors[cIndex].id) {
                                            $scope.sflowcollectors[cIndex].weight = collectorsInsideSet[csIndex].weight;
                                        }
                                    }
                                }
                                console.log($scope);
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "SFlow CollectorSet GET failed.";
                                $log.debug('Response status for SFlow CollectorSet:')
                                $log.debug(response.status)
                            })
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Collector GET failed.";
                    $log.debug('Response status for SFlow Collector:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding SFlow CollectorSet " + $scope.sflowcollectorset_name;
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
            $scope.status_msg = "SFlow CollectorSet updation failed. Total Weight of Collectors is greater than 100";
            return;
        }

        var data = {
            name: $scope.sflowcollectorset_name,
            collector_ids: collector_list,
            lb_algo: $scope.lb_algo.id,
            col_type: 'sflow'
        };

        $log.debug('Updated SFlow CollectorSet data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/collectorset/" + $scope.sflowcollectorset_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow CollectorSet " + $scope.sflowcollectorset_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow CollectorSet updation failed.";
            });
    };

    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing SFlow CollectorSet " + $scope.sflowcollectorset_name;

        var data = {};

        $log.debug('Id of SFlow CollectorSet to delete:')
        $log.debug($scope.sflowcollectorset_id)
        $http.delete("/v1.0/secmon/collectorset/" + $scope.sflowcollectorset_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow CollectorSet " + $scope.sflowcollectorset_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing SFlow CollectorSet failed.";
            });
    };
});
