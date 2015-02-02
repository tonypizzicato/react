"use strict";

var AppDispatcher = require('../dispatcher/app-dispatcher'),
    NewsConstants = require('../constants/NewsConstants');

var NewsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_LOAD
        });
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: NewsConstants.NEWS_SAVE,
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
    }
};

module.exports = NewsActions;