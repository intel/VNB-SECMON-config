var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditNetflowCollectorSetController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.netflowcollectorset_id = ScopeService.getVal();

    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];


    $scope.loadData = function() {
        $http.get("/v1.0/secmon/collector/netflow/")
            .then(function(response) {
                $scope.netflowcollectors = response.data;
                $scope.netflowcollectors.sort(function(a, b) {
                    return a.name > b.name;
                });

                $http.get("/v1.0/secmon/collectorset/" + $scope.netflowcollectorset_id + "/")
                    .then(function(response) {
                        $scope.available_netflowcollectorsets = response.data;
                        $scope.collectorIdsArray = JSON.parse($scope.available_netflowcollectorsets.collector_ids.replace(/'/gi, "\""));
                        $scope.netflowcollectorset_id = $scope.available_netflowcollectorsets.id
                        $scope.netflowcollectorset_name = $scope.available_netflowcollectorsets.name

                        for (var ncIndex = 0; ncIndex < $scope.netflowcollectors.length; ++ncIndex) {
                            $scope.netflowcollectors[ncIndex].weight = 0;
                            for (var nciIndex = 0; nciIndex < $scope.collectorIdsArray.length; ++nciIndex) {
                                if ($scope.netflowcollectors[ncIndex].id === $scope.collectorIdsArray[nciIndex].id) {
                                    $scope.netflowcollectors[ncIndex].weight = $scope.collectorIdsArray[nciIndex].weight;
                                }
                            } // end of collectorIdsArray
                        } // end of netflowcollectors loop

                    })
            })
        console.log($scope);
    };

    $scope.loadData();

    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Updating NetFlow CollectorSet " + $scope.netflowcollectorset_name;
        var collector_dict = {};
        var collector_list = [];
        for (index = 0; index < $scope.collector_ids.length; ++index) {
            var collector_selected = $scope.collector_ids[index].id
            // var weight_collector = "weight_collector" + index
            //console.log('weight_collector:')
            //console.log(weight_collector)
            //console.log('$scope:')
            //console.log($scope)
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
            $scope.status_msg = "NetFlow CollectorSet updation failed. Total Weight of Collectors is greater than 100";
            return;
        }

        var data = {
            name: $scope.netflowcollectorset_name,
            collector_ids: collector_list,
            lb_algo: $scope.lb_algo.id,
            col_type: 'netflow'
        };
        console.info($scope);
        console.log(data);

        $http.put("/v1.0/secmon/collectorset/" + $scope.netflowcollectorset_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow CollectorSet " + $scope.netflowcollectorset_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow CollectorSet updation failed.";
            });
    };

    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing NetFlow CollectorSet " + $scope.netflowcollectorset_name;

        var data = {};

        $http.delete("/v1.0/secmon/collectorset/" + $scope.netflowcollectorset_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow CollectorSet " + $scope.netflowcollectorset_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing NetFlow CollectorSet failed.";
            });
    };
});
