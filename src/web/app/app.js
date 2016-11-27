(function(){
    'use strict';

    angular.module('historify', ['historify.core','uiGmapgoogle-maps','ngGeolocation'])
        .controller('MapController', function($scope, uiGmapGoogleMapApi, $geolocation){
            $scope.map = {center: {
                latitude: -33.0,
                longitude: -70.0
            }, zoom: 16};
            console.log('Se ejecuta la mierda');
            $geolocation.getCurrentPosition(
                {
                    timeout: 60000
                }
            ).then(function(position){
                console.log(position);
                $scope.map = { center: 
                                        {latitude: position.coords.latitude,
                                            longitude: position.coords.longitude
                                        }, 
                               zoom: 16 };
            });
        });

})();
/*
(function(){
    'use strict';

    var app = angular.module('historify', ['uiGmapgoogle-maps', 'satellizer'])
        .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
            GoogleMapApi.configure({
                key: 'AIzaSyDbVhxwEY-MeBCZ_Guk-pl7tqljbAwh5sM',
                v: '3',
                libraries: 'weather,geometry,visualization'
            });
            //console.log(GoogleMapApi);
        }])
        .config(function ($authProvider) {
            $authProvider.facebook({
                clientId: '1612734245701460'
            });
        });

    app.controller('MapController', function ($scope, $http, uiGmapGoogleMapApi) {

        uiGmapGoogleMapApi.then(function (maps) {
            console.log('maps',maps);
        });

        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        
        console.log('$scope.map', $scope.map);

        var newMarker = true;
        var milestone = '../resources/img/milestone.png';
        var milestoneAjeno = '../resources/img/milestoneAjeno.png';
        
        // Obtiene la data de los eventos desde la API 
        $scope.getData = function () {
            var request = {
                method: 'GET',
                url: 'http://api.historify.cl/historicalevent',
                params: {}
            };
            
            return $http(request)
                .then(function (response) {
                    return response.data;
                });
        };

        // // Inicializacion del Mapa        
        // $scope.initMap = function() {
        //     $scope.getData()
        //         .then(function(events) {

        //             var map = new google.maps.Map(document.getElementById('map'), {
        //                 zoom: 18,
        //                 center: { lat: -33.434678, lng: -70.635780 }
        //             });
		        
        //             // This event listener calls addMarker() when the map is clicked.
        //             google.maps.event.addListener(map, 'click', function(event) {
        //                 if (newMarker) {
        //                     addNewMarker(event.latLng, map);
        //                     newMarker = !newMarker;
        //                 }
        //             });

        //             // localizamos todos los eventos en el mapa
        //             events.forEach(function(value) {
        //                 addMarker({ lat: Number.parseFloat(value.lat), lng: Number.parseFloat(value.long) }, map, value.name);
        //             })

        //         });
        // }

        // // Adds a marker to the map.
        // function addMarker(location, map, event) {
        //     // Add the marker at the clicked location, and add the next-available label
        //     // from the array of alphabetical characters.
        //     var marker = new google.maps.Marker({
        //         position: location,
        //         map: map,
        //         icon: milestoneAjeno,
        //         label: event
        //     });
        // }

        // // Adds a new marker to the map.
        // function addNewMarker(location, map) {
        //     // Add the marker at the clicked location, and add the next-available label
        //     // from the array of alphabetical characters.
        //     var marker = new google.maps.Marker({
        //         position: location,
        //         label: 'nuevo',
        //         map: map,
        //         draggable: true,
        //         icon: milestone
        //     });
        // }


    });

})();*/