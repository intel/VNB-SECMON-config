var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };


app.controller('RawforwardManagementController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.title = 'RawForward';
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
        highlightMgmtLink('rawforward_mgmt_link');

            /*
                    //fetch and populate rawforwardcollector configurations in rawforwardcollector data table
                    $http.get("/v1.0/secmon/collector/rawforward/")
                        .then(function(response) {
                            $scope.available_rawforwardcollectors = response.data;

                            $http.get("/v1.0/secmon/collectorset/rawforward/")
                                .then(function(response) {
                                    $scope.available_rawforwardcollectorsets = response.data;
                                    for (var i = 0; i < $scope.available_rawforwardcollectorsets.length; i++) {
                                        if ($scope.available_rawforwardcollectorsets[i].lb_algo == "1") {
                                            $scope.available_rawforwardcollectorsets[i].lb_algo = "round_robin"
                                        } else if ($scope.available_rawforwardcollectorsets[i].lb_algo == "0") {
                                            $scope.available_rawforwardcollectorsets[i].lb_algo = "session_based"
                                        } else if ($scope.available_rawforwardcollectorsets[i].lb_algo == "2") {
                                            $scope.available_rawforwardcollectorsets[i].lb_algo = "weighted_round_robin"
                                        }
                                    }

                                    var rawforwardCollectorSets = $scope.available_rawforwardcollectorsets;
                                    for (var csIndex = 0; csIndex < rawforwardCollectorSets.length; ++csIndex) {
                                        rawforwardCollectorSets[csIndex].collectorIds = JSON.parse(rawforwardCollectorSets[csIndex].collector_ids.replace(/'/gi, "\""));
                                        var collectorIds = rawforwardCollectorSets[csIndex].collectorIds;
                                        var collectorInsideSet = "[";

                                        for (var cIndex = 0; cIndex < collectorIds.length; ++cIndex) {
                                            for (var acIndex = 0; acIndex < $scope.available_rawforwardcollectors.length; ++acIndex) {
                                                if (collectorIds[cIndex].id === $scope.available_rawforwardcollectors[acIndex].id) {
                                                    collectorInsideSet += "{" + $scope.available_rawforwardcollectors[acIndex].name + ", weight:" + collectorIds[cIndex].weight + "}, ";
                                                }
                                            }
                                        }

                                        rawforwardCollectorSets[csIndex].collectorInsideSet = collectorInsideSet.substr(0, collectorInsideSet.length - 2) + "]";

                                    }
                                    $scope.available_rawforwardcollectorsets = rawforwardCollectorSets;

                                    console.log($scope);
                                });

                        })
            */
        //fetch and populate scope data in rawforwardassociation table
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.available_scopes = response.data;
                    //fetch and populate policy data in rawforward association table
                    return $http.get("/v1.0/secmon/policy/")
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
                    $scope.available_policys = response.data;
                    //fetch and populate collector data in rawforwardassociation table
                    return $http.get("/v1.0/secmon/collector/rawforward/");
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
                    $scope.available_rawforwardcollectors = response.data;

                    //fetch and populate collectorset data in rawforwardassociation table
                    return $http.get("/v1.0/secmon/collectorset/rawforward/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward Collector data GET failed.";
                    $log.debug('Response status for RawForward Collector:')
                    $log.debug(response.status)
		    $scope.available_rawforwardcollectors = []
                    //fetch and populate collectorset data in rawforwardassociation table
                    return $http.get("/v1.0/secmon/collectorset/rawforward/");
                })
            .then(function(response) {
                    $scope.available_rawforwardcollectorsets = response.data;
                    for (var i = 0; i < $scope.available_rawforwardcollectorsets.length; i++) {
                        if ($scope.available_rawforwardcollectorsets[i].lb_algo == "1") {
                            $scope.available_rawforwardcollectorsets[i].lb_algo = "round_robin"
                        } else if ($scope.available_rawforwardcollectorsets[i].lb_algo == "0") {
                            $scope.available_rawforwardcollectorsets[i].lb_algo = "session_based"
                        } else if ($scope.available_rawforwardcollectorsets[i].lb_algo == "2") {
                            $scope.available_rawforwardcollectorsets[i].lb_algo = "weighted_round_robin"
                        }
                    }

                    var rawforwardCollectorSets = $scope.available_rawforwardcollectorsets;
                    for (var csIndex = 0; csIndex < rawforwardCollectorSets.length; ++csIndex) {
                        rawforwardCollectorSets[csIndex].collectorIds = JSON.parse(rawforwardCollectorSets[csIndex].collector_ids.replace(/'/gi, "\""));
                        var collectorIds = rawforwardCollectorSets[csIndex].collectorIds;
                        var collectorInsideSet = "[";

                        for (var cIndex = 0; cIndex < collectorIds.length; ++cIndex) {
                            for (var acIndex = 0; acIndex < $scope.available_rawforwardcollectors.length; ++acIndex) {
                                if (collectorIds[cIndex].id === $scope.available_rawforwardcollectors[acIndex].id) {
                                    collectorInsideSet += "{" + $scope.available_rawforwardcollectors[acIndex].name + ", weight:" + collectorIds[cIndex].weight + "}, ";
                                }
                            }
                        }

                        rawforwardCollectorSets[csIndex].collectorInsideSet = collectorInsideSet.substr(0, collectorInsideSet.length - 2) + "]";

                    }
                    $scope.available_rawforwardcollectorsets = rawforwardCollectorSets;

                    console.log($scope);

                    //fetch and populate rawforward association data in rawforwardassociation table
                    return $http.get("/v1.0/secmon/rawforwardassociation/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward CollectorSet data GET failed.";
                    $log.debug('Response status for RawForward CollectorSet:')
                    $log.debug(response.status)
		    $scope.available_rawforwardcollectorsets = []
                    //fetch and populate rawforward association data in rawforwardassociation table
                    return $http.get("/v1.0/secmon/rawforwardassociation/");
                })
            .then(function(response) {
                    $scope.available_rawforwardassociations = response.data;
                    var rawforwardCollectors = $scope.available_rawforwardcollectors;

                    for (var i = 0; i < $scope.available_rawforwardassociations.length; i++) {
                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                            if ($scope.available_rawforwardassociations[i].scope_id == $scope.available_scopes[j].id) {
                                $scope.available_rawforwardassociations[i].scope_id = $scope.available_scopes[j].name;
                                break;
                            }
                        }
                        for (var j = 0; j < $scope.available_policys.length; j++) {
                            if ($scope.available_rawforwardassociations[i].policy_id == $scope.available_policys[j].id) {
                                $scope.available_rawforwardassociations[i].policy_id = $scope.available_policys[j].name;
                                break;
                            }
                        }

                        for (var j = 0; j < rawforwardCollectors.length; j++) {
                            var collector_ids_list = $scope.available_rawforwardassociations[i].collector_id.split(":");
                            //if (collector_ids_list[1] == $scope.available_rawforwardcollectors[j].id){
                            //    $scope.available_rawforwardassociations[i].collector_id = $scope.available_rawforwardcollectors[j].name;
                            //    break;
                            // }
                            if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == rawforwardCollectors[j].id) {
                                $scope.available_rawforwardassociations[i].collector_id = "Collector:" + rawforwardCollectors[j].name;
                                break;
                            }
                        }

                        if ($scope.available_rawforwardcollectorsets) {
                            for (var k = 0; k < $scope.available_rawforwardcollectorsets.length; k++) {
                                var collectorset_ids_list = $scope.available_rawforwardassociations[i].collector_id.split(":");
                                console.log('collectorset_ids_list')
                                console.log(collectorset_ids_list)
                                if (collectorset_ids_list[0] == "Collectorset" && collectorset_ids_list[1] == $scope.available_rawforwardcollectorsets[k].id) {
                                    $scope.available_rawforwardassociations[i].collector_id = "Collectorset:" + $scope.available_rawforwardcollectorsets[k].name;
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
                    $scope.status_msg = "RawForward Association data GET failed.";
                    $log.debug('Response status for RawForward Association:')
                    $log.debug(response.status)
                    $scope.available_rawforwardassociations = []
                })
            .catch(function(error) {
                return $http.get("/v1.0/secmon/rawforwardassociation/");
            })
            .then(function(response) {
                if (!(!!response)) {
                    return;
                }
                $scope.available_rawforwardassociations = response.data;
                var rawforwardCollectors = $scope.available_rawforwardcollectors;

                for (var i = 0; i < $scope.available_rawforwardassociations.length; i++) {
                    for (var j = 0; j < $scope.available_scopes.length; j++) {
                        if ($scope.available_rawforwardassociations[i].scope_id == $scope.available_scopes[j].id) {
                            $scope.available_rawforwardassociations[i].scope_id = $scope.available_scopes[j].name;
                            break;
                        }
                    }
                    for (var j = 0; j < $scope.available_policys.length; j++) {
                        if ($scope.available_rawforwardassociations[i].policy_id == $scope.available_policys[j].id) {
                            $scope.available_rawforwardassociations[i].policy_id = $scope.available_policys[j].name;
                            break;
                        }
                    }

                    for (var j = 0; j < rawforwardCollectors.length; j++) {
                        var collector_ids_list = $scope.available_rawforwardassociations[i].collector_id.split(":");
                        //if (collector_ids_list[1] == $scope.available_rawforwardcollectors[j].id){
                        //    $scope.available_rawforwardassociations[i].collector_id = $scope.available_rawforwardcollectors[j].name;
                        //    break;
                        // }
                        if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == rawforwardCollectors[j].id) {
                            $scope.available_rawforwardassociations[i].collector_id = "Collector:" + rawforwardCollectors[j].name;
                            break;
                        }
                    }

                    if ($scope.available_rawforwardcollectorsets) {
                        for (var k = 0; k < $scope.available_rawforwardcollectorsets.length; k++) {
                            var collectorset_ids_list = $scope.available_rawforwardassociations[i].collector_id.split(":");
                            console.log('collectorset_ids_list')
                            console.log(collectorset_ids_list)
                            if (collectorset_ids_list[0] == "Collectorset" && collectorset_ids_list[1] == $scope.available_rawforwardcollectorsets[k].id) {
                                $scope.available_rawforwardassociations[i].collector_id = "Collectorset:" + $scope.available_rawforwardcollectorsets[k].name;
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
                    //fetch and populate rawforwardassociation configurations in rawforwardassociation data table
                    $http.get("/v1.0/secmon/rawforwardassociation/")
                        .then(function(response) {
                            $scope.available_rawforwardassociations = response.data;

                            $http.get("/v1.0/secmon/collector/rawforward/")
                                .then(function(response) {

                                    var rawforwardCollectors = response.data;

                                    for (var i = 0; i < $scope.available_rawforwardassociations.length; i++) {
                                        for (var j = 0; j < $scope.available_scopes.length; j++) {
                                            if ($scope.available_rawforwardassociations[i].scope_id == $scope.available_scopes[j].id) {
                                                $scope.available_rawforwardassociations[i].scope_id = $scope.available_scopes[j].name;
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < $scope.available_policys.length; j++) {
                                            if ($scope.available_rawforwardassociations[i].policy_id == $scope.available_policys[j].id) {
                                                $scope.available_rawforwardassociations[i].policy_id = $scope.available_policys[j].name;
                                                break;
                                            }
                                        }

                                        for (var j = 0; j < rawforwardCollectors.length; j++) {
                                            var collector_ids_list = $scope.available_rawforwardassociations[i].collector_id.split(":");
                                            //if (collector_ids_list[1] == $scope.available_rawforwardcollectors[j].id){
                                            //    $scope.available_rawforwardassociations[i].collector_id = $scope.available_rawforwardcollectors[j].name;
                                            //    break;
                                            // }
                                            if (collector_ids_list[0] == "Collector" && collector_ids_list[1] == rawforwardCollectors[j].id) {
                                                $scope.available_rawforwardassociations[i].collector_id = "Collector:" + rawforwardCollectors[j].name;
                                                break;
                                            }
                                        }

                                        if ($scope.available_rawforwardcollectorsets) {
                                            for (var k = 0; k < $scope.available_rawforwardcollectorsets.length; k++) {
                                                var collectorset_ids_list = $scope.available_rawforwardassociations[i].collector_id.split(":");
                                                console.log('collectorset_ids_list')
                                                console.log(collectorset_ids_list)
                                                if (collectorset_ids_list[0] == "Collectorset" && collectorset_ids_list[1] == $scope.available_rawforwardcollectorsets[k].id) {
                                                    $scope.available_rawforwardassociations[i].collector_id = "Collectorset:" + $scope.available_rawforwardcollectorsets[k].name;
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

    //function to delete a rawforwardcollector with given id
    $scope.deleteRawforwardCollector = function(ev, cred_rawforwardcollector_id) {

        // getting rawforward collector name corresponding to rawforward
        // collector id
        var deleteRawforwardCollectorName = "";
        for (var rcIndex = 0; rcIndex < $scope.available_rawforwardcollectors.length; ++rcIndex) {
            if ($scope.available_rawforwardcollectors[rcIndex].id === cred_rawforwardcollector_id) {
                deleteRawforwardCollectorName = $scope.available_rawforwardcollectors[rcIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete RawForward Collector?')
            .textContent("Deleting " + deleteRawforwardCollectorName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_rawforwardcollector_id }
            $http.delete("/v1.0/secmon/collector/" + cred_rawforwardcollector_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: RawForward Collector deletion failed.", response);
                    $log.debug('Response status for RawForward Collector deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a rawforwardassocaition with given id
    $scope.deleteRawforwardAssociation = function(ev, cred_rawforwardassociation_id) {

        // getting rawforward association scope and collector name corresponding
        // to the rawforward association id
        var deleteRawforwardAssociationName = "";
        for (var raIndex = 0; raIndex < $scope.available_rawforwardassociations.length; ++raIndex) {
            if ($scope.available_rawforwardassociations[raIndex].id === cred_rawforwardassociation_id) {
                deleteRawforwardAssociationName = $scope.available_rawforwardassociations[raIndex].scope_id + ":" +
                    $scope.available_rawforwardassociations[raIndex].collector_id;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete RawForward Association?')
            .textContent("Deleting " + deleteRawforwardAssociationName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_rawforwardassociation_id }
            $http.delete("/v1.0/secmon/rawforwardassociation/" + cred_rawforwardassociation_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: RawForward Association deletion failed.", response);
                    $log.debug('Response status for RawForward Association deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a rawforwardcollectorset with given id
    $scope.deleteRawforwardCollectorSet = function(ev, cred_rawforwardcollectorset_id) {

        // getting rawforward collector set name corresponding to rawforward
        // collector set id
        var deleteRawforwardCollectorSetName = "";
        for (var rcsIndex = 0; rcsIndex < $scope.available_rawforwardcollectorsets.length; ++rcsIndex) {
            if ($scope.available_rawforwardcollectorsets[rcsIndex].id === cred_rawforwardcollectorset_id) {
                deleteRawforwardCollectorSetName = $scope.available_rawforwardcollectorsets[rcsIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete RawForward CollectorSet?')
            .textContent("Deleting " + deleteRawforwardCollectorSetName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'id': cred_rawforwardcollectorset_id }
            $http.delete("/v1.0/secmon/collectorset/" + cred_rawforwardcollectorset_id + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: RawForward CollectorSet deletion failed.", response);
                    $log.debug('Response status for RawForward CollectorSet deletion:')
                    $log.debug(response.status)
                });
        });
    }


    //function to delete multiple rawforwardcollectors
    $scope.selectedRawforwardCollectorDelete = function(ev) {
        rawforwardcollector_names = Object.keys($scope.selected);
        for (index = 0; index < rawforwardcollector_names.length; ++index) {
            $scope.deleteRawforwardCollector(ev, rawforwardcollector_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple rawforwardassociations
    $scope.selectedRawforwardAssociationDelete = function(ev) {
        rawforwardassociation_names = Object.keys($scope.selected);
        for (index = 0; index < rawforwardassociation_names.length; ++index) {
            $scope.deleteRawforwardAssociation(ev, rawforwardassociation_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple rawforwardcollectorsets
    $scope.selectedRawforwardCollectorSetDelete = function(ev) {
        rawforwardcollectorset_names = Object.keys($scope.selected);
        for (index = 0; index < rawforwardcollectorset_names.length; ++index) {
            $scope.deleteRawforwardCollectorSet(ev, rawforwardcollectorset_names[index]);
        }
        $scope.selected = {};
    }

    //function for rawforwardcollector creation
    $scope.createRawforwardCollectorDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_rawforwardcollector.html',
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

    //function for rawforwardassociation creation
    $scope.createRawforwardAssociationDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_rawforwardassociation.html',
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

    //function for rawforwardcollectorset creation
    $scope.createRawforwardCollectorSetDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_rawforwardcollectorset.html',
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

    //function for rawforwardcollector updation
    $scope.editRawforwardCollector = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_rawforwardcollector.html',
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

    //function for rawforwardassociation updation
    $scope.editRawforwardAssociation = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_rawforwardassociation.html',
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

    //function for rawforwardcollectorset updation
    $scope.editRawforwardCollectorSet = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_rawforwardcollectorset.html',
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

app.controller('CreateRawforwardCollectorController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.encapsulationprotocols = [
        { id: "UDP", value: "UDP" },
/*        { id: "SFLOW", value: "SFLOW" } */
    ];

    //$scope.loadData();

    //function to send rawforwardcollector configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating RawForward Collector " + $scope.rawforwardcollector_name;

        var data = {
            name: $scope.rawforwardcollector_name,
            ip_address: $scope.ip_address,
            udp_port: $scope.udp_port,
            encapsulation_protocol: $scope.encapsulation_protocol.id,
            col_type: 'rawforward'
        };
        $log.debug('Data to be sent for RawForward Collector creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/collector/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward Collector " + $scope.rawforwardcollector_name + " created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "RawForward Collector creation failed";
                $log.debug('Response status for RawForward Collector:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateRawforwardAssociationController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.directions = [
        { id: "INGRESS", value: "INGRESS" },
        { id: "EGRESS", value: "EGRESS" },
        { id: "BOTH", value: "BOTH" }
    ];

    $scope.loadData = function() {
        //fetch and populate scope field in create rawforwardassociation form
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.scopes = response.data;
                    $scope.scopes.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    //fetch and populate rawforwardcollector field in create rawforwardassociation form
                    return $http.get("/v1.0/secmon/collector/rawforward/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope GET failed";
                    $log.debug('Response code for Scope:')
                    $log.debug(response.status)

                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.collectors = response.data;
                    console.log($scope.collectors);
                    $scope.collectors.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    for (var j = 0; j < $scope.collectors.length; j++) {
                        $scope.collectors[j].id = "Collector:" + $scope.collectors[j].id
                        $scope.collectors[j].name = "Collector:" + $scope.collectors[j].name
                    }
                    //fetch and populate rawforwardcollectorset field in create rawforwardassociation form
                    return $http.get("/v1.0/secmon/collectorset/rawforward/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward Collector GET failed";
                    $log.debug('Response code for RawForward Collector:')
                    $log.debug(response.status)
                })
            .then(function(response) {
                    if (!(!!response)) {
                        return;
                    }
                    $scope.collectorsets = response.data;
                    console.log($scope.collectorsets);
                    for (var j = 0; j < $scope.collectorsets.length; j++) {
                        $scope.collectorsets[j].id = "Collectorset:" + $scope.collectorsets[j].id
                        $scope.collectorsets[j].name = "Collectorset:" + $scope.collectorsets[j].name
                    }
                    console.log('$scope.collectors in association')
                    console.log($scope.collectors)
                    $scope.collectors.push.apply($scope.collectors, $scope.collectorsets)
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward CollectorSet GET failed";
                    $log.debug('Response code for RawForward CollectorSet:')
                    $log.debug(response.status)

                })
            //fetch and populate policy field in create rawforwardassociation form
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

    //function to send rawforwardassociation configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating RawForward Association " + $scope.scope_id.name;

        var data = {
            scope_id: $scope.scope_id.id,
            collector_id: $scope.collector_id.id,
            direction: $scope.direction.id,
            policy_id: $scope.policy_id.id
        };
        $log.debug('Data to be sent for RawForward Association creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/rawforwardassociation/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward Association created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "RawForward Association creation failed";
                $log.debug('Response code for RawForward Association:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateRawforwardCollectorSetController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.algorithms = [
        { id: "1", value: "round_robin" },
        { id: "0", value: "session_based" },
        { id: "2", value: "weighted_round_robin" }
    ];

    $scope.loadData = function() {
        //fetch and populate rawforwardcollector field in create rawforwardcollectorset form
        $http.get("/v1.0/secmon/collector/rawforward/")
            .then(function(response) {
                    $scope.rawforwardcollectors = response.data;
                    $scope.rawforwardcollectors.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "RawForward Collector GET failed";
                    $log.debug('Response code for RawForward Collector:')
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
        $scope.status_msg = "Creating RawForward CollectorSet " + $scope.rawforwardcollectorset_name;
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
            $scope.status_msg = "RawForward CollectorSet creation failed. Total Weight of Collectors is greater than 100";
            return;
        }

        var data = {
            name: $scope.rawforwardcollectorset_name,
            collector_ids: collector_list,
            lb_algo: $scope.lb_algo.id,
            col_type: 'rawforward'
        };
        $log.debug('Data to be sent for RawForward CollectorSet creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/collectorset/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "RawForward CollectorSet created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "RawForward CollectorSet creation failed";
                $log.debug('Response code for RawForward CollectorSet:')
                $log.debug(response.status)
            });
    };
});
