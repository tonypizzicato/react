"use strict";

var React           = require('react'),
    Router          = require('react-router'),
    mui             = require('material-ui'),

    Tabs            = mui.Tabs,
    Tab             = mui.Tab,

    EventsConstants = require('../../constants/EventsConstants'),

    OrdersActions   = require('../../actions/OrdersActions'),
    OrdersStore     = require('../../stores/OrdersStore'),

    OrdersList      = require('../orders/OrdersList.jsx');

var OrdersApp = React.createClass({

    mixins: [Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array.required
        }
    },

    getInitialState: function () {
        return {
            orders:          [],
            selectedContact: {}
        }
    },

    componentDidMount: function () {
        OrdersStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        OrdersStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.leagues.length) {
            OrdersActions.load();
        }
    },

    _onChange: function () {
        this.setState({
            order: OrdersStore.getAll()
        });
    },

    render: function () {
        var tabItems = this.props.leagues.map(function (league) {
            var ordersItems = OrdersStore.getByLeague(league._id).filter(function (item) {
                return item.leagueId == league._id;
            }.bind(this));

            return (
                <Tab label={league.name} key={league._id} >
                    <OrdersList orders={ordersItems} />
                </Tab>
            );
        }.bind(this));
        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
});

module.exports = OrdersApp;
