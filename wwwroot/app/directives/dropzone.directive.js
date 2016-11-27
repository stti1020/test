(function() {
    'use strict';

    angular
        .module('app')
        .directive('dropzoneDirective', dropzoneDirective);

    dropzoneDirective.$inject = ['$window'];
    
    function dropzoneDirective ($window) {
        // Usage:
        //     <dropzoneDirective></dropzoneDirective>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();