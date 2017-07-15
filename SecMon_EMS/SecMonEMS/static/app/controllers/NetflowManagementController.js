var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };


app.controller('NetflowManagementController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService, $q) {

    $scope.title = 'NetFlow';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {};
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    $scope.loadData = function() {
        highlightMgmtLink('netflow_mgmt_link');
        //fetch and populate scope data in netflow config, netflow monitor and
        //netflow association table
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.available_scopes = response.data;
                    //fetch and populate netflow configurations in netflowconfig data table
                    return $http.get("/v1.0/secmon/netflowconfig/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope data GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)
                    $scope.available_scopes = []
		})
        //fetch and populate policy data in netflow association table
        $http.get("/v1.0/secmon/policy/")
            .then(function(response) {
                    $scope.available_policys = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Policy GET failed.";
                    $log.debug('Response status for Policy:')
                    $log.debug(response.status)
		    $scope.available_policys = []
                })
            //fetch and populate netflow configurations in netflowconfig data table
        $http.get("/v1.0/secmon/netflowconfig/")
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_netflowconfigs = response.data;
                    for (var i = 0; i < $scope.available_netflowconfigs.length; i++) {
                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                            if ($scope.available_netflowconfigs[i].scope_id == $scope.available_scopes[j].id) {
                                $scope.available_netflowconfigs[i].scope_id = $scope.available_scopes[j].name;
                                break;
                            }
                        }
                    }
                    //fetch and populate netflowmonitor configurations in netflowmonitor data table
                    return $http.get("/v1.0/secmon/netflowmonitor/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Config GET failed.";
                    $log.debug('Response status for NetFlow Config:')
                    $log.debug(response.status)
		    $scope.available_netflowconfigs = []

                })

        //fetch and populate netflowmonitor configurations in netflowmonitor data table
        $http.get("/v1.0/secmon/netflowmonitor/")
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_netflowmonitors = response.data;
                    for (var i = 0; i < $scope.available_netflowmonitors.length; i++) {
                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                            if ($scope.available_netflowmonitors[i].scope_id == $scope.available_scopes[j].id) {
                                $scope.available_netflowmonitors[i].scope_id = $scope.available_scopes[j].name;
                                break;
                            }
                        }
                    }
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFloW Monitor get failed.";
                    $log.debug('Response status for NetFlow Monitor:')
                    $log.debug(response.status)
                    $scope.available_netflowmonitors = []
                });

            /*
        //fetch and populate netflowcollector configurations in netflowcollector data table
        $http.get("/v1.0/secmon/collector/netflow/")
            .then(function(response) {
                $scope.available_netflowcollectors = response.data;

                //fetch and populate netflowcollectorset configurations in netflowcollectorset data table
                $http.get("/v1.0/secmon/collectorset/netflow/")
                    .then(function(response) {
                        $scope.available_netflowcollectorsets = response.data;
                        for (var i = 0; i < $scope.available_netflowcollectorsets.length; i++) {
                            if ($scope.available_netflowcollectorsets[i].lb_algo == "1") {
                                $scope.available_netflowcollectorsets[i].lb_algo = "round_robin"
                            } else if ($scope.available_netflowcollectorsets[i].lb_algo == "0") {
                                $scope.available_netflowcollectorsets[i].lb_algo = "session_based"
                            } else if ($scope.available_netflowcollectorsets[i].lb_algo == "2") {
                                $scope.available_netflowcollectorsets[i].lb_algo = "weighted_round_robin"
                            }
                            //var collectors = $scope.available_netflowcollectorsets[i].collector_ids;
                            for (collector_id in $scope.available_netflowcollectorsets[i].collector_ids) {
                                for (var k = 0; k < $scope.available_netflowcollectors.length; k++) {
                                    //console.log('$scope.available_netflowcollectorsets[i].collector_ids')
                                    //console.log(collector_id)
                                    if (collector_id.id == $scope.available_netflowcollectors[k].id) {
                                        collector_id.id = $scope.available_netflowcollectors[k].name
                                    }
                                }
                            }
                        }

                        var netflowCollectorSets = $scope.available_netflowcollectorsets;
                        for (var csIndex = 0; csIndex < netflowCollectorSets.length; ++csIndex) {
                            netflowCollectorSets[csIndex].collectorIds = JSON.parse(netflowCollectorSets[csIndex].collector_ids.replace(/'/gi, "\""));
                            var collectorIds = netflowCollectorSets[csIndex].collectorIds;
                            var collectorInsideSet = "[";

                            for (var cIndex = 0; cIndex < collectorIds.length; ++cIndex) {
                                for (var acIndex = 0; acIndex < $scope.available_netflowcollectors.length; ++acIndex) {
                                    if (collectorIds[cIndex].id === $scope.available_netflowcollectors[acIndex].id) {
                                        collectorInsideSet += "{" + $scope.available_netflowcollectors[acIndex].name + ", weight:" + collectorIds[cIndex].weight + "}, ";
                                    }
                                }
                            }

                            netflowCollectorSets[csIndex].collectorInsideSet = collectorInsideSet.substr(0, collectorInsideSet.length - 2) + "]";

                        }
                        $scope.available_netflowcollectorsets = netflowCollectorSets;

                        console.log($scope);
                    });

            })
*/

        $scope.algorithms = [
            { id: "1", value: "round_robin" },
            { id: "0", value: "session_based" },
            { id: "2", value: "weighted_round_robin" }
        ];
        /*        $http.get("/v1.0/secmon/netflowassociation/")
                    .then(function(response) {
                        $scope.available_netflowassociations = response.data;
                        console.info($scope);

                        $http.get("/v1.0/secmon/collector/netflow/")
                            .then(function(response) {
                                var netflowCollectors = response.data;

                                for (var i = 0; i < $scope.available_netflowassociations.length; i++) {
                                    for (var j = 0; j < $scope.available_scopes.length; j++) {
                                        if ($scope.available_netflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                                            $scope.available_netflowassociations[i].scope_id = $scope.available_scopes[j].name;
                                            break;
                                        }
                                    }
                                    for (var j = 0; j < $scope.available_policys.length; j++) {
                                        if ($scope.available_netflowassociations[i].policy_id == $scope.available_policys[j].id) {
                                            $scope.available_netflowassociations[i].policy_id = $scope.available_policys[j].name;
                                            break;
                                        }
                                    }
                                    for (var j = 0; j < netflowCollectors.length; j++) {
                                        var collector_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                                        if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == netflowCollectors[j].id) {
                                            $scope.available_netflowassociations[i].collector_id = "Collector:" + netflowCollectors[j].name;
                                            //break;
                                        }
                                    }
                                    if ($scope.available_netflowcollectorsets) {
                                        for (var k = 0; k < $scope.available_netflowcollectorsets.length; k++) {
                                            var collectorset_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                                            if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_netflowcollectorsets[k].id) {
                                                $scope.available_netflowassociations[i].collector_id = "Collectorset:" + $scope.available_netflowcollectorsets[k].name;
                                                break;
                                            }
                                        }
                                    }
                                }

                                console.log($scope);
                            });

                    });
        */
        // fetch and populate scope data in netflow association table
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.available_scopes = response.data;
                    //fetch and populate policy data in netflow association table
                    return $http.get("/v1.0/secmon/policy/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope data GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)
		    $scope.available_scopes = []
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }                    
                    $scope.available_policys = response.data;
                    //fetch and populate collector data in netflow association table
                    return $http.get("/v1.0/secmon/collector/netflow/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Policy GET failed.";
                    $log.debug('Response status for Policy:')
                    $log.debug(response.status)
		    $scope.available_policys = []
                })
            .then(function(response) {
                    // $scope.testingCollector = response.data;
                    if (!(!!response)) {
                        return;
                    }                    
                    $scope.available_netflowcollectors = response.data;

                    //fetch and populate collector set data in netflow association table
                    return $http.get("/v1.0/secmon/collectorset/netflow/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Netflow Collector GET failed.";
                    $log.debug('Response status for Netflow Collector:')
                    $log.debug(response.status)
		    $scope.available_netflowcollectors = []

                    //fetch and populate collector set data in netflow association table
                    return $http.get("/v1.0/secmon/collectorset/netflow/");
                })
            .then(function(response) {
                    // $scope.testingCollectorSet = response.data;
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_netflowcollectorsets = response.data;
                    for (var i = 0; i < $scope.available_netflowcollectorsets.length; i++) {
                        if ($scope.available_netflowcollectorsets[i].lb_algo == "1") {
                            $scope.available_netflowcollectorsets[i].lb_algo = "round_robin"
                        } else if ($scope.available_netflowcollectorsets[i].lb_algo == "0") {
                            $scope.available_netflowcollectorsets[i].lb_algo = "session_based"
                        } else if ($scope.available_netflowcollectorsets[i].lb_algo == "2") {
                            $scope.available_netflowcollectorsets[i].lb_algo = "weighted_round_robin"
                        }
                        //var collectors = $scope.available_netflowcollectorsets[i].collector_ids;
                        for (collector_id in $scope.available_netflowcollectorsets[i].collector_ids) {
                            for (var k = 0; k < $scope.available_netflowcollectors.length; k++) {
                                //console.log('$scope.available_netflowcollectorsets[i].collector_ids')
                                //console.log(collector_id)
                                if (collector_id.id == $scope.available_netflowcollectors[k].id) {
                                    collector_id.id = $scope.available_netflowcollectors[k].name
                                }
                            }
                        }
                    }

                    var netflowCollectorSets = $scope.available_netflowcollectorsets;
                    for (var csIndex = 0; csIndex < netflowCollectorSets.length; ++csIndex) {
                        netflowCollectorSets[csIndex].collectorIds = JSON.parse(netflowCollectorSets[csIndex].collector_ids.replace(/'/gi, "\""));
                        var collectorIds = netflowCollectorSets[csIndex].collectorIds;
                        var collectorInsideSet = "[";

                        for (var cIndex = 0; cIndex < collectorIds.length; ++cIndex) {
                            for (var acIndex = 0; acIndex < $scope.available_netflowcollectors.length; ++acIndex) {
                                if (collectorIds[cIndex].id === $scope.available_netflowcollectors[acIndex].id) {
                                    collectorInsideSet += "{" + $scope.available_netflowcollectors[acIndex].name + ", weight:" + collectorIds[cIndex].weight + "}, ";
                                }
                            }
                        }

                        netflowCollectorSets[csIndex].collectorInsideSet = collectorInsideSet.substr(0, collectorInsideSet.length - 2) + "]";

                    }
                    $scope.available_netflowcollectorsets = netflowCollectorSets;

                    console.log($scope);

                    //fetch and populate netflow association data in netflow association table
                    return $http.get("/v1.0/secmon/netflowassociation/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow CollectorSet GET failed.";
                    $log.debug('Response status for NetFlow CollectorSet:')
                    $log.debug(response.status)
                    $scope.available_netflowcollectorsets = []
                    //fetch and populate netflow association data in netflow association table
                    return $http.get("/v1.0/secmon/netflowassociation/");
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_netflowassociations = response.data;
                    var netflowCollectors = $scope.available_netflowcollectors;

                    for (var i = 0; i < $scope.available_netflowassociations.length; i++) {
                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                            if ($scope.available_netflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                                $scope.available_netflowassociations[i].scope_id = $scope.available_scopes[j].name;
                                break;
                            }
                        }
                        for (var j = 0; j < $scope.available_policys.length; j++) {
                            if ($scope.available_netflowassociations[i].policy_id == $scope.available_policys[j].id) {
                                $scope.available_netflowassociations[i].policy_id = $scope.available_policys[j].name;
                                break;
                            }
                        }
                        for (var j = 0; j < netflowCollectors.length; j++) {
                            var collector_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                            if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == netflowCollectors[j].id) {
                                $scope.available_netflowassociations[i].collector_id = "Collector:" + netflowCollectors[j].name;
                                //break;
                            }
                        }
                        if ($scope.available_netflowcollectorsets) {
                            for (var k = 0; k < $scope.available_netflowcollectorsets.length; k++) {
                                var collectorset_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                                if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_netflowcollectorsets[k].id) {
                                    $scope.available_netflowassociations[i].collector_id = "Collectorset:" + $scope.available_netflowcollectorsets[k].name;
                                    break;
                                }
                            }
                        }
                    }

                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Association GET failed.";
                    $log.debug('Response status for NetFlow Association:')
                    $log.debug(response.status);
		    $scope.available_netflowassociations = []

                })
            .catch(function(error) {
                console.log(error);
                return $http.get("/v1.0/secmon/netflowassociation/");
            })
            .then(function(response) {
                // $scope.testingAssociation = response.data;
                if (!(!!response)) {
                    return;
                }
                $scope.available_netflowassociations = response.data;
                var netflowCollectors = $scope.available_netflowcollectors;

                for (var i = 0; i < $scope.available_netflowassociations.length; i++) {
                    for (var j = 0; j < $scope.available_scopes.length; j++) {
                        if ($scope.available_netflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                            $scope.available_netflowassociations[i].scope_id = $scope.available_scopes[j].name;
                            break;
                        }
                    }
                    for (var j = 0; j < $scope.available_policys.length; j++) {
                        if ($scope.available_netflowassociations[i].policy_id == $scope.available_policys[j].id) {
                            $scope.available_netflowassociations[i].policy_id = $scope.available_policys[j].name;
                            break;
                        }
                    }
                    for (var j = 0; j < netflowCollectors.length; j++) {
                        var collector_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                        if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == netflowCollectors[j].id) {
                            $scope.available_netflowassociations[i].collector_id = "Collector:" + netflowCollectors[j].name;
                            //break;
                        }
                    }
                    if ($scope.available_netflowcollectorsets) {
                        for (var k = 0; k < $scope.available_netflowcollectorsets.length; k++) {
                            var collectorset_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                            if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_netflowcollectorsets[k].id) {
                                $scope.available_netflowassociations[i].collector_id = "Collectorset:" + $scope.available_netflowcollectorsets[k].name;
                                break;
                            }
                        }
                    }
                }

            })
            .finally(function() {
                console.log($scope);
            })
            /*
                    $http.get("/v1.0/secmon/netflowassociation/")
                        .then(function(response) {
                            $scope.available_netflowassociations = response.data;
                            console.info($scope);

                            $http.get("/v1.0/secmon/collector/netflow/")
                                .then(function(response) {
                                    var netflowCollectors = response.data;

                                    for (var i = 0; i < $scope.available_netflowassociations.length; i++) {
                                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                                            if ($scope.available_netflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                                                $scope.available_netflowassociations[i].scope_id = $scope.available_scopes[j].name;
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < $scope.available_policys.length; j++) {
                                            if ($scope.available_netflowassociations[i].policy_id == $scope.available_policys[j].id) {
                                                $scope.available_netflowassociations[i].policy_id = $scope.available_policys[j].name;
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < netflowCollectors.length; j++) {
                                            var collector_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                                            if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == netflowCollectors[j].id) {
                                                $scope.available_netflowassociations[i].collector_id = "Collector:" + netflowCollectors[j].name;
                                                //break;
                                            }
                                        }
                                        if ($scope.available_netflowcollectorsets) {
                                            for (var k = 0; k < $scope.available_netflowcollectorsets.length; k++) {
                                                var collectorset_ids_list = $scope.available_netflowassociations[i].collector_id.split(":");
                                                if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_netflowcollectorsets[k].id) {
                                                    $scope.available_netflowassociations[i].collector_id = "Collectorset:" + $scope.available_netflowcollectorsets[k].name;
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    console.log($scope);
                                });

                        });
            */
    };

    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        $scope.loadData();
    });

    //function to delete a netflowcollector with given id
    $scope.deleteNetflowCollector = function(ev, cred_netflowcollector_id) {

        var deleteNetflowCollectorName = "";
        for (var ncIndex = 0; ncIndex < $scope.available_netflowcollectors.length; ++ncIndex) {
            if ($scope.available_netflowcollectors[ncIndex].id === cred_netflowcollector_id) {
                deleteNetflowCollectorName = $scope.available_netflowcollectors[ncIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete NetFlow Collector?')
            .textContent("Deleting " + deleteNetflowCollectorName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_netflowcollector_id }
            $http.delete("/v1.0/secmon/collector/" + cred_netflowcollector_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: NetFlow Collector deletion failed.", response);
                    $log.debug('Response status for NetFlow Collector deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a netflowconfig with given id
    $scope.deleteNetflowConfig = function(ev, cred_netflowconfig_id) {

        var confirm = $mdDialog.confirm()
            .title('Delete?')
            .textContent("Deleting the NetFlow Config " + cred_netflowconfig_id + " would disable all access to it. Are you sure you want to delete the NetFlow Config?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['id'] = { 'name': cred_netflowconfig_id }
            $http.delete("/v1.0/secmon/netflowconfig/" + cred_netflowconfig_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: NetFlow Config deletion failed.", response);
                    $log.debug('Response status for NetFlow Config deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a netflowmonitor with given id
    $scope.deleteNetflowMonitor = function(ev, cred_netflowmonitor_id) {

        var confirm = $mdDialog.confirm()
            .title('Delete?')
            .textContent("Deleting the NetFlow Monitor " + cred_netflowmonitor_id + " would disable all access to it. Are you sure you want to delete the NetFlow Monitor?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_netflowmonitor_id }
            $http.delete("/v1.0/secmon/netflowmonitor/" + cred_netflowmonitor_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: NetFlow Monitor deletion failed.", response);
                    $log.debug('Response status for NetFlow Monitor deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a netflowassociation with given id
    $scope.deleteNetflowAssociation = function(ev, cred_netflowassociation_id) {

        console.log($scope);
        var deleteNetflowAssociationName = "";
        for (var naIndex = 0; naIndex < $scope.available_netflowassociations.length; ++naIndex) {
            if ($scope.available_netflowassociations[naIndex].id === cred_netflowassociation_id) {
                deleteNetflowAssociationName = $scope.available_netflowassociations[naIndex].scope_id + ":" + $scope.available_netflowassociations[naIndex].collector_id;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete NetFlow Association?')
            .textContent("Deleting " + deleteNetflowAssociationName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_netflowassociation_id }
            $http.delete("/v1.0/secmon/netflowassociation/" + cred_netflowassociation_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: NetFlow Association deletion failed.", response);
                    $log.debug('Response status for NetFlow Association deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a netflowcollectorset with given id
    $scope.deleteNetflowCollectorSet = function(ev, cred_netflowcollectorset_id) {

        // getting netflow collectorset name corresponding to the netflow
        // collectorset id
        var deleteNetflowCollectorSetName = "";
        for (var ncsIndex = 0; ncsIndex < $scope.available_netflowcollectorsets.length; ++ncsIndex) {
            if ($scope.available_netflowcollectorsets[ncsIndex].id == cred_netflowcollectorset_id) {
                deleteNetflowCollectorSetName = $scope.available_netflowcollectorsets[ncsIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete NetFlow CollectorSet?')
            .textContent("Deleting " + deleteNetflowCollectorSetName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_netflowcollectorset_id }
            $http.delete("/v1.0/secmon/collectorset/" + cred_netflowcollectorset_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: NetFlow CollectorSet deletion failed.", response);
                    $log.debug('Response status for NetFlow CollectorSet deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete multiple netflowcollectors
    $scope.selectedNetflowCollectorDelete = function(ev) {
        netflowcollector_names = Object.keys($scope.selected);
        for (index = 0; index < netflowcollector_names.length; ++index) {
            $scope.deleteNetflowCollector(ev, netflowcollector_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple netflowconfigs
    $scope.selectedNetflowConfigDelete = function(ev) {
        netflowconfig_names = Object.keys($scope.selected);
        for (index = 0; index < netflowconfig_names.length; ++index) {
            $scope.deleteNetflowConfig(ev, netflowconfig_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple netflowmonitors
    $scope.selectedNetflowMonitorDelete = function(ev) {
        netflowmonitor_names = Object.keys($scope.selected);
        for (index = 0; index < netflowmonitor_names.length; ++index) {
            $scope.deleteNetflowMonitor(ev, netflowmonitor_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple netflowassociations
    $scope.selectedNetflowAssociationDelete = function(ev) {
        netflowassociation_names = Object.keys($scope.selected);
        for (index = 0; index < netflowassociation_names.length; ++index) {
            $scope.deleteNetflowAssociation(ev, netflowassociation_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple netflowcollectorsets
    $scope.selectedNetflowCollectorSetDelete = function(ev) {
        netflowcollectorset_names = Object.keys($scope.selected);
        for (index = 0; index < netflowcollectorset_names.length; ++index) {
            $scope.deleteNetflowCollectorSet(ev, netflowcollectorset_names[index]);
        }
        $scope.selected = {};
    }

    //function for netflowcollector creation
    $scope.createNetflowCollectorDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_netflowcollector.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {

            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowconfig creation
    $scope.createNetflowConfigDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_netflowconfig.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {

            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowmonitor creation
    $scope.createNetflowMonitorDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_netflowmonitor.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {

            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowassociation creation
    $scope.createNetflowAssociationDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_netflowassociation.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {

            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowcollectorset creation
    $scope.createNetflowCollectorsetDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_netflowcollectorset.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {

            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowcollector updation
    $scope.editNetflowCollector = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_netflowcollector.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {});
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowconfig updation
    $scope.editNetflowConfig = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_netflowconfig.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {});
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowmonitor updation
    $scope.editNetflowMonitor = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_netflowmonitor.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {});
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowassociation updation
    $scope.editNetflowAssociation = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_netflowassociation.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {});
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    //function for netflowcollectorset updation
    $scope.editNetflowCollectorSet = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_netflowcollectorset.html',
                parent: el,
                targetEvent: ev,
                clickOutsideToClose: true,
            })
            .then(function(answer) {});
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    $scope.loadData();
});


function DialogController($scope, $http, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
};

app.controller('CreateNetflowCollectorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    //function to send netflowcollector configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating NetFlow Collector " + $scope.netflowcollector_name;

        var data = {
            name: $scope.netflowcollector_name,
            ip_address: $scope.ip_address,
            udp_port: $scope.udp_port,
            col_type: 'netflow'
        };
        $log.debug('Data to be sent for NetFlow Collector creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/collector/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Collector " + $scope.netflowcollector_name + " created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Collector creation failed";
                $log.debug('Response status for NetFlow Collector:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateNetflowConfigController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.loadData = function() {
        //fetch and populate scope field in create netflowconfig form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed";
                    $log.debug('Response code for Scope:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    //function to send netflow configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating NetFlow Config for" + $scope.scope_id.name;

        var data = {
            scope_id: $scope.scope_id.id,
            active_timeout: $scope.active_timeout,
            inactive_timeout: $scope.inactive_timeout,
            refresh_rate: $scope.refresh_rate,
            timeout_rate: $scope.timeout_rate,
            maxflows: $scope.maxflows
        };
        $log.debug('Data to be sent for NetFlow Config creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/netflowconfig/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Config created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Config creation failed";
                $log.debug('Response code for NetFlow Config:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateNetflowMonitorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
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
        //fetch and populate scope field in create netflowmonitor form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed";
                    $log.debug('Response code for Scope:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    //function to send netflowmonitor configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating NetFlow Monitor " + $scope.scope_id.name;

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

        var data = {
            scope_id: $scope.scope_id.id,
            match_fields: netflowmonitor_matchfields_string,
            collect_fields: netflowmonitor_collectfields_string
        };
        $log.debug('Data to be sent for NetFlow Monitor creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/netflowmonitor/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = " NetFlow Monitor created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Monitor creation failed";
                $log.debug('Response code for NetFlow Monitor:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateNetflowAssociationController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.directions = [
        { id: "INGRESS", value: "INGRESS" },
        { id: "EGRESS", value: "EGRESS" },
        { id: "BOTH", value: "BOTH" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in create netflowassociation form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                    $scope.scopes.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed";
                    $log.debug('Response code for Scope:')
                    $log.debug(response.status)

                })
            //fetch and populate netflowcollector field in create netflowassociation form
        $http.get("/v1.0/secmon/collector/netflow/")
            .then(function(response) {
                    $scope.collectors = response.data;
                    $scope.collectors.sort(function(a, b) {
                        return a.name > b.name;
                    });

                    for (var j = 0; j < $scope.collectors.length; j++) {
                        $scope.collectors[j].id = "Collector:" + $scope.collectors[j].id
                        $scope.collectors[j].name = "Collector:" + $scope.collectors[j].name
                    }
                    //fetch and populate netflowcollectorset field in create netflowassociation form
                    return $http.get("/v1.0/secmon/collectorset/netflow/")
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Collector GET failed";
                    $log.debug('Response code for NetFlow Collector')
                    $log.debug(response.status)
                })
            .then(function(response) {
                    $scope.collectorsets = response.data;
                    $scope.collectorsets.sort(function(a, b) {
                        return a.name > b.name;
                    });

                    for (var j = 0; j < $scope.collectorsets.length; j++) {
                        $scope.collectorsets[j].id = "Collectorset:" + $scope.collectorsets[j].id
                        $scope.collectorsets[j].name = "Collectorset:" + $scope.collectorsets[j].name
                    }
                    console.log('$scope.collectors in association')
                    $scope.collectors.push.apply($scope.collectors, $scope.collectorsets)
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow CollectorSet GET failed";
                    $log.debug('Response code for NetFlow CollectorSet failed:')
                    $log.debug(response.status)

                })
            //fetch and populate policy field in create netflowassociation form
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
                    $scope.status_msg = "Policy GET failed";
                    $log.debug('Response code for Policy GET:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    //function to send netflowassociation configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating NetFlow Association " + $scope.scope_id.name;
            //       collector_id_list = $scope.collector_id.id.split(":")
            //       if (collector_id_list[0] == "Collector"){
            //           collector_data = 'Collector:' + $scope.collector_id.id
            //       }
            //       else{
            //           collector_data = 'Collector:' + $scope.collector_id.id
            //       }

        var data = {
            scope_id: $scope.scope_id.id,
            originator_vm_id: $scope.originator_vm_id,
            collector_id: $scope.collector_id.id,
            direction: $scope.direction.id,
            policy_id: $scope.policy_id.id
        };
        $log.debug('Data to be sent for NetFlow Association creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/netflowassociation/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow Association created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow Association creation failed";
                $log.debug('Response code for NetFlow Association:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateNetflowCollectorSetController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];

    $scope.loadData = function() {
        //fetch and populate netflowcollector field in create netflowcollectorset form
        $http.get("/v1.0/secmon/collector/netflow/")
            .then(function(response) {
                    $scope.netflowcollectors = response.data;
                    $scope.netflowcollectors.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Collector GET failed";
                    $log.debug('Response code for NetFlow Collector:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    //function to send netflowcollectorset configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating NetFlow CollectorSet " + $scope.netflowcollectorset_name;
        var collector_dict = {};
        var collector_list = [];
        for (index = 0; index < $scope.collector_ids.length; ++index) {
            var collector_selected = $scope.collector_ids[index].id
            console.log('$scope.collector_id')
            console.log($scope[collector_selected])
            var weight_col = $scope[collector_selected]
            if ($scope.lb_algo.id == "2") {
                collector_dict = {
                    'id': collector_selected,
                    'weight': $scope[collector_selected]
                }
            } else {
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
            $scope.status_msg = "NetFlow CollectorSet creation failed. Total Weight of Collectors is greater than 100";
            return;
        }

        var data = {
            name: $scope.netflowcollectorset_name,
            collector_ids: collector_list,
            lb_algo: $scope.lb_algo.id,
            col_type: 'netflow'
        };
        $log.debug('Data to be sent for NetFlow CollectorSet creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/collectorset/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "NetFlow CollectorSet created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "NetFlow CollectorSet creation failed. Please contact the administrator.";
                $log.debug('Response code for NetFlow CollectorSet:')
                $log.debug(data)
            });
    };
});
