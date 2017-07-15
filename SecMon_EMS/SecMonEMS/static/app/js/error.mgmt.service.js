app.service('ErrMgmtService', function () {
    return {
        showErrorMsg: function (message, resp) {
            el = angular.element( document.querySelector( '#messageBox' ) );
            el.html(message + " (" + resp.statusText + ")");
            setTimeout(function(){ el.toggleClass("displayElement") }, 3000);
            el.toggleClass("displayElement");
        }
    };
});

