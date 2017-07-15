var app = angular.module('secmon');
var http_headers = { headers: {'X-Auth-Token': "9c198186-dbcf-3f8a-4d7d-0ebc97c8a80b", 'Content-Type': 'application/json'}};
      
app.service('ScopeService', function () {
    var property = '';
    var key = "key"; 
    var val = "val"; 

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        },
        getKey: function() {
            return key; 
        },
        setKey: function(value) {
            key = value; 
        },
        getVal: function() {
            return val; 
        }, 
        setVal: function(value) {
            val = value; 
        }
    };
});

