"use strict";

const basePath = 'http://localhost:3000';

const routes = {
    auth:  {
        signup: {
            path:   '/api/admin/signup',
            method: 'POST'
        },
        login:  {
            path:   '/api/admin/login',
            method: 'POST'
        },
        logout: {
            path:   '/api/admin/logout',
            method: 'GET'
        }
    },
    users: {
        fetch: {
            path:   '/api/admin/users',
            method: 'GET'
        },
        save:  {
            path:   '/api/admin/users/%(_id)s',
            method: 'PUT'
        }
    }
};

export default {
    routes,
    basePath
}
