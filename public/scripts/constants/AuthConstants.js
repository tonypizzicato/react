"use strict";

var keymirror = require('keymirror');

var AuthConstants = keymirror({
    AUTH_SIGNUP:       null,
    AUTH_LOGIN:        null,
    AUTH_LOGOUT:       null,
    AUTH_UNAUTHORIZED: null
});

module.exports = AuthConstants;