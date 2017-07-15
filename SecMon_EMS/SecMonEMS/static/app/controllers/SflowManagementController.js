var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };


app.controller('SflowManagementController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.title = 'SFlow';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {};
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;
    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];

    $scope.loadData = function() {
        highlightMgmtLink('sflow_mgmt_link');
        //fetch and populate scope data in sflowconfig and sflowassociation table
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.available_scopes = response.data;
                    return $http.get("/v1.0/secmon/sflowconfig/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope data GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)
		                //$scope.available_scopes = []
                })
            .then(function(response) {
                $scope.available_sflowconfigs = response.data;
                for (var i = 0; i < $scope.available_sflowconfigs.length; i++) {
                    for (var j = 0; j < $scope.available_scopes.length; j++) {
                        if ($scope.available_sflowconfigs[i].scope_id == $scope.available_scopes[j].id) {
                            $scope.available_sflowconfigs[i].scope_id = $scope.available_scopes[j].name;
                            break;
                        }
                    }
                }},
		function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Config data GET failed.";
                    $log.debug('Response status for SFlow Config:')
                    $log.debug(response.status)
                    $scope.available_sflowconfigs = []
                }
            )

            /*
                    //fetch and populate sflowcollector configurations in sflowcollector data table
                    $http.get("/v1.0/secmon/collector/sflow/")
                        .then(function(response) {
                            $scope.available_sflowcollectors = response.data;

                            //fetch and populate sflowcollectorset configurations in sflowcollectorset data table
                            $http.get("/v1.0/secmon/collectorset/sflow/")
                                .then(function(response) {
                                    $scope.available_sflowcollectorsets = response.data;

                                    for (var i = 0; i < $scope.available_sflowcollectorsets.length; i++) {
                                        if ($scope.available_sflowcollectorsets[i].lb_algo == "1") {
                                            $scope.available_sflowcollectorsets[i].lb_algo = "round_robin"
                                        } else if ($scope.available_sflowcollectorsets[i].lb_algo == "0") {
                                            $scope.available_sflowcollectorsets[i].lb_algo = "session_based"
                                        } else if ($scope.available_sflowcollectorsets[i].lb_algo == "2") {
                                            $scope.available_sflowcollectorsets[i].lb_algo = "weighted_round_robin"
                                        }
                                    }

                                    var sflowCollectorsets = $scope.available_sflowcollectorsets;
                                    for (var csIndex = 0; csIndex < sflowCollectorsets.length; ++csIndex) {
                                        sflowCollectorsets[csIndex].collectorIds = JSON.parse(sflowCollectorsets[csIndex].collector_ids.replace(/'/gi, "\""));
                                        var collectorIds = sflowCollectorsets[csIndex].collectorIds;
                                        var collectorInsideSet = "[";

                                        for (var cIndex = 0; cIndex < collectorIds.length; ++cIndex) {
                                            for (var acIndex = 0; acIndex < $scope.available_sflowcollectors.length; ++acIndex) {
                                                if (collectorIds[cIndex].id === $scope.available_sflowcollectors[acIndex].id) {
                                                    collectorInsideSet += "{" + $scope.available_sflowcollectors[acIndex].name + ", weight:" + collectorIds[cIndex].weight + "}, ";
                                                }
                                            }
                                        }

                                        sflowCollectorsets[csIndex].collectorInsideSet = collectorInsideSet.substr(0, collectorInsideSet.length - 2) + "]";

                                    }
                                    $scope.available_sflowcollectorsets = sflowCollectorsets;
                                    console.log($scope);

                                })
                        })
            */
            //fetch and populate sflow configurations in sflowconfig data table
        // fetch and populate scope data
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.available_scopes = response.data;
                    //fetch and populate policy data
                    return $http.get("/v1.0/secmon/policy/")
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope data GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_policys = response.data;
                    // fetch and populate collector data
                    return $http.get("/v1.0/secmon/collector/sflow/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Policy data GET failed.";
                    $log.debug('Response status for Policy:')
                    $log.debug(response.status)
            		    $scope.available_policys = []
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_sflowcollectors = response.data;
                    // fetch and populate collectorset data
                    return $http.get("/v1.0/secmon/collectorset/sflow/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Sflow Collector data GET failed.";
                    $log.debug('Response status for Sflow Collector:')
                    $log.debug(response.status)
		                $scope.available_sflowcollectors = []
                    // fetch and populate collectorset data
                    return $http.get("/v1.0/secmon/collectorset/sflow/");
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_sflowcollectorsets = response.data;

                    for (var i = 0; i < $scope.available_sflowcollectorsets.length; i++) {
                        if ($scope.available_sflowcollectorsets[i].lb_algo == "1") {
                            $scope.available_sflowcollectorsets[i].lb_algo = "round_robin"
                        } else if ($scope.available_sflowcollectorsets[i].lb_algo == "0") {
                            $scope.available_sflowcollectorsets[i].lb_algo = "session_based"
                        } else if ($scope.available_sflowcollectorsets[i].lb_algo == "2") {
                            $scope.available_sflowcollectorsets[i].lb_algo = "weighted_round_robin"
                        }
                    }

                    var sflowCollectorsets = $scope.available_sflowcollectorsets;
                    for (var csIndex = 0; csIndex < sflowCollectorsets.length; ++csIndex) {
                        sflowCollectorsets[csIndex].collectorIds = JSON.parse(sflowCollectorsets[csIndex].collector_ids.replace(/'/gi, "\""));
                        var collectorIds = sflowCollectorsets[csIndex].collectorIds;
                        var collectorInsideSet = "[";

                        for (var cIndex = 0; cIndex < collectorIds.length; ++cIndex) {
                            for (var acIndex = 0; acIndex < $scope.available_sflowcollectors.length; ++acIndex) {
                                if (collectorIds[cIndex].id === $scope.available_sflowcollectors[acIndex].id) {
                                    collectorInsideSet += "{" + $scope.available_sflowcollectors[acIndex].name + ", weight:" + collectorIds[cIndex].weight + "}, ";
                                }
                            }
                        }

                        sflowCollectorsets[csIndex].collectorInsideSet = collectorInsideSet.substr(0, collectorInsideSet.length - 2) + "]";

                    }
                    $scope.available_sflowcollectorsets = sflowCollectorsets;
                    console.log($scope);

                    // fetch and populate sflowassociation data
                    return $http.get("/v1.0/secmon/sflowassociation/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow CollectorSet data GET failed.";
                    $log.debug('Response status for SFlow CollectorSet:')
                    $log.debug(response.status)
		                $scope.available_sflowcollectorsets = []

                    // fetch and populate sflowassociation data
                    return $http.get("/v1.0/secmon/sflowassociation/");
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.available_sflowassociations = response.data;
                    var sflowCollectors = $scope.available_sflowcollectors;

                    for (var i = 0; i < $scope.available_sflowassociations.length; i++) {
                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                            if ($scope.available_sflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                                $scope.available_sflowassociations[i].scope_id = $scope.available_scopes[j].name;
                                break;
                            }
                        }
                        for (var j = 0; j < $scope.available_policys.length; j++) {
                            if ($scope.available_sflowassociations[i].policy_id == $scope.available_policys[j].id) {
                                $scope.available_sflowassociations[i].policy_id = $scope.available_policys[j].name;
                                break;
                            }
                        }
                        for (var j = 0; j < sflowCollectors.length; j++) {
                            var collector_ids_list = $scope.available_sflowassociations[i].collector_id.split(":");
                            if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == sflowCollectors[j].id) {
                                $scope.available_sflowassociations[i].collector_id = "Collector:" + sflowCollectors[j].name;
                                break;
                            }
                        }
                        if ($scope.available_sflowcollectorsets) {
                            for (var k = 0; k < $scope.available_sflowcollectorsets.length; k++) {
                                var collectorset_ids_list = $scope.available_sflowassociations[i].collector_id.split(":");
                                console.log('collectorset_ids_list')
                                console.log(collectorset_ids_list)
                                if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_sflowcollectorsets[k].id) {
                                    $scope.available_sflowassociations[i].collector_id = "Collectorset:" + $scope.available_sflowcollectorsets[k].name;
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
                    $scope.status_msg = "SFlow Association data GET failed.";
                    $log.debug('Response status for SFlow Association:')
                    $log.debug(response.status)
                    $scope.available_sflowassociations = []
                })
            .catch(function(error) {
                console.log(error);
                return $http.get("/v1.0/secmon/sflowassociation/");
            })
            .then(function(response) {
                if (!(!!response)) {
                    return;
                }
                $scope.available_sflowassociations = response.data;
                var sflowCollectors = $scope.available_sflowcollectors;

                for (var i = 0; i < $scope.available_sflowassociations.length; i++) {
                    for (var j = 0; j < $scope.available_scopes.length; j++) {
                        if ($scope.available_sflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                            $scope.available_sflowassociations[i].scope_id = $scope.available_scopes[j].name;
                            break;
                        }
                    }
                    for (var j = 0; j < $scope.available_policys.length; j++) {
                        if ($scope.available_sflowassociations[i].policy_id == $scope.available_policys[j].id) {
                            $scope.available_sflowassociations[i].policy_id = $scope.available_policys[j].name;
                            break;
                        }
                    }
                    for (var j = 0; j < sflowCollectors.length; j++) {
                        var collector_ids_list = $scope.available_sflowassociations[i].collector_id.split(":");
                        if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == sflowCollectors[j].id) {
                            $scope.available_sflowassociations[i].collector_id = "Collector:" + sflowCollectors[j].name;
                            break;
                        }
                    }
                    if ($scope.available_sflowcollectorsets) {
                        for (var k = 0; k < $scope.available_sflowcollectorsets.length; k++) {
                            var collectorset_ids_list = $scope.available_sflowassociations[i].collector_id.split(":");
                            console.log('collectorset_ids_list')
                            console.log(collectorset_ids_list)
                            if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_sflowcollectorsets[k].id) {
                                $scope.available_sflowassociations[i].collector_id = "Collectorset:" + $scope.available_sflowcollectorsets[k].name;
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
                    //fetch and populate sflowassociation configurations in sflowassociation data table
                $http.get("/v1.0/secmon/sflowassociation/")
                    .then(function(response) {
                        $scope.available_sflowassociations = response.data;

                        $http.get("/v1.0/secmon/collector/sflow/")
                            .then(function(response) {
                                var sflowCollectors = response.data;

                                for (var i = 0; i < $scope.available_sflowassociations.length; i++) {
                                    for (var j = 0; j < $scope.available_scopes.length; j++) {
                                        if ($scope.available_sflowassociations[i].scope_id == $scope.available_scopes[j].id) {
                                            $scope.available_sflowassociations[i].scope_id = $scope.available_scopes[j].name;
                                            break;
                                        }
                                    }
                                    for (var j = 0; j < $scope.available_policys.length; j++) {
                                        if ($scope.available_sflowassociations[i].policy_id == $scope.available_policys[j].id) {
                                            $scope.available_sflowassociations[i].policy_id = $scope.available_policys[j].name;
                                            break;
                                        }
                                    }
                                    for (var j = 0; j < sflowCollectors.length; j++) {
                                        var collector_ids_list = $scope.available_sflowassociations[i].collector_id.split(":");
                                        if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == sflowCollectors[j].id) {
                                            $scope.available_sflowassociations[i].collector_id = "Collector:" + sflowCollectors[j].name;
                                            break;
                                        }
                                    }
                                    if ($scope.available_sflowcollectorsets) {
                                        for (var k = 0; k < $scope.available_sflowcollectorsets.length; k++) {
                                            var collectorset_ids_list = $scope.available_sflowassociations[i].collector_id.split(":");
                                            console.log('collectorset_ids_list')
                                            console.log(collectorset_ids_list)
                                            if (collector_ids_list[0] == "Collectorset" && collector_ids_list[1] == $scope.available_sflowcollectorsets[k].id) {
                                                $scope.available_sflowassociations[i].collector_id = "Collectorset:" + $scope.available_sflowcollectorsets[k].name;
                                                break;
                                            }
                                        }
                                    }
                                }
                            });
                    });
                    */
    };

    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        $scope.loadData();
    });

    //function to delete a sflowcollector with given id
    $scope.deleteSflowCollector = function(ev, cred_sflowcollector_id) {

        console.log($scope);
        // getting sflow collector name corresponding to sflow collector id
        var deleteSflowCollectorName = "";
        for (var scIndex = 0; scIndex < $scope.available_sflowcollectors.length; ++scIndex) {
            if ($scope.available_sflowcollectors[scIndex].id === cred_sflowcollector_id) {
                deleteSflowCollectorName = $scope.available_sflowcollectors[scIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete SFlow Collector?')
            .textContent("Deleting " + deleteSflowCollectorName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_sflowcollector_id }
            $http.delete("/v1.0/secmon/collector/" + cred_sflowcollector_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: SFlow Collector deletion failed.", response);
                    $log.debug('Response status for SFlow Collector deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a sflowconfig with given id
    $scope.deleteSflowConfig = function(ev, cred_sflowconfig_id) {

        var confirm = $mdDialog.confirm()
            .title('Delete?')
            .textContent("Deleting the SFlow Config" + cred_sflowconfig_id + " would disable all access to it. Are you sure you want to delete the SFlow Config?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_sflowconfig_id }
            $http.delete("/v1.0/secmon/sflowconfig/" + cred_sflowconfig_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: SFlow Config deletion failed.", response);
                    $log.debug('Response status for SFlow Config deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a sflowassociation with given id
    $scope.deleteSflowAssociation = function(ev, cred_sflowassociation_id) {

        // getting sflow scope id to collector or collector set mapping
        // corresponding to the sflow association id
        var deleteSflowAssociationName = "";
        for (var saIndex = 0; saIndex < $scope.available_sflowassociations.length; ++saIndex) {
            if ($scope.available_sflowassociations[saIndex].id === cred_sflowassociation_id) {
                deleteSflowAssociationName = $scope.available_sflowassociations[saIndex].scope_id + ":" +
                    $scope.available_sflowassociations[saIndex].collector_id;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete SFlow Association?')
            .textContent("Deleting " + deleteSflowAssociationName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_sflowassociation_id }
            $http.delete("/v1.0/secmon/sflowassociation/" + cred_sflowassociation_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: SFlow Association deletion failed.", response);
                    $log.debug('Response status for SFlow Association deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a sflowcollectorset with given id
    $scope.deleteSflowCollectorSet = function(ev, cred_sflowcollectorset_id) {

        console.log($scope);
        // getting sflow collector set name corresponding to sflow collector set id
        var deleteSflowCollectorSetName = "";
        for (var scsIndex = 0; scsIndex < $scope.available_sflowcollectorsets.length; ++scsIndex) {
            if ($scope.available_sflowcollectorsets[scsIndex].id === cred_sflowcollectorset_id) {
                deleteSflowCollectorSetName = $scope.available_sflowcollectorsets[scsIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete SFlow CollectorSet?')
            .textContent("Deleting " + deleteSflowCollectorSetName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_sflowcollectorset_id }
            $http.delete("/v1.0/secmon/collectorset/" + cred_sflowcollectorset_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: SFlow CollectorSet deletion failed.", response);
                    $log.debug('Response status for SFlow CollectorSet deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete multiple sflowcollectors
    $scope.selectedSflowCollectorDelete = function(ev) {
        sflowcollector_names = Object.keys($scope.selected);
        for (index = 0; index < sflowcollector_names.length; ++index) {
            $scope.deleteSflowCollector(ev, sflowcollector_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple sflowconfigs
    $scope.selectedSflowConfigDelete = function(ev) {
        sflowconfig_names = Object.keys($scope.selected);
        for (index = 0; index < sflowconfig_names.length; ++index) {
            $scope.deleteSflowConfig(ev, sflowconfig_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple sflowassociations
    $scope.selectedSflowAssociationDelete = function(ev) {
        sflowassociation_names = Object.keys($scope.selected);
        for (index = 0; index < sflowassociation_names.length; ++index) {
            $scope.deleteSflowAssociation(ev, sflowassociation_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple sflowcollectorsets
    $scope.selectedSflowCollectorSetDelete = function(ev) {
        sflowcollectorset_names = Object.keys($scope.selected);
        for (index = 0; index < sflowcollectorset_names.length; ++index) {
            $scope.deleteSflowCollectorSet(ev, sflowcollectorset_names[index]);
        }
        $scope.selected = {};
    }

    //function for sflowcollector creation
    $scope.createSflowCollectorDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_sflowcollector.html',
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

    //function for sflowconfig creation
    $scope.createSflowConfigDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_sflowconfig.html',
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

    //function for sflowassociation creation
    $scope.createSflowAssociationDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_sflowassociation.html',
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

    //function for sflowcollectorset creation
    $scope.createSflowCollectorsetDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_sflowcollectorset.html',
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

    //function for sflowcollector updation
    $scope.editSflowCollector = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_sflowcollector.html',
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

    //function for sflowconfig updation
    $scope.editSflowConfig = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_sflowconfig.html',
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

    //function for sflowassociation updation
    $scope.editSflowAssociation = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_sflowassociation.html',
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

    //function for sflowcollectorset updation
    $scope.editSflowCollectorSet = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_sflowcollectorset.html',
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

app.controller('CreateSflowCollectorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    //function to send sflowcollector configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating SFlow Collector " + $scope.sflowcollector_name;

        var data = {
            name: $scope.sflowcollector_name,
            ip_address: $scope.ip_address,
            col_type: 'sflow',
            udp_port: $scope.udp_port
        };
        $log.debug('Data to be sent for SFlow Collector creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/collector/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Collector " + $scope.sflowcollector_name + " created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow Collector creation failed";
                $log.debug('Response status for SFlow Collector:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateSflowConfigController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.loadData = function() {
        //fetch and populate scope field in create sflowconfig form
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

    //function to send sflow configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating SFlow Config" + $scope.scope_id.name;

        var data = {
            scope_id: $scope.scope_id.id,
            agent_ip: $scope.agent_ip,
            agent_subid: $scope.agent_subid,
            sampling_rate: $scope.sampling_rate,
            truncate_to_size: $scope.truncate_to_size
        };
        $log.debug('Data to be sent for SFlow Config creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/sflowconfig/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Config created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow Config creation failed";
                $log.debug('Response code for SFlow Config:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateSflowAssociationController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.directions = [
        { id: "INGRESS", value: "INGRESS" },
        { id: "EGRESS", value: "EGRESS" },
        { id: "BOTH", value: "BOTH" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in create sflowassociation form
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
            //fetch and populate sflowcollector field in create sflowassociation form
        $http.get("/v1.0/secmon/collector/sflow/")
            .then(function(response) {
                    $scope.collectors = response.data;
                    for (var j = 0; j < $scope.collectors.length; j++) {
                        $scope.collectors[j].id = "Collector:" + $scope.collectors[j].id
                        $scope.collectors[j].name = "Collector:" + $scope.collectors[j].name
                    }

                    $scope.collectors.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Collector GET failed";
                    $log.debug('Response code for SFlow Collector:')
                    $log.debug(response.status)

                })
            //fetch and populate sflowcollectorset field in create sflowassociation form
        $http.get("/v1.0/secmon/collectorset/sflow/")
            .then(function(response) {
                    $scope.collectorsets = response.data;
                    for (var j = 0; j < $scope.collectorsets.length; j++) {
                        $scope.collectorsets[j].id = "Collectorset:" + $scope.collectorsets[j].id
                        $scope.collectorsets[j].name = "Collectorset:" + $scope.collectorsets[j].name
                    }
                    console.log('$scope.collectors in association')
                    console.log($scope.collectors)
                    $scope.collectors.push.apply($scope.collectors, $scope.collectorsets)

                    $scope.collectorsets.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow CollectorSet GET failed";
                    $log.debug('Response code for SFlow CollectorSet:')
                    $log.debug(response.status)

                })
            //fetch and populate policy field in create sflowassociation form
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
                    $log.debug('Response code for Policy:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    //function to send sflowassocaition configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating SFlow Association " + $scope.scope_id.name;

        var data = {
            scope_id: $scope.scope_id.id,
            collector_id: $scope.collector_id.id,
            direction: $scope.direction.id,
            policy_id: $scope.policy_id.id
        };
        $log.debug('Data to be sent for SFlow Association creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/sflowassociation/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow Association created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow Association creation failed";
                $log.debug('Response code for SFlow Association:')
                $log.debug(response.status)
            });
    };
});


app.controller('CreateSflowCollectorSetController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];

    $scope.loadData = function() {
        //fetch and populate sflowcollwctor field in create sflowcollectorset form
        $http.get("/v1.0/secmon/collector/sflow/")
            .then(function(response) {
                    $scope.sflowcollectors = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Collector GET failed";
                    $log.debug('Response code for SFlow Collector:')
                    $log.debug(response.status)

                })
    };

    $scope.loadData();

    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating SFlow CollectorSet " + $scope.sflowcollectorset_name;
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
            $scope.status_msg = "SFlow CollectorSet creation failed. Total Weight of Collectors is greater than 100";
            return;
        }

        var data = {
            name: $scope.sflowcollectorset_name,
            collector_ids: collector_list,
            lb_algo: $scope.lb_algo.id,
            col_type: 'sflow'
        };
        $log.debug('Data to be sent for SFlow CollectorSet creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/collectorset/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "SFlow CollectorSet created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "SFlow CollectorSet creation failed";
                $log.debug('Response code for SFlow CollectorSet:')
                $log.debug(response.status)
            });
    };
});
