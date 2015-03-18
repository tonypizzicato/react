"use strict";

var AppDispatcher  = require('../dispatcher/app-dispatcher'),
    GamesConstants = require('../constants/GamesConstants');

module.exports = {
    load: function (data) {
        AppDispatcher.dispatch({
            type: GamesConstants.GAMES_LOAD,
            data: data
        });
    }
};