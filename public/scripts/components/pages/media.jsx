"use strict";

var React  = require('react'),
    Router = require('react-router');

var MediaApp = React.createClass({

    mixins: [Router.State],

    render: function () {
        return (
            <div>
                Hello form Media App!
            </div>
        )
    }
});

module.exports = MediaApp;