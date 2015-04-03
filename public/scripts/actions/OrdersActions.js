"use strict";

var AppDispatcher   = require('../dispatcher/app-dispatcher'),
    OrdersConstants = require('../constants/OrdersConstants');

var OrdersActions = {
    load: function () {
        AppDispatcher.dispatch({
            type: OrdersConstants.ORDERS_LOAD
        });
    }
};

module.exports = OrdersActions;
