"use strict";

var React        = require('react'),
    Router       = require('react-router'),
    mui          = require('material-ui'),

    UsersActions = require('../../actions/UsersActions'),
    UsersStore   = require('../../stores/UsersStore'),

    UsersList    = require('../users/UsersList.jsx');

var UsersApp = React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
        return {
            users: []
        }
    },

    componentDidMount: function () {
        UsersStore.addChangeListener(this._onChange);
        UsersActions.load();
    },

    componentWillUnmount: function () {
        UsersStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({users: UsersStore.getAll()});
    },

    render: function () {
        return (
            <div>
                <UsersList users={this.state.users} />
            </div>
        )
    }
});

module.exports = UsersApp;
