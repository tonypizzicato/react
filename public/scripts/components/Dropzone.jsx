"use strict";

var _            = require('lodash'),
    React        = require('react'),
    cx           = require('classnames'),
    mui          = require('material-ui'),

    Dropzone     = require('dropzone'),

    Button       = mui.FlatButton,
    Icon         = mui.FontIcon,
    ActionButton = mui.FloatingActionButton;

var DropzoneComponent = React.createClass({

    _reader: null,

    propTypes: function () {
        return {
            url:            React.PropTypes.string.required,
            uploadMultiple: React.PropTypes.bool,
            onUpload:       React.PropTypes.func,
            onChunkUpload:  React.PropTypes.func
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
            parallelUploads:  10,
            addRemoveLinks:   true,
            uploadMultiple:   this.props.uploadMultiple
        });

        this._loader.on('completemultiple', function () {
            this._loader.processQueue();
        }.bind(this));

        if (this.props.onUpload) {
            this._loader.on('processingmultiple', this.props.onUpload);
        }

        if (this.props.onChunkUpload) {
            this._loader.on('completemultiple', this.props.onChunkUpload);
        }
    },

    render: function () {
        return (
            <div className="mui-dropzone-container s_mt_24">
                <div className="dropzone" ref="dropzone"/>
                <ActionButton iconClassName="mdfi_file_file_upload" className="s_mt_12" onClick={this._onClick}/>
            </div>
        );
    }
});

module.exports = DropzoneComponent;
