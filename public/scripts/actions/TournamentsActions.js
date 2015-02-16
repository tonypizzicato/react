"use strict";

var AppDispatcher        = require('../dispatcher/app-dispatcher'),
    TournamentsConstants = require('../constants/TournamentsConstants');

var TournamentsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_LOAD
        });
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_SAVE,
            data: {
                name:     data.name,
                slug:     data.slug,
                leagueId: data.league,
                state:    data.state
            }
        })
    },

    sort: function (id, dir) {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_SORT,
            data: {
                id:  id,
                dir: dir
            }
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: TournamentsConstants.TOURNAMENTS_DELETE,
            data: {
                id: id
            }
        });
    }
};

module.exports = TournamentsActions;