"use strict";

var React = require('react'),
    mui   = require('material-ui'),

    Menu  = mui.DropDownMenu;

var DropDownMenu = React.createClass({

    propTypes: function () {
        return {
            menuItems:     React.PropTypes.array.required,
            selectedIndex: React.PropTypes.number,
            noDataText:    React.PropTypes.string
        }
    },

    getDefaultProps: function () {
        return {
            noDataText: 'Нет данных'
        }
    },

    render: function () {
        if (!this.props.menuItems.length || !this.props.menuItems[this.props.selectedIndex]) {
            return <span className="mui-label s_ml_24 s_mr_24">{this.props.noDataText}</span>;
        }

        if (this.props.menuItems.length > 1) {
            return <Menu {...this.props} />;
        } else {
            return <span className="mui-label s_ml_24 s_mr_24">{this.props.menuItems[0].text}</span>;
        }
    }
});

module.exports = DropDownMenu;