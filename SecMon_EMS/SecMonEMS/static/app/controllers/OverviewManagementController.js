var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };


app.controller('OverviewManagementController', function($scope, $log, $rootScope, $http, $timeout, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.title = 'Overview';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {};
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    $scope.loadData = function() {
        highlightMgmtLink('overview_mgmt_link');
        //fetch and populate scope data in scope table
        $http.get("/v1.0/secmon/scope/")
            .then(function(response) {
                    $scope.available_scopes = response.data;

                    // now load all the netflow configs and netflow monitors which are dependent on
                    // scopes so if any scope is deleted we should also delete netflow monitors
                    // Note: we might do this server side it needs discussion
                    $http.get("/v1.0/secmon/netflowconfig/")
                        .then(function(response) {
                            $scope.availableNetFlowConfigs = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Config data GET failed.";
                    $log.debug('Response status for NetFlow Config:')
                    $log.debug(response.status)
                    $scope.availableNetFlowConfigs = []
	        });

                    $http.get("/v1.0/secmon/netflowmonitor/")
                        .then(function(response) {
                            $scope.availableNetFlowMonitors = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "NetFlow Monitor data GET failed.";
                    $log.debug('Response status for NetFlow Monitor:')
                    $log.debug(response.status)
		    $scope.availableNetFlowMonitors = []

		});

                    $http.get("/v1.0/secmon/sflowconfig/")
                        .then(function(response) {
                            $scope.availableSflowConfigs = response.data;
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "SFlow Config data GET failed.";
                    $log.debug('Response status for SFlow Config:')
                    $log.debug(response.status)
                    $scope.availableSflowConfigs = []
		});

                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Scope data GET failed.";
                    $log.debug('Response status for Scope:')
                    $log.debug(response.status)
		    $scope.available_scopes = []
                });
        //fetch and populate classificationobject data in classificationobject table
        $http.get("/v1.0/secmon/classificationobject/")
            .then(function(response) {
                    $scope.available_classificationobjects = response.data;
                    for (var i = 0; i < $scope.available_classificationobjects.length; i++) {
                        if ($scope.available_classificationobjects[i].protocol == "1") {
                            $scope.available_classificationobjects[i].protocol = "ICMP";
                        } else if ($scope.available_classificationobjects[i].protocol == "6") {
                            $scope.available_classificationobjects[i].protocol = "TCP";
                        } else if ($scope.available_classificationobjects[i].protocol == "17") {
                            $scope.available_classificationobjects[i].protocol = "UDP";
                        } else if ($scope.available_classificationobjects[i].protocol == "132") {
                            $scope.available_classificationobjects[i].protocol = "SCTP";
                        }
                    }

                    return $http.get("/v1.0/secmon/ruleobject/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Classification Object data GET failed.";
                    $log.debug('Response status for Classification Object:')
                    $log.debug(response.status)
		    $scope.available_classificationobjects = []
                    return $http.get("/v1.0/secmon/ruleobject/");
                })
            //fetch and populate ruleobject data in ruleobject table
            //$http.get("/v1.0/secmon/ruleobject/")
            .then(function(response) {
                    $scope.available_ruleobjects = response.data;
                    $scope.available_ruleobjects.sort(function(a, b) {
                        return a.name > b.name;
                    });

                    for (var i = 0; i < $scope.available_ruleobjects.length; i++) {
                    if($scope.available_ruleobjects[i].truncate_to_size == "0"){
                        $scope.available_ruleobjects[i].truncate_to_size = "Disabled";
                    }
                        if ($scope.available_ruleobjects[i].action == "1") {
                            $scope.available_ruleobjects[i].action = "Forward";
                        } else if ($scope.available_ruleobjects[i].action == "0") {
                            $scope.available_ruleobjects[i].action = "Drop";
                        }
                        for (var j = 0; j < $scope.available_classificationobjects.length; j++) {
                            if ($scope.available_ruleobjects[i].classificationobject_id == $scope.available_classificationobjects[j].id) {
                                $scope.available_ruleobjects[i].classificationobject_id = $scope.available_classificationobjects[j].name;
                                break;
                            }
                        }
                    }
                    console.log($scope);
                    return $http.get("/v1.0/secmon/policy/");
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Rule Object data GET failed.";
                    $log.debug('Response status for Rule Object:')
                    $log.debug(response.status)
		    $scope.available_ruleobjects = []
                    return $http.get("/v1.0/secmon/policy/");
                })
            //fetch and populate policy data in policy table
            //$http.get("/v1.0/secmon/policy/")
            .then(function(response) {
                    $scope.available_policys = response.data;
                    for (var i = 0; i < $scope.available_policys.length; i++) {
                        ruleobject_ids = $scope.available_policys[i].ruleobject_id
                        var ruleobject_ids_list = ruleobject_ids.split(",");
                        $scope.ruleobject_string = ""
                        for (var j = 0; j < ruleobject_ids_list.length; j++) {
                            for (var k = 0; k < $scope.available_ruleobjects.length; k++) {
                                if (ruleobject_ids_list[j] == $scope.available_ruleobjects[k].id) {
                                    if (j == 0) {
                                        $scope.ruleobject_string = $scope.available_ruleobjects[k].name
                                    } else {
                                        $scope.ruleobject_string = $scope.ruleobject_string + ", " + $scope.available_ruleobjects[k].name
                                    }
                                    break;
                                }
                            }
                            $scope.available_policys[i].ruleobject_id = $scope.ruleobject_string
                        }
                    }
                    //}); // end of policy fetching
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Policy data GET failed.";
                    $log.debug('Response status for Policy:')
                    $log.debug(response.status)
		    $scope.available_policys = []

                }); // end of policy fetching
    };

    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        $scope.loadData();
    });

    //function to delete a scope with given id
    $scope.deleteScope = function(ev, cred_scope_name) {

        // finding name of scope to delete corresponding to the scope id
        var deleting_scope_name = "";
        for (var sIndex = 0; sIndex < $scope.available_scopes.length; ++sIndex) {
            if ($scope.available_scopes[sIndex].id === cred_scope_name) {
                deleting_scope_name = $scope.available_scopes[sIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete Scope?')
            .textContent("Deleting " + deleting_scope_name + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));
        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'scope_name': cred_scope_name }
            $http.delete("/v1.0/secmon/scope/" + cred_scope_name + "/").then(
                function(response) {
                    // successfully deleted scope
                    /*
                                        // deleting netflow monitor and netflow config which are dependent on this scope
                                        for (var nmIndex = 0; nmIndex < $scope.availableNetFlowMonitors.length; ++nmIndex) {
                                            if ($scope.availableNetFlowMonitors[nmIndex].scope_id === cred_scope_name) {
                                                $http.delete("/v1.0/secmon/netflowmonitor/" + $scope.availableNetFlowMonitors[nmIndex].id + "/")
                                                    .then(function(response) {});
                                                break;
                                            }
                                        }

                                        for (var ncIndex = 0; ncIndex < $scope.availableNetFlowConfigs.length; ++ncIndex) {
                                            if ($scope.availableNetFlowConfigs[ncIndex].scope_id === cred_scope_name) {
                                                $http.delete("/v1.0/secmon/netflowconfig/" + $scope.availableNetFlowConfigs[ncIndex].id + "/")
                                                    .then(function(response) {});
                                                break;
                                            }
                                        }

                                        for (var scIndex = 0; scIndex < $scope.availableSflowConfigs.length; ++scIndex) {
                                            if ($scope.availableSflowConfigs[scIndex].scope_id === cred_scope_name) {
                                                $http.delete("/v1.0/secmon/sflowconfig/" + $scope.availableSflowConfigs[scIndex].id + "/")
                                                    .then(function(response) {
                                                        console.log("DELETED successfully");
                                                    });
                                                break;
                                            }
                                        }
                    */
                    $http.get("/v1.0/secmon/netflowconfig/scope_id/" + cred_scope_name + "/").then(
                        function(response) {
                            console.log('netflowconfig id')
                            console.log(response.data[0].id)
                            $http.delete("/v1.0/secmon/netflowconfig/" + response.data[0].id + "/").then(
                                function(response) {})
                        })
                    $http.get("/v1.0/secmon/netflowmonitor/scope_id/" + cred_scope_name + "/").then(
                        function(response) {
                            console.log('netflowmonitor id')
                            console.log(response.data[0].id)
                            $http.delete("/v1.0/secmon/netflowmonitor/" + response.data[0].id + "/").then(
                                function(response) {})
                        })
                    $http.get("/v1.0/secmon/sflowconfig/scope_id/" + cred_scope_name + "/").then(
                        function(response) {
                            console.log('sflowconfig id')
                            console.log(response.data[0].id)
                            $http.delete("/v1.0/secmon/sflowconfig/" + response.data[0].id + "/").then(
                                function(response) {})
                        })

                    console.log($scope);
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: Scope deletion failed.", response);
                    $log.debug('Response status for Scope deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a classificationobject with given id
    $scope.deleteClassificationObject = function(ev, cred_classificationobject_name) {

        // getting classification object name corresponding to classification
        // object id
        var deleteClassificationName = "";
        for (var cIndex = 0; cIndex < $scope.available_classificationobjects.length; ++cIndex) {
            if ($scope.available_classificationobjects[cIndex].id === cred_classificationobject_name) {
                console.log("Classification Object Matched");
                deleteClassificationName = $scope.available_classificationobjects[cIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete Classification Object?')
            .textContent("Deleting " + deleteClassificationName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'name': cred_classificationobject_name }
            $http.delete("/v1.0/secmon/classificationobject/" + cred_classificationobject_name + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: ClassificationObject deletion failed.", response);
                    $log.debug('Response status for Classification Object deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a ruleobject with given id
    $scope.deleteRuleObject = function(ev, cred_ruleobject_name) {

        // getting rule object name corresponding to rule object id
        var deleteRuleObjectName = "";
        for (var rIndex = 0; rIndex < $scope.available_ruleobjects.length; ++rIndex) {
            if ($scope.available_ruleobjects[rIndex].id === cred_ruleobject_name) {
                deleteRuleObjectName = $scope.available_ruleobjects[rIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete Rule Object?')
            .textContent("Deleting " + deleteRuleObjectName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = { 'name': cred_ruleobject_name }
            $http.delete("/v1.0/secmon/ruleobject/" + cred_ruleobject_name + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: RuleObject deletion failed.", response);
                    $log.debug('Response status for Rule Object deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete a policy with given id
    $scope.deletePolicy = function(ev, cred_policy_name) {

        // getting policy name corresponding to policy id
        var deletePolicyName = "";
        for (var pIndex = 0; pIndex < $scope.available_policys.length; ++pIndex) {
            if ($scope.available_policys[pIndex].id === cred_policy_name) {
                deletePolicyName = $scope.available_policys[pIndex].name;
            }
        }

        var confirm = $mdDialog.confirm()
            .title('Delete Policy?')
            .textContent("Deleting " + deletePolicyName + ". Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Yes, Delete it!')
            .cancel("No");

        el = angular.element(document.querySelector('#messageBox'));

        $mdDialog.show(confirm).then(function() {
            $http.delete("/v1.0/secmon/policy/" + cred_policy_name + "/").then(
                function(response) {
                    $scope.loadData();
                },
                function(response) {
                    $('html,body').scrollTop(0);
                    ErrMgmtService.showErrorMsg("Error: Policy deletion failed.", response);
                    $log.debug('Response status for Policy deletion:')
                    $log.debug(response.status)
                });
        });
    }

    //function to delete multiple scopes
    $scope.selectedScopeDelete = function(ev) {
        scope_names = Object.keys($scope.selected);
        for (index = 0; index < scope_names.length; ++index) {
            $scope.deleteScope(ev, scope_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple classificationobjects
    $scope.selectedClassificationObjectDelete = function(ev) {
        classificationobject_names = Object.keys($scope.selected);
        for (index = 0; index < classificationobject_names.length; ++index) {
            $scope.deleteClassificationObject(ev, classificationobject_names[index]);
            // console.log($scope);
        }
        $scope.selected = {};
    }

    //function to delete multiple ruleobjects
    $scope.selectedRuleObjectDelete = function(ev) {
        ruleobject_names = Object.keys($scope.selected);
        for (index = 0; index < ruleobject_names.length; ++index) {
            $scope.deleteRuleObject(ev, ruleobject_names[index]);
        }
        $scope.selected = {};
    }

    //function to delete multiple policys
    $scope.selectedPolicyDelete = function(ev) {
        policy_names = Object.keys($scope.selected);
        for (index = 0; index < policy_names.length; ++index) {
            $scope.deletePolicy(ev, policy_names[index]);
        }
        $scope.selected = {};
    }

    //function to perform flush operation
    $scope.flushDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/flush.html',
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

    //function for scope creation
    $scope.createScopeDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_scope.html',
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

    //function for classificationobject creation
    $scope.createClassificationObjectDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_classificationobject.html',
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

    //function for ruleobject creation
    $scope.createRuleObjectDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_ruleobject.html',
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

    //function for policy creation
    $scope.createPolicyDialog = function(ev) {
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/create_policy.html',
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

    //function clalled for scope updation
    $scope.editScope = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_scope.html',
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

    //function called for classificationobject updation
    $scope.editClassificationObject = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_classificationobject.html',
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

    //function called for ruleobject updation
    $scope.editRuleObject = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_ruleobject.html',
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

    //function called for policy updation
    $scope.editPolicy = function(ev, resource1, value1) {
        ScopeService.setProperty(resource1);
        ScopeService.setVal(value1);
        el = angular.element(document.querySelector('.row'));
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/static/views/edit_policy.html',
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

app.controller('FlushController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.loadData = function() {
        //fetch and populate scope field in flush form
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

                });
    };

    $scope.loadData();

    //function to send flush configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Scope " + $scope.scope_id.name + "flush";

        var flush_data = {
            id: "1",
            table_name: "scope",
            row_id: $scope.scope_id.id,
            operation: "FLUSH"
        };
        $log.debug('Data to be sent for Flush:')
        $log.debug(flush_data)
        $http.post("/v1.0/secmon/notification/1/", flush_data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Scope " + $scope.scope_id.name + " flush was successfull";
                console.log($scope);
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Flush operation failed";
                $log.debug('Response code for Flush:')
                $log.debug(response.status)

            });
    }
});

app.controller('CreateScopeController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    // function to send scope configurations to EMS server, on success creates and send
    // netflow config data, netflow monitor data and sflow config data to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating Scope " + $scope.scope_name;

        var scope_data = {
            name: $scope.scope_name,
            netflowstatus: $scope.netflowstatus,
            rawforwardstatus: $scope.rawforwardstatus,
            sflowstatus: $scope.sflowstatus
        };
        $log.debug('Data to be sent for Scope creation:')
        $log.debug(scope_data)
        $http.post("/v1.0/secmon/scope/", scope_data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Scope " + $scope.scope_name + " created successfully";

                var netflowconfig_data = {
                    scope_id: response.data.id,
                    active_timeout: 60,
                    inactive_timeout: 60,
                    refresh_rate: 60,
                    timeout_rate: 60,
                    maxflows: 60
                };
                $http.post("/v1.0/secmon/netflowconfig/", netflowconfig_data).then(
                    function(response) {
                        $scope.show_prog_bar = false;
                        $rootScope.$emit('scope-operation');
                        $scope.show_success_icon = true;
                        $scope.show_err_icon = false;
                        // $scope.status_msg = "Netflow Config for scope " + $scope.scope_name + " created successfully";
                    },
                    function(response) {
                        $scope.show_prog_bar = false;
                        $scope.show_err_icon = true;
                        $scope.show_success_icon = false;
                        $scope.status_msg = "Netflow Config creation failed. Please contact the administrator.";
                        $log.debug('Response code for Netflow Config:')
                        $log.debug(response.status)
                    });

                var netflowmonitor_data = {
                    scope_id: response.data.id,
                    match_fields: "ND",
                    collect_fields: "ND"
                };
                $log.debug('Data to be sent for Netflow Monitor creation:')
                $log.debug(netflowmonitor_data)
                $http.post("/v1.0/secmon/netflowmonitor/", netflowmonitor_data).then(
                    function(response) {
                        $scope.show_prog_bar = false;
                        $rootScope.$emit('scope-operation');
                        $scope.show_success_icon = true;
                        $scope.show_err_icon = false;
                        // $scope.status_msg = "Netflow Monitor for scope " + $scope.scope_name + " created successfully";
                    },
                    function(response) {
                        $scope.show_prog_bar = false;
                        $scope.show_err_icon = true;
                        $scope.show_success_icon = false;
                        $scope.status_msg = "Netflow Monitor creation failed. Please contact the administrator.";
                        $log.debug('Response code for Netflow Monitor:')
                        $log.debug(response.status)
                    });

                var sflowconfig_data = {
                    scope_id: response.data.id,
                    agent_ip: "0.0.0.0",
                    agent_subid: 0,
                    sampling_rate: 20,
                    truncate_to_size: 128
                };
                $log.debug('Data to be sent for Sflow Config creation:')
                $log.debug(sflowconfig_data)
                $http.post("/v1.0/secmon/sflowconfig/", sflowconfig_data).then(
                    function(response) {
                        $scope.show_prog_bar = false;
                        $rootScope.$emit('scope-operation');
                        $scope.show_success_icon = true;
                        $scope.show_err_icon = false;
                        // $scope.status_msg = "Sflow Config for scope " + $scope.scope_name + " created successfully";
                    },
                    function(response) {
                        $scope.show_prog_bar = false;
                        $scope.show_err_icon = true;
                        $scope.show_success_icon = false;
                        $scope.status_msg = "Sflow Config creation failed";
                        $log.debug('Response code for Sflow Config:')
                        $log.debug(response.status)
                    });
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Scope creation failed";
                $log.debug('Response code for Scope:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateClassificationObjectController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.protocol_id = { id: 1, value: "ICMP" }
    $scope.protocols = [
        { id: 1, value: "ICMP" },
        { id: 6, value: "TCP" },
        { id: 17, value: "UDP" },
        { id: 132, value: "SCTP" }
    ];
    $scope.src_ip = "0.0.0.0"
    $scope.src_mac = "*"
    $scope.src_ip_subnet = 0
    $scope.minimum_src_port = 1
    $scope.maximum_src_port = 65535
    $scope.dst_ip = "0.0.0.0"
    $scope.dst_mac = "*"
    $scope.dst_ip_subnet = 0
    $scope.minimum_dst_port = 1
    $scope.maximum_dst_port = 65535

    //function to send classificationobject configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating Classification Object " + $scope.classificationobject_name;

        var data = {
            name: $scope.classificationobject_name,
            src_ip: $scope.src_ip,
            src_mac: $scope.src_mac,
            src_ip_subnet: $scope.src_ip_subnet,
            minimum_src_port: $scope.minimum_src_port,
            maximum_src_port: $scope.maximum_src_port,
            dst_ip: $scope.dst_ip,
            dst_mac: $scope.dst_mac,
            dst_ip_subnet: $scope.dst_ip_subnet,
            minimum_dst_port: $scope.minimum_dst_port,
            maximum_dst_port: $scope.maximum_dst_port,
            protocol: $scope.protocol_id.id,
        };

        $log.debug('Data to be sent for Classification Object creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/classificationobject/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Classification Object " + $scope.classificationobject_name + " created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Classification Object creation failed";
                $log.debug('Response code for Classification Object:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreateRuleObjectController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.action = { id: 1, value: "Forward" }
    $scope.actions = [
        { id: 1, value: "Forward" },
        { id: 0, value: "Drop" }
    ];
    $scope.priority = 1
    $scope.truncate_to_size = 0
    $scope.loadData = function() {
        //fetch and populate classificationobject data in create ruleobject form
        $http.get("/v1.0/secmon/classificationobject/")
            .then(function(response) {
                    $scope.classificationobjects = response.data;
                    $scope.classificationobjects.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Classification Object GET failed";
                    $log.debug('Response code for Clasification Object:')
                    $log.debug(response.status)

                });
    };

    $scope.loadData();

    //function to send ruleobject configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating Rule Object " + $scope.ruleobject_name;

        var data = {
            name: $scope.ruleobject_name,
            classificationobject_id: $scope.classificationobject_id.id,
            priority: $scope.priority,
            truncate_to_size: $scope.truncate_to_size,
            action: $scope.packet_action.id
        };
        $log.debug('Data to be sent for Rule Object creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/ruleobject/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Rule Object " + $scope.ruleobject_name + " created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Rule Object creation failed";
                $log.debug('Response code for Rule Object:')
                $log.debug(response.status)
            });
    };
});

app.controller('CreatePolicyController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.loadData = function() {
        //fetch and populate ruleobject field in create policy form
        $http.get("/v1.0/secmon/ruleobject/")
            .then(function(response) {
                    $scope.ruleobjects = response.data;
                    $scope.ruleobjects.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Rule Object GET failed";
                    $log.debug('Response code for Rule Object:')
                    $log.debug(response.status)

                })
    };
    $scope.loadData();

    //function to send policy configurations to EMS server
    $scope.submit = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Creating Policy " + $scope.policy_name;
        var ruleobject_id_string = "";
        for (var i = 0; i < $scope.ruleobject_id.length; i++) {
            if (i == 0) {
                ruleobject_id_string = $scope.ruleobject_id[i].id
            } else {
                ruleobject_id_string = ruleobject_id_string + ',' + $scope.ruleobject_id[i].id
            }
        }
        var data = {
            name: $scope.policy_name,
            ruleobject_id: ruleobject_id_string
        };
        $log.debug('Data to be sent for Policy creation:')
        $log.debug(data)
        $http.post("/v1.0/secmon/policy/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Policy " + $scope.policy_name + " created successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Policy creation failed";
                $log.debug('Response code for Policy:')
                $log.debug(response.status)
            });
    };
});
