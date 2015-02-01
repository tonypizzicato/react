"use strict";

var React        = require('react'),
    Router       = require('react-router'),
    mui          = require('material-ui'),

    Menu         = mui.Menu,
    RouteHandler = Router.RouteHandler;

var WithNav = React.createClass({

    mixins: [Router.Navigation, Router.State],

    _onMenuItemClick: function (e, index, item) {
        this.transitionTo(item.route);
    },

    _getSelectedIndex: function () {
        var menuItems = this.props.menuItems,
            currentItem;

        for (var i = menuItems.length - 1; i >= 0; i--) {
            currentItem = menuItems[i];
            if (currentItem.route && this.isActive(currentItem.route)) {
                return i;
            }
        }
    },

    render: function () {
        return (
            <div className="mui-app-content-canvas page-with-nav">
                <div className="page-with-nav-content">
                    <RouteHandler />
                </div>
                <div className="page-with-nav-secondary-nav">
                    <Menu
                        ref="menuItems"
                        zDepth={0}
                        menuItems={this.props.menuItems}
                        selectedIndex={this._getSelectedIndex()}
                        onItemClick={this._onMenuItemClick} />
                </div>
            </div>
        );
    }
});

module.exports = WithNav;