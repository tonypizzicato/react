"use strict";

var AppDispatcher         = require('../dispatcher/app-dispatcher'),
    GameArticlesConstants = require('../constants/GameArticlesConstants');

var GameArticlesActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: GameArticlesConstants.GAME_ARTICLES_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: GameArticlesConstants.GAME_ARTICLES_ADD,
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: GameArticlesConstants.GAME_ARTICLES_SAVE,
            data: data
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: GameArticlesConstants.GAME_ARTICLES_DELETE,
            data: {
                _id: id
            }
        });
    },

    images: function (id) {
        AppDispatcher.dispatch({
            type: GameArticlesConstants.GAME_ARTICLES_IMAGES_LOAD,
            data: {
                _id: id
            }
        });
    }
};

module.exports = GameArticlesActions;
