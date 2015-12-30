const basePath = 'http://localhost:9000/api';

const routes = {
    auth:       {
        signup: {
            path:   '/signup',
            method: 'POST'
        },
        login:  {
            path:   '/login',
            method: 'POST'
        },
        logout: {
            path:   '/logout',
            method: 'GET'
        }
    },
    users:      {
        save: {
            path:   '/users/%(_id)s',
            method: 'PUT'
        }
    },
    categories: {
        fetch:  {
            path:   '/categories',
            method: 'GET'
        },
        add:    {
            path:   '/categories',
            method: 'POST'
        },
        save:   {
            path:   '/categories/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/categories/%(_id)s',
            method: 'DELETE'
        }
    },
    news:       {
        fetch:  {
            path:   '/news',
            method: 'GET'
        },
        add:    {
            path:   '/news',
            method: 'POST'
        },
        save:   {
            path:   '/news/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/news/%(_id)s',
            method: 'DELETE'
        }
    },

    leagues: {
        fetch: {
            path:   '/leagues',
            method: 'GET'
        },
        save:  {
            path:   '/leagues/%(_id)s',
            method: 'PUT'
        }
    },

    tournaments: {
        fetch: {
            path:   '/tournaments',
            method: 'GET'
        },
        add:   {
            path:   '/tournaments',
            method: 'POST'
        },
        save:  {
            path:   '/tournaments/%(_id)s',
            method: 'PUT'
        }
    },

    countries: {
        fetch:  {
            path:   '/countries',
            method: 'GET'
        },
        add:    {
            path:   '/countries',
            method: 'POST'
        },
        save:   {
            path:   '/countries/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/countries/%(_id)s',
            method: 'DELETE'
        }
    },

    games: {
        fetch: {
            path:   '/games',
            method: 'GET'
        }
    },

    previews: {
        list:   {
            path:   '/previews',
            method: 'GET'
        },
        item:   {
            path:   '/previews/%(_id)s',
            method: 'GET'
        },
        add:    {
            path:   '/previews',
            method: 'POST'
        },
        save:   {
            path:   '/previews/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/previews/%(_id)s',
            method: 'DELETE'
        }
    },

    gameArticles: {
        fetch:   {
            path:   '/game-articles',
            method: 'GET'
        },
        add:    {
            path:   '/game-articles',
            method: 'POST'
        },
        save:   {
            path:   '/game-articles/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/game-articles/%(_id)s',
            method: 'DELETE'
        }
    },

    photos: {
        fetch:   {
            path:   '/%(type)s/%(postId)s/images/',
            method: 'GET'
        },
        add:    {
            path:   '/%(type)s/%(postId)s/images',
            method: 'POST'
        },
        save:   {
            path:   '/%(type)s/%(postId)s/images/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/%(type)s/%(postId)s/images/%(_id)s',
            method: 'DELETE'
        }
    },

    contacts: {
        fetch:  {
            path:   '/contacts',
            method: 'GET'
        },
        add:    {
            path:   '/contacts',
            method: 'POST'
        },
        save:   {
            path:   '/contacts/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/contacts/%(_id)s',
            method: 'DELETE'
        }
    },

    fields: {
        fetch:  {
            path:   '/fields',
            method: 'GET'
        },
        add:    {
            path:   '/fields',
            method: 'POST'
        },
        save:   {
            path:   '/fields/%(_id)s',
            method: 'PUT'
        },
        remove: {
            path:   '/fields/%(_id)s',
            method: 'DELETE'
        }
    },

    orders: {
        fetch: {
            path:   '/orders',
            method: 'GET'
        }
    }
};

export default {
    routes,
    basePath
}