"use strict";

var React           = require('react'),
    mui             = require('material-ui'),

    RaisedButton    = mui.RaisedButton,
    Toolbar         = mui.Toolbar,

    FileUploadFiled = require('./FileUploadField.jsx');

var FileUpload = React.createClass({

    getInitialState: function () {
        return {
            files: []
        }
    },

    render: function () {
        return (
            <div>
                <FileUploadFiled />
            </div>
        )
    }
});

module.exports = FileUpload;