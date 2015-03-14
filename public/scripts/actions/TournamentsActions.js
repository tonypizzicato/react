"use strict";

var AppDispatcher        = require('../dispatcher/app-dispatcher'),
    TournamentsConstants = require('../constants/TournamentsConstants');

var TournamentsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_ADD,
            data: data
        })
    },

    save: function (data, options) {
        AppDispatcher.dispatch({
            type:    TournamentsConstants.TOURNAMENTS_SAVE,
            data:    data,
            options: options
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = TournamentsActions;