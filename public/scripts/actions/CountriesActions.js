"use strict";

var AppDispatcher      = require('../dispatcher/app-dispatcher'),
    CountriesConstants = require('../constants/CountriesConstants');

var CountriesActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: CountriesConstants.COUNTRIES_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: CountriesConstants.COUNTRIES_ADD,
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: CountriesConstants.COUNTRIES_SAVE,
            data: data
        })
    },

    sort: function (id, dir) {
        AppDispatcher.dispatch({
            type: CountriesConstants.COUNTRIES_SORT,
            data: {
                _id:  id,
                dir: dir
            }
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: CountriesConstants.COUNTRIES_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = CountriesActions;
