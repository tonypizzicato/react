"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    OrderItem            = require('../orders/OrderItem.jsx');

var OrdersList = React.createClass({

    propTypes: function () {
        return {
            orders: React.PropTypes.array
        }
    },

    render: function () {
        if (!this.props.orders.length) {
            return false;
        }

        var items = this.props.orders.map(function (item) {
            return (
                <OrderItem order={item} key={item._id} />
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>
        );
    }
});

module.exports = OrdersList;
