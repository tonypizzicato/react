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
            data: {
                name:  data.name,
                slug:  data.slug,
                state: data.state
            }
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
                id:  id,
                dir: dir
            }
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: CountriesConstants.COUNTRIES_DELETE,
            data: {
                id: id
            }
        });
    }
};

module.exports = CountriesActions;
