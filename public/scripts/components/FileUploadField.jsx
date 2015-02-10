"use strict";

var React        = require('react'),
    mui          = require('material-ui'),

    _            = require('underscore'),
    $            = require('jquery'),

    CssEvent     = require('../utils/css-event'),

    RaisedButton = mui.RaisedButton;


var FileUploadField = React.createClass({

    _onSubmit: function () {
        console.log('submit');
    },

    _onClick: function () {
        var input = this.refs.input.getDOMNode();
        CssEvent.onAnimationEnd(this.refs.fileButton.getDOMNode(), input.click);
    },

    render: function () {

        return (
            <div>
                <div className="file-upload__button s_mb_12">
                    <input type="file" multiple="multiple" ref="input" />
                    <RaisedButton label="Upload" onClick={this._onClick} ref="fileButton" />
                </div>

                <RaisedButton label="Submit" onClick={this._onSubmit} />
                <form>
                </form>
            </div>
        )
    }
});

module.exports = FileUploadField;