"use strict";

var AppDispatcher     = require('../dispatcher/app-dispatcher'),
    ContactsConstants = require('../constants/ContactsConstants');

var ContactsActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: ContactsConstants.CONTACTS_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: ContactsConstants.CONTACTS_ADD,
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: ContactsConstants.CONTACTS_SAVE,
            data: data
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: ContactsConstants.CONTACTS_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = ContactsActions;
