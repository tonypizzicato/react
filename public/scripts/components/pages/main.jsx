"use strict";

var React   = require('react'),
    Router  = require('react-router'),
    mui     = require('material-ui'),

    Canvas  = mui.AppCanvas,
    AppBar  = mui.AppBar,

    WithNav = require('./with-nav.jsx');

var menuItems = [
    {route: 'users', text: 'Users'},
    {route: 'tournaments', text: 'Tournaments'},
    {route: 'news', text: 'News'},
    {route: 'media', text: 'Media'}
];

var MainApp = React.createClass({

    mixins: [Router.State],

    render: function () {
        return (
            <div>
                <Canvas>
                    <AppBar className="mui-dark-theme" title="Amateur Admin App" zDepth={0} />

                    <WithNav menuItems={menuItems} />
                </Canvas>
            </div>
        )
    }
});

module.exports = MainApp;