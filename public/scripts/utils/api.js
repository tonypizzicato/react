"use strict";

var $      = require('jquery'),

    routes = require('./api-routes');

var api = {
    call: function (routeName, data) {
        var route = routes.get(routeName, data);

        return $.ajax({
            type: route.method,
            url:  route.path,
            data: data || {}
        });
    }
}

module.exports = api;