"use strict";

var basePath = 'http://localhost:3000';

var routes = {
    'auth':  {
        'signup': {
            path:   '/api/admin/signup',
            method: 'POST'
        },
        'login':  {
            path:   '/api/admin/login',
            method: 'POST'
        },
        'logout': {
            path:   '/api/admin/logout',
            method: 'GET'
        }
    },
    'users': {
        'list': {
            path:   '/api/admin/users',
            method: 'GET'
        },
        'save': {
            path:   '/api/admin/users/%(_id)s',
            method: 'PUT'
        }
    }
};


module.exports.routes = routes;
module.exports.basePath = basePath;
