"use strict";

var _               = require('lodash'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    FieldsConstants = require('../constants/FieldsConstants'),

    routes          = require('../utils/api-routes'),
    api             = require('../utils/api').init(routes.routes, routes.basePath);

var _fields          = [],
    _validationError = null;

var Store = assign({}, EventEmitter.prototype, {
  getAll: function () {
    return _fields;
  },

  getByLeague: function (leagueId) {
    return _fields.filter(function (item) {
      return item.leagueId == leagueId;
    });
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
  },

  /**
   * @returns {Object|null} Validation error object
   *
   * @private
   */
  _getValidationError: function () {
    var err          = _validationError;
    _validationError = null;

    return err;
  },

  /**
   * @param {Object} field New field object
   *
   * @returns {boolean}
   *
   * @private
   */
  _validate: function (field) {
    var notEmpty = function (value) {
      return value && value.toString().length > 0;
    };

    var rules = {
      title:    notEmpty,
      address:  notEmpty,
      'geo[0]': notEmpty,
      'geo[1]': notEmpty
    };

    return this._isValid(field, rules);
  },

  _isValid: function (entity, rules) {

    var result = true,
        ruleResult;

    for (var rule in rules) {
      const value = _.get(entity, rule);

      if (value !== undefined) {
        ruleResult = _.get(rules, rule)(value);
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
  switch (action.type) {
    case FieldsConstants.FIELDS_LOAD:
      api.call('fields:list').done(function (result) {
        _fields = result;
        Store.emitChange();
      });

      break;

    case FieldsConstants.FIELDS_ADD:
      var fields = _fields.slice(0);

      if (Store._validate(action.data)) {
        api.call('fields:create', action.data, true).then(function (res) {
          _fields.push(res);
          Store.emitChange();
        });
      } else {
        Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
      }
      break;

    case FieldsConstants.FIELDS_SAVE:
      var field = action.data;

      if (Store._validate(field)) {
        _.defer(() => {
          api.call('fields:save', field, true).then(function () {
            var changed = _.findWhere(_fields, { _id: field._id });

            assign(changed, field);
            Store.emitChange();
          });
        })
      } else {
        Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
      }
      break;

    case FieldsConstants.FIELDS_DELETE:
      api.call('fields:delete', { _id: action.data._id }).then(function () {
        _fields = _.filter(_fields, function (item) {
          return item._id != action.data._id;
        });

        Store.emitChange();
      });
      break;

    default:
      break;
  }
});

module.exports = Store;
