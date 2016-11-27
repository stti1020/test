(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProfileService', ProfileService);

    ProfileService.$inject = ['Restangular', 'AuthenticationService'];

    function ProfileService(Restangular, AuthenticationService) {

        // Alle Funktionen, die der ProfileService bereitstellt.
        var service = {
            saveProfileChanges: saveProfileChanges,
            deleteProfile: deleteProfile,
            saveProfilePicture: saveProfilePicture
        };

        return service;

        // Methode, die die REST-Schnittstelle /api/user/UpdateUser des Back-Ends anspricht, um die Änderungen am Profil im System zu speichern.
        // Übergibt die ID, den Vornamen und den Nachnamen des Nutzers.
        function saveProfileChanges(user) {
            return Restangular.all('api/user/').customPUT({ name: "" }, "UpdateUser",
                { Id: user.Id, FirstName: user.FirstName, LastName: user.LastName });
        }

        // Methode, die die REST-Schnittstelle /api/user/DeleteUser des Back-Ends anspricht, um den angemeldeten Nutzer aus dem System zu löschen.
        // Übergibt die Id des Nutzers.
        function deleteProfile(user) {
            return Restangular.all('api/user/')
                                    .customDELETE("DeleteUser", { Id: user.Id });
        }

        // Methode, die die REST-Schnittstelle /api/user/UpdateProfilePicture des Back-Ends anspricht, um das Profilbild in der Datenbank zu speichern.
        // Setzt den übergebenen Benutzer auf eine lokale Variable im authenticationService.
        function saveProfilePicture(user) {
            AuthenticationService.setCurrentUser(user);
            return Restangular.all('api/user/')
                .customPUT({ Picture: user.ProfilePicture }, "UpdateProfilePicture", { Id: user.Id });
        }
    }
})();