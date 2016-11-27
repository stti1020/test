(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['Restangular'];

    function AuthenticationService(Restangular) {
        var currentUser;

        // Alle Funktionen, die der AuthenticationService bereitstellt.
        var authentication = {
            getCurrentUser: getCurrentUser,
            setCurrentUser: setCurrentUser,
            fetchCurrentUser : fetchCurrentUser,
            logout: logout
        };
        
        return authentication;

        // Methode, die die REST-Schnittstelle /controllers/Account/GetCurrentUser des Back-Ends anspricht, um den aktuell angemeldeten Nutzer zu erhalten.
        // Speichert den erhaltenen Nutzer in einer private Variablen innerhalb des Services.
        function fetchCurrentUser() {
            return Restangular.all('/controllers/account/').customGET("GetCurrentUser").then(function (user) {
                return currentUser = user;
            })
        }

        // Methode, um den aktuellen Nutzer des Services zu erhalten.
        function getCurrentUser() {
            return currentUser;
        }

        // Methode um den aktuellen Nutzer des Services zu ändern.
        function setCurrentUser(user) {
            this.currentUser = user;
        }

        // Methode, die die REST-Schnittstelle /controllers/Account/LogOff des Back-Ends anspricht,um den angemeldeten Nutzer vom System abzumelden.
        function logout() {
            return Restangular.all('/controllers/account/').customPOST({ name: "" }, "LogOff");
        }
    }
})();