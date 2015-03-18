"use strict";

var React                = require('react'),
    ReactTransitionGroup = React.addons.CSSTransitionGroup,

    UserItem             = require('../users/UserItem.jsx');

var UsersList = React.createClass({

    propTypes: function () {
        return {
            users: React.PropTypes.array
        }
    },

    getDefaultProps: function () {
        return {
            users: []
        }
    },

    render: function () {
        if (!this.props.users.length) {
            return false;
        }

        var items = this.props.users.map(function (item) {
            return (
                <UserItem user={item} key={item._id} />
            );
        }.bind(this));

        return (
            <ReactTransitionGroup transitionName="fadeIn">
                {items}
            </ReactTransitionGroup>

        );
    }
});

module.exports = UsersList;
