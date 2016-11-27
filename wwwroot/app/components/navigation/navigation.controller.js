(function () {
    'use strict';

    angular
        .module('app')
        .controller('NavigationController', NavigationController);

    NavigationController.$inject = ['$location', 'AuthenticationService', '$window','$scope'];

    function NavigationController($location, AuthenticationService, $window, $scope) {

        var vm = this;
        vm.getIfActive = getIfActive;
        vm.logout = logout;
        vm.currentUser;

        // Initial den aktuell angemeldeten Benutzer aus dem Back-End laden und im Front-End abspeichern.
        // Auf lokale Variable currentUser setzen damit dessen Details in der Navigation angezeigt werden können.
        AuthenticationService.fetchCurrentUser()
            .then(function (user) {
                vm.currentUser = user;
            });
        // Methode um den ausgewählten Tab in der Navigation zu highlighten.
        // Setzt die CSS-Klasse 'active' auf das Element
        function getIfActive(path) {
           return ($location.path().substr(0, path.length) === path) ? 'active' : '';
        }

        // Methode um den aktuellen Benutzer vom System abzumelden.
        // Reload der Seite damit der Benutzer auf die Login Seite geleitet wird.
        function logout() {
            AuthenticationService.logout()
                .then(function (result) {
                    $window.location.reload();
                });
        }

        // Watcher, der das Objekt currentUser innerhalb des AuthenticationServices beobachtet und bei Änderung
        // die lokale Variable currentUser aktualisiert, damit das Bild in der Navigation synchron geändert wird sobald ein neues Bild hochgeladen wird.
        $scope.$watch(function() {
            return AuthenticationService.currentUser;
        }, function(newVal, oldVal) {
            vm.currentUser = newVal;
        }, true);
    };
})();
