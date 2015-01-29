"use strict";

var React  = require('react'),
    Router = require('react-router');

var UsersApp = React.createClass({

    mixins: [Router.State],

    render: function () {
        return (
            <div>
                Hello form Users App!
            </div>
        )
    }
});

module.exports = UsersApp;