angular.module('myApp.servicesa', [], function($provide){

    $provide.factory('pageService',function($q, $http){

        return {
            get: function (id, url) {
                var items, deferred;

                deferred = $q.defer();

                $http.get((url || configuration.ITEMS_URL)).
                    success(function (data, status, headers, config) {
                        var result;
                        if (id) {
                            angular.forEach(data, function (obj, index) {
                                if (obj.id === id) {
                                    result = obj;
                                }
                            });
                        } else {
                            result = data;
                        }
                        deferred.resolve(result);
                    }).
                    error(function (data, status, headers, config) {
                        console.error(data, status, headers, config);
                        deferred.reject(data);
                    });

                return deferred.promise;
            }
        }

    })
});