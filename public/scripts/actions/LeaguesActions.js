"use strict";

var AppDispatcher = require('../dispatcher/app-dispatcher'),
    LeaguesConstants = require('../constants/LeaguesConstants');

module.exports = {
    load: function() {
        AppDispatcher.dispatch({
            type: LeaguesConstants.LEAGUES_LOAD
        });
    }
};