"use strict";!function(){function t(t){function n(n){var r={method:"GET",url:"http://api.historify.cl/historicalevent",params:{}};return t(r).then(function(t){return t.data})}return{getData:n}}angular.module("historify.apiservice").factory("Evento",t),t.$inject=["$http"]}();