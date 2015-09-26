"use strict";

var basePath = 'http://localhost:9000/api';

var routes = {
    'auth':       {
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
    'users':      {
        'save': {
            path:   '/users/%(_id)s',
            method: 'PUT'
        }
    },
    'categories': {
        'list':   {
            path:   '/categories',
            method: 'GET'
        },
        'create': {
            path:   '/categories',
            method: 'POST'
        },
        'save':   {
            path:   '/categories/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/categories/%(_id)s',
            method: 'DELETE'
        }
    },
    'news':       {
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
        },
        'save': {
            path:   '/leagues/%(_id)s',
            method: 'PUT'
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
    },

    'images': {
        'list':   {
            path:   '/%(type)s/%(postId)s/images/',
            method: 'GET'
        },
        'create': {
            path:   '/%(type)s/%(postId)s/images',
            method: 'POST'
        },
        'save':   {
            path:   '/%(type)s/%(postId)s/images/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/%(type)s/%(postId)s/images/%(_id)s',
            method: 'DELETE'
        }
    },

    'contacts': {
        'list':   {
            path:   '/contacts',
            method: 'GET'
        },
        'create': {
            path:   '/contacts',
            method: 'POST'
        },
        'save':   {
            path:   '/contacts/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/contacts/%(_id)s',
            method: 'DELETE'
        }
    },

    'fields': {
        'list':   {
            path:   '/fields',
            method: 'GET'
        },
        'create': {
            path:   '/fields',
            method: 'POST'
        },
        'save':   {
            path:   '/fields/%(_id)s',
            method: 'PUT'
        },
        'delete': {
            path:   '/fields/%(_id)s',
            method: 'DELETE'
        }
    },

    'orders': {
        'list': {
            path:   '/orders',
            method: 'GET'
        }
    }
};

module.exports.routes   = routes;
module.exports.basePath = basePath;
