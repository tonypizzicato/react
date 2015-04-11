"use strict";

var AppDispatcher       = require('../dispatcher/app-dispatcher'),
    CategoriesConstants = require('../constants/CategoriesConstants');

var CategoriesActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: CategoriesConstants.CATEGORIES_LOAD
        });
    },

    add: function (data) {
        AppDispatcher.dispatch({
            type: CategoriesConstants.CATEGORIES_ADD,
            data: data
        })
    },

    save: function (data) {
        AppDispatcher.dispatch({
            type: CategoriesConstants.CATEGORIES_SAVE,
            data: data
        })
    },

    delete: function (id) {
        AppDispatcher.dispatch({
            type: CategoriesConstants.CATEGORIES_DELETE,
            data: {
                _id: id
            }
        });
    }
};

module.exports = CategoriesActions;
