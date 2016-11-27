/*(function() {
'use strict';

    angular
        .module('historify.apiservice')
        .factory('evento', evento);

    evento.$inject = ['$http'];
    
    function evento($http) {
       return {
            getData: getData
        };
        
        // LISTA:
        function getData(model){
            var request = {
                method: 'GET',
                url: 'http://api.historify.cl/historicalevent',
                params: {}
            };
            
            return $http(request)
                .then(function(response){
                    return response.data;        
                });
        }
        
        
    }
})();*/