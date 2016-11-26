
(function(){
    'use strict';

    var app = angular.module('historify', []); 
    app.controller('MapController', function ($scope, $http) {

        var newMarker = true;
        var milestone = '../resources/img/milestone.png';
        var milestoneAjeno = '../resources/img/milestoneAjeno.png';
        
        // Obtiene la data de los eventos desde la API 
        $scope.getData = function() {
            var request = {
                method: 'GET',
                url: 'http://api.historify.cl/historicalevent',
                params: {}
            };
            
            return $http(request)
                .then(function(response) {
                    return response.data;
                });
        };

        // Inicializacion del Mapa        
        $scope.initMap = function() {
            $scope.getData()
                .then(function(events) {

                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 18,
                        center: { lat: -33.434678, lng: -70.635780 }
                    });
		        
                    // This event listener calls addMarker() when the map is clicked.
                    google.maps.event.addListener(map, 'click', function(event) {
                        if (newMarker) {
                            addNewMarker(event.latLng, map);
                            newMarker = !newMarker;
                        }
                    });

                    // localizamos todos los eventos en el mapa
                    events.forEach(function(value) {
                        addMarker({ lat: Number.parseFloat(value.lat), lng: Number.parseFloat(value.long) }, map, value.name);
                    })

                });
        }

        // Adds a marker to the map.
        function addMarker(location, map, event) {
            // Add the marker at the clicked location, and add the next-available label
            // from the array of alphabetical characters.
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: milestoneAjeno,
                label: event
            });
        }

        // Adds a new marker to the map.
        function addNewMarker(location, map) {
            // Add the marker at the clicked location, and add the next-available label
            // from the array of alphabetical characters.
            var marker = new google.maps.Marker({
                position: location,
                label: 'nuevo',
                map: map,
                draggable: true,
                icon: milestone
            });
        }

        $scope.initMap();
    });

})();