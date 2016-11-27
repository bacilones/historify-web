(function() {

    'use strict';
    angular.module('historify', ['historify.core'])

        .config(function($stateProvider, $urlRouterProvider) {

            $stateProvider.state({
                name        : 'home',
                url         : '/home',
                templateUrl : './templates/home.html',
                controller  : 'HomeController'
            });

            $stateProvider.state({
                name        : 'home.map',
                url         : '/map',
                templateUrl : './templates/map.html',
                controller  : 'MapController'
            });

            $urlRouterProvider.otherwise('/home/map');
        })



        .controller('MapController', function($scope, $http, $uibModal) {

            $scope.addNewEventModal = function () {
                $uibModal.open({
                  animation    : true,
                  templateUrl  : './templates/addEvent.html',
                  controller   : function($scope, $uibModalInstance) {
                    $scope.cancel = function() {
                        $uibModalInstance.close();
                    };
                  },
                  size         : 'sm',
                  backdrop     : true,
                  keyboard     : true
                });
            };

            $scope.addNewPointOfViewModal = function () {
            };

            function CenterControl(controlDiv, map) {
              // Set CSS for the control border.
              var controlUI = document.createElement('div');
              controlUI.style.backgroundColor = '#6fcb9f';
              controlUI.style.border = '2px solid #6fcb9f';
              controlUI.style.borderRadius = '50px';
              controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
              controlUI.style.cursor = 'pointer';
              controlUI.style.marginTop = '100px';
              console.log(controlUI.style);

              controlUI.style.alignSelf = 'right';
              // controlUI.style.textAlign = 'center';
              controlUI.title = 'Click to recenter the map';
              controlDiv.appendChild(controlUI);

              // Set CSS for the control interior.
              var controlText = document.createElement('div');
              controlText.style.color = 'rgb(25,25,25)';
              controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
              controlText.style.fontSize = '35px';
              controlText.style.lineHeight = '38px';
              controlText.style.paddingLeft = '10px';
              controlText.style.paddingRight = '10px';
              controlText.innerHTML = '+';
              controlUI.appendChild(controlText);

              // Setup the click event listeners: simply set the map to Chicago.
              controlUI.addEventListener('click', function() {
                $scope.addNewEventModal();
              });

            }

            $scope.markers = [];
            $scope.labels = [];

            $scope.removeAllMarkers = function() {
                $scope.markers.forEach(mark => {
                    mark.setMap(null);
                });
                $scope.markers = [];
            };

            $scope.removeAllLabels = function () {
                $scope.labels.forEach(label => {
                    label.setMap(null);
                });
                $scope.labels = [];
            };


            $scope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: {
                    lat: -33.434678,
                    lng: -70.635780
                }
            });

            var centerControlDiv = document.createElement('div');
            var centerControl = new CenterControl(centerControlDiv, map);

            centerControlDiv.index = 1;

            $scope.map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

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
                            map: $scope.map,
                            icon : './resources/img/historical_event_marker.png'
                        });

                        var mapLabel = new MapLabel({
                           text: mark.name,
                           position: new google.maps.LatLng(mark.lat,mark.long),
                           map: $scope.map,
                           fontSize: 15,
                           fontColor : '#232324',
                           strokeWeight: 2,
                           align: 'center'
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
                                    $scope.removeAllLabels();
                                    result.data.point_of_views.forEach(pov => {

                                        var povMarker = new google.maps.Marker({
                                            position: {
                                                lat: parseFloat(pov.lat),
                                                lng: parseFloat(pov.long)
                                            },
                                            map   : $scope.map,
                                            icon  : './resources/img/point_of_view.png'
                                        });

                                        var povLabel = new MapLabel({
                                           text: pov.title,
                                           position: new google.maps.LatLng(pov.lat, pov.long),
                                           map: $scope.map,
                                           fontSize: 15,
                                           fontColor : '#232324',
                                           strokeWeight: 2,
                                           align: 'center'
                                        });

                                        var markerInfoWindow = new google.maps.InfoWindow({
                                            content : pov.content
                                        });

                                        povMarker.addListener('click', function () {
                                            markerInfoWindow.open($scope.map, povMarker);
                                        });

                                        $scope.labels.push(povLabel);
                                        $scope.markers.push(povMarker);
                                    });

                                    var mainMarker = new google.maps.Marker({
                                        position: {
                                            lat: parseFloat(result.data.lat),
                                            lng: parseFloat(result.data.long)
                                        },
                                        map: $scope.map,
                                        icon : './resources/img/historical_event_marker.png'
                                    });

                                    var mainLabel = new MapLabel({
                                       text: result.data.name,
                                       position: new google.maps.LatLng(result.data.lat, result.data.long),
                                       map: $scope.map,
                                       fontSize: 15,
                                       fontColor : '#232324',
                                       strokeWeight: 2,
                                       align: 'center'
                                    });

                                    $scope.map.setZoom(13);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        });

                        $scope.markers.push(marker);
                        $scope.labels.push(mapLabel);
                    });
                    console.log('markers -->', $scope.markers);
                })
                .catch(err => {
                    console.log(err);
                });
        })

        .controller('HomeController', function($scope) {
            console.log('home');
        });
})();