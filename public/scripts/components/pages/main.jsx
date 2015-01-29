"use strict";

var React        = require('react'),
    Router       = require('react-router'),
    mui          = require('material-ui'),

    RouteHandler = Router.RouteHandler,

    Canvas       = mui.AppCanvas,
    AppBar       = mui.AppBar,
    LeftNav      = mui.LeftNav,
    MenuItem     = mui.MenuItem,
    Paper        = mui.Paper;


var menuItems = [
    {route: 'get-started', text: 'Get Started'},
    {route: 'css-framework', text: 'CSS Framework'},
    {route: 'components', text: 'Components'},
    {type: MenuItem.Types.SUBHEADER, text: 'Resources'},
    {
        type:    MenuItem.Types.LINK,
        payload: 'https://github.com/callemall/material-ui',
        text:    'GitHub'
    }
];


var MainApp = React.createClass({
    mixins: [Router.State],


    render: function () {
        return (
            <div>
                <Canvas>
                    <AppBar title="Amateurs League Admin App" />
                    <Paper>
                        <LeftNav menuItems={menuItems} />
                    </Paper>

                    <Paper className="content_main">
                        <RouteHandler />
                    </Paper>
                </Canvas>
            </div>
        )
    }
});

module.exports = MainApp;