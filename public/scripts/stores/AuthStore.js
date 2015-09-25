const $               = require('jquery'),
      _               = require('lodash'),
      EventEmitter    = require('events').EventEmitter,

      routes          = require('../utils/routes'),
      api             = require('../utils/api').init(routes.routes, routes.basePath),

      AppDispatcher   = require('../dispatcher/app-dispatcher'),

      EventsConstants = require('../constants/EventsConstants'),
      AuthConstants   = require('../constants/AuthConstants');

const initUser = function () {
    var el      = $('#user'),
        user    = null;
    var userObj = el.data('user');
    if (userObj !== undefined) {
        if (userObj._id) {
            user = userObj;
        }
        el.remove();
    }

    return user;
};

let _user            = initUser(),
    _validationError = null;

const Store = _.extend({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(EventsConstants.EVENT_CHANGE);
    },

    addChangeListener: function (cb) {
        this.on(EventsConstants.EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_CHANGE, cb);
    },

    emitUnauthorized: function (e) {
        this.emit(AuthConstants.AUTH_UNAUTHORIZED, e);
    },

    addUnauthorizedListener: function (cb) {
        this.addListener(AuthConstants.AUTH_UNAUTHORIZED, cb);
    },

    removeUnauthorizedListener: function (cb) {
        this.removeListener(AuthConstants.AUTH_UNAUTHORIZED, cb);
    },

    getUser: function () {
        return _user;
    },

    loggedIn: function () {
        return !!_user;
    },

    /**
     * @returns {Object|null} Validation error object
     */
    getValidationError: function () {
        const err        = _validationError;
        _validationError = null;

        return err;
    },

    /**
     * @param {Object} New user object
     * @returns {boolean}
     */
    validate: function (user) {
        const notEmpty = function (value) {
            return value.toString().length > 0;
        };

        const rules = {
            username: notEmpty,
            email:    notEmpty
        };

        return this._isValid(user, rules);
    },

    _isValid: function (entity, rules) {

        let result = true,
            ruleResult;

        for (let rule in rules) {
            if (entity.hasOwnProperty(rule)) {
                ruleResult = rules[rule](entity[rule]);
                if (!ruleResult) {
                    _validationError       = _validationError || {};
                    _validationError[rule] = true;
                    result                 = false;
                }
            }
        }

        return result;
    }
});


AppDispatcher.register(function (action) {
    const options = _.extend({}, {validate: true, silent: false}, action.options);

    switch (action.type) {
        case AuthConstants.AUTH_SIGNUP:
            api.call('auth:signup', action.data).done(function (response) {
                _user = response;
                Store.emitChange();
            });
            //_user = action.data;
            Store.emitChange();

            break;
        case AuthConstants.AUTH_LOGIN:
            api.call('auth:login', action.data).done(function (response) {
                _user = response;
                Store.emitChange();
            }).fail(function (res) {
                Store.emitUnauthorized(res);
            });
            //Store.emitChange();

            break;
        case AuthConstants.AUTH_LOGOUT:
            api.call('auth:logout').done(function (response) {
                _user = null;
                Store.emitChange();
            });
            break;

        case AuthConstants.USER_SAVE:
            if (!options.validate || Store.validate(action.data)) {
                api.call('user:save', action.data).done(function () {
                    _user = _.extend({}, action.data, _user);

                    if (!options.silent) {
                        Store.emitChange();
                    }
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store.getValidationError());
            }
            break;
    }
});

module.exports = Store;
