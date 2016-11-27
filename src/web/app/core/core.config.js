(function() {
    'use strict';

    var core = angular.module('historify.core');

    var settings = {
        appTitle: 'Historify Web UI',
        version: '0.0.1'
    };
    
    core.value('config', settings);
    core.config(config);

    function config(){
        
    }

})();