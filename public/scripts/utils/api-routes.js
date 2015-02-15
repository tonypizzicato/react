"use strict";

var s = require('underscore.string');

var basePath = 'http://localhost:9000/api';

var routes = {
    'news': {
        'list':   {
            path:   '/news',
            method: 'GET'
        },
        'item':   {
            path:   '/news/%(id)s',
            method: 'GET'
        },
        'create': {
            path:   '/news',
            method: 'POST'
        },
        'edit':   {
            path:   '/news',
            method: 'PUT'
        },
        'delete': {
            path:   '/news/%(id)s',
            method: 'DELETE'
        }
    },

    'leagues': {
        'list': {
            path:   '/leagues',
            method: 'GET'
        },
        'item': {
            path:   '/leagues/%(id)s',
            method: 'GET'
        }
    },

    'tournaments': {
        'list': {
            path:   '/tournaments',
            method: 'GET'
        },
        'item': {
            path:   '/tournaments/%(id)s',
            method: 'GET'
        }
    }
};

var mapParams = function (route, params) {
    var parts = route.split('/');
    for (var i in parts) {
        if (parts[i].indexOf(':') === 0) {
            var param = params[parts[i]];
            if (param === undefined) {
                throw Error('Parameter ":' + parts[i] + '" for "' + route + '" not defined');
            }

            parts[i] = param;
        }
    }

    return parts.join('/');
}

var get = function (routeName, params) {
    var parts = routeName.split(':'),
        route = JSON.parse(JSON.stringify(routes));
    for (var i in parts) {
        route = route[parts[i]];
        if (!route) {
            throw Error('No existing route for ' + routeName);
        }
    }

    route.path = basePath + s.sprintf(route.path, params);

    return route;
}

module.exports = {
    get: get
};