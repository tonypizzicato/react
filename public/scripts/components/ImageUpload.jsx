"use strict";

var React = require('react'),
    mui   = require('material-ui');

var ImageUpload = React.createClass({

    _reader: null,

    _previewImage: function () {
        this._reader = new FileReader();
        this._reader.readAsDataURL(this.refs.upload.getDOMNode().files[0]);

        this._reader.onload = function (oFREvent) {
            this.refs.preview.getDOMNode().src = oFREvent.target.result;
        }.bind(this);
    },

    getImage: function () {
        return this._reader.result;
    },

    render: function () {
        var style = {
            width:  '100%',
            height: this.props.image ? 'auto' : 0
        };
        return (
            <div>
                <img ref="preview" src={this.props.image} style={style} />
                <input ref="upload" type="file" onChange={this._previewImage} />
            </div>
        );
    }
});

module.exports = ImageUpload;