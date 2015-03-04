"use strict";

var _            = require('underscore'),
    React        = require('react'),
    cx           = React.addons.classSet,
    mui          = require('material-ui'),

    Button       = mui.FlatButton,
    Icon         = mui.FontIcon,
    ActionButton = mui.FloatingActionButton;

var ImageUpload = React.createClass({

    _reader: null,

    propTypes: function () {
        return {
            label:     React.PropTypes.string,
            image:     React.PropTypes.string,
            errorText: React.PropTypes.string
        }
    },

    getDefaultProps: function () {
        return {
            label:     "Select image",
            image:     null,
            errorText: null
        }
    },

    getInitialState: function () {
        return {
            uploaded: this.props.image
        }
    },

    _onImage: function () {
        this._reader = new FileReader();
        this._reader.readAsDataURL(this.refs.upload.getDOMNode().files[0]);

        this._reader.onload = function (e) {
            this.refs.preview.getDOMNode().src = e.target.result;
            this.setState({uploaded: true});
        }.bind(this);

        this._reader.onprogress = function (e) {
            console.dir(e);
        }.bind(this);
    },

    _onDelete: function () {
        console.log('remove image');
    },

    _onClick: function () {
        _.delay(function () {
            this.refs.upload.getDOMNode().click();
        }.bind(this), 600);
    },

    getImage: function () {
        return this.state.uploaded ? (this._reader ? this._reader.result : this.props.image) : null;
    },

    render: function () {
        var previewClass = cx({
            'mui-file-input-image':         true,
            'mui-file-input-image-visible': this.state.uploaded
        });
        var closeClass = cx({
            'mui-file-input-image-close': true,
            's_display_none':             !this.state.uploaded
        });

        var error = this.props.errorText ? (<span className="mui-file-input-error">{this.props.errorText}</span>) : '';

        return (
            <div className="mui-file-input-container">
                <ActionButton className={closeClass} iconClassName="mdfi_navigation_close" onClick={this._onDelete} />
                <img src={this.props.image} className={previewClass} ref="preview" />
                <input className="file-input" type="file" onChange={this._onImage} ref="upload" />

                <div className="mui-file-input">
                    <Button onClick={this._onClick} >
                        <Icon className="mdfi_image_photo s_mr_6 s_t_4"/>
                        <span className="mui-flat-button-label">{this.props.label}</span>
                    </Button>
                    {error}
                </div>
            </div>
        );
    }
});

module.exports = ImageUpload;