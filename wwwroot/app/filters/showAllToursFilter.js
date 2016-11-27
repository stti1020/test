(function () {
    'use strict';

    angular
        .module('app')
        .filter('showAllToursFilter', showAllToursFilter);

    showAllToursFilter.$inject = []; 

    function showAllToursFilter() {
        
        return function(items, search) {
            if (search === undefined) {
                return items;
            };

            var result = [];
            var done;

            if (search === "Nein" || search === "Ja") {
                if (search === "Ja") {
                    done = true;
                }
                if (search === "Nein") {
                    done = false;
                }
                angular.forEach(items,function(item) {
                    if (item.Done === done || item.Name.includes(search)) {
                        result.push(item);
                    }
                });
            } else {
                angular.forEach(items, function (item) {
                    if (item.Name.includes(search)) {
                        result.push(item);
                    }
                });
            }

            return result;
        };
    }
})();
