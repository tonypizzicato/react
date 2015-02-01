"use strict";

var AppDispatcher = require('../dispatcher/app-dispatcher'),
    NewsConstants = require('../constants/NewsConstants');

var NewsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_LOAD
        });
    },

    save: function (title, body) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_SAVE,
            data: {
                title: title,
                body:  body
            }
        })
    },

    sort: function(id, dir) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_SORT,
            data: {
                id: id,
                dir: dir
            }
        })
    }
};

module.exports = NewsActions;