(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['currentUser', 'ProfileService', '$window', 'AuthenticationService'];

    function ProfileController(currentUser, ProfileService, $window, AuthenticationService) {
        var vm = this;
        var originalUser = null;
        vm.message = null;
        vm.abortProfileChanges = abortProfileChanges
        vm.profileEditable = false
        vm.editProfile = editProfile;
        vm.deleteProfile = deleteProfile;
        vm.saveProfileChanges = saveProfileChanges;
        vm.user = currentUser;
        vm.saveProfilePicture = saveProfilePicture;

        // Methode, die das Profil in der View editierbar macht.
        function editProfile() {
            document.getElementById('firstnameInput').focus();
            vm.profileEditable = true;
            originalUser = angular.copy(vm.user);
        }

        // Methode, die die Änderungen im Profil verwirft und das Model wieder auf den alten Wert setzt.
        function abortProfileChanges() {
            vm.profileEditable = false;
            vm.user = originalUser;
        }

        // Methode, die den ProfileService aufruft, um die Änderungen im System zu speichern und den Nutzer im AuthenticationService aktualisiert.
        function saveProfileChanges() {
            return ProfileService.saveProfileChanges(vm.user).then(function (newUser) {
                if (newUser !== undefined || newUser !== null) {
                    vm.user = newUser;
                    AuthenticationService.setCurrentUser(newUser);
                    vm.profileEditable = false;
                    swal("Erfolgreich gespeichrt!", "", "success");
                } else {
                    swal("Interner Serverfehler!", "", "error");
                }
            });
        }

        // Methode, die Den ProfileService aufruft, um den angemeldeten Nutzer aus dem System zu löschen.
        // Löst ein Reload der Seite aus um den Nutzer auf die Registrieren Seite leitet.
        function deleteProfile() {
            swal({
                title: "Soll dieses Profil wirklich gelöscht werden?",
                text: "Das Profil kann nicht wiederhergestellt werden.",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Abbrechen",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Löschen",
                closeOnConfirm: false
                },
                function () {
                    return ProfileService.deleteProfile(vm.user).then(function (result) {
                        AuthenticationService.logout()
                            .then(function (result) {
                                $window.location.reload();
                            })
                    })
                });

        }

        // Methode um das Profilebild abzuspeichern.
        // Erwartet ein Bild als Parameter.
        // Setzt das Bild auf das Scope Object currentUser.
        // Übergibt das Bild an den ProfileService um dieses in der Datenbank zu persistieren.
        // Versteckt den Canvas-Container bei Erfolg und gibt eine Meldung an den Benutzer zurück.
        function saveProfilePicture(img) {
            vm.user.ProfilePicture = img;
            return ProfileService.saveProfilePicture(vm.user).then(function (newUser) {
                vm.user = newUser;
                AuthenticationService.setCurrentUser(newUser);
                vm.profileEditable = false;
            }).then(function() {
                document.getElementById("canvasContainer").className = "hidden";
                document.getElementById("file").value = null;
            })
        }
    }
})();
        

    


    
  
