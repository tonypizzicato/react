"use strict";

var AppDispatcher   = require('../dispatcher/app-dispatcher'),
    FieldsConstants = require('../constants/FieldsConstants');

var FieldsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: FieldsConstants.FIELDS_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: FieldsConstants.FIELDS_ADD,
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: FieldsConstants.FIELDS_SAVE,
            data: data
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: FieldsConstants.FIELDS_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = FieldsActions;
