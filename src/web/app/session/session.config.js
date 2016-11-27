/**
 * Created by sebmaldo on 14-03-16.
 */
(function(){
    'use strict';
    angular.module('historify.sesion')
        .config(configSatellizer);

    configSatellizer.$inject = ['$authProvider'];


    function configSatellizer($authProvider){
        $authProvider.tokenPrefix = 'historify';
        $authProvider.user = 'user';
        $authProvider.loginUrl = 'http://api.historify.cl/user/auth';
        
        $authProvider.facebook({
                                   clientId: '1612734245701460',
                                   url: 'http://api.historify.cl/user/auth/facebook'
                               });

        /*$authProvider.google({
                                 clientId: '57118405424-gc2gkfak88eonsb721u141d3sjm52bgs.apps.googleusercontent.com',
                                 url: 'api/usuario/registrar/google'
                             });

        $authProvider.linkedin({
                                   clientId: '770faot4scgq6o',
                                   url: 'api/usuario/registrar/linkedin'
                               });
                               */
    }


})();
