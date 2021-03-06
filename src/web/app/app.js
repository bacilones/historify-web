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

        .controller('MapController', function($scope, $http, $uibModal, $rootScope) {

            $scope.markers = [];
            $scope.labels = [];
            $scope.isInPovView = false;

            // Map init
            $rootScope.map = $scope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: {
                    lat: -33.434678,
                    lng: -70.635780
                },
                styles: [
                    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                    {
                      featureType: 'administrative.locality',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#d59563'}]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#d59563'}]
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'geometry',
                      stylers: [{color: '#263c3f'}]
                    },
                    {
                      featureType: 'poi.park',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#6b9a76'}]
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry',
                      stylers: [{color: '#38414e'}]
                    },
                    {
                      featureType: 'road',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#212a37'}]
                    },
                    {
                      featureType: 'road',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#9ca5b3'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry',
                      stylers: [{color: '#746855'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'geometry.stroke',
                      stylers: [{color: '#1f2835'}]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#f3d19c'}]
                    },
                    {
                      featureType: 'transit',
                      elementType: 'geometry',
                      stylers: [{color: '#2f3948'}]
                    },
                    {
                      featureType: 'transit.station',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#d59563'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'geometry',
                      stylers: [{color: '#17263c'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.fill',
                      stylers: [{color: '#515c6d'}]
                    },
                    {
                      featureType: 'water',
                      elementType: 'labels.text.stroke',
                      stylers: [{color: '#17263c'}]
                    }
                  ]
            });

            // Open new pov modal
            $scope.addNewPointOfViewModal = function (position) {
               var modalInstance = $uibModal.open({
                  animation    : true,
                  templateUrl  : './templates/addNewPointOfView.html',
                  controller   : function($scope, $uibModalInstance, position, $http) {

                    $scope.newPov = {};
                    $scope.newPov.lat = position.lat();
                    $scope.newPov.long = position.lng();
                    $scope.newPov.user_id = 1;
                    $scope.newPov.title = '';
                    $scope.newPov.content = '';

                    $scope.createEvent  = function () {

                      var request = {
                          method: 'POST',
                          url   : 'http://api.historify.cl/historicalevent/1/pov',
                          params : $scope.newPov
                      };

                      $http.post(request.url, $scope.newPov)
                        .then(result => {
                          // Here
                          var newMarker = new google.maps.Marker({
                              position: position,
                              map  : $scope.map,
                              icon : './resources/img/point_of_view.png'
                          });

                          var mapLabel = new MapLabel({
                             text         : result.data.title,
                             position     : new google.maps.LatLng(result.data.lat, result.data.long),
                             map          : $rootScope.map,
                             fontSize     : 15,
                             fontColor    : '#ffffff',
                             fontFamily   : 'Raleway, sans-serif',
                             strokeWeight : 0,
                             align        : 'center'
                          });

                          newMarker.addListener('click', function () {

                            var centerControlDiv = document.createElement('div');
                            var centerControl = new CenterControl(centerControlDiv, map);

                            centerControlDiv.index = 1;

                            $scope.isInPovView = true;

                            $scope.map.controls[1].push(centerControlDiv);

                            $scope.isInPovView = true;

                            var request = {
                                method: 'GET',
                                url   : `http://api.historify.cl/historicalevent/${result.data.id}`
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
                                           fontColor : '#ffffff',
                                           fontFamily   : 'Raleway, sans-serif',
                                           strokeWeight: 0,
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
                                       fontColor : '#ffffff',
                                       fontFamily   : 'Raleway, sans-serif',
                                       strokeWeight: 0,
                                       align: 'center'
                                    });

                                    $scope.map.setZoom(13);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                          });

                          $uibModalInstance.close();
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.close();
                    };
                  },
                  size         : 'sm',
                  backdrop     : true,
                  keyboard     : true,
                  resolve      : {
                    position : position
                  }
                });
            };


            // Open add event modal
            $scope.addNewEventModal = function (position) {
                var modalInstance = $uibModal.open({
                  animation    : true,
                  templateUrl  : './templates/addEvent.html',
                  controller   : function($scope, $uibModalInstance, position, $http) {

                    $scope.newEvent = {};
                    $scope.newEvent.lat = position.lat();
                    $scope.newEvent.long = position.lng();
                    $scope.newEvent.user_id = 1;
                    $scope.newEvent.large_description = '';

                    $scope.createEvent  = function () {

                      var request = {
                          method: 'POST',
                          url   : 'http://api.historify.cl/historicalevent',
                          params : $scope.newEvent
                      };

                      $http.post(request.url, $scope.newEvent)
                        .then(result => {
                          // Here

                          var newMarker = new google.maps.Marker({
                              position: position,
                              map  : $scope.map,
                              icon : './resources/img/historical_event_marker.png'
                          });

                          var mapLabel = new MapLabel({
                             text         : result.data.name,
                             position     : new google.maps.LatLng(result.data.lat, result.data.long),
                             map          : $rootScope.map,
                             fontSize     : 15,
                             fontColor    : '#ffffff',
                             fontFamily   : 'Raleway, sans-serif',
                             strokeWeight : 0,
                             align        : 'center'
                          });

                          newMarker.addListener('click', function () {

                            var centerControlDiv = document.createElement('div');
                            var centerControl = new CenterControl(centerControlDiv, map);

                            centerControlDiv.index = 1;

                            $scope.isInPovView = true;

                            $scope.map.controls[1].push(centerControlDiv);

                            $scope.isInPovView = true;

                            var request = {
                                method: 'GET',
                                url   : `http://api.historify.cl/historicalevent/${result.data.id}`
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
                                           fontColor : '#ffffff',
                                           fontFamily   : 'Raleway, sans-serif',
                                           strokeWeight: 0,
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
                                       fontColor : '#ffffff',
                                       fontFamily   : 'Raleway, sans-serif',
                                       strokeWeight: 0,
                                       align: 'center'
                                    });

                                    $scope.map.setZoom(13);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                          });

                          $uibModalInstance.close();
                        })
                        .catch(err => {
                          console.log(err);
                        });

                    };

                    $scope.cancel = function() {
                        $uibModalInstance.close();
                    };
                  },
                  size         : 'sm',
                  backdrop     : true,
                  keyboard     : true,
                  resolve      : {
                    position : position
                  }
                });
            };



            // Custom controll
            function CenterControl(controlDiv, map) {

              // Set CSS for the control border.
              var controlUI = document.createElement('div');
              controlUI.style.backgroundColor = '#fff';
              controlUI.style.border = '2px solid #fff';
              controlUI.style.borderRadius = '3px';
              controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
              controlUI.style.cursor = 'pointer';
              controlUI.style.marginTop = '100px';
              controlUI.style.textAlign = 'center';
              controlUI.title = 'Click to recenter the map';
              controlDiv.appendChild(controlUI);

              // Set CSS for the control interior.
              var controlText = document.createElement('div');
              controlText.style.color = 'rgb(25,25,25)';
              controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
              controlText.style.fontSize = '16px';
              controlText.style.lineHeight = '38px';
              controlText.style.paddingLeft = '5px';
              controlText.style.paddingRight = '5px';
              controlText.innerHTML = '← Back';
              controlUI.appendChild(controlText);

              // Setup the click event listeners: simply set the map to Chicago.
              controlUI.addEventListener('click', function() {
                $scope.isInPovView = false;
                $scope.map.controls[1].clear();
                $scope.map.setZoom(15);
                $scope.removeAllLabels();
                $scope.removeAllMarkers();
                $scope.loadMarkers();
              });
            }

            // Remove all markers
            $rootScope.removeAllLabels = $scope.removeAllMarkers = function() {
                $scope.markers.forEach(mark => {
                    mark.setMap(null);
                });
                $scope.markers = [];
            };

            // Remove all custom labels
            $rootScope.removeAllMarkers = $scope.removeAllLabels = function () {
                $scope.labels.forEach(label => {
                    label.setMap(null);
                });
                $scope.labels = [];
            };

            // Click on map
            $scope.map.addListener('click', function(e) {
              $scope.map.panTo(e.latLng);
              if ($scope.isInPovView) {
                $scope.addNewPointOfViewModal(e.latLng);
              }
              else {
                $scope.addNewEventModal(e.latLng);
              }
            });

            var request = {
                method: 'GET',
                url   : 'http://api.historify.cl/historicalevent',
                params : {}
            };

            $scope.loadMarkers  = function () {
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
                           fontColor : '#ffffff',
                           fontFamily   : 'Raleway, sans-serif',
                           strokeWeight: 0,
                           align: 'center'
                        });

                        marker.addListener('click', function () {


                            var windowContent = '<div class="title">'+mark.name+'</div>'+
                                                '<div class="body">'+mark.large_description+'</div>';

                            var eventMarkerInfoWindow = new google.maps.InfoWindow({
                                content : windowContent
                            });

                            var centerControlDiv = document.createElement('div');
                            var centerControl = new CenterControl(centerControlDiv, map);

                            centerControlDiv.index = 1;

                            $scope.isInPovView = true;

                            $scope.map.controls[1].push(centerControlDiv);


                            var request = {
                                method: 'GET',
                                url   : `http://api.historify.cl/historicalevent/${mark.id}`
                            };

                            $http(request)
                                .then(result => {
                                    $scope.removeAllMarkers();
                                    $scope.removeAllLabels();

                                    eventMarkerInfoWindow.open($scope.map, marker);

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
                                           fontColor : '#ffffff',
                                           fontFamily   : 'Raleway, sans-serif',
                                           strokeWeight: 0,
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
                                       fontColor : '#ffffff',
                                       strokeWeight: 0,
                                       fontFamily   : 'Raleway, sans-serif',
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
            }

            $scope.loadMarkers();

        })

        .controller('HomeController', function($scope) {
            console.log('home');
        });
})();