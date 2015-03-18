"use strict";

var assign          = require('object-assign'),

    AppDispatcher   = require('../dispatcher/app-dispatcher'),
    PhotosConstants = require('../constants/PhotosConstants');

module.exports = {
    load: function (type, postId) {
        AppDispatcher.dispatch({
            type: PhotosConstants.PHOTOS_LOAD,
            data: {
                type:   type,
                postId: postId
            }
        });
    },

    save: function (type, postId, id, data, options) {
        data = assign({}, {type: type, postId: postId, _id: id}, data);

        AppDispatcher.dispatch({
            type:    PhotosConstants.PHOTOS_SAVE,
            data:    data,
            options: options
        });
    },

    delete: function (type, postId, id) {
        AppDispatcher.dispatch({
            type: PhotosConstants.PHOTOS_DELETE,
            data: {
                type:   type,
                postId: postId,
                _id:    id
            }
        });
    }
};
