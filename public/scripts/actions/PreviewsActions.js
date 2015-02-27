"use strict";

var AppDispatcher     = require('../dispatcher/app-dispatcher'),
    PreviewsConstants = require('../constants/PreviewsConstants');

var PreviewsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: PreviewsConstants.PREVIEWS_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: PreviewsConstants.PREVIEWS_ADD,
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: PreviewsConstants.PREVIEWS_SAVE,
            data: data
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: PreviewsConstants.PREVIEWS_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = PreviewsActions;