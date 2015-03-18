"use strict";

var AppDispatcher  = require('../dispatcher/app-dispatcher'),
    UsersConstants = require('../constants/UsersConstants');

module.exports = {
    load: function () {
        AppDispatcher.dispatch({
            type: UsersConstants.USERS_LOAD
        });
    }
};
