(function() {
    'use strict';

    angular
        .module('app')
        .directive('adjustContainerChildHeight', adjustContainerChildHeight);

    adjustContainerChildHeight.$inject = ['$window'];

    //Suchen der größten Höhe aller direkt unter element befindliche child Elemente und setzen der Höhe für diese.
    function adjustContainerChildHeight($window) {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {

            var biggestHeight = 0;

            //Suchen der größten Höhe aller direkt unter element befindliche child Elemente. 
            element.find('> *')
                .each(function() {

                    if (angular.element(this)[0].offsetHeight > biggestHeight) {

                        biggestHeight = biggestHeight = angular.element(this)[0].offsetHeight;
                    };
                });

            //Setzen der größten Höhe für alle direkt unter element befindliche child Elemente. 
            element.find('> *')
                .each(function () {
                    angular.element(this).css("height", biggestHeight + "px");
                });
        }
    }

})()