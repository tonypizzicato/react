"use strict";

var AppDispatcher = require('../dispatcher/app-dispatcher'),
    AuthConstants = require('../constants/AuthConstants');

module.exports = {
    signup: function (data) {
        AppDispatcher.dispatch({
            type: AuthConstants.AUTH_SIGNUP,
            data: data
        });
    },
    login:  function (username, password) {
        AppDispatcher.dispatch({
            type: AuthConstants.AUTH_LOGIN,
            data: {
                username: username,
                password: password
            }
        });
    },
    logout: function () {
        AppDispatcher.dispatch({
            type: AuthConstants.AUTH_LOGOUT
        });
    }
};
