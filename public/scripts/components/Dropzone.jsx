"use strict";

var _            = require('underscore'),
    React        = require('react'),
    cx           = React.addons.classSet,
    mui          = require('material-ui'),

    Dropzone     = require('dropzone'),

    Button       = mui.FlatButton,
    Icon         = mui.FontIcon,
    ActionButton = mui.FloatingActionButton;

var DropzoneComponent = React.createClass({

    _reader: null,

    propTypes: function () {
        return {}
    },

    getDefaultProps: function () {
        return {}
    },

    getInitialState: function () {
        return {}
    },

    componentDidMount: function() {
        this._loader = new Dropzone(this.refs.dropzone.getDOMNode(), {
            url: 'http://localhost:9009/api/photos',
            autoProcessQueue: false
        });

    },

    render: function () {
        return (
            <div className="dropzone mui-dropzone-container s_mt_24" ref="dropzone">
            </div>
        );
    }
});

module.exports = DropzoneComponent;