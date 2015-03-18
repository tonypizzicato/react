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
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_SAVE,
            data: data
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = NewsActions;