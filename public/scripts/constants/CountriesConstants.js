"use strict";

var keymirror = require('keymirror');

var CountriesConstants = keymirror({
    COUNTRIES_ADD:    null,
    COUNTRIES_LOAD:   null,
    COUNTRIES_SAVE:   null,
    COUNTRIES_UPDATE: null,
    COUNTRIES_SORT:   null,
    COUNTRIES_DELETE: null
});

module.exports = CountriesConstants;