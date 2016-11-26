
(function(){
    'use strict';

    var app = angular.module('historify', []); 
    app.controller('MapController', function ($scope) {

        $scope.texto = 'y la wea';
        
        $scope.events = [
            ['example 1', -33.434678, -70.635780, 18],
            ['example 2', -33.434778, -70.635880, 18],
            ['example 3', -33.434878, -70.635980, 18],
            ['example 4', -33.434978, -70.636080, 18]
        ];

        $scope.newMarker = true;
        $scope.milestone = './milestone.png';
        $scope.milestoneAjeno = './milestoneAjeno.png';

        // This example adds a marker to indicate the position of USS,
        $scope.initMap = function(){
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: { lat: -33.434678, lng: -70.635780 }
            });
        
            // This event listener calls addMarker() when the map is clicked.
            google.maps.event.addListener(map, 'click', function (event) {
                if (newMarker) {
                    addNewMarker(event.latLng, map);
                    newMarker = !newMarker;
                }
            });

            // localizamos todos los eventos en el mapa
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                addMarker({ lat: event[1], lng: event[2] }, map, event[0]);
                console.log('eventos', event);
            }
        }

        $scope.initMap();
    });

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

    // Adds a marker to the map.
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

})();