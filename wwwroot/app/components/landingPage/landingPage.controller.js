(function() {
    'use strict';

    angular.module('app')
        .controller('LandingPageController', LandingPageController);

    LandingPageController.$inject = [];


    function LandingPageController() {
        var vm = this;

        // Elemente die auf der Startseite angezeigt werden
        vm.elements = [
            {
                name: "Echtzeitkarte",
                imageSource: "images/EchtzeitKartenansichts_Beispiel.PNG",
                href: "Map"
            },
            {
                name: "Fahrzeugverwaltung",
                imageSource: "images/Fahrzeugverwaltung_Beispiel.PNG",
                href: "VehicleManagement"
            },
            {
                name: "Tourenverwaltung",
                imageSource: "images/Tourenverwaltung_Beispiel.PNG",
                href: "TourManagement"
            },
            {
                 name: "Routenverwaltung",
                 imageSource: "images/Tourenverwaltung_Beispiel.PNG",
                 href: "RouteManagement"
             },
            {
                name: "Profilverwaltung",
                imageSource: "images/Benutzerverwaltung_BeispielPNG.PNG",
                href: "Profile"
            }
        ]
    }
})();
