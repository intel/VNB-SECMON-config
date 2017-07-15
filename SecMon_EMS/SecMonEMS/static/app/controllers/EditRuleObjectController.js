var app = angular.module('secmon');
var http_headers = { headers: { 'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json' } };

app.controller('EditRuleObjectController', function($scope, $log, $rootScope, $http, $mdDialog, $mdMedia, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.resource1 = ScopeService.getProperty();
    $scope.ruleobject_id = ScopeService.getVal();
    $scope.actions = [
        { id: 1, value: "Forward" },
        { id: 0, value: "Drop" }
    ];
    $scope.loadData = function() {
        //fetch and populate classificationobject field in ruleobject edit form
        $http.get("/v1.0/secmon/classificationobject/")
            .then(function(response) {
                    $scope.classificationobjects = response.data;
                    $scope.classificationobjects.sort(function(a, b) {
                        return a.name > b.name;
                    });
                    //});
                    //fetch and populate ruleobject data in edit form
                    $http.get("/v1.0/secmon/ruleobject/" + $scope.ruleobject_id + "/")
                        .then(function(response) {
                                $scope.available_ruleobjects = response.data;
                                $scope.ruleobject_name = $scope.available_ruleobjects.name
                                $scope.ruleobject_id = $scope.available_ruleobjects.id
                                $scope.classificationobj = $scope.available_ruleobjects.classificationobject_id
                                $scope.priority = $scope.available_ruleobjects.priority
                                $scope.truncate_to_size = $scope.available_ruleobjects.truncate_to_size
                                if ($scope.available_ruleobjects.action == "1") {
                                    $scope.packet_action = { id: 1, value: "Forward" };
                                } else if ($scope.available_ruleobjects.action == "0") {
                                    $scope.packet_action = { id: 0, value: "Drop" };
                                }
                            },
                            function(response) {
                                $scope.show_prog_bar = false;
                                $scope.show_err_icon = true;
                                $scope.show_success_icon = false;
                                $scope.status_msg = "Rule Object get failed.";
                                $log.debug('Response status for Rule Object:')
                                $log.debug(response.status)

                            }); // end of fetching rule object
                },
                function(response) {
                    $scope.show_prog_bar = false;
                    $scope.show_err_icon = true;
                    $scope.show_success_icon = false;
                    $scope.status_msg = "Classification Object get failed.";
                    $log.debug('Response status for Classification Object:')
                    $log.debug(response.status)

                }); // end of fetching classification object
    };

    $scope.loadData();

    //function to execute PUT request for updated data
    $scope.add = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Adding Rule Object " + $scope.ruleobject_name;

        console.log("put request in editform", $scope);
        var data = {
            name: $scope.ruleobject_name,
            classificationobject_id: $scope.classificationobject_id.id,
            priority: $scope.priority,
            truncate_to_size: $scope.truncate_to_size,
            action: $scope.packet_action.id
        };

        $log.debug('Updated Rule Object data to send:')
        $log.debug(data)
        $http.put("/v1.0/secmon/ruleobject/" + $scope.ruleobject_id + "/", data).then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Rule Object " + $scope.ruleobject_name + " is updated successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Rule Object updation failed.";
            });
    };

    //function to DELETE ruleobject
    $scope.remove = function() {
        $scope.show_prog_bar = true;
        $scope.show_form_elements = false;

        $scope.show_status_msgs = true;
        $scope.show_err_icon = false;
        $scope.show_success_icon = false;
        $scope.status_msg = "Removing ruleobject " + $scope.ruleobject_name;

        var data = {};

        $log.debug('Id of Rule Object to delete:')
        $log.debug($scope.ruleobject_id)
        $http.delete("/v1.0/secmon/ruleobject/" + $scope.ruleobject_id + "/").then(
            function(response) {
                $scope.show_prog_bar = false;
                $rootScope.$emit('scope-operation');
                $scope.show_success_icon = true;
                $scope.show_err_icon = false;
                $scope.status_msg = "Rule Object " + $scope.ruleobject_name + " is removed successfully";
            },
            function(response) {
                $scope.show_prog_bar = false;
                $scope.show_err_icon = true;
                $scope.show_success_icon = false;
                $scope.status_msg = "Removing ruleobject failed.";
            });
    };
});
