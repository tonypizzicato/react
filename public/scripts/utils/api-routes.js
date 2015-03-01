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
            path:   '/news/%(_id)s',
            method: 'GET'
        },
        'create': {
            path:   '/news',
            method: 'POST'
        },
        'save':   {
            path:   '/news/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/news/%(_id)s',
            method: 'DELETE'
        }
    },

    'leagues': {
        'list': {
            path:   '/leagues',
            method: 'GET'
        },
        'item': {
            path:   '/leagues/%(_id)s',
            method: 'GET'
        }
    },

    'tournaments': {
        'list':   {
            path:   '/tournaments',
            method: 'GET'
        },
        'item':   {
            path:   '/tournaments/%(_id)s',
            method: 'GET'
        },
        'create': {
            path:   '/tournaments',
            method: 'POST'
        },
        'save':   {
            path:   '/tournaments/%(_id)s',
            method: 'PUT'
        }
    },

    'countries': {
        'list':   {
            path:   '/countries',
            method: 'GET'
        },
        'item':   {
            path:   '/countries/%(_id)s',
            method: 'GET'
        },
        'create': {
            path:   '/countries',
            method: 'POST'
        },
        'delete': {
            path:   '/countries/%(_id)s',
            method: 'DELETE'
        },
        'save':   {
            path:   '/countries/%(_id)s',
            method: 'PUT'
        }
    },

    'games': {
        'list': {
            path:   '/games',
            method: 'GET'
        },
        'item': {
            path:   '/games/%(_id)s',
            method: 'GET'
        }
    },

    'previews': {
        'list':   {
            path:   '/previews',
            method: 'GET'
        },
        'item':   {
            path:   '/previews/%(_id)s',
            method: 'GET'
        },
        'create': {
            path:   '/previews',
            method: 'POST'
        },
        'save':   {
            path:   '/previews/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/previews/%(_id)s',
            method: 'DELETE'
        }
    },

    'game-articles': {
        'list':   {
            path:   '/game-articles',
            method: 'GET'
        },
        'create': {
            path:   '/game-articles',
            method: 'POST'
        },
        'save':   {
            path:   '/game-articles/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/game-articles/%(_id)s',
            method: 'DELETE'
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
