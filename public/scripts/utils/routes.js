"use strict";

var basePath = 'http://localhost:3000';

var routes = {
    'auth':  {
        'signup': {
            path:   '/signup',
            method: 'POST'
        },
        'login':  {
            path:   '/login',
            method: 'POST'
        },
        'logout': {
            path:   '/logout',
            method: 'GET'
        }
    },
    'users': {
        'list': {
            path:   '/users',
            method: 'GET'
        }
    }
};


module.exports.routes = routes;
module.exports.basePath = basePath;
