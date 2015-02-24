"use strict";

var $            = require('jquery'),
    _            = require('underscore'),
    React        = require('react'),
    Router       = require('react-router'),
    mui          = require('material-ui'),

    RouteHandler = Router.RouteHandler,
    Menu         = mui.Menu,
    Snackbar     = mui.Snackbar;

var WithNav = React.createClass({

    mixins: [Router.Navigation, Router.State],

    propTypes: function () {
        return {
            leagues: React.PropTypes.array
        }
    },

    getInitialState: function () {
        return {
            loading: true
        }
    },

    _onMenuItemClick: function (e, index, item) {
        this.transitionTo(item.route);
        if (!this.isActive(item.route)) {
            this._showLoader();
        }
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

    componentDidMount: function () {
        this._showLoader();

        $(document).ajaxError(this._handleAjaxError);
        $(document).ajaxComplete(this._handleAjaxComplete);

    },

    _showLoader: function () {
        this.setState({loading: true});

        _.delay(this.setState.bind(this, {loading: false}), 1000);
    },

    _hideLoader: function () {
        _.delay(this.setState.bind(this, {loading: false}), 400);
    },

    _handleAjaxError: function () {
        this._hideLoader();
        this.refs.snack.show();
        _.delay(this.refs.snack.dismiss, 2000);
    },

    _handleAjaxComplete: function () {
        this._hideLoader();
    },

    render: function () {
        var loaderClass = 'page-loader' + (this.state.loading ? ' page-loader_active' : '');

        return (
            <div className="mui-app-content-canvas page-with-nav">
                <div className="page-with-nav-content">
                    <RouteHandler leagues={this.props.leagues} />
                </div>
                <div className="page-with-nav-secondary-nav">
                    <Menu
                        ref="menuItems"
                        zDepth={0}
                        menuItems={this.props.menuItems}
                        selectedIndex={this._getSelectedIndex()}
                        onItemClick={this._onMenuItemClick} />
                </div>
                <div className={loaderClass} ref="loader" />
                <Snackbar
                    message="Error loading data. Try to repeat your request."
                    ref="snack" />

            </div>
        );
    }
});

module.exports = WithNav;