"use strict";

var AppDispatcher = require('../dispatcher/app-dispatcher'),
    NewsConstants = require('../constants/NewsConstants');

var NewsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_ADD,
            data: {
                title: data.title,
                body:  data.body,
                show:  data.show,
                stick: data.stick
            }
        })
    },

    sort: function (id, dir) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_SORT,
            data: {
                id:  id,
                dir: dir
            }
        })
    },

    delete: function(id) {
        AppDispatcher.dispatch({
           type: NewsConstants.NEWS_DELETE,
            data: {
                id: id
            }
        });
    }
};

module.exports = NewsActions;