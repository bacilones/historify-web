(function() {
    'use strict';

    angular.module('historify', ['historify.core'])
        .controller('MapController', function($scope, $http) {
            $scope.markers = [];

            $scope.removeAllMarkers = function() {
                $scope.markers.forEach(mark => {
                    mark.setMap(null);
                });
                $scope.markers = [];
            };

            $scope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 17,
                center: {
                    lat: -33.434678,
                    lng: -70.635780
                }
            });

            var request = {
                method: 'GET',
                url   : 'http://api.historify.cl/historicalevent',
                params : {}
            };

            $http(request)
                .then(result => {
                    result.data.forEach(mark => {

                       var marker = new google.maps.Marker({
                            position: {
                                lat: parseFloat(mark.lat),
                                lng: parseFloat(mark.long)
                            },
                            label : mark.name,
                            map: $scope.map,
                            icon : './resources/img/historical_event_marker.png'
                        });

                        marker.addListener('click', function () {
                            console.log('marker presed', mark.id);

                            var request = {
                                method: 'GET',
                                url   : `http://api.historify.cl/historicalevent/${mark.id}`
                            };

                            $http(request)
                                .then(result => {
                                    $scope.removeAllMarkers();
                                    result.data.point_of_views.forEach(pov => {

                                        var povMarker = new google.maps.Marker({
                                            position: {
                                                lat: parseFloat(pov.lat),
                                                lng: parseFloat(pov.long)
                                            },
                                            label : pov.title,
                                            map   : $scope.map,
                                            icon  : './resources/img/point_of_view.png'
                                        });

                                        var markerInfoWindow = new google.maps.InfoWindow({
                                            content : pov.content
                                        });

                                        povMarker.addListener('click', function () {
                                            markerInfoWindow.open($scope.map, povMarker);
                                        });

                                        $scope.markers.push(povMarker);
                                    });

                                    var mainMarker = new google.maps.Marker({
                                        position: {
                                            lat: parseFloat(result.data.lat),
                                            lng: parseFloat(result.data.long)
                                        },
                                        label : result.data.name,
                                        map: $scope.map,
                                        icon : './resources/img/historical_event_marker.png'
                                    });

                                    $scope.map.setZoom(15);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        });

                        $scope.markers.push(marker);
                    });

                    console.log('markers -->', $scope.markers);
                })
                .catch(err => {
                    console.log(err);
                });
        });
})();