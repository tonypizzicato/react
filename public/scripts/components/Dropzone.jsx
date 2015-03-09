"use strict";

var _ = require('underscore'),
    React = require('react'),
    cx = React.addons.classSet,
    mui = require('material-ui'),

    Dropzone = require('dropzone'),

    Button = mui.FlatButton,
    Icon = mui.FontIcon,
    ActionButton = mui.FloatingActionButton;

var DropzoneComponent = React.createClass({

    _reader: null,

    propTypes: function () {
        return {
            url:            React.PropTypes.string.required,
            uploadMultiple: React.PropTypes.bool
        }
    },

    getDefaultProps: function () {
        return {
            uploadMultiple: true
        }
    },

    getInitialState: function () {
        return {}
    },

    _onClick: function () {
        this._loader.processQueue();
    },

    componentDidMount: function () {
        this._loader = new Dropzone(this.refs.dropzone.getDOMNode(), {
            url:              this.props.url,
            autoProcessQueue: false,
            parallelUploads:  1,
            uploadMultiple:   this.props.uploadMultiple
        });

    },

    render: function () {
        return (
            <div>
                <div className="dropzone mui-dropzone-container s_mt_24" ref="dropzone"/>
                <ActionButton iconClassName="mdfi_file_file_upload" className="s_mt_12 s_float_r"
                              onClick={this._onClick}/>
            </div>
        );
    }
});

module.exports = DropzoneComponent;