var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditPolicyController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.policy_id = ScopeService.getVal();
    $scope.loadData = function() {
        //fetch and populate ruleobject field in policy edit form
        $http.get("/v1.0/secmon/ruleobject/")
            .then(function(response) {
                    $scope.ruleobjects = response.data;
                    console.log($scope.ruleobjects);
                    //})
                    //fetch and populate data for policy in edit form
                    $http.get("/v1.0/secmon/policy/" + $scope.policy_id + "/")
                        .then(function(response) {
                                $rootScope.ruleobjects_list = []
                                $scope.available_policys = response.data;
                                $scope.policy_id = $scope.available_policys.id
                                $scope.policy_name = $scope.available_policys.name
                                var ruleobject_ids_list = $scope.available_policys.ruleobject_id.split(",")
                                for (var i = 0; i < ruleobject_ids_list.length; i++) {
                                    for (var j = 0; j < $scope.ruleobjects.length; j++) {
                                        if (ruleobject_ids_list[i] == $scope.ruleobjects[j].id) {
                                            $rootScope.ruleobjects_list.push($scope.ruleobjects[j])
                                            break;
                                        }
                                    }
                                }
                                $scope.ruleobject_id = $rootScope.ruleobjects_list
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "Policy get failed.";
                                $log.debug('response status for Policy:')
                                $log.debug(response.status)

                            }); // end of fetching policy
                    $scope.ruleobjects.sort(function(a, b) {
                        return a.name > b.name;
                    });
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Ruleobject get failed.";
                    $log.debug('response status for Ruleobject:')
                    $log.debug(response.status)

                }); // end of fetching rule objects
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding policy " + $scope.policy_name;

        var ruleobject_id_string = ""
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

        $log.debug('Updated Policy data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/policy/" + $scope.policy_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Policy " + $scope.policy_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Policy updation failed.";
            });
    };

    //function to DELETE policy
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing policy " + $scope.policy_name;

        var data = {};
        $log.debug('Id of Policy to delete:')
        $log.debug($scope.policy_id)
        $http.delete("/v1.0/secmon/policy/" + $scope.policy_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Policy " + $scope.policy_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing policy failed.";
            });
    };
});
