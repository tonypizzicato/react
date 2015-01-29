"use strict";

var React  = require('react'),
    Router = require('react-router');

var NewsApp = React.createClass({

    mixins: [Router.State],

    render: function () {
        return (
            <div>
                Hello form News App!
            </div>
        )
    }
});

module.exports = NewsApp;