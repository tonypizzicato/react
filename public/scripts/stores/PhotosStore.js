"use strict";

var _               = require('lodash'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    routes          = require('../utils/api-routes'),
    api             = require('../utils/api').init(routes.routes, routes.basePath),

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    PhotosConstants = require('../constants/PhotosConstants');


var _photos = [];

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _photos;
    },

    getImagesUrl: function (type, postId) {
        return api.get('images:create', {type: type, postId: postId}).path;
    },

    emitChange: function () {
        this.emit(EventsConstants.EVENT_CHANGE);
    },

    emitEvent: function (type, data) {
        this.emit(type, data);
    },

    addChangeListener: function (cb) {
        this.on(EventsConstants.EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_CHANGE, cb);
    },

    addEventListener: function (type, cb) {
        this.addListener(type, cb);
    },

    removeEventListener: function (type, cb) {
        this.removeListener(type, cb);
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case PhotosConstants.PHOTOS_LOAD:
            var call = api.call('images:list', action.data).done(function (response) {
                _photos = response;
                Store.emitChange();
            });
            Store.emitEvent(EventsConstants.EVENT_CALL, call);

            break;

        case PhotosConstants.PHOTOS_SAVE:
            var photo = assign({}, action.data),
                options = assign({}, {silent: false}, action.options);

            api.call('images:save', action.data).then(function () {
                var changed = _photos.filter(function (item) {
                    return item._id == photo._id;
                }).pop();

                assign(changed, photo);
                if (!options.silent) {
                    Store.emitChange();
                }
            });

            break;

        case PhotosConstants.PHOTOS_DELETE:
            api.call('images:delete', action.data).then(function () {
                _photos = _.filter(_photos, function (item) {
                    return item._id != action.data._id
                });

                Store.emitChange();
            });
            break;

        default:
            break;
    }
});

module.exports = Store;
