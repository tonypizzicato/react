"use strict";

var React      = require('react'),
    mui        = require('material-ui'),

    Button = mui.RaisedButton,
    FontIcon   = mui.FontIcon;

var HelpButton = React.createClass({
    propTypes: function() {
        return {
            dialog: React.PropTypes.element.required
        };
    },

    _onClick: function (e) {
        console.log(e);

        this.props.dialog.show();
    },

    render: function () {
        return (
            <Button className="button_type_help s_mt_24" onTouchTap={this._onClick} secondary={true}>
                <FontIcon className="mdfi_action_help"/>
                <span className="mui-raised-button-label">Справка</span>
            </Button>
        );
    }
});

module.exports = HelpButton;